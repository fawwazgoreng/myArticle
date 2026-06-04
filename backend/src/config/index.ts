import z from "zod";

const envTEST = z.object({
    "DATABASE_URL" : z.string(),
    "DATABASE_POST" : z.string(),
    "DATABASE_PASSWORD": z.string(),
    "DATABASE_USER": z.string(),
    "DATABASE_NAME":z.string(),
    "NODE_ENV": z.enum(["development" , "production" , "debugging" , "test"]),
    "APP_NAME": z.string(),
    "APP_URL": z.url(),
    "APP_PORT": z.string(),
    "REDIS_PORT":z.string(),
    "REDIS_DB":z.string(),
    "REDIS_HOST":z.string(),
    "REDIS_PASSWORD":z.string().nullable(),
    "FRONT_END_URL":z.url(),
    "SECRET_KEY": z.string(),
    "ELASTICSEARCH_URL": z.string(),
    "ELASTICSEARCH_API_KEY": z.string(),
    "BETTER_AUTH_SECRET": z.string(),
    // "GOOGLE_CLIENT_ID": z.string(),
    // "GOOGLE_CLIENT_SECRET": z.string(),
    "GITHUB_CLIENT_ID": z.string(),
    "GITHUB_CLIENT_SECRET": z.string(),
});

const parsedEnv = envTEST.safeParse(process.env);
if (parsedEnv.error) {
    console.error("❌ Invalid environment variables:", parsedEnv.error.format);
      console.error(parsedEnv.error.message);
      process.exit(1);
} 

export const env = parsedEnv.data;