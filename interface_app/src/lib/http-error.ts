export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message?: string,
    public details?: unknown
  ) {
    super(message ?? code);
  }
}

export const Errors = {
  badRequest: (msg = "Bad Request", d?: unknown) =>
    new HttpError(400, "BAD_REQUEST", msg, d),
  unauthorized: (msg = "Unauthorized") =>
    new HttpError(401, "UNAUTHORIZED", msg),
  forbidden: (msg = "Forbidden") => new HttpError(403, "FORBIDDEN", msg),
  notFound: (msg = "Not Found") => new HttpError(404, "NOT_FOUND", msg),
  conflict: (msg = "Conflict") => new HttpError(409, "CONFLICT", msg),
  unprocessable: (msg = "Unprocessable", d?: unknown) =>
    new HttpError(422, "UNPROCESSABLE", msg, d),
  internal: (msg = "Internal Server Error", d?: unknown) =>
    new HttpError(500, "INTERNAL", msg, d),
};
