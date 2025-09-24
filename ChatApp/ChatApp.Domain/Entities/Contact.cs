using ChatApp.Domain.Enum;

namespace ChatApp.Domain.Entities
{
    public class Contact : AuditableEntity
    {
        public Guid Id { get; set; }
        public Guid OwnerId { get; set; }
        public Guid TargetId { get; set; }
        public ContactStatus Status { get; set; }
        public string? Note { get; set; }

        public User Owner { get; set; } = default!;
        public User Target { get; set; } = default!;
    }
}