import { Client } from "@elastic/elasticsearch";

const elasticSearchClient = new Client({
    node: process.env.ELASTICSEARCH_URL,
    auth: {
        apiKey: String(process.env.ELASTICSEARCH_API_KEY)
    }
});

export default elasticSearchClient;