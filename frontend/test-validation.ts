
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().trim().email("Invalid email format"),
    password: z.string().trim().min(6, "Password must be at least 6 characters"),
});

function test(email: string, password: string) {
    const trimmedEmail = (email || "").trim();
    const trimmedPassword = (password || "").trim();
    const validation = loginSchema.safeParse({ email: trimmedEmail, password: trimmedPassword });
    if (validation.success) {
        console.log(`PASS: "${email}", "${password}"`);
    } else {
        const errorMsg = validation.error ? validation.error.issues[0]?.message : "Unknown error";
        console.log(`FAIL: "${email}", "${password}" -> ${errorMsg}`);
    }
}

console.log("Testing validation logic...");
test("admin@ems.com", "admin123");
test(" admin@ems.com ", "admin123");
test("admin@ems.com", " admin123 ");
test("invalid-email", "admin123");
test("admin@ems.com", "12345");
test("", "");
