<script setup>
// 1. Initialize Runtime Config & Stores
const config = useRuntimeConfig();

// 2. Use useAsyncData or useFetch at the top-level (NOT inside a function)
// This ensures data is fetched on the SERVER before the HTML is sent to the browser
const { data: articleData, pending: loading } = await useAsyncData('home-articles', async () => {
    const [articles, popular] = await Promise.all([
        $fetch(`${config.public.apiBaseUrl}/article`),
        $fetch(`${config.public.apiBaseUrl}/article?populer=true`)
    ]);
    
    return {
        all: articles.article || [],
        popular: popular.article || [],
        meta: articles.article?.meta || {}
    };
} );

// 3. Dynamic SEO Meta
// Since this is a landing page, we create an engaging description for search engines
watchEffect(() => {
useSeoMeta({
    title: 'MYArticle - Trusted & Latest News Portal',
    ogTitle: 'MYArticle - Trusted News Portal',
    description: 'Get the latest news today from politics, technology, and lifestyle categories only at MYArticle.',
    ogDescription: 'A trusted news portal providing accurate and balanced information.',
    ogImage: String(config.public.imageBaseUrl) + String(articleData.value?.all[0]?.image) || '/default-og.jpg',
    twitterCard: 'summary_large_image',
});
})
// 4. JSON-LD (Schema Markup) - Highly recommended for Google indexing
useHead({
    script: [
        {
            type: 'application/ld+json',
            children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "NewsMediaOrganization",
                "name": "MYArticle",
                "url": "https://yourwebsite.com"
            })
        }
    ]
});


