using ChatApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ChatApp.Application.BackGroundServices
{    /// <summary>
     /// Service để tự động unmute conversations khi hết thời gian mute
     /// </summary>
    public class ConversationUnmuteService(IServiceProvider serviceProvider,
            ILogger<ConversationUnmuteService> _logger) : BackgroundService
    {
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = serviceProvider.CreateScope();
                    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                    //Find conversation have experies
                    var expiredMutes = await context.ConversationMembers.
                        Where(m => m.MutedUntil.HasValue && m.MutedUntil.Value <= DateTimeOffset.UtcNow)
                        .ToListAsync();

                    foreach (var member in expiredMutes)
                    {
                        member.MutedUntil = null;
                        _logger.LogInformation("Auto-unmuted conversation {ConversationId} for user {UserId}", member.ConversationId, member.UserId);
                    }

                    if (expiredMutes.Any())
                    {
                        await context.SaveChangesAsync(stoppingToken);
                    }

                    // Chạy mỗi 5 phút
                    await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in ConversationUnmuteService");
                    await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
                }
            }
        }
    }
}