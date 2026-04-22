import elasticSearchClient from ".";

export type DocumentBody = {
    [key: string]: any;
}

export default class ElasticSearchModel {
    private index: string = "article";
    constructor(private client = elasticSearchClient) { }
    get = async (id: string) => {
        await this.client.get({
            index: this.index,
            id,
        });
    };
    create = async (id: string, body: DocumentBody) => {
        await this.client.index({
            index: this.index,
            id,
            document: body,
        });
    };
    search = async (req: {from: number, size: number, query: any, sort: any}) => {
        return await this.client.search({
            index: this.index,
            from: req.from,
            size: req.size,
            query: req.query,
            sort: req.sort,
        });
    };
    update = async (id: string, body: DocumentBody) => {
        await this.client.update({
            index: this.index,
            id,
            doc: body,
        });
    };
    delete = async (id: string) => {
        await this.client.delete({
            index: this.index,
            id,
        });
    };
}
