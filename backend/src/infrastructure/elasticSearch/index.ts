import { env } from "@/config";
import { Client , HttpConnection } from "@elastic/elasticsearch";

const elasticSearchClient = new Client({
    node: env.ELASTICSEARCH_URL,
    auth: {
        username: env.ELASTICSEARCH_USERNAME,
        password: env.ELASTICSEARCH_PASSWORD,
    },
    requestTimeout: 5000,
    maxRetries: 2,
    Connection: HttpConnection
});

export default elasticSearchClient;