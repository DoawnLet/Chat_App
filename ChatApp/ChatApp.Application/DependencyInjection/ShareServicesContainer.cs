using ChatApp.Application.Abstractions;
using ChatApp.Application.Exceptions.ReponseExceptions;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Application.DependencyInjection
{
    public static class ShareServicesContainer
    {
        public static IServiceCollection AddShareServices<TContext>(this IServiceCollection service, IConfiguration config, string fileName) where TContext : DbContext
        {
            service.AddDbContext<TContext>(option => option.UseSqlServer(
               config.GetConnectionString("ChatAppDb"),
               sqlserveroption => sqlserveroption.EnableRetryOnFailure()));

            //configure serilog logging
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Information()
                .WriteTo.Console()
                .WriteTo.Debug()
                .WriteTo.File(path: $"{fileName}.text", restrictedToMinimumLevel: Serilog.Events.LogEventLevel.Information,
               outputTemplate: "{TimeStamp:YYYY-MM-dd HH:mm:ss fff zzz} [{Level:u3}] {message:lj}{NewLine}{Exception}",
               rollingInterval: RollingInterval.Day).CreateLogger();

            JWTAuthenticationScheme.AddJWTAuthenticationScheme(service, config);

            return service;
        }

        public static IApplicationBuilder UseSharedPolices(this IApplicationBuilder app)
        {
            //use global exception handler
            app.UseMiddleware<GlobalExceptions>();

            //Refister middleware to block all outsiders API call
            //app.UseMiddleware<ListenToOnlyApiGetway>();
            return app;
        }
    }
}