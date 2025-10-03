using ChatApp.Application.DTOs;

namespace ChatApp.Application.Abstractions.IServices
{
    public interface IChatClient
    {
        Task MessageCraete(MessagePush msg);

        Task ReceiptUpdate(ReceiptPush receipt);
    }
}