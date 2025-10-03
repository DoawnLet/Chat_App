using ChatApp.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Application.DTOs
{
    public class SendMessageRequest
    {
        public string ClientMessageId { get; set; } = default!;  // client tự tạo
        public string Text { get; set; } = "";
        public MessageType Type { get; set; } = MessageType.Text;
    }
}