using ChatApp.Application.Abstractions.IServices;
using ChatApp.Application.DependencyInjection;
using ChatApp.Infrastructure.DependencyInjection;
using ChatApp.Presentation.Realtime;
using ChatApp.Presentation.Realtime.ChatHubs;

namespace ChatApp.Presentation
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddInfrastructureService(builder.Configuration);
            builder.Services.AddApplicationService(builder.Configuration);
            builder.Services.AddScoped<IMessageBus, SignalRMessageBus>();
            builder.Services.AddSignalR();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowNextJs",
                    policy => policy.WithOrigins("http://localhost:3000") // địa chỉ Next.js
                                    .AllowAnyHeader()
                                    .AllowAnyMethod()
                                    .AllowCredentials());
            });

            var app = builder.Build();
            {
                app.UseInfrastructurePolicy();
                app.UseSwagger();
            }

            app.MapHub<ChatHub>("/hubs/chat");
            app.UseSwaggerUI();

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}