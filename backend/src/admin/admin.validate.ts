import z from "zod";
import { loginRequest } from "./admin.type";

const loginValidate = z.object({
    email: z.email().min(10),
    password: z
        .string()
        .min(6)
        .refine((val) => /[A-Z]/.test(val) && /[0-9]/.test(val), {
            error: "Password at least contains 1 uppercase and one number",
        })
        .regex(/[`~!@$#%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
            message: "Password must contain at least one special character",
        }),
});

export class AdminValidate {
    login = async (req: loginRequest) => {
        try {
            return loginValidate.parse(req);
        } catch (error) {
            throw error;
        }
    };
}
