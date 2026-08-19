namespace Korp.Inventory.API.DTOs;

public class ConsumeStockRequestDto
{
    public List<ConsumeStockItemDto> Items { get; set; } = new();
}

public class ConsumeStockItemDto
{
    public int ProductId { get; set; }
    public decimal Quantity { get; set; }
}