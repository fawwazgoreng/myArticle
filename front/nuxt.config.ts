// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV == "development" },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  runtimeConfig: {
    public: {  
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASEURL || "http://localhost:3000"
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