// Helper: Format date to English format
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
     <div class="min-h-screen bg-gray-50 font-sans">

        <div class="bg-red-600 text-white text-sm py-2 overflow-hidden">
            <div class="max-w-7xl mx-auto px-6 flex items-center gap-4">
                <span class="shrink-0 font-bold bg-white text-red-600 px-2 py-0.5 rounded text-xs uppercase tracking-wide">Breaking</span>
                <p class="truncate">Welcome to MYArticle - Your trusted source for the latest news and updates.</p>
            </div>
        </div>

        <main class="max-w-7xl mx-auto px-6 py-8">

            <section v-if="loading" class="grid grid-cols-12 gap-6">
                <div class="col-span-12 md:col-span-7 h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
                <div class="col-span-12 md:col-span-5 flex flex-col gap-4">
                    <div
                        v-for="i in 3"
                        :key="i"
                        class="flex gap-3 items-center"
                    >
                        <div class="w-24 h-20 bg-gray-200 rounded-xl animate-pulse shrink-0"></div>
                        <div class="flex-1 space-y-2">
                            <div class="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                            <div class="h-3 bg-gray-200 rounded animate-pulse w-4/5"></div>
                            <div class="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                        </div>
                    </div>
                </div>
                <div
                    v-for="i in 3"
                    :key="i"
                    class="col-span-12 md:col-span-4 h-56 bg-gray-200 rounded-2xl animate-pulse"
                ></div>
            </section>

            <section v-if="!loading && articleData.all.length > 0">

                <div class="grid grid-cols-12 gap-6 mb-10">

                    <NuxtLink
                        :to="`/article/${articleData.all[0]?.id}`"
                        class="col-span-12 md:col-span-7 relative rounded-2xl overflow-hidden group no-underline block h-96"
                    >
                        <img
                            :src="String(config.public.imageBaseUrl) + articleData.all[0]?.image || `https://source.unsplash.com/random/?${articleData.all[0].category.category.name}&1` "
                            :alt="articleData.all[0]?.title"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div class="absolute bottom-0 left-0 p-6 text-white">
                            <span class="text-xs bg-red-600 px-2 py-1 rounded font-semibold uppercase tracking-wide mb-2 inline-block">
                                {{ articleData.all[0]?.category[0].category.name || "News" }}
                            </span>
                            <h2 class="text-2xl font-bold leading-snug mb-1 line-clamp-3">{{ articleData.all[0]?.title }}</h2>
                            <p class="text-xs text-gray-300">{{ formatDate(articleData.all[0]?.created_at) }}</p>
                        </div>
                    </NuxtLink>

                    <div class="col-span-12 md:col-span-5 flex flex-col gap-4">
                        <NuxtLink
                            v-for="(item, index) in articleData.all.slice(1, 4)"
                            :key="index"
                            :to="`/article/${item.id}`"
                            class="flex gap-4 items-start group no-underline"
                        >
                            <img
                                :src=" String(config.public.imageBaseUrl) + item.image || '/placeholder.jpg'"
                                :alt="item.title"
                                class="w-28 h-20 object-cover rounded-xl bg-gray-200 shrink-0 group-hover:opacity-90 transition-opacity"
                            />
                            <div>
                                <span class="text-xs text-red-600 font-semibold uppercase tracking-wide">{{ item.category[0].category.name || "News" }}</span>
                                <h3 class="text-sm font-semibold text-gray-800 leading-snug mt-1 line-clamp-3 group-hover:text-red-600 transition-colors">
                                    {{ item.title }}
                                </h3>
                                <p class="text-xs text-gray-400 mt-1">{{ formatDate(item.created_at) }}</p>
                            </div>
                        </NuxtLink>
                    </div>
                </div>

                <div class="flex items-center gap-4 mb-6">
                    <span class="text-sm font-bold text-red-600 uppercase tracking-widest">Latest News</span>
                    <div class="flex-1 h-px bg-gray-200"></div>
                </div>

                <div class="grid grid-cols-12 gap-6 mb-10">
                    <NuxtLink
                        v-for="(item, index) in articleData.all.slice(4, 7)"
                        :key="index"
                        :to="`/article/${item.id}`"
                        class="col-span-12 sm:col-span-6 md:col-span-4 group no-underline"
                    >
                        <div class="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                            <div class="relative overflow-hidden h-44">
                                <img
                                    :src="String(config.public.imageBaseUrl) + item.image || '/placeholder.jpg'"
                                    :alt="item.title"
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <span class="absolute top-3 left-3 text-xs bg-red-600 text-white px-2 py-0.5 rounded font-semibold uppercase">
                                    {{ item.category[0].category.name || "News" }}
                                </span>
                            </div>
                            <div class="p-4 flex flex-col gap-2 flex-1">
                                <h3 class="text-sm font-semibold text-gray-800 leading-snug line-clamp-3 group-hover:text-red-600 transition-colors">
                                    {{ item.title }}
                                </h3>
                                <p class="text-xs text-gray-400 mt-auto">{{ formatDate(item.created_at) }}</p>
                            </div>
                        </div>
                    </NuxtLink>
                </div>

                <div class="grid grid-cols-12 gap-8">

                    <div class="col-span-12 lg:col-span-8 flex flex-col gap-5">
                        <div class="flex items-center gap-4 mb-2">
                            <span class="text-sm font-bold text-red-600 uppercase tracking-widest">See More</span>
                            <div class="flex-1 h-px bg-gray-200"></div>
                        </div>

                        <NuxtLink
                            v-for="(item, index) in articleData.all.slice(7, 15)"
                            :key="index"
                            :to="`/article/${item.id}`"
                            class="flex gap-4 items-start group no-underline border-b border-gray-100 pb-5 last:border-none"
                        >
                            <img
                                :src=" String(config.public.imageBaseUrl) + item.image || '/placeholder.jpg'"
                                :alt="item.title"
                                class="w-36 h-24 object-cover rounded-xl bg-gray-200 shrink-0 group-hover:opacity-90 transition-opacity"
                            />
                            <div class="flex flex-col gap-1">
                                <span class="text-xs text-red-600 font-semibold uppercase tracking-wide">{{ item.category[0].category.name || "News" }}</span>
                                <h3 class="text-base font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                                    {{ item.title }}
                                </h3>
                                <p class="text-xs text-gray-400 mt-auto">{{ formatDate(item.created_at) }}</p>
                            </div>
                        </NuxtLink>
                    </div>

                    <aside class="col-span-12 lg:col-span-4">
                        <div class="sticky top-20">
                            <div class="flex items-center gap-3 mb-5">
                                <span class="w-1 h-5 bg-red-600 rounded-full inline-block"></span>
                                <h2 class="text-sm font-bold text-gray-800 uppercase tracking-widest">Popular Articles</h2>
                            </div>

                            <div class="flex flex-col gap-4">
                                <NuxtLink
                                    v-for="(item, index) in articleData.popular.slice(0, 5)"
                                    :key="index"
                                    :to="`/article/${item.id}`"
                                    class="flex gap-3 items-start group no-underline"
                                >
                                    <span class="text-3xl font-extrabold text-gray-100 leading-none shrink-0 w-8 text-center">{{ index + 1 }}</span>
                                    <div>
                                        <h4 class="text-sm font-semibold text-gray-800 leading-snug line-clamp-3 group-hover:text-red-600 transition-colors">
                                            {{ item.title }}
                                        </h4>
                                        <p class="text-xs text-gray-400 mt-1">{{ formatDate(item.created_at) }}</p>
                                    </div>
                                </NuxtLink>
                            </div>

                            <div class="mt-8 bg-red-600 rounded-2xl p-6 text-white text-center">
                                <p class="text-xs font-bold uppercase tracking-widest mb-1">Newsletter</p>
                                <h3 class="text-lg font-extrabold mb-2">Get the Latest Updates</h3>
                                <p class="text-xs text-red-100 mb-4">Subscribe and never miss important news.</p>
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    class="w-full px-3 py-2 rounded-lg text-sm text-gray-800 focus:outline-none mb-2"
                                />
                                <button class="w-full bg-white text-red-600 font-bold text-sm py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            <div v-if="!loading && articleData.all.length === 0" class="flex flex-col items-center justify-center py-32 text-gray-400">
                <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-lg font-semibold">No articles available yet</p>
                <p class="text-sm mt-1">Please check back later.</p>
            </div>
        </main>
    </div>
     
</template>

<style scoped>
a {
    text-decoration: none;
}

.line-clamp-2 {
    overflow: hidden;
}
.line-clamp-3 {
    overflow: hidden;
}
</style>
