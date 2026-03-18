
export interface loginRequest {
    email: string,
    password: string
}

export interface monitoring {
    admin_id: string,
    event_type: "login" | "register" | "logout",
    device_type: string,
    ip_address: string,
    success: boolean,
    failure_session: string | null
}