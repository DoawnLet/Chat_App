import { NextResponse } from "next/server";
import { HttpError } from "./http-error";

export function toProblem(e: unknown, fallback = 500) {
  if (e instanceof HttpError) {
    return NextResponse.json(
      { title: e.message, status: e.status, code: e.code, details: e.details },
      { status: e.status }
    );
  }

  // Log ở đây (Sentry/console)
  return NextResponse.json(
    { title: "Internal Server Error", status: fallback, code: "INTERNAL" },
    { status: fallback }
  );
}
