import { errors, estypes } from "@elastic/elasticsearch";
import ElasticSearchModel, { DocumentBody } from "@infra/elasticSearch/elastic.model";
import AppError from "@utils/error";

export default class ElasticSearchCase {
    constructor(private model = new ElasticSearchModel()) { }
    buildQuery = (req: any) => {
        const must = [];
        if (req.title) {
            must.push({
                match: {
                    title: req.title,
                    fuzziness: "AUTO",
                },
            });
        }
        
        if (req.category) {
                must.push({
                    term: {
                        "category.name.keyword": req.category
                    }
                });
            }
        
        return {bool: {must}};
    };
    create = async (id: string, body: DocumentBody) => {
        try {
            await this.model.create(id, body);
        } catch (error) {
            this.errorHandling(error);
        }
    };
    get = async (id: string) => {
        try {
            return await this.model.get(id);
        } catch (error) {
            this.errorHandling(error);
        }
    };
    search = async (req: {from: number, size: number, query: any, sort: any}) => {
        try {
            return await this.model.search(req);
        } catch (error) {
            this.errorHandling(error);
        }
    };
    update = async (id: string, body: DocumentBody) => {
        try {
            await this.model.update(id, body);
        } catch (error) {
            this.errorHandling(error);
        }
    };
    delete = async (id: string) => {
        try {
            await this.model.delete(id);
        } catch (error) {
            this.errorHandling(error);
        }
    };
    private errorHandling = (error: any) => {
        if (error instanceof errors.ConnectionError) {
            throw new AppError(
                503,
                "Search service is temporarily unavailable",
                "ELASTICSEARCH_CONNECTION_ERROR",
            );
        }

        if (error instanceof errors.ResponseError) {
            const status = error.statusCode;
            const reason =
                error.meta.body?.error?.reason ||
                "Elasticsearch response error";

            switch (status) {
                case 404:
                    throw new AppError(
                        404,
                        "Data not found in search index",
                        "ES_NOT_FOUND",
                    );
                case 409:
                    throw new AppError(
                        409,
                        "Data already exists",
                        "ES_CONFLICT",
                    );
                case 400:
                    throw new AppError(
                        400,
                        `Invalid search request: ${reason}`,
                        "ES_BAD_REQUEST",
                        error.meta.body,
                    );
                case 401:
                case 403:
                    throw new AppError(
                        403,
                        "Search service authentication failed",
                        "ES_AUTH_ERROR",
                    );
                default:
                    throw new AppError(
                        status || 500,
                        reason,
                        "ES_SERVER_ERROR",
                    );
            }
        }

        if (error instanceof errors.TimeoutError) {
            throw new AppError(408, "Search request timed out", "ES_TIMEOUT");
        }

        console.error("Unknown ES Error:", error);
        throw new AppError(
            500,
            "An unexpected error occurred in the search engine",
            "ES_UNKNOWN_ERROR",
            process.env.NODE_ENV === "development" ? error : undefined,
        );
    };
}
