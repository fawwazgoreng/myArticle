<script setup>
const categoryStore = useCategoryStore();
const config = useRuntimeConfig();
const search = ref([]);
const path = String(window?.location?.href) || "";

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
            console.log(res);
        } catch (error) {
            console.error(error);
        }
    }, 400);
};
console.log(search.value);
</script>

<template>
</template>