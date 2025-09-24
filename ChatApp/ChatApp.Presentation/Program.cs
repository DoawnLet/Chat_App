using ChatApp.Application.DependencyInjection;
using ChatApp.Infrastructure.DependencyInjection;

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

            var app = builder.Build();

            app.UseInfrastructurePolicy();
            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}