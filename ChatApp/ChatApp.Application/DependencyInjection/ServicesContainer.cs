using ChatApp.Application.Abstractions.IRepositories;
using ChatApp.Application.Exceptions.Logs;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Polly;
using Polly.Retry;

namespace ChatApp.Application.DependencyInjection
{
    public static class ServicesContainer
    {
        public static IServiceCollection AddApplicationService(this IServiceCollection services, IConfiguration config)
        {
            //Create Dependency inject

            //Craete retry strategy
            var retryStrategy = new RetryStrategyOptions()
            {
                ShouldHandle = new PredicateBuilder().Handle<TaskCanceledException>(),
                BackoffType = DelayBackoffType.Constant,
                UseJitter = true,
                MaxRetryAttempts = 3,
                Delay = TimeSpan.FromMilliseconds(500),
                OnRetry = args =>
                {
                    string message = $"OnRetry, Attempt: {args.AttemptNumber} OutCome {args.Outcome}";
                    LogExceptions.LogToConsole(message);
                    LogExceptions.LogToDebug(message);
                    return ValueTask.CompletedTask;
                }
            };

            //use retry strategy
            services.AddResiliencePipeline("my-retry-pipeline",
                 builder =>
                 {
                     builder.AddRetry(retryStrategy);
                 });

            return services;
        }
    }
}