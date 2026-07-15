import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "../../../../lib/prisma";
import { verifyPassword } from "../../../../lib/auth";
import { generateToken } from "../../../../lib/jwt";
import { UserStatus } from "@prisma/client";

export async function POST(req: Request) {
    try {
        // Step 1: Read JSON Body
        const body = await req.json();
        const { email, password } = body;
        const normalizedEmail = (email ?? "").trim().toLowerCase();

        // Step 2: Validate Input
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !normalizedEmail ||
            !emailRegex.test(normalizedEmail) ||
            !password ||
            password.length < 8
        ) {
            return NextResponse.json(
                { success: false, message: "Validation Failed" },
                { status: 400 }
            );
        }

        // Step 4: Find User
        const user = await prisma.user.findFirst({
            where: {
                email: normalizedEmail,
                isDeleted: false,
            },
        });

        // Step 5: If User Not Found
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid Email or Password" },
                { status: 401 }
            );
        }

        // Step 6: Check Password Exists
        if (!user.password) {
            return NextResponse.json(
                { success: false, message: "Account has no password" },
                { status: 400 }
            );
        }

        // Step 7: Check User Status
        if (user.status !== UserStatus.ACTIVE) {
            return NextResponse.json(
                { success: false, message: "Account is inactive" },
                { status: 403 }
            );
        }

        // Step 8: Compare Password
        const isPasswordValid = await verifyPassword(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: "Invalid Email or Password" },
                { status: 401 }
            );
        }

        // Step 9: Generate Token
        const token = generateToken({
            id: user.id,
            ngoId: user.ngoId ?? "",
            role: user.role,
            email: user.email,
        });
console.log("Generated Token:", token);

        // Step 10: Set HttpOnly Cookie
        // In Next.js App Router, cookies() needs to be awaited
        const cookieStore = await cookies();
        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        });

        // Step 11: Return Success (Excluding sensitive data like the password)
        return NextResponse.json(
            {
                success: true,
                message: "Login Successful",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    image: user.image,
                },
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("[LOGIN_ERROR]", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Login Failed"
            },
            {
                status: 500
            }
        );
    }
}