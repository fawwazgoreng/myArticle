// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
    devtools: { enabled: process.env.NODE_ENV == "development" },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
    devServer: {
        https: {
            key: "./localhost-key.pem",
            cert: "./localhost.pem"
        },
        port: 3000
    },
    app: {
        head: {
            titleTemplate: `%s - MyArticle`,
            meta: [
                { charset: "utf-8" },
                {name: "viewport" , content: "device-width, initial-scale=1"}
            ]
        }
    },
    runtimeConfig: {
    public: {  
            apiBaseUrl: process.env.NUXT_PUBLIC_API_BASEURL || "https://localhost:2000",
            imageBaseUrl: process.env.NUXT_PUBLIC_BASE_IMAGE|| "https://localhost:2000/static"
    }
  },
  telemetry: false,
  pinia: {
    storesDirs: ["./stores/**"]
  },
  nitro: {
    minify: true,
    compressPublicAssets: true
  },
  experimental: {
    payloadExtraction: true
  },
  tailwindcss: {
    exposeConfig: false,
    viewer: false
  }
})