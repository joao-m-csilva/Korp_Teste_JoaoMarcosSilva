using Microsoft.AspNetCore.Mvc;
using Korp.Inventory.API.Models;
using Korp.Inventory.API.Data;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Korp.Inventory.API.DTOs;

namespace Korp.Inventory.API.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ProductsController : ControllerBase
{
    private readonly InventoryDbContext _context;
    private static readonly HashSet<string> IntegerUnits = new(StringComparer.OrdinalIgnoreCase)
    {
        "UN", "PC", "CX"
    };

    public ProductsController(InventoryDbContext context)
    {
        _context = context;
    }

    // List all products
    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        var products = await _context.Products.ToListAsync();
        return Ok(products);
    }

    // List product by id
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetProductById(int id)
    {
        var product = await _context.Products
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id)!;

        if (product == null)
        {
            return NotFound(new { message = "Produto não localizado no sistema." });
        }
        return Ok(product);
    }

    // New product registration
    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] Product product)
    {
        var error = ProductValidation(product);

        if (error != null)
        {
            return BadRequest(new { message = error });
        }

        try
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);
        }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException pgEx && pgEx.SqlState == PostgresErrorCodes.UniqueViolation)
        {
            return Conflict(new { message = "Já existe um produto cadastrado com este código." });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Internal Error: {ex.Message}");
            Console.WriteLine($"Error location: {ex.StackTrace}");
        }

        ;

        return StatusCode(500, new { message = "Erro interno no servidor. Estamos trabalhando para corrigir. Tente novamente em breve." });

    }

    [HttpPost("consume")]
    public async Task<IActionResult> ConsumeStock(ConsumeStockRequestDto dto)
    {
        if (dto.Items == null || !dto.Items.Any())
        {
            return BadRequest(new
            {
                message = "Nenhum item informado para consumo."
            });
        }

        foreach (var item in dto.Items)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == item.ProductId);

            if (product == null)
            {
                return BadRequest(new
                {
                    message = $"Produto {item.ProductId} não encontrado."
                });
            }

            if (product.Balance < item.Quantity)
            {
                return BadRequest(new
                {
                    message = $"Estoque insuficiente para o produto '{product.Description}'."
                });
            }
        }

        foreach (var item in dto.Items)
        {
            var product = await _context.Products
                .FirstAsync(p => p.Id == item.ProductId);

            product.Balance -= item.Quantity;
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Estoque consumido com sucesso."
        });
    }
    
    // Error treatment 
    private string? ProductValidation(Product product)
    {
        if (product == null)
        {
            return "Dados do produto inválidos";
        }

        if (string.IsNullOrWhiteSpace(product.Description))
        {
            return "O campo de descrição não pode estar vazio.";
        }

        if (product.Description.Length < 10)
        {
            return "Informe uma descrição básica válida.";
        }

        if (string.IsNullOrWhiteSpace(product.Code))
        {
            return "O campo de código não pode estar em branco/vazio.";
        }

        if (!product.Code.All(char.IsDigit))
        {
            return "O campo de código deve conter somente valores numéricos.";
        }

        if (product.Balance <= 0)
        {
            return "A quantidade deve ser maior que 0.";
        }

        if (IntegerUnits.Contains(product.Unit) && product.Balance % 1 != 0)
        {
            return $"A unidade '{product.Unit}' aceita apenas valores inteiros para quantidade.";
        }

        return null;
    }

}
