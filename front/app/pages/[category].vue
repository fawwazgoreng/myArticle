<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const category = String(route.params.category ?? "News"); // Captures the category name from the URL path
definePageMeta({
    layout: "default",
});

const defaultMeta = {
    firstPage: 1,
    currentPage: 1,
    lastPage: 1,
    count: 0,
};

const config = useRuntimeConfig();

// 1. Loading Placeholder Generator
// Creates an array to iterate over for rendering skeleton screens while data is fetching.
const loadingRender = [];
for (let i = 0; i < 8; i++) {
    loadingRender.push(i + 1);
}

// 2. Data Fetching
// Uses Nuxt's useFetch to grab articles filtered by category.
// { lazy: true } allows the page to navigate immediately while the data loads in the background.
const { data: articleData, pending: loading } = useAsyncData(
    "article-by-category",
    async () => {
        const res = await $fetch(
            `${config.public.apiBaseUrl}/article?category=${route.params.category}`,
        ).catch(() => null);
        return {
            article: res.article ?? [],
            meta: res.meta ?? defaultMeta,
        };
    },
    {
        lazy: false,
        default: () => ({
            article: [],
            meta: defaultMeta,
        }),
    },
);

const article = computed(() => articleData?.value?.article ?? []);
const meta = computed(() => articleData?.value?.meta ?? defaultMeta);

const renderPaginate = () => {
    const page = route.query.page;
};

// 3. Dynamic SEO Meta
// watchEffect ensures that if 'article' data changes, the SEO tags update accordingly.
useSeoMeta({
    title: `MYArticle - Latest ${category} News`,
    ogTitle: "MYArticle - Trusted News Portal",
    description: `Get the latest news today from ${category} and other categories only at MYArticle.`,
    ogDescription:
        "A trusted news portal providing accurate and balanced information.",
    // Uses the first article's image as the social media thumbnail, or a default placeholder.
    ogImage: article.value?.article?.[0]?.image || "/placeholder.jpg",
    twitterCard: "summary_large_image",
});

