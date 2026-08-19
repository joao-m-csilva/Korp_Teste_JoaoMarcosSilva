namespace Korp.Invoicing.API.Models;

public class Invoice
{
    public int Id { get; set; }
    public int Number { get; set; }
    public DateTime Date { get; set; }
    public decimal Total_Value { get; set; }
    public string Status { get; set; } = "Aberta"; 
    
    public List<InvoiceItem> Items { get; set; } = new();
}