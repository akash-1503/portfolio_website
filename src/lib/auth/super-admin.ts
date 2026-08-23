import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../prisma";
import { verifyToken } from "../jwt";
import { Role } from "@prisma/client";

export async function authenticateSuperAdmin(
    req: NextRequest
) {
    /* =====================================================
       GET TOKEN
    ===================================================== */

    const token =
        req.cookies.get("token")?.value;

    if (!token) {
        console.error(
            "SUPER ADMIN AUTH: token cookie missing"
        );

        return {
            error: NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            ),
        };
    }

    /* =====================================================
       VERIFY JWT
    ===================================================== */

    let payload: any;

    try {
        payload =
            verifyToken(token);
    } catch (error) {
        console.error(
            "SUPER ADMIN JWT ERROR:",
            error
        );

        return {
            error: NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid or expired token.",
                },
                {
                    status: 401,
                }
            ),
        };
    }

    /* =====================================================
       VALIDATE JWT PAYLOAD
    ===================================================== */

    if (
        !payload ||
        !payload.id
    ) {
        console.error(
            "SUPER ADMIN AUTH: invalid JWT payload"
        );

        return {
            error: NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid authentication token.",
                },
                {
                    status: 401,
                }
            ),
        };
    }

    /* =====================================================
       CHECK ROLE
    ===================================================== */

    if (
        payload.role !==
        Role.SUPER_ADMIN
    ) {
        console.error(
            "SUPER ADMIN AUTH: invalid role",
            payload.role
        );

        return {
            error: NextResponse.json(
                {
                    success: false,
                    message:
                        "Super Admin access required.",
                },
                {
                    status: 403,
                }
            ),
        };
    }

    /* =====================================================
       VERIFY USER IN DATABASE
    ===================================================== */

    const superAdmin =
        await prisma.user.findFirst({
            where: {
                id: payload.id,

                role:
                    Role.SUPER_ADMIN,

                isDeleted: false,

                status: "ACTIVE",
            },

            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                ngoId: true,
            },
        });

    /* =====================================================
       SUPER ADMIN NOT FOUND
    ===================================================== */

    if (!superAdmin) {
        console.error(
            "SUPER ADMIN AUTH: account not found",
            payload.id
        );

        return {
            error: NextResponse.json(
                {
                    success: false,
                    message:
                        "Super Admin account not found or inactive.",
                },
                {
                    status: 403,
                }
            ),
        };
    }

    /* =====================================================
       SUCCESS
    ===================================================== */

    return {
        payload,
        superAdmin,
    };
}