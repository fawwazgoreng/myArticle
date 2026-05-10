<script setup>
/**
 * Article Detail Page
 * Handles server-side data fetching, dynamic SEO meta-tag generation,
 * and responsive content rendering with skeleton loading states.
 */
const config = useRuntimeConfig();
const route = useRoute();
definePageMeta({
    layout: "default"
})

// 1. Fetching Data with useAsyncData
// We fetch both the specific article details and a list of popular articles concurrently
// to improve server-side response times (Time to First Byte).
const { data: article, pending: loading, error } = await useAsyncData(
  `article-detail-${route.params.id}`,
  async () => {
    const [articleResponse, recommendationsResponse] = await Promise.all([
      $fetch(`${config.public.apiBaseUrl}/article/${route.params.id}`),
      $fetch(`${config.public.apiBaseUrl}/article?populer=true`)
    ]);

    return {
      details: articleResponse.article || {},
      recommendations: recommendationsResponse.article || []
    };
  },
  {
    // Key ensures data is cached/refreshed uniquely per article ID
    key: `article-${route.params.id}`,
    // Default structure prevents 'undefined' property access errors in the template
    default: () => ({
      details: {},
      recommendations: []
    })
  }
);

// 2. Dynamic SEO Meta
// Automatically populates social media cards (OG/Twitter) and browser titles
// based on the fetched article content.
useSeoMeta({
  title: () => article.value?.details?.title || "Loading Article...",
  ogTitle: () => article.value?.details?.title,
  description: () => {
    // Strips HTML tags and truncates content for the meta description
    const content = article.value?.details?.content || "";
    return content.replace(/<[^>]*>?/gm, '').substring(0, 160) || "Read the latest news on MYArticle.";
  },
  ogImage: () => article.value?.details?.image 
    ? `${config.public.imageBaseUrl}${article.value.details.image}` 
    : '/default-og.jpg',
  twitterCard: 'summary_large_image',
});

// 3. Formatting Helpers
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
</script>

