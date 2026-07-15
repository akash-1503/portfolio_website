import { NextResponse } from "next/server";
// Adjust this import based on where you initialize your Prisma Client
import { prisma } from "../../../../lib/prisma";

import { Role, UserStatus } from "@prisma/client";
import { hashPassword } from "../../../../lib/auth";

export async function POST(req: Request) {
    try {
        // Step 1: Read the JSON Body
        const body = await req.json();
        console.log(body);
        const { name, email, password, phone } = body;
        const cleanName = (name ?? "").trim();
        const cleanEmail = (email ?? "").trim().toLowerCase();
        console.log({
    cleanName,
    cleanEmail,
    password,
    phone,
});

        // Step 2: Validate Input
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

       if (!cleanName) {
    return NextResponse.json(
        {
            success: false,
            message: "Name is required",
        },
        { status: 400 }
    );
}

if (cleanName.length < 3) {
    return NextResponse.json(
        {
            success: false,
            message: "Name must be at least 3 characters",
        },
        { status: 400 }
    );
}

if (!cleanEmail) {
    return NextResponse.json(
        {
            success: false,
            message: "Email is required",
        },
        { status: 400 }
    );
}

if (!emailRegex.test(cleanEmail)) {
    return NextResponse.json(
        {
            success: false,
            message: "Invalid email",
        },
        { status: 400 }
    );
}

if (!password) {
    return NextResponse.json(
        {
            success: false,
            message: "Password is required",
        },
        { status: 400 }
    );
}

if (password.length < 8) {
    return NextResponse.json(
        {
            success: false,
            message: "Password must be at least 8 characters",
        },
        { status: 400 }
    );
}

if (phone && !phoneRegex.test(phone)) {
    return NextResponse.json(
        {
            success: false,
            message: "Phone number must contain exactly 10 digits",
        },
        { status: 400 }
    );
}

        // Step 3: Check Email Exists
        const existingUser = await prisma.user.findFirst({
            where: {
                email: cleanEmail,
                isDeleted: false,
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "Email already registered" },
                { status: 409 }
            );
        }

        // Step 4: Find NGO
        // Assuming the model is named NGO in Prisma
      const ngo = await prisma.nGO.findFirst({
  where: {
    isDeleted: false,
  },
});

console.log("NGO FOUND:", ngo);

        if (!ngo) {
            return NextResponse.json(
                { success: false, message: "NGO not found" },
                { status: 404 }
            );
        }

        // Step 5: Hash Password
        // Using a salt round of 12 for standard security
        const hashedPassword = await hashPassword(password);

        // Step 6: Create User
        await prisma.user.create({
    data: {
        ngoId: ngo.id,

        name: cleanName,

        email: cleanEmail,

        password: hashedPassword,

        phone: phone || null,

        role: Role.USER,

        status: UserStatus.ACTIVE,

        image: null,

        emailVerified: null,

        isDeleted: false,
    },
});

        // Step 7: Return Success
        return NextResponse.json(
            { success: true, message: "Registration Successful" },
            { status: 201 }
        );

    } catch (error) {
        // Step 8: Catch Block
        console.error("[REGISTER_ERROR]", error);

        return NextResponse.json(
            { success: false, message: "Registration Failed" },
            { status: 500 }
        );
    }
}