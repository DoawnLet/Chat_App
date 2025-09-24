using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Domain.Entities
{
    public class MessageAttachment : AuditableEntity
    {
        public Guid Id { get; set; }
        public Guid MessageId { get; set; }
        public Guid MediaId { get; set; }
        public string FileName { get; set; } = default!;
        public string MimeType { get; set; } = default!;
        public long Size { get; set; }
        public int? Width { get; set; }
        public int? Height { get; set; }
        public double? Duration { get; set; }               // cho audio/video

        public Message Message { get; set; } = default!;
        public MediaObject Media { get; set; } = default!;
    }
}