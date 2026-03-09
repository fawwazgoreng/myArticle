<script setup>
import { ref  , watch } from "vue";
import { useRoute } from "vue-router";

const config = useRuntimeConfig();
const route = useRoute();
const loading = ref(true);
const { data : article , pending , error } = await useFetch(`${config.public.apiBaseUrl}/article/${route.params.id}` , {lazy: true});
console.log(article.value);
useSeoMeta({
  title: () => article.value?.article.title || "loading article .....",
  ogImage: () => article.value?.article.image,
  description: () => String(article.value?.article.content || "loading description ....").substring(0 , 160)
});

</script>

<template>
    <main class="max-w-7xl mx-auto px-6 py-8">
        
    </main>
</template>