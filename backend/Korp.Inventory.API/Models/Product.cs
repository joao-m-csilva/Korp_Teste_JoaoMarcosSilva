namespace Korp.Inventory.API.Models;


public class Product
{
    public int Id { get; set; }
    public string Code {get; set;} = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Unit { get; set; } = "UN";
    public decimal Balance { get; set; }
}