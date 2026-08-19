using Microsoft.EntityFrameworkCore;
using Korp.Invoicing.API.Data;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<InvoiceDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddControllers();

builder.Services.AddProblemDetails();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddOpenApi();

// HTTP client for communication with the Inventory API
var inventoryBaseUrl = builder.Configuration["InventoryApi:BaseUrl"]
    ?? builder.Configuration["InventoryApi__BaseUrl"]
    ?? "http://inventory-api:8080";

builder.Services.AddHttpClient("Inventory", client =>
{
    client.BaseAddress = new Uri(inventoryBaseUrl);
    client.Timeout = TimeSpan.FromSeconds(5);
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<InvoiceDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AngularApp");

app.UseExceptionHandler(exceptionApp =>
{
    exceptionApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new
        {
            message = "Erro interno do sistema. Estamos trabalhando para corrigir. Tente novamente em breve."
        });
    });
});

app.MapControllers();

app.Run();