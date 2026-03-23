<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router"

const route = useRoute();
const category = route.params.category;

const config = useRuntimeConfig();
const search = ref([]);

// render loading placeholder
const loadingRender = [];
for (let i = 0; i < 8; i++) {
    loadingRender.push(i + 1);
}

const { data: article , pending : loading , error } = await useFetch(`${config.public.apiBaseUrl}/article?category=${route.params.category}` , { lazy: true});
console.log(article.value);

watchEffect(() => {
    useSeoMeta({
        title: 'MYArticle - Trusted & Latest News Portal',
        ogTitle: 'MYArticle - Trusted News Portal',
        description: 'Get the latest news today from politics, technology, and lifestyle categories only at MYArticle.',
        ogDescription: 'A trusted news portal providing accurate and balanced information.',
        ogImage: article.article?.[0]?.image || '/placeholder.jpg',
        twitterCard: 'summary_large_image',
    });
});

// format tanggal ke format Indonesia
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

        <!-- Breaking news ticker -->
        <div class="bg-red-600 text-white text-sm py-2 overflow-hidden">
            <div class="max-w-7xl mx-auto px-6 flex items-center gap-4">
                <span class="shrink-0 font-bold bg-white text-red-600 px-2 py-0.5 rounded text-xs uppercase tracking-wide">Breaking</span>
                <p class="truncate">Welcome to MYArticle - Your trusted source for the latest news and updates.</p>
            </div>
        </div>

        <main class="max-w-7xl mx-auto px-6 py-8">

            <!-- loading saat data belum siap -->
            <section v-if="loading" class="grid grid-cols-12 gap-6">
                <!-- hero besar -->
                <div class="col-span-12 md:col-span-7 h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
                <!-- artikel kecil di samping -->
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
                <!-- grid bawah -->
                <div
                    v-for="i in 3"
                    :key="i"
                    class="col-span-12 md:col-span-4 h-56 bg-gray-200 rounded-2xl animate-pulse"
                ></div>
            </section>

            <!-- konten artikel setelah data siap -->
            <!-- FIX 2: Tambah optional chaining article.article -->
            <section v-if="!loading && article.article.length > 0">

                <!-- Hero section: artikel utama + artikel sekunder -->
                <div class="grid grid-cols-12 gap-6 mb-10">

                    <!-- artikel utama (hero besar) -->
                    <NuxtLink
                        :to="`/article/${article.article[0]?.id}`"
                        class="col-span-12 md:col-span-7 relative rounded-2xl overflow-hidden group no-underline block h-96"
                    >
                        <img
                            :src="article.article[0]?.image || '/placeholder.jpg'"
                            :alt="article.article[0]?.title"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <!-- overlay gradient -->
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div class="absolute bottom-0 left-0 p-6 text-white">
                            <span class="text-xs bg-red-600 px-2 py-1 rounded font-semibold uppercase tracking-wide mb-2 inline-block">
                                <!-- FIX 3: Syntax error utama diperbaiki -->
                                <!-- Sebelum: article[0].category[0.category.name  → parser baca "0.category" sebagai float literal -->
                                <!-- Sesudah: article[0].category[0]?.name         → akses index [0] lalu property .name -->
                                {{ article.article[0]?.category?.[0]?.name || "Berita" }}
                            </span>
                            <h2 class="text-2xl font-bold leading-snug mb-1 line-clamp-3">{{ article.article[0]?.title }}</h2>
                            <p class="text-xs text-gray-300">{{ formatDate(article.article[0]?.created_at) }}</p>
                        </div>
                    </NuxtLink>

                    <!-- artikel sekunder di samping hero -->
                    <div class="col-span-12 md:col-span-5 flex flex-col gap-4">
                        <NuxtLink
                            v-for="(item, index) in article.article.slice(1, 4)"
                            :key="index"
                            :to="`/article/${item.id}`"
                            class="flex gap-4 items-start group no-underline"
                        >
                            <img
                                :src="item.image || '/placeholder.jpg'"
                                :alt="item.title"
                                class="w-28 h-20 object-cover rounded-xl bg-gray-200 shrink-0 group-hover:opacity-90 transition-opacity"
                            />
                            <div>
                                <!-- FIX 5: item.category adalah array of objects, akses .name dari index [0] -->
                                <span class="text-xs text-red-600 font-semibold uppercase tracking-wide">{{ item.category?.[0]?.name || "Berita" }}</span>
                                <h3 class="text-sm font-semibold text-gray-800 leading-snug mt-1 line-clamp-3 group-hover:text-red-600 transition-colors">
                                    {{ item.title }}
                                </h3>
                                <p class="text-xs text-gray-400 mt-1">{{ formatDate(item.created_at) }}</p>
                            </div>
                        </NuxtLink>
                    </div>
                </div>

                <!-- divider dengan label seksi -->
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-sm font-bold text-red-600 uppercase tracking-widest">Berita Terbaru</span>
                    <div class="flex-1 h-px bg-gray-200"></div>
                </div>

                <!-- grid artikel menengah -->
                <!-- FIX 6: article.data.slice → article.article.slice -->
                <div class="grid grid-cols-12 gap-6 mb-10">
                    <NuxtLink
                        v-for="(item, index) in article.article.slice(4, 7)"
                        :key="index"
                        :to="`/article/${item.id}`"
                        class="col-span-12 sm:col-span-6 md:col-span-4 group no-underline"
                    >
                        <div class="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                            <div class="relative overflow-hidden h-44">
                                <img
                                    :src="item.image || '/placeholder.jpg'"
                                    :alt="item.title"
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <span class="absolute top-3 left-3 text-xs bg-red-600 text-white px-2 py-0.5 rounded font-semibold uppercase">
                                    {{ item.category?.[0]?.name || "Berita" }}
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

                <!-- layout dua kolom: daftar berita + sidebar populer -->
                <div class="grid grid-cols-12 gap-8">

                    <!-- daftar artikel list -->
                    <div class="col-span-12 lg:col-span-8 flex flex-col gap-5">
                        <div class="flex items-center gap-4 mb-2">
                            <span class="text-sm font-bold text-red-600 uppercase tracking-widest">Selengkapnya</span>
                            <div class="flex-1 h-px bg-gray-200"></div>
                        </div>

                        <!-- FIX 7: article.data.slice → article.article.slice -->
                        <NuxtLink
                            v-for="(item, index) in article.article.slice(7, 15)"
                            :key="index"
                            :to="`/article/${item.id}`"
                            class="flex gap-4 items-start group no-underline border-b border-gray-100 pb-5 last:border-none"
                        >
                            <img
                                :src="item.image || '/placeholder.jpg'"
                                :alt="item.title"
                                class="w-36 h-24 object-cover rounded-xl bg-gray-200 shrink-0 group-hover:opacity-90 transition-opacity"
                            />
                            <div class="flex flex-col gap-1">
                                <span class="text-xs text-red-600 font-semibold uppercase tracking-wide">{{ item.category?.[0]?.name || "Berita" }}</span>
                                <h3 class="text-base font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                                    {{ item.title }}
                                </h3>
                                <p class="text-sm text-gray-500 line-clamp-2 mt-1">{{ item.excerpt || "" }}</p>
                                <p class="text-xs text-gray-400 mt-auto">{{ formatDate(item.created_at) }}</p>
                            </div>
                        </NuxtLink>
                    </div>

                    <!-- sidebar artikel populer -->
                    <aside class="col-span-12 lg:col-span-4">
                        <div class="sticky top-20">
                            <div class="flex items-center gap-3 mb-5">
                                <span class="w-1 h-5 bg-red-600 rounded-full inline-block"></span>
                                <h2 class="text-sm font-bold text-gray-800 uppercase tracking-widest">Artikel Populer</h2>
                            </div>

                            <!-- daftar artikel populer dengan nomor urut -->
                            <!-- FIX 8: article.data.slice → article.article.slice -->
                            <div class="flex flex-col gap-4">
                                <NuxtLink
                                    v-for="(item, index) in article.article.slice(0, 5)"
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

                            <!-- banner newsletter -->
                            <div class="mt-8 bg-red-600 rounded-2xl p-6 text-white text-center">
                                <p class="text-xs font-bold uppercase tracking-widest mb-1">Newsletter</p>
                                <h3 class="text-lg font-extrabold mb-2">Dapatkan Berita Terkini</h3>
                                <p class="text-xs text-red-100 mb-4">Subscribe dan jangan lewatkan berita penting.</p>
                                <input
                                    type="email"
                                    placeholder="Email kamu"
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

            <!-- state kosong jika tidak ada artikel -->
            <div v-if="!loading && article.article.length === 0" class="flex flex-col items-center justify-center py-32 text-gray-400">
                <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-lg font-semibold">Belum ada artikel tersedia</p>
                <p class="text-sm mt-1">Coba lagi beberapa saat kemudian.</p>
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