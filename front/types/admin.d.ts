declare global {
    interface Admin {
        id: string;
        username: string;
        email: string;
    }
    interface AdminResponse extends GlobalResponse {
        profile: Admin;
        token: string;
    }
}
export {};
