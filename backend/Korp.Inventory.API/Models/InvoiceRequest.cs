namespace Korp.Inventory.API.Models;

public class StockConsumptionRequest
{
    public List<StockConsumptionItem> Items { get; set; } = new();
}

public class StockConsumptionItem
{
    public int ProductId { get; set; }
    public decimal Quantity { get; set; }
}