/**
 * Formats a raw date string into a localized Indonesian format (e.g., 23 Maret 2026).
 */
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
    <div class="min-h-screen bg-gray-50 font-sans">
        <div class="bg-red-600 text-white text-sm py-2 overflow-hidden">
            <div class="max-w-7xl mx-auto px-6 flex items-center gap-4">
                <span
                    class="shrink-0 font-bold bg-white text-red-600 px-2 py-0.5 rounded text-xs uppercase tracking-wide"
                    >Breaking</span
                >
                <p class="truncate">
                    Welcome to MYArticle - Your trusted source for the latest
                    news and updates.
                </p>
            </div>
        </div>

        <main class="max-w-7xl mx-auto px-6 py-8">
            <section v-if="loading" class="grid grid-cols-12 gap-6">
                <div
                    class="col-span-12 md:col-span-7 h-96 bg-gray-200 rounded-2xl animate-pulse"
                ></div>
                <div class="col-span-12 md:col-span-5 flex flex-col gap-4">
                    <div
                        v-for="i in 3"
                        :key="i"
                        class="flex gap-3 items-center"
                    >
                        <div
                            class="w-24 h-20 bg-gray-200 rounded-xl animate-pulse shrink-0"
                        ></div>
                        <div class="flex-1 space-y-2">
                            <div
                                class="h-3 bg-gray-200 rounded animate-pulse w-full"
                            ></div>
                            <div
                                class="h-3 bg-gray-200 rounded animate-pulse w-1/2"
                            ></div>
                        </div>
                    </div>
                </div>
            </section>

            <section v-if="!loading && article?.length > 0">
                <div class="grid grid-cols-12 gap-6 mb-10">
                    <NuxtLink
                        :to="`/article/${article[0]?.id}`"
                        class="col-span-12 md:col-span-7 relative rounded-2xl overflow-hidden group block h-96"
                    >
                        <img
                            :src="article[0]?.image || '/placeholder.jpg'"
                            :alt="article[0]?.title"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                        ></div>
                        <div class="absolute bottom-0 left-0 p-6 text-white">
                            <span
                                class="text-xs bg-red-600 px-2 py-1 rounded font-semibold uppercase tracking-wide mb-2 inline-block"
                            >
                                {{
                                    article[0]?.category?.[0]?.name || "Berita"
                                }}
                            </span>
                            <h2
                                class="text-2xl font-bold leading-snug mb-1 line-clamp-3"
                            >
                                {{ article[0]?.title }}
                            </h2>
                            <p class="text-xs text-gray-300">
                                {{ formatDate(article[0]?.created_at) }}
                            </p>
                        </div>
                    </NuxtLink>

                    <div class="col-span-12 md:col-span-5 flex flex-col gap-4">
                        <NuxtLink
                            v-for="(item, index) in article.slice(1, 4)"
                            :key="index"
                            :to="`/article/${item.id}`"
                            class="flex gap-4 items-start group"
                        >
                            <img
                                :src="item.image || '/placeholder.jpg'"
                                :alt="item.title"
                                class="w-28 h-20 object-cover rounded-xl bg-gray-200 shrink-0 group-hover:opacity-90 transition-opacity"
                            />
                            <div>
                                <span
                                    class="text-xs text-red-600 font-semibold uppercase tracking-wide"
                                    >{{
                                        item.category?.[0]?.name || "Berita"
                                    }}</span
                                >
                                <h3
                                    class="text-sm font-semibold text-gray-800 leading-snug mt-1 line-clamp-3 group-hover:text-red-600 transition-colors"
                                >
                                    {{ item.title }}
                                </h3>
                                <p class="text-xs text-gray-400 mt-1">
                                    {{ formatDate(item.created_at) }}
                                </p>
                            </div>
                        </NuxtLink>
                    </div>
                </div>

                <div class="flex items-center gap-4 mb-6">
                    <span
                        class="text-sm font-bold text-red-600 uppercase tracking-widest"
                        >Berita Terbaru</span
                    >
                    <div class="flex-1 h-px bg-gray-200"></div>
                </div>

                <div class="grid grid-cols-12 gap-6 mb-10">
                    <NuxtLink
                        v-for="(item, index) in article.slice(4, 7)"
                        :key="index"
                        :to="`/article/${item.id}`"
                        class="col-span-12 sm:col-span-6 md:col-span-4 group"
                    >
                        <div
                            class="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"
                        >
                            <div class="relative overflow-hidden h-44">
                                <img
                                    :src="item.image || '/placeholder.jpg'"
                                    class="w-full h-full object-cover group-hover:scale-105 transition-duration-500"
                                />
                            </div>
                            <div class="p-4 flex flex-col gap-2 flex-1">
                                <h3
                                    class="text-sm font-semibold text-gray-800 line-clamp-3 group-hover:text-red-600"
                                >
                                    {{ item.title }}
                                </h3>
                                <p class="text-xs text-gray-400 mt-auto">
                                    {{ formatDate(item.created_at) }}
                                </p>
                            </div>
                        </div>
                    </NuxtLink>
                </div>

                <div class="grid grid-cols-12 gap-8">
                    <div class="col-span-12 lg:col-span-8 flex flex-col gap-5">
                        <NuxtLink
                            v-for="(item, index) in article.slice(7, 15)"
                            :key="index"
                            :to="`/article/${item.id}`"
                            class="flex gap-4 items-start group border-b border-gray-100 pb-5 last:border-none"
                        >
                            <img
                                :src="item.image || '/placeholder.jpg'"
                                class="w-36 h-24 object-cover rounded-xl shrink-0"
                            />
                            <div class="flex flex-col gap-1">
                                <span
                                    class="text-xs text-red-600 font-semibold uppercase"
                                    >{{
                                        item.category?.[0]?.name || "Berita"
                                    }}</span
                                >
                                <h3
                                    class="text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-red-600"
                                >
                                    {{ item.title }}
                                </h3>
                                <p class="text-sm text-gray-500 line-clamp-2">
                                    {{ item.excerpt || "" }}
                                </p>
                            </div>
                        </NuxtLink>
                    </div>

                    <aside class="col-span-12 lg:col-span-4">
                        <div class="sticky top-20">
                            <h2
                                class="text-sm font-bold text-gray-800 uppercase tracking-widest mb-5"
                            >
                                Artikel Populer
                            </h2>
                            <div class="flex flex-col gap-4">
                                <NuxtLink
                                    v-for="(item, index) in article.slice(0, 5)"
                                    :key="index"
                                    :to="`/article/${item.id}`"
                                    class="flex gap-3 items-start group"
                                >
                                    <span
                                        class="text-3xl font-extrabold text-gray-100 shrink-0 w-8"
                                        >{{ index + 1 }}</span
                                    >
                                    <h4
                                        class="text-sm font-semibold text-gray-800 line-clamp-3 group-hover:text-red-600"
                                    >
                                        {{ item.title }}
                                    </h4>
                                </NuxtLink>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            <div
                v-if="!loading && article?.length === 0"
                class="flex flex-col items-center justify-center py-32 text-gray-400"
            >
                <svg
                    class="w-16 h-16 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <p class="text-lg font-semibold">Belum ada artikel tersedia</p>
                <p class="text-sm mt-1">Coba lagi beberapa saat kemudian.</p>
            </div>
        </main>

        <div class="mt-10 mb-2 w-full flex items-center justify-center gap-3">
            <span
                v-if="meta.currentPage == 1"
                class="block hover:bg-gray-200 hover:text-700 duration-100 rounded-xl w-20 py-2 text-center font-semibold"
                >Prev</span
            >
            <NuxtLink
                v-else
                :to="`/${route.params.category}/${Number(route.params.id) - 1}`"
                class="block hover:bg-gray-200 hover:text-700 duration-100 rounded-xl w-20 py-2 text-center font-semibold"
            >
                Prev
            </NuxtLink>
            <div class="flex gap-2"></div>
            <span
                v-if="meta.currentPage >= meta.lastPage"
                class="block hover:bg-gray-200 hover:text-700 duration-100 rounded-xl w-20 py-2 text-center font-semibold"
                >Next</span
            >
            <NuxtLink
                :to="`/${route.params.category}/${Number(route.params.id) + 1}`"
                v-else
            >
                Next
            </NuxtLink>
        </div>
    </div>
</template>

<style scoped>
/* Scoped styles for micro-optimizations in text display */
.line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
.line-clamp-3 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
}
</style>
