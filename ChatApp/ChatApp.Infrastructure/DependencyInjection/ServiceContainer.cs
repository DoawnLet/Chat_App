using ChatApp.Application.Abstractions.IRepositories;
using ChatApp.Application.Abstractions.IServices;
using ChatApp.Application.DependencyInjection;
using ChatApp.Application.Helps;
using ChatApp.Application.Helps.Mapping;
using ChatApp.Infrastructure.Data;
using ChatApp.Infrastructure.Repositories;
using ChatApp.Infrastructure.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ChatApp.Infrastructure.DependencyInjection
{
    public static class ServiceContainer
    {
        public static IServiceCollection AddInfrastructureService(this IServiceCollection services, IConfiguration config)
        {
            //ADd database connectivity
            //JWT and Authentication Scheme
            ShareServicesContainer.AddShareServices<AppDbContext>(services, config, config["MySerilog:FileName"]!);

            //Create dependency Injection

            // Thay thế dòng lỗi bằng
            services.AddAutoMapper(cfg =>
            {
                cfg.AddProfile<MapToFriendRequestProfile>();
                // Thêm các profile khác ở đây nếu cần
                cfg.AddProfile<MapToUserProfileProfile>();
                cfg.AddProfile<ConversionProfile>();
            });

            services.AddScoped<IAuthenticationService, AuthenticationServices>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IContactService, ContactService>();
            services.AddScoped<Utils>();
            services.AddScoped<IConversationService, ConversationService>();

            return services;
        }

        public static IApplicationBuilder UseInfrastructurePolicy(this IApplicationBuilder app)
        {
            //Register middleware such as
            //Global Exception => handle external errors
            //ListenToAPIGateway Only => block all outside calls
            ShareServicesContainer.UseSharedPolices(app);
            return app;
        }
    }
}