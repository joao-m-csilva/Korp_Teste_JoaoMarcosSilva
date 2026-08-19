using System.Text.Json.Serialization;

namespace Korp.Invoicing.API.Models;

public class InvoiceItem
{
    public int Id { get; set; }
    public int InvoiceId { get; set; }
    public int ProductId { get; set; }
    public decimal Quantity { get; set; }
    public decimal UnitPrice { get; set; }

    [JsonIgnore]
    public Invoice? Invoice { get; set; }
}