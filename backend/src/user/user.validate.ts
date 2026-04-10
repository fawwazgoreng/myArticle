import z from "zod";
import { loginRequest, registerType } from "./user.type";

const loginValidate = z.object({
    email: z.email().min(10).max(150),
    password: z
        .string()
        .min(6)
        .max(100)
        .refine((val) => /[A-Z]/.test(val) && /[0-9]/.test(val), {
            error: "Password at least contains 1 uppercase and one number",
        })
        .regex(/[`~!@$#%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
            message: "Password must contain at least one special character",
        }),
});
const registerValidate = z.object({
    email: z.email().min(10).max(150),
    username: z.string().min(6).max(100),
    password: z
        .string()
        .min(6)
        .max(100)
        .refine((val) => /[A-Z]/.test(val) && /[0-9]/.test(val), {
            error: "Password at least contains 1 uppercase and one number",
        })
        .regex(/[`~!@$#%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
            message: "Password must contain at least one special character",
        }),
});

export class UserValidate {
    login =  (req: loginRequest) => {
        return  loginValidate.parse(req);
    };
    register =  (req: registerType) => {
        return registerValidate.parse(req);
    };
}
