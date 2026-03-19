
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

export interface session_audit_trail extends monitoring {
    id: number,
    admin: adminType,
    created_at: Date,
    updated_at: Date,
}

export type adminType = {
    id: string,
    username: string,
    email: string,
    password: string,
    created_at: Date,
    updated_at: Date,
    authlogs?: session_audit_trail | session_audit_trail[]
} 

export type adminHasUsed = {
    ip_address: string,
    event_type: "login" | "register" | "logout",
    device_type: string,
}