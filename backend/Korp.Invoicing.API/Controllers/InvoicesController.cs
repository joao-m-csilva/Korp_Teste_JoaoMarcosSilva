using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Korp.Invoicing.API.Data;
using Korp.Invoicing.API.Models;
using Korp.Invoicing.API.DTOs;

namespace Korp.Invoicing.API.Controllers;


[ApiController]
[Route("api/[controller]")]
public class InvoicesController : ControllerBase
{
    private readonly InvoiceDbContext _context;
    private readonly HttpClient _inventoryClient;

    public InvoicesController(
        InvoiceDbContext context,
        IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _inventoryClient = httpClientFactory.CreateClient("Inventory");
    }

    // Invoice Creation
    [HttpPost]
    public async Task<IActionResult> CreateInvoice(Invoice invoice)
    {
        if (invoice.Items == null || !invoice.Items.Any())
        {
            return BadRequest(new
            {
                message = "A nota fiscal deve possuir pelo menos um item."
            });
        }

        if (invoice.Items.Any(i => i.Quantity <= 0))
        {
            return BadRequest(new
            {
                message = "A quantidade dos itens deve ser maior que zero."
            });


        }

        if (invoice.Items.Any(i => i.UnitPrice <= 0))
        {
            return BadRequest(new
            {
                message = "O preço unitário deve ser maior que zero."
            });
        }

        invoice.Date = DateTime.UtcNow;
        invoice.Status = "Aberta";
        invoice.Total_Value = invoice.Items.Sum(
            item => item.Quantity * item.UnitPrice);

        _context.Invoices.Add(invoice);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetInvoice),
            new { id = invoice.Id },
            invoice);
    }

    // List all Invoices
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Invoice>>> GetInvoices()
    {
        var invoices = await _context.Invoices
            .Include(i => i.Items)
            .OrderByDescending(i => i.Date)
            .ToListAsync();

        return Ok(invoices);
    }

    // List invoices by ID
    [HttpGet("{id:int}")]
    public async Task<ActionResult> GetInvoice(int id)
    {
        var invoice = await _context.Invoices
            .AsNoTracking()
            .Include(i => i.Items)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (invoice == null)
        {
            return NotFound(new { message = "A nota fiscal solicitada não existe." });
        }

        return Ok(invoice);
    }

    // Invoice printing and inventory API call through HTTP to consume stock
    [HttpPost("{id:int}/print")]
    public async Task<IActionResult> PrintInvoice(int id)
    {
        var invoice = await _context.Invoices
            .Include(i => i.Items)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (invoice == null)
        {
            return NotFound(new
            {
                message = "Nota fiscal não encontrada."
            });
        }

        if (invoice.Status == "Fechada")
        {
            return BadRequest(new
            {
                message = "A nota fiscal já está fechada."
            });
        }

        if (!invoice.Items.Any())
        {
            return BadRequest(new
            {
                message = "A nota fiscal não possui itens."
            });
        }

        try
        {
            var response = await ConsumeInventoryAsync(invoice);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return new ContentResult
                {
                    Content = error,
                    ContentType = "application/json",
                    StatusCode = (int)response.StatusCode
                };
            }
        }
        catch (HttpRequestException)
        {
            return StatusCode(503, new
            {
                message = "Serviço de inventário indisponível no momento. Não foi possível baixar o estoque."
            });
        }

        invoice.Status = "Fechada";

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Nota fiscal fechada com sucesso.",
            invoice
        });
    }

    private async Task<HttpResponseMessage> ConsumeInventoryAsync(Invoice invoice)
    {
        var request = new ConsumeStockDto
        {
            Items = invoice.Items
                .Select(item => new ConsumeStockItemDto
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity
                })
                .ToList()
        };

        return await _inventoryClient.PostAsJsonAsync(
            "/api/products/consume",
            request);
    }

}