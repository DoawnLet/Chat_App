using ChatApp.Application.Abstractions.IServices;
using ChatApp.Application.DependencyInjection;
using ChatApp.Infrastructure.DependencyInjection;
using ChatApp.Infrastructure.MessageActive;
using ChatApp.Presentation.Realtime;
using ChatApp.Presentation.Realtime.ChatHubs;
using Microsoft.AspNetCore.CookiePolicy;
using Serilog;

namespace ChatApp.Presentation
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Host.UseSerilog();
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddInfrastructureService(builder.Configuration);
            builder.Services.AddApplicationService(builder.Configuration);
            //builder.Services.AddShareServices(builder.Configuration);

            builder.Services.AddScoped<IMessageBus, SignalRMessageBus>();
            // Thêm MediatR registration
            //builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(SendMessageHandler).Assembly));
            //builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(ListMessageHandler).Assembly));
            builder.Services.AddSignalR();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(
                    "AllowFrontend",
                    builder =>
                    {
                        builder
                            .WithOrigins("http://localhost:3000")
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials();
                    }
                );
            });

            // Add cookie policy configuration
            builder.Services.Configure<CookiePolicyOptions>(options =>
            {
                options.MinimumSameSitePolicy = SameSiteMode.None;
                options.HttpOnly = HttpOnlyPolicy.Always;
                options.Secure = CookieSecurePolicy.Always;
            });

            var app = builder.Build();

            app.Use(async (context, next) =>
            {
                Console.WriteLine($"Request: {context.Request.Method} {context.Request.Path}");
                await next();
            });

            app.UseInfrastructurePolicy();
            app.UseSwagger();
            app.UseCors("AllowFrontend");
            // Make sure to use the policy
            app.UseCookiePolicy();

            app.UseSwaggerUI();

            app.UseSharedPolices();
            // app.UseHttpsRedirection(); // Tạm thời disable cho development với HTTP frontend

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapHub<ChatHub>("/hubs/chat");
            app.MapControllers();

            app.Run();
        }
    }
}