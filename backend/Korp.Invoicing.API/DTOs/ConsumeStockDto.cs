namespace Korp.Invoicing.API.DTOs;

public class ConsumeStockDto
{
    public List<ConsumeStockItemDto> Items { get; set; } = new();
}

public class ConsumeStockItemDto
{
    public int ProductId { get; set; }
    public decimal Quantity { get; set; }
}