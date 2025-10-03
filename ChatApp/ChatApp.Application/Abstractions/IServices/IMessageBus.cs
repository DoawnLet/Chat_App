using ChatApp.Application.DTOs;

namespace ChatApp.Application.Abstractions.IServices
{
    public interface IMessageBus
    {
        Task publicMessageCreatedAsync(MessageCreatedEvent evt);
    }
}