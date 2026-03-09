import { defineStore } from "pinia"

export const useCategoryStore = defineStore('category',{
  state: () => ({
    category:[],
    load:false
  }),
  actions: {
    async mount () {
      const config = useRuntimeConfig();
      if (this.category.length > 1 || this.load == true) return;
      const res = await $fetch(`${config.public.apiBaseUrl}/category`)
      this.category = res.category;
      this.load = true;
    }
  }
})