import { env } from "@/config";
import AppError from "@utils/error";

export const encode = (text: string) => new TextEncoder().encode(text);
export const decode = (buffer: ArrayBuffer) => new TextDecoder().decode(buffer);

const getKey = async () => {
    const key = String(env.SECRET_KEY);
    const hashedKey = await crypto.subtle.digest("SHA-256", encode(key));
    return crypto.subtle.importKey(
        "raw",
        hashedKey,
        { name: "AES-GCM" },
        false,
        ['encrypt' , 'decrypt']
    )
}

export const encryptToken = async (value: string) => {
    try {        
    const key = await getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryped = await crypto.subtle.encrypt(
        {name: "AES-GCM" , iv},
        key,
        encode(value)
    );
    const combined = new Uint8Array(iv.length + encryped.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryped), iv.length);
        return Buffer.from(combined).toString("base64");
    } catch (error : any) {
        throw new AppError(500, "Error encript token");
    }
}

export const randomUuid = async () => {
    const uuid = crypto.randomUUID();
    return await encryptToken(uuid);
}

export const decryptToken = async (token: string) => {
    const key = await getKey();
    
    const combined = Uint8Array.from(atob(token).split("").map(c => c.charCodeAt(0)));
    
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decrypt = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        ciphertext
    );
    return decode(decrypt);
}