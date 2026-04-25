using Ecommerce.Domain.Entities;

namespace Ecommerce.Tests;

public class CartEntitiesTests
{
    [Fact]
    public void Cart_HasGeneratedId_AndUpdatedAtUtc_Default()
    {
        var before = DateTime.UtcNow.AddMinutes(-1);
        var cart = new Cart();
        var after = DateTime.UtcNow.AddMinutes(1);

        Assert.NotEqual(Guid.Empty, cart.Id);
        Assert.InRange(cart.UpdatedAtUtc, before, after);
    }

    [Fact]
    public void Cart_StartsWithEmptyItemsCollection()
    {
        var cart = new Cart();

        Assert.NotNull(cart.Items);
        Assert.Empty(cart.Items);
    }

    [Fact]
    public void CartItem_HasMutableQuantityAndRelations()
    {
        var cartId = Guid.NewGuid();
        var productId = Guid.NewGuid();

        var cartItem = new CartItem
        {
            CartId = cartId,
            ProductId = productId,
            Quantity = 3
        };

        Assert.Equal(cartId, cartItem.CartId);
        Assert.Equal(productId, cartItem.ProductId);
        Assert.Equal(3, cartItem.Quantity);
    }

    [Fact]
    public void Product_InitializesCartItemsCollection()
    {
        var product = new Product();

        Assert.NotNull(product.CartItems);
        Assert.Empty(product.CartItems);
    }

    [Fact]
    public void User_CanReferenceSingleCart()
    {
        var user = new User();
        var cart = new Cart { UserId = user.Id };

        user.Cart = cart;

        Assert.NotNull(user.Cart);
        Assert.Equal(user.Id, user.Cart!.UserId);
    }
}
