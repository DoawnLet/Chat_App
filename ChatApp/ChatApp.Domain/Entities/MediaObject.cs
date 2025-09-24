using ChatApp.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Domain.Entities
{
    public class MediaObject : AuditableEntity
    {
        public Guid Id { get; set; }
        public string StorageKey { get; set; } = default!;  // path/key trong storage
        public string MimeType { get; set; } = default!;
        public long Size { get; set; }
        public string Sha256 { get; set; } = default!;
        public MediaStatus Status { get; set; } = MediaStatus.Pending;
        public string? Url { get; set; }                    // CDN (nếu public)
        public string? ThumbUrl { get; set; }

        public ICollection<MessageAttachment> Attachments { get; set; } = new List<MessageAttachment>();
    }
}