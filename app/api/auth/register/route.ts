import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";

// example request body
// {
//     "name": "John Doe",
//     "email": "
//     "password": "password123"
// }

// example request code in js fetch
// fetch("/api/auth/register", {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//         name: "John Doe",
//         email: "testuser@gmail.com",
//         password: "password123",
//     }),
// })
//     .then((res) => res.json())
//     .then((data) => console.log(data))
//     .catch((err) => console.error(err));


export  async function POST(request: Request) {
    const { name, email, password } = await request.json();
    const hash = await bcrypt.hash(password, 10);
    const result = await db.insert(users).values({
        name,
        email,
        roleType: "user",
        "password": hash,
    })
    if (result) {
        return new Response(JSON.stringify({ message: "User registered successfully" }), {
            status: 201,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } else {
        return new Response(JSON.stringify({ message: "Failed to register user" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}
