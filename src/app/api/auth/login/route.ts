import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { verifyPassword } from "../../../../lib/auth";
import { generateToken } from "../../../../lib/jwt";
import { UserStatus } from "@prisma/client";

export async function POST(req: Request) {
    try {
        /* =====================================================
           STEP 1: READ REQUEST BODY
        ===================================================== */

        const body = await req.json();

        const {
            email,
            password,
        } = body;

        /* =====================================================
           STEP 2: NORMALIZE INPUT
        ===================================================== */

        const normalizedEmail =
            typeof email === "string"
                ? email.trim().toLowerCase()
                : "";

        /* =====================================================
           STEP 3: VALIDATE INPUT
        ===================================================== */

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !normalizedEmail ||
            !emailRegex.test(normalizedEmail) ||
            typeof password !== "string" ||
            password.length < 8
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Validation Failed",
                },
                {
                    status: 400,
                }
            );
        }

        /* =====================================================
           STEP 4: FIND USER
        ===================================================== */

        const user =
            await prisma.user.findFirst({
                where: {
                    email: normalizedEmail,
                    isDeleted: false,
                },
            });

        /* =====================================================
           STEP 5: USER NOT FOUND
        ===================================================== */

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid Email or Password",
                },
                {
                    status: 401,
                }
            );
        }

        /* =====================================================
           STEP 6: CHECK PASSWORD
        ===================================================== */

        if (!user.password) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Account has no password",
                },
                {
                    status: 400,
                }
            );
        }

        /* =====================================================
           STEP 7: CHECK ACCOUNT STATUS
        ===================================================== */

        if (
            user.status !==
            UserStatus.ACTIVE
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Account is inactive",
                },
                {
                    status: 403,
                }
            );
        }

        /* =====================================================
           STEP 8: VERIFY PASSWORD
        ===================================================== */

        const isPasswordValid =
            await verifyPassword(
                password,
                user.password
            );

        if (!isPasswordValid) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid Email or Password",
                },
                {
                    status: 401,
                }
            );
        }

        /* =====================================================
           STEP 9: GENERATE JWT
        ===================================================== */

        const token =
            generateToken({
                id: user.id,
                ngoId: user.ngoId ?? "",
                role: user.role,
                email: user.email,
            });

        console.log(
            "LOGIN SUCCESS:",
            {
                userId: user.id,
                role: user.role,
                email: user.email,
            }
        );

        /* =====================================================
           STEP 10: CREATE RESPONSE
        ===================================================== */

        const response =
            NextResponse.json(
                {
                    success: true,

                    message:
                        "Login Successful",

                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        image: user.image,
                    },
                },
                {
                    status: 200,
                }
            );

        /* =====================================================
           STEP 11: SET JWT COOKIE
        ===================================================== */

        response.cookies.set(
            "token",
            token,
            {
                httpOnly: true,

                secure:
                    process.env.NODE_ENV ===
                    "production",

                sameSite: "lax",

                path: "/",

                maxAge:
                    7 *
                    24 *
                    60 *
                    60,
            }
        );

        /* =====================================================
           STEP 12: RETURN RESPONSE
        ===================================================== */

        return response;

    } catch (error) {
        console.error(
            "[LOGIN_ERROR]",
            error
        );

        return NextResponse.json(
            {
                success: false,

                message:
                    error instanceof Error
                        ? error.message
                        : "Login Failed",
            },
            {
                status: 500,
            }
        );
    }
}