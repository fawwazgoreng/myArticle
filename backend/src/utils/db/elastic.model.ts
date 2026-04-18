import elasticSearchClient from "../../infrastructure/elasticSearch";

export type DocumentBody = {
    [key: string]: any;
}

export default class ElasticSearchModel {
    private index: string = "myArticle";
    constructor(private client = elasticSearchClient) {}
    get = async (id: string) => {
        await this.client.get({
            index: this.index,
            id,
        });
    };
    search = async (fieldName: string , query: string) => {
        await this.client.search({
            index: this.index,
            query: {
                match: {
                    [fieldName]: query
                }
            }
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
    create = async (id: string, body: DocumentBody) => {
        await this.client.create({
            index: this.index,
            id,
            document: body,
        });
    };
}
