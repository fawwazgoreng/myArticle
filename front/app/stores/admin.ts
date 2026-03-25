import { defineStore } from "pinia";

// stores/category.js
export const useAdminStore = defineStore("admin", {
    state: () => ({
        profile: {
            id: "",
            username: "",
            email: "",
        },
        isLogin: false,
        isLoaded: false,
    }),
    actions: {
        async mount() {
            if (this.isLoaded) return;

            const config = useRuntimeConfig();
            try {
                const res = await $fetch(
                    `${config.public.apiBaseUrl}/profile`,
                    {},
                ) ;
                // Pastikan format response backend sesuai
                this.profile = res.profile ?? {};
                this.isLoaded = true;
                this.isLogin = true;
                accessToken.setToken(res.token);
            } catch (error) {
                console.error("Gagal mengambil kategori:", error);
                this.profile = {
                    id: "",
                    username: "",
                    email: "",
                };
                accessToken.setToken(null);
                this.isLogin = false;
            }
        },
        async login(req: {
            email: string,
            password: string
        }) {
            try {
                
            } catch (error) {
                
            }
        },
        async logout() {
            try {
               await 
            } catch (error) {
                
            }
        }
    },
});
