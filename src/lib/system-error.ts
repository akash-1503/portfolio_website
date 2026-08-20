import { prisma } from "./prisma";
import { Prisma, ErrorSeverity } from "@prisma/client";

interface LogSystemErrorParams {
  error: unknown;

  message?: string;

  errorType?: string;

  endpoint?: string;

  method?: string;

  statusCode?: number;

  ngoId?: string | null;

  userId?: string | null;

  severity?: ErrorSeverity;

  requestId?: string;

  stack?: string | null;

  metadata?: Prisma.InputJsonValue | null;
}

/* =========================================================
   ERROR MESSAGE
========================================================= */

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown system error";
  }
}

/* =========================================================
   ERROR STACK
========================================================= */

function getErrorStack(error: unknown): string | null {
  if (error instanceof Error) {
    return error.stack ?? null;
  }

  return null;
}

/* =========================================================
   LOG SYSTEM ERROR
========================================================= */

export async function logSystemError({
  error,
  message,
  errorType,
  endpoint,
  method,
  statusCode,
  ngoId,
  userId,
  severity = ErrorSeverity.ERROR,
  requestId,
  stack,
  metadata,
}: LogSystemErrorParams) {
  try {
    const errorMessage =
      message || getErrorMessage(error);

    const errorStack =
      stack !== undefined
        ? stack
        : getErrorStack(error);

    const systemError =
      await prisma.systemError.create({
        data: {
          message: errorMessage,

          errorType:
            errorType ?? null,

          stack:
            errorStack,

          endpoint:
            endpoint ?? null,

          method:
            method ?? null,

          statusCode:
            statusCode ?? null,

          ngoId:
            ngoId ?? null,

          userId:
            userId ?? null,

          severity,

          requestId:
            requestId ?? null,

          metadata:
            metadata === undefined
              ? undefined
              : metadata === null
                ? Prisma.JsonNull
                : metadata,
        },
      });

    console.error(
      "SYSTEM ERROR LOGGED:",
      systemError.id
    );

    return systemError;

  } catch (loggingError) {
    /*
     * Error logging must NEVER
     * crash the original API.
     */

    console.error(
      "FAILED TO LOG SYSTEM ERROR:",
      loggingError
    );

    return null;
  }
}