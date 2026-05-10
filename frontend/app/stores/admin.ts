import { defineStore } from "pinia";
import { accessToken } from "../utils/accessToken";

const defaultProfile: Admin = {
    id: null,
    username: "",
    email: "",
};

interface AdminState {
    profile: Admin;
    isLogin: boolean;
    isLoaded: boolean;
    error: string | null;
}

export const useAdminStore = defineStore("admin", {
    state: (): AdminState => ({
        profile: defaultProfile,
        isLogin: false,
        isLoaded: false,
        error: null,
    }),

    getters: {
        isAuthenticated: (state) => state.isLogin && state.isLoaded,
    },

    actions: {
        _setError(message: string | null) {
            this.error = message;
        },

        _resetAuth() {
            this.profile = defaultProfile;
            this.isLogin = false;
            this.isLoaded = false;
            accessToken.setToken(null);
        },

        async mount():Promise<void> {
            if (this.isLoaded) return;

            const config = useRuntimeConfig();

            try {
                const res = await $fetch<AdminResponse>(
                    `${config.public.apiBaseUrl}/profile`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                this.profile = res.profile ?? defaultProfile;
                this.isLoaded = true;
                this.isLogin = true;
                this.error = null;
                accessToken.setToken(res.token);
            } catch (error: any) {
                this._resetAuth();
                this._setError(error?.data?.message ?? "Gagal memuat profil");
            }
        },

        async login(req: { email: string; password: string }): Promise<boolean> {
            this._setError(null);

            try {
                const config = useRuntimeConfig();

                const res = await $fetch<AdminLogin>(
                    `${config.public.apiBaseUrl}/login`,
                    {
                        method: "POST",
                        body: req,
                        credentials: "include",
                    }
                );

                accessToken.setToken(res.token);
                await this.mount();
                return true;
            } catch (error: any) {
                this._resetAuth();
                this._setError(
                    error?.data?.message ?? "Email atau password salah"
                );
                return false;
            }
        },

        async logout(): Promise<void> {
            this._setError(null);

            try {
                const config = useRuntimeConfig();

                await $fetch(`${config.public.apiBaseUrl}/logout`, {
                    method: "DELETE",
                    credentials: "include",
                });
            } catch (error: any) {
                this._setError(error?.data?.message ?? "Gagal logout dari server");
            } finally {
                this._resetAuth();
            }
        },
    },
});