using ChatApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users => Set<User>();
        public DbSet<Device> Devices => Set<Device>();
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
        public DbSet<Contact> Contacts => Set<Contact>();
        public DbSet<Conversation> Conversations => Set<Conversation>();
        public DbSet<ConversationMember> ConversationMembers => Set<ConversationMember>();
        public DbSet<Message> Messages => Set<Message>();
        public DbSet<MessageAttachment> MessageAttachments => Set<MessageAttachment>();
        public DbSet<MediaObject> MediaObjects => Set<MediaObject>();
        public DbSet<MessageReceipt> MessageReceipts => Set<MessageReceipt>();
        public DbSet<MessageReaction> MessageReactions => Set<MessageReaction>();
        public DbSet<NotificationToken> NotificationTokens => Set<NotificationToken>();

        protected override void OnModelCreating(ModelBuilder b)
        {
            // Concurrency token
            foreach (var e in b.Model.GetEntityTypes())
            {
                var prop = e.FindProperty(nameof(AuditableEntity.RowVersion));
                if (prop != null) prop.IsConcurrencyToken = true;
            }

            // ----- User -----
            b.Entity<User>(e =>
            {
                e.HasKey(x => x.Id);
                e.Property(x => x.Handle).IsRequired().HasMaxLength(32);
                e.Property(x => x.DisplayName).IsRequired().HasMaxLength(64);
                e.Property(x => x.PasswordHash).IsRequired();
                e.HasIndex(x => x.Handle).IsUnique();
                e.HasIndex(x => x.Email).IsUnique(false);
                e.HasIndex(x => x.Phone).IsUnique(false);
            });

            // ----- Device -----
            b.Entity<Device>(e =>
            {
                e.HasKey(x => x.Id);
                e.Property(x => x.Platform).HasConversion<string>().HasMaxLength(16);
                e.HasOne(x => x.User).WithMany(u => u.Devices).HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasIndex(x => new { x.UserId, x.Platform });
            });

            // ----- RefreshToken -----
            b.Entity<RefreshToken>(e =>
            {
                e.HasKey(x => x.Id);
                e.Property(x => x.TokenHash).IsRequired();
                e.HasOne(x => x.User).WithMany(u => u.RefreshTokens).HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Restrict); // Thay đổi từ Cascade sang Restrict
                e.HasOne(x => x.Device).WithMany().HasForeignKey(x => x.DeviceId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasIndex(x => new { x.UserId, x.DeviceId, x.ExpiresAt });
            });
            // ----- Contact -----
            b.Entity<Contact>(e =>
            {
                e.HasKey(x => x.Id);
                e.Property(x => x.Status).HasConversion<string>().HasMaxLength(16);
                e.HasOne(x => x.Owner).WithMany(u => u.ContactsOwned).HasForeignKey(x => x.OwnerId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.Target).WithMany(u => u.ContactsTargeted).HasForeignKey(x => x.TargetId)
                    .OnDelete(DeleteBehavior.Restrict); // Thay đổi từ Cascade sang Restrict
                e.HasIndex(x => new { x.OwnerId, x.TargetId }).IsUnique();
            });

            // ----- Conversation -----
            b.Entity<Conversation>(e =>
            {
                e.HasKey(x => x.Id);
                e.Property(x => x.Type).HasConversion<string>().HasMaxLength(16);
                e.Property(x => x.DirectKey).HasMaxLength(100);
                e.HasIndex(x => x.Type);
                e.HasIndex(x => x.LastMessageAt);
                e.HasIndex(x => x.DirectKey).IsUnique(false); // unique nếu bạn enforce cho Direct qua validation ứng dụng
            });

            // ----- ConversationMember -----
            b.Entity<ConversationMember>(e =>
            {
                e.HasKey(x => new { x.ConversationId, x.UserId });
                e.Property(x => x.Role).HasConversion<string>().HasMaxLength(16);
                e.HasOne(x => x.Conversation).WithMany(c => c.Members).HasForeignKey(x => x.ConversationId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.User).WithMany(u => u.Memberships).HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasIndex(x => new { x.UserId, x.ConversationId });
            });

            // ----- Message -----
            b.Entity<Message>(e =>
            {
                e.HasKey(x => x.Id);
                e.Property(x => x.Type).HasConversion<string>().HasMaxLength(16);
                e.Property(x => x.ClientMessageId).IsRequired().HasMaxLength(64);
                e.HasOne(x => x.Conversation).WithMany(c => c.Messages).HasForeignKey(x => x.ConversationId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.Sender).WithMany().HasForeignKey(x => x.SenderId)
                    .OnDelete(DeleteBehavior.Restrict);

                e.HasIndex(x => new { x.ConversationId, x.Seq }).IsUnique();
                e.HasIndex(x => new { x.ConversationId, x.CreatedAt });
                e.HasIndex(x => new { x.ConversationId, x.SenderId, x.ClientMessageId }).IsUnique(); // idempotency
            });

            // ----- MediaObject -----
            b.Entity<MediaObject>(e =>
            {
                e.HasKey(x => x.Id);
                e.Property(x => x.Status).HasConversion<string>().HasMaxLength(16);
                e.Property(x => x.StorageKey).IsRequired().HasMaxLength(512);
                e.HasIndex(x => x.StorageKey).IsUnique();
                e.HasIndex(x => x.Status);
            });

            // ----- MessageAttachment -----
            b.Entity<MessageAttachment>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasOne(x => x.Message).WithMany(m => m.Attachments).HasForeignKey(x => x.MessageId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.Media).WithMany(mo => mo.Attachments).HasForeignKey(x => x.MediaId)
                    .OnDelete(DeleteBehavior.Restrict);
                e.HasIndex(x => x.MessageId);
            });

            // ----- MessageReceipt -----
            b.Entity<MessageReceipt>(e =>
            {
                e.HasKey(x => x.Id);
                e.Property(x => x.Status).HasConversion<string>().HasMaxLength(16);
                e.HasOne(x => x.Message).WithMany(m => m.Receipts).HasForeignKey(x => x.MessageId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasIndex(x => new { x.MessageId, x.UserId }).IsUnique();
                e.HasIndex(x => new { x.UserId, x.Status, x.Timestamp });
            });

            // ----- MessageReaction -----
            b.Entity<MessageReaction>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasOne(x => x.Message).WithMany(m => m.Reactions).HasForeignKey(x => x.MessageId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasIndex(x => new { x.MessageId, x.UserId, x.Emoji }).IsUnique();
            });

            // ----- NotificationToken -----
            b.Entity<NotificationToken>(e =>
            {
                e.HasKey(x => x.Id);
                e.Property(x => x.Platform).HasConversion<string>().HasMaxLength(16);
                e.Property(x => x.Token).IsRequired().HasMaxLength(512);
                e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Restrict); // Thay đổi từ Cascade sang Restrict
                e.HasOne(x => x.Device).WithMany(d => d.NotificationTokens).HasForeignKey(x => x.DeviceId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasIndex(x => new { x.DeviceId, x.Token }).IsUnique();
            });
        }

        public override int SaveChanges()
        {
            TouchTimestamps();
            return base.SaveChanges();
        }

        public override async System.Threading.Tasks.Task<int> SaveChangesAsync(System.Threading.CancellationToken cancellationToken = default)
        {
            TouchTimestamps();
            return await base.SaveChangesAsync(cancellationToken);
        }

        private void TouchTimestamps()
        {
            var entries = ChangeTracker.Entries<AuditableEntity>();
            var now = DateTimeOffset.UtcNow;
            foreach (var e in entries)
            {
                if (e.State == EntityState.Added)
                {
                    e.Entity.CreatedAt = now;
                    e.Entity.UpdatedAt = now;
                }
                else if (e.State == EntityState.Modified)
                {
                    e.Entity.UpdatedAt = now;
                }
            }
        }
    }
}