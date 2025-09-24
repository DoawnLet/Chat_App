using ChatApp.Application.Exceptions.Logs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.Json;

namespace ChatApp.Application.Exceptions.ReponseExceptions
{
    public class GlobalExceptions(RequestDelegate next)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            string message = "Sorry, internal server error occured. Kindly try again";
            int statusCode = (int)HttpStatusCode.InternalServerError;
            string title = "Error";

            try
            {
                await next(context);

                // Xử lý các status code đã được thiết lập
                switch (context.Response.StatusCode)
                {
                    case StatusCodes.Status400BadRequest:
                        title = "Bad Request";
                        message = "The request was invalid or cannot be served";
                        await ModifyHeader(context, title, message, StatusCodes.Status400BadRequest);
                        break;

                    case StatusCodes.Status401Unauthorized:
                        title = "Unauthorized";
                        message = "Authentication is required and has failed or has not been provided";
                        await ModifyHeader(context, title, message, StatusCodes.Status401Unauthorized);
                        break;

                    case StatusCodes.Status403Forbidden:
                        title = "Forbidden";
                        message = "You do not have permission to access this resource";
                        await ModifyHeader(context, title, message, StatusCodes.Status403Forbidden);
                        break;

                    case StatusCodes.Status404NotFound:
                        title = "Not Found";
                        message = "The requested resource could not be found";
                        await ModifyHeader(context, title, message, StatusCodes.Status404NotFound);
                        break;

                    case StatusCodes.Status429TooManyRequests:
                        title = "Warning";
                        message = "Too many requests";
                        await ModifyHeader(context, title, message, StatusCodes.Status429TooManyRequests);
                        break;
                }
            }
            catch (Exception ex)
            {
                // Log lỗi gốc
                LogExceptions.LogException(ex);

                // Xử lý các loại exception khác nhau
                if (ex is TaskCanceledException || ex is TimeoutException)
                {
                    title = "Out of time";
                    message = "Request timeout. Please try again";
                    statusCode = StatusCodes.Status408RequestTimeout;
                }
                else if (ex is UnauthorizedAccessException)
                {
                    title = "Unauthorized";
                    message = "You are not authorized to access this resource";
                    statusCode = StatusCodes.Status401Unauthorized;
                }
                else if (ex is KeyNotFoundException)
                {
                    title = "Not Found";
                    message = "The requested resource was not found";
                    statusCode = StatusCodes.Status404NotFound;
                }
                else if (ex is InvalidOperationException)
                {
                    title = "Bad Request";
                    message = "The request cannot be processed due to invalid operation";
                    statusCode = StatusCodes.Status400BadRequest;
                }
                else if (ex is ArgumentException)
                {
                    title = "Bad Request";
                    message = "One or more arguments are invalid";
                    statusCode = StatusCodes.Status400BadRequest;
                }
                // Thêm các exception khác nếu cần

                // Gửi response với thông tin lỗi đã xử lý
                await ModifyHeader(context, title, message, statusCode);
            }
        }

        private async Task ModifyHeader(HttpContext context, string title, string message, int statusCode)
        {
            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonSerializer.Serialize(new ProblemDetails()
            {
                Detail = message,
                Status = statusCode,
                Title = title
            }), CancellationToken.None);
        }
    }
}