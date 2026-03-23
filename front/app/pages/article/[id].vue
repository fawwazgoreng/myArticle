<script setup>
const config = useRuntimeConfig();
const route = useRoute();

const { data: article, pending: loading, error } = await useAsyncData(`article-${route.params.id}`, async () => {
    const [data , recommendation] = await Promise.all([
        $fetch(`${config.public.apiBaseUrl}/article/${route.params.id}`),
        $fetch(`${config.public.apiBaseUrl}/article?populer=true`)
    ]);
    return {
        data: data.article,
        recommendation: recommendation.article
    }
}, {
  key: `article-${route.params.id}`,
    default: () => ({
        data: {},
        recommendation: {}
  })
});

console.log(article.value);
watch(article, () => {
    console.log(article);
})

useSeoMeta({
  title: () => article.data?.title || "Loading Article...",
  ogTitle: () => article.data?.title,
  description: () => {
    const content = article.data?.content || "";
    return content.replace(/<[^>]*>?/gm, '').substring(0, 160) || "Read more about this article...";
  },
  ogImage: () => article.data?.image
    ? `${config.public.imageBaseUrl}${article.data.image}`
    : '/default-article-image.jpg',
  twitterCard: 'summary_large_image',
});

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
</script>

<template>
  <main class="max-w-7xl mx-auto px-6 py-8">

    <!-- ✅ Error State -->
    <div v-if="error" class="py-20 text-center">
      <h1 class="text-2xl font-bold text-red-600">Article Not Found</h1>
      <p class="text-gray-500">The article you're looking for doesn't exist or has been removed.</p>
      <NuxtLink to="/" class="mt-4 inline-block text-blue-600 underline">Back to Home</NuxtLink>
    </div>

    <section v-else class="grid grid-cols-12 gap-8">

      <!-- ============ MAIN ARTICLE COLUMN ============ -->
      <article class="lg:col-span-8 col-span-12">

        <!-- Loading: Header -->
        <header v-if="loading" class="mb-6 space-y-3">
          <div class="h-10 w-3/4 bg-gray-200 animate-pulse rounded-md"></div>
          <div class="h-6 w-1/2 bg-gray-200 animate-pulse rounded-md"></div>
          <div class="flex items-center gap-3 mt-4">
            <div class="h-5 w-16 bg-gray-200 animate-pulse rounded"></div>
            <div class="h-4 w-4 bg-gray-200 animate-pulse rounded-full"></div>
            <div class="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </header>

        <!-- Real: Header -->
        <header v-else class="mb-6">
          <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            {{ article.data?.title }}
          </h1>
          <div class="flex items-center gap-3 mt-4 text-sm text-gray-500">
            <span class="bg-red-100 text-red-600 px-2 py-0.5 rounded font-semibold uppercase text-xs">
              {{ article.data?.category?.[0]?.category?.name || 'News' }}
            </span>
            <span>•</span>
            <time>{{ formatDate(article.data?.created_at) }}</time>
          </div>
        </header>

        <!-- Loading: Hero Image -->
        <div v-if="loading" class="aspect-video w-full bg-gray-200 animate-pulse rounded-2xl mb-8"></div>

        <!-- Real: Hero Image -->
        <div v-else class="rounded-2xl overflow-hidden mb-8 shadow-sm">
          <img v-if="article.data.image"
            :src="config.public.imageBaseUrl + article.data?.image"
            :alt="article.data?.title"
            class="w-full h-auto object-cover"
          />
          <div v-else class="aspect-video w-full bg-gray-200 animate-pulse rounded-2xl mb-8"></div>
        </div>

        <!-- Loading: Article Body -->
        <div v-if="loading" class="space-y-3">
          <!-- Simulasi paragraf dengan lebar baris yang bervariasi -->
          <template v-for="p in 4" :key="`para-${p}`">
            <div class="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
            <div class="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
            <div class="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
            <div :class="`h-4 bg-gray-200 animate-pulse rounded `"></div>
            <div class="h-4 w-0 mb-2"></div><!-- paragraph spacer -->
          </template>
        </div>

        <!-- Real: Article Body -->
        <div
          v-else
          class="prose prose-lg max-w-none text-gray-700 leading-relaxed"
          v-html="article.data?.content"
        ></div>

      </article>

      <!-- ============ SIDEBAR COLUMN ============ -->
      <aside class="lg:col-span-4 col-span-12">
        <div class="sticky top-24 space-y-6">

          <!-- Loading: Sidebar Header -->
          <div v-if="loading" class="flex items-center gap-3">
            <div class="w-1 h-5 bg-gray-200 animate-pulse rounded-full"></div>
            <div class="h-4 w-28 bg-gray-200 animate-pulse rounded"></div>
          </div>

          <!-- Real: Sidebar Header -->
          <div v-else class="flex items-center gap-3">
            <span class="w-1 h-5 bg-red-600 rounded-full"></span>
            <h2 class="font-bold text-gray-800 uppercase tracking-widest text-sm">Berita Lainnya</h2>
          </div>

          <!-- Loading: Sidebar Cards -->
          <div v-if="loading" class="flex flex-col gap-4">
            <div v-for="i in 5" :key="`skel-${i}`" class="flex gap-3 items-start">
              <!-- Thumbnail skeleton -->
              <div class="w-20 h-20 bg-gray-200 animate-pulse rounded-lg shrink-0"></div>
              <!-- Text skeleton -->
              <div class="flex-1 space-y-2 pt-1">
                <div class="h-3.5 w-full bg-gray-200 animate-pulse rounded"></div>
                <div class="h-3.5 w-5/6 bg-gray-200 animate-pulse rounded"></div>
                <div class="h-3 w-1/2 bg-gray-200 animate-pulse rounded mt-1"></div>
              </div>
            </div>
          </div>

          <!-- Real: Sidebar Cards (placeholder, ganti dengan data aktual) -->
          <div v-else class="flex flex-col gap-4">
            <div v-for="(item,i) in article.recommendation.slice(0,8)" :key="i" class="group flex gap-3 items-start cursor-pointer">
              <div class="w-20 h-20 bg-gray-100 rounded-lg shrink-0"></div>
              <div class="flex-1">
                <h3 class="text-sm font-semibold line-clamp-2 group-hover:text-red-600 transition-colors">
                     {{item.title}} 
                </h3>
              </div>
            </div>
          </div>
          

        </div>
      </aside>

    </section>
  </main>
</template>

<style scoped>
.prose :deep(p) {
  margin-bottom: 1.5rem;
}
</style>