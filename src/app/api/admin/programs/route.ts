import { NextRequest, NextResponse } from "next/server";
import { ProgramStatus } from "@prisma/client";
import { cookies } from "next/headers";
import { verifyToken } from "../../../../lib/jwt";
import { prisma } from "../../../../lib/prisma";



/* =====================================================
   GET - List All Programs
   ===================================================== */
export async function GET() {
    try {
        const cookieStore = await cookies();

const token = cookieStore.get("token")?.value;

if (!token) {
    return NextResponse.json(
        {
            success: false,
            message: "Unauthorized",
        },
        {
            status: 401,
        }
    );
}

const payload = verifyToken(token);

    const programs = await prisma.program.findMany({
    where: {
        ngoId: payload.ngoId,
        isDeleted: false,
    },

            include: {
                ngo: {
                    select: {
                        id: true,
                        name: true,
                    },
                },

                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },

                campaigns: {
                    where: {
                        isDeleted: false,
                    },
                    select: {
                        id: true,
                        title: true,
                        status: true,
                    },
                },

                events: {
                    where: {
                        isDeleted: false,
                    },
                    select: {
                        id: true,
                        title: true,
                        startDate: true,
                        status: true,
                    },
                },

                volunteers: {
                    include: {
                        volunteer: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },

            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({
            success: true,
            count: programs.length,
            data: programs,
        });
    } catch (error) {
        console.error("GET PROGRAMS ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch programs",
            },
            {
                status: 500,
            }
        );
    }
}

/* =====================================================
   POST - Create Program
   ===================================================== */

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
    
        const cookieStore = await cookies();

const token = cookieStore.get("token")?.value;

if (!token) {
    return NextResponse.json(
        {
            success: false,
            message: "Unauthorized",
        },
        {
            status: 401,
        }
    );
}

const payload = verifyToken(token);
if (payload.role !== "ADMIN") {
    return NextResponse.json(
        {
            success: false,
            message: "Access denied",
        },
        {
            status: 403,
        }
    );
}

const ngoId = payload.ngoId;

const createdBy = payload.id;
        const {
            name,
            category,
            description,
            coordinator,
            manager,
            budget,
            beneficiaries,
            progress,
            startDate,
            endDate,
            location,
            coverImage,
            status,
        } = body;

        /* ---------------- Validation ---------------- */

        if (!name)
            return NextResponse.json(
                {
                    success: false,
                    message: "Program name is required",
                },
                {
                    status: 400,
                }
            );

        if (!category)
            return NextResponse.json(
                {
                    success: false,
                    message: "Category is required",
                },
                {
                    status: 400,
                }
            );

        if (!budget)
            return NextResponse.json(
                {
                    success: false,
                    message: "Budget is required",
                },
                {
                    status: 400,
                }
            );

        if (!startDate)
            return NextResponse.json(
                {
                    success: false,
                    message: "Start Date is required",
                },
                {
                    status: 400,
                }
            );

        /* ------------ Check NGO ------------ */

const ngo = await prisma.nGO.findFirst({
    where: {
        id: ngoId,
        isDeleted: false,
    },
});

        if (!ngo) {
            return NextResponse.json(
                {
                    success: false,
                    message: "NGO not found",
                },
                {
                    status: 404,
                }
            );
        }

        /* ------------ Check User ------------ */

    const admin = await prisma.user.findFirst({
    where: {
        id: createdBy,
        ngoId: ngoId,
        role: "ADMIN",
        isDeleted: false,
    },
});

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Creator not found",
                },
                {
                    status: 404,
                }
            );
        }

        /* ------------ Create Program ------------ */

        const program = await prisma.program.create({
            data: {
                ngoId,

                createdBy,

                name,

                category,

                description,

                coordinator,

                manager,

                budget,

                beneficiaries: beneficiaries ?? 0,

                progress: progress ?? 0,

                startDate: new Date(startDate),

                endDate: endDate ? new Date(endDate) : null,

                location,

                coverImage,

                status: status ?? ProgramStatus.UPCOMING,
            },

            include: {
                ngo: true,
                creator: true,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Program created successfully",
                data: program,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("CREATE PROGRAM ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create program",
            },
            {
                status: 500,
            }
        );
    }
}

/* =====================================================
   PATCH - Update Program
===================================================== */

export async function PATCH(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const payload = verifyToken(token);
        const body = await req.json();

        const {
            id,
            name,
            category,
            description,
            coordinator,
            manager,
            budget,
            usedBudget,
            beneficiaries,
            progress,
            startDate,
            endDate,
            location,
            coverImage,
            status,
        } = body;

        // Validate Program ID
        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Program ID is required",
                },
                { status: 400 }
            );
        }

        // Check if Program exists
      const existingProgram = await prisma.program.findFirst({
    where: {
        id,
        ngoId: payload.ngoId,
        isDeleted: false,
    },
});

        if (!existingProgram) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Program not found",
                },
                { status: 404 }
            );
        }

        // Update Program
        const updatedProgram = await prisma.program.update({
            where: {
                id,
            },

            data: {
                ...(name !== undefined && { name }),

                ...(category !== undefined && { category }),

                ...(description !== undefined && { description }),

                ...(coordinator !== undefined && { coordinator }),

                ...(manager !== undefined && { manager }),

                ...(budget !== undefined && {
                    budget: Number(budget),
                }),

                ...(usedBudget !== undefined && {
                    usedBudget: Number(usedBudget),
                }),

                ...(beneficiaries !== undefined && {
                    beneficiaries: Number(beneficiaries),
                }),

                ...(progress !== undefined && {
                    progress: Number(progress),
                }),

                ...(startDate && {
                    startDate: new Date(startDate),
                }),

                ...(endDate && {
                    endDate: new Date(endDate),
                }),

                ...(location !== undefined && { location }),

                ...(coverImage !== undefined && { coverImage }),

                ...(status !== undefined && { status }),

                updatedBy: payload.id,
            },

            include: {
                ngo: true,

                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },

                campaigns: true,

                events: true,

                volunteers: true,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Program updated successfully",
            data: updatedProgram,
        });
    } catch (error) {
        console.error("UPDATE PROGRAM ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update program",
            },
            {
                status: 500,
            }
        );
    }
}
/* =====================================================
   DELETE - Soft Delete Program
===================================================== */

export async function DELETE(req: NextRequest) {
    try {
        // Get Program ID from query parameter
        const { searchParams } = new URL(req.url);

        const id = searchParams.get("id");
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;


if (!token) {
    return NextResponse.json(
        {
            success: false,
            message: "Unauthorized",
        },
        {
            status: 401,
        }
    );
}

const payload = verifyToken(token);

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Program ID is required",
                },
                {
                    status: 400,
                }
            );
        }

        // Check Program Exists
        const existingProgram = await prisma.program.findFirst({
           where:{
    id,
    ngoId: payload.ngoId,
    isDeleted:false
}
        });

        if (!existingProgram) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Program not found",
                },
                {
                    status: 404,
                }
            );
        }

        // Permanently Delete Program
       const deletedProgram = await prisma.program.delete({
    where: {
        id,
    },
});

        return NextResponse.json({
            success: true,
            message: "Program deleted successfully",
            data: deletedProgram,
        });

    } catch (error) {
        console.error("DELETE PROGRAM ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete program",
            },
            {
                status: 500,
            }
        );
    }
}