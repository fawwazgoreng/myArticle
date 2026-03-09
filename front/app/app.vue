<script setup>
const categoryStore = useCategoryStore();
const config = useRuntimeConfig();
const search = ref([]);

// Fetch categories on the server for SEO and navigation
await useAsyncData('categories-data', () => categoryStore.mount());

const { category } = storeToRefs(categoryStore);
let debounceTimer;

const handleChange = (e) => {
    const value = e.target.value;
    clearTimeout(debounceTimer);
    
    debounceTimer = setTimeout(async () => {
        if (!value) {
            search.value = [];
            return;
        }
        
        try {
            const res = await $fetch(`${config.public.apiBaseUrl}/article?title=${value}`);
            search.value = res.article;
        } catch (error) {
            console.error(error);
        }
    }, 400);
};
</script>

<template>
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div class="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
            <NuxtLink
                to="/"
                class="text-2xl font-extrabold text-red-600 tracking-tight no-underline shrink-0"
            >
                MY<span class="text-gray-900">Article</span>
            </NuxtLink>

            <ul class="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                <li>
                    <NuxtLink
                        to="/"
                        class="hover:text-red-600 transition-colors"
                    >Home</NuxtLink>
                </li>
                <li v-for="item in category" :key="item.id">
                    <NuxtLink
                        :to="`/${item.name}`"
                        class="hover:text-red-600 transition-colors"
                    >{{ item.name }}</NuxtLink>
                </li>
            </ul>

            <div class="relative w-72">
                <input
                    type="text"
                    class="w-full px-4 py-2 pl-9 text-sm border border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition"
                    placeholder="Search news..."
                    @input="handleChange"
                    @focus="changeMenu"
                    @blur="changeMenu"
                />
                <svg
                    class="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                    />
                </svg>

                <div
                    v-show="menu && search.length > 0"
                    class="absolute top-full mt-1 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-72 overflow-y-auto"
                >
                    <NuxtLink
                        v-for="(item, index) in search"
                        :key="index"
                        :to="`/article?name=${item.slug}`"
                        class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-none no-underline"
                    >
                        <img
                            :src="item.image || '/placeholder.jpg'"
                            :alt="item.title"
                            class="w-10 h-10 rounded object-cover bg-gray-200 shrink-0"
                        />
                        <span class="text-sm text-gray-800 line-clamp-2">{{ item.title }}</span>
                    </NuxtLink>
                </div>

                <div
                    v-show="menu && search.length === 0"
                    class="absolute top-full mt-1 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 px-4 py-3 text-sm text-gray-400"
                >
                    Type to search for news...
                </div>
            </div>
        </div>
    </nav>

    <main class="mt-10">
        <NuxtPage />
    </main>

    <footer class="bg-gray-900 text-gray-400 mt-16 py-10">
        <div class="max-w-7xl mx-auto px-6 grid grid-cols-12 gap-8">
            <div class="col-span-12 md:col-span-4">
                <p class="text-2xl font-extrabold text-white mb-2">MY<span class="text-red-500">Article</span></p>
                <p class="text-sm leading-relaxed">A trusted news portal providing the latest, accurate, and balanced information for the community.</p>
            </div>
            <div class="col-span-6 md:col-span-2">
                <p class="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Categories</p>
                <ul class="text-sm space-y-2">
                    <li v-for="item in category" :key="item.id">
                        <NuxtLink :to="'/' + item.name" class="hover:text-white transition-colors">{{ item.name }}</NuxtLink>
                    </li>
                </ul>
            </div>
            <div class="col-span-6 md:col-span-2">
                <p class="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Company</p>
                <ul class="text-sm space-y-2">
                    <li><NuxtLink to="/about" class="hover:text-white transition-colors">About Us</NuxtLink></li>
                    <li><NuxtLink to="/contact" class="hover:text-white transition-colors">Contact</NuxtLink></li>
                    <li><NuxtLink to="/privacy" class="hover:text-white transition-colors">Privacy Policy</NuxtLink></li>
                </ul>
            </div>
        </div>
        <div class="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-gray-800 text-xs text-center">
            2026 MYArticle. Created by Fawwaz.
        </div>
    </footer>
</template>