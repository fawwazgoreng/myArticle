import { defineStore } from "pinia"

// stores/category.js
export const useCategoryStore = defineStore('category', {
  state: () => ({
    category: [],
    isLoaded: false
  }),
  actions: {
    async mount() {
      if (this.isLoaded) return;

      const config = useRuntimeConfig();
      try {
          const res = await $fetch<CategoryResponse>(`${config.public.apiBaseUrl}/category`);
        // Pastikan format response backend sesuai
        this.category = res.category ?? []; 
        this.isLoaded = true;
      } catch (error) {
          console.error("Gagal mengambil kategori:", error);
          this.category = [];
      }
    }
  }
})