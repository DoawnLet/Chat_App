import { ZodError } from "zod";
import { Errors } from "./http-error";
export function fromZod(e: unknown) {
  if (e instanceof ZodError) {
    return Errors.unprocessable("Validation failed", e.flatten());
  }
  throw e;
}
