declare global {
    type Admin = {
        id: string | null;
        username: string;
        email: string;
    }
    interface AdminResponse extends GlobalResponse {
        profile: Admin;
        token: string;
    }
    interface AdminLogin extends GlobalResponse {
        token: string
    }
}
export {};
