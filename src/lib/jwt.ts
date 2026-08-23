import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

/* =========================================================
   JWT CONFIGURATION
========================================================= */

const JWT_SECRET_ENV = process.env.JWT_SECRET;

if (!JWT_SECRET_ENV) {
  throw new Error(
    "JWT_SECRET is not defined in environment variables."
  );
}

const JWT_SECRET: jwt.Secret = JWT_SECRET_ENV;

const JWT_EXPIRES_IN =
  (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"];

/* =========================================================
   JWT PAYLOAD
========================================================= */

export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
  ngoId: string | null;
}

/* =========================================================
   GENERATE TOKEN
========================================================= */

export function generateToken(
  payload: JwtPayload
): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/* =========================================================
   VERIFY TOKEN
========================================================= */

export function verifyToken(
  token: string
): JwtPayload {
  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    /* -------------------------------------------------------
       Ensure decoded value is an object
    ------------------------------------------------------- */

    if (
      typeof decoded !== "object" ||
      decoded === null
    ) {
      throw new Error("Invalid JWT payload.");
    }

    const payload = decoded as jwt.JwtPayload &
      Partial<JwtPayload>;

    /* -------------------------------------------------------
       Validate required JWT fields
    ------------------------------------------------------- */

    if (
      typeof payload.id !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.role !== "string"
    ) {
      throw new Error(
        "Invalid JWT payload structure."
      );
    }

    /* -------------------------------------------------------
       Validate role
    ------------------------------------------------------- */

    const validRoles = Object.values(Role);

    if (
      !validRoles.includes(
        payload.role as Role
      )
    ) {
      throw new Error(
        "Invalid role in JWT payload."
      );
    }

    /* -------------------------------------------------------
       Validate ngoId
    ------------------------------------------------------- */

    if (
      payload.ngoId !== undefined &&
      payload.ngoId !== null &&
      typeof payload.ngoId !== "string"
    ) {
      throw new Error(
        "Invalid ngoId in JWT payload."
      );
    }

    /* -------------------------------------------------------
       Return validated payload
    ------------------------------------------------------- */

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role as Role,
      ngoId: payload.ngoId ?? null,
    };
  } catch (error) {
    console.error(
      "JWT VERIFY ERROR:",
      error
    );

    throw error;
  }
}