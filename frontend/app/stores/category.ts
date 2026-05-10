import { defineStore } from "pinia";

interface CategoryState {
    category: Category[];
    isLoaded: boolean;
    error: null | string;
}

// stores/category.js
export const useCategoryStore = defineStore("category", {
    state: (): CategoryState => ({
        category: [],
        isLoaded: false,
        error: null,
    }),
    actions: {
        async mount(): Promise<void> {
            if (this.isLoaded) return;

            const config = useRuntimeConfig();
            try {
                const res = await $fetch<CategoryResponse>(
                    `${config.public.apiBaseUrl}/category`,
                );
                this.category = res.category ?? [];
                this.isLoaded = true;
            } catch (error: any) {
                console.error("Gagal mengambil kategori:", error);
                this.error = error.message;
                this.category = [];
            }
        },
    },
});
