import { env } from "@/config";
import { Client , HttpConnection } from "@elastic/elasticsearch";

const elasticSearchClient = new Client({
    node: env.ELASTICSEARCH_URL,
    auth: {
        apiKey: env.ELASTICSEARCH_API_KEY
    },
    requestTimeout: 5000,
    maxRetries: 2,
    Connection: HttpConnection
});

export default elasticSearchClient;