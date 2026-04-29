import { ReadRedis } from "@infra/redis/redis.read";
import WriteRedis from "@infra/redis/redis.write";
import ArticleModel from "@/article/article.model";
import { article, articleMeta } from "@/article/article.type";
import AppError from "@utils/error";
import { ArticleRepositoryRead } from "@/article/article.repository";
import ElasticSearchCase from "@infra/elasticSearch/elastic.case";

// Service responsible for reading articles with Redis caching
export default class ReadArticle implements ArticleRepositoryRead {
    // Initialize dependencies for database and Redis operations
    constructor(
        private articleModel = new ArticleModel(),
        private readRedis = new ReadRedis(),
        private writeRedis = new WriteRedis(),
        private ESCase = new ElasticSearchCase()
    ) {}

    // Retrieve paginated articles with Redis cache-first strategy
    show = async (req: {
        page: number;
        title: string;
        time: "newest" | "oldest";
        populer: boolean;
        category?: string;
    }) => {
        let cacheKey = `articles:${req.page}:${req.time}:${req.populer ? "populer" : "unpopuler"}${req.category ? ":" + req.category : ""}`;
        if (String(req.title).length < 10) cacheKey += `:${req.title}`;
    
        let article: articleMeta;
    
        const data = await this.readRedis.readAll(cacheKey);
        if (data) {
            article = JSON.parse(data);
        } else {
            const take = 30;
            const from = (req.page - 1) * take;
    
            const sort: any[] = [];
            if (req.populer) {
                sort.push({ base_views: { order: "desc" } });
            }
            sort.push({ created_at: { order: req.time === "newest" ? "desc" : "asc" } });
    
            const esResponse = await this.ESCase.search({
                from: from,
                size: take,
                query: this.ESCase.buildQuery(req),
                sort: sort
            });
            
            if (!esResponse) throw new AppError(404, "No results found", "NO_RESULTS_FOUND" );
    
            const hits = esResponse.hits.hits.map(hit => hit._source);
            const total = typeof esResponse.hits.total === 'number' 
                          ? esResponse.hits.total 
                          : esResponse.hits.total?.value || 0;
    
            const res: articleMeta = {
                article: hits as article[],
                meta: {
                    firstPage: 1,
                    currentPage: req.page,
                    lastPage: Math.ceil(total / take),
                    count: total,
                },
            };
    
            if (String(req.title).length < 10 && hits.length > 0) {
                await this.writeRedis.cacheSearch(cacheKey, res);
            }
    
            article = res;
        }
    
        if (article.article.length > 0) {
            const ids = article.article.map((item) => String(item.id));
            const redisValue = await this.readRedis.readViews(ids);
    
            for (const [key, value] of Object.entries(redisValue)) {
                if (!value) continue;
                const findable = article.article.find(item => item.id === Number(key));
                if (findable) findable.base_views = Number(value);
            }
        }
    
        return article;
    };

    // Retrieve single article with Redis cache lookup
    findById = async (id: number) => {
        const redisCache = await this.readRedis.readShow(id);

        if (redisCache) return redisCache;

        const article = await this.articleModel.findById(id);

        if (!article?.id) {
            throw new AppError(
                404,
                `article id ${id} not found`,
                "ARTICLE_NOT_FOUND",
            );
        }

        return article as article;
    };
}