<template>
  <main class="max-w-7xl mx-auto px-6 py-8">
    
    <div v-if="error" class="py-20 text-center">
      <h1 class="text-2xl font-bold text-red-600">Article Not Found</h1>
      <p class="text-gray-500">The article you're looking for doesn't exist or has been removed.</p>
      <NuxtLink to="/" class="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg inline-block hover:bg-red-700 transition">
        Back to Home
      </NuxtLink>
    </div>

    <section v-else class="grid grid-cols-12 gap-10">
      <article class="lg:col-span-8 col-span-12">
        
        <header class="mb-8">
          <div v-if="loading" class="space-y-3">
            <div class="h-10 w-full bg-gray-200 animate-pulse rounded-md"></div>
            <div class="h-10 w-2/3 bg-gray-200 animate-pulse rounded-md"></div>
            <div class="h-4 w-32 bg-gray-200 animate-pulse rounded mt-6"></div>
          </div>
          <template v-else>
            <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              {{ article.details?.title }}
            </h1>
            <div class="flex items-center gap-3 mt-6 text-sm text-gray-500">
              <span class="bg-red-600 text-white px-2 py-0.5 rounded font-bold uppercase text-xs tracking-wide">
                {{ article.details?.category?.[0]?.category?.name || 'General' }}
              </span>
              <span>•</span>
              <time class="font-medium">{{ formatDate(article.details?.created_at) }}</time>
            </div>
          </template>
        </header>

        <div class="rounded-3xl overflow-hidden mb-8 shadow-lg bg-gray-100">
          <div v-if="loading" class="aspect-video w-full animate-pulse bg-gray-200"></div>
          <img v-else-if="article.details?.image"
            :src="config.public.imageBaseUrl + article.details?.image"
            :alt="article.details?.title"
            class="w-full h-auto object-cover max-h-[500px]"
          />
          <div v-else class="aspect-video w-full bg-gray-200"></div>
        </div >

        <section>
          <div v-if="loading" class="space-y-4">
            <div v-for="i in 8" :key="i" :class="['h-4 bg-gray-200 animate-pulse rounded', i % 3 === 0 ? 'w-2/3' : 'w-full']"></div>
          </div>
          <div v-else 
            class="prose prose-lg prose-red max-w-none text-gray-800 leading-relaxed" 
            v-html="article.details?.content">
          </div>
        </section>

        <section class="mt-16 border-t pt-10">
          <div class="flex items-center gap-3 mb-8">
            <span class="w-1.5 h-6 bg-red-600 rounded-full"></span>
            <h2 class="font-bold uppercase tracking-widest text-xl text-gray-900">Recommended for You</h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <template v-if="loading">
              <div v-for="i in 4" :key="i" class="space-y-3">
                <div class="aspect-video bg-gray-200 animate-pulse rounded-xl"></div>
                <div class="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              </div>
            </template>
            <template v-else>
              <NuxtLink 
                v-for="item in article.recommendations.slice(0, 4)" 
                :key="item.id" 
                :to="`/article/${item.id}`"
                class="group cursor-pointer"
              >
                <div class="aspect-video rounded-xl bg-gray-100 mb-3 overflow-hidden shadow-sm">
                  <img :src="config.public.imageBaseUrl + item.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <p class="text-xs text-red-600 font-bold uppercase mb-1">{{ item.category?.[0]?.category?.name || 'News' }}</p>
                <h3 class="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-red-600">{{ item.title }}</h3>
              </NuxtLink>
            </template>
          </div>
        </section>
      </article>

      <aside class="lg:col-span-4 col-span-12">
        <div class="sticky top-24 space-y-8">
          
          <div>
            <div class="flex items-center gap-3 mb-6">
              <span class="w-1.5 h-5 bg-red-600 rounded-full"></span>
              <h2 class="font-bold text-gray-900 uppercase tracking-widest text-sm">Popular News</h2>
            </div>

            <div class="flex flex-col gap-6">
              <template v-if="loading">
                <div v-for="i in 5" :key="i" class="flex gap-4 items-center">
                  <div class="w-20 h-20 bg-gray-200 animate-pulse rounded-xl shrink-0"></div>
                  <div class="flex-1 space-y-2">
                    <div class="h-3 w-full bg-gray-200 animate-pulse rounded"></div>
                    <div class="h-3 w-2/3 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
              </template>
              <template v-else>
                <NuxtLink 
                  v-for="item in article.recommendations.slice(4, 9)" 
                  :key="item.id" 
                  :to="`/article/${item.id}`"
                  class="group flex gap-4 items-start"
                >
                  <div class="w-20 h-20 bg-gray-100 rounded-xl shrink-0 overflow-hidden shadow-sm">
                    <img :src="config.public.imageBaseUrl + item.image" class="w-full h-full object-cover group-hover:opacity-80 transition" />
                  </div>
                  <div class="flex-1">
                    <h3 class="text-sm font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                      {{ item.title }}
                    </h3>
                    <p class="text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-tighter">
                      {{ formatDate(item.created_at) }}
                    </p>
                  </div>
                </NuxtLink>
              </template>
            </div>
          </div>

          <div class="bg-gray-900 rounded-3xl p-6 text-white">
            <h3 class="font-bold text-lg mb-2">Subscribe to our Newsletter</h3>
            <p class="text-gray-400 text-xs mb-4">Get the latest stories sent directly to your inbox.</p>
            <input type="email" placeholder="Email address" class="w-full bg-gray-800 border-none rounded-xl px-4 py-2 text-sm mb-3 focus:ring-2 focus:ring-red-600" />
            <button class="w-full bg-red-600 hover:bg-red-700 font-bold py-2 rounded-xl transition text-sm">Subscribe</button>
          </div>
        </div>
      </aside>
    </section>
  </main>
</template>

<style scoped>
/* Tailwind Typography (prose) custom spacing */
.prose :deep(p) {
  margin-bottom: 1.5rem;
}
</style>