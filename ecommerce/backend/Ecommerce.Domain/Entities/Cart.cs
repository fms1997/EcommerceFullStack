using Ecommerce.Domain.Common;

namespace Ecommerce.Domain.Entities;

public class Cart : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
}
