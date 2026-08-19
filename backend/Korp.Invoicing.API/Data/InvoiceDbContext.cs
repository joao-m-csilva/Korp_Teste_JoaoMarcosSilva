using Microsoft.EntityFrameworkCore;
using Korp.Invoicing.API.Models;

namespace Korp.Invoicing.API.Data;

public class InvoiceDbContext : DbContext
{
    public InvoiceDbContext(DbContextOptions<InvoiceDbContext> options)
        : base(options)
    {
    }

    public DbSet<Invoice> Invoices { get; set; }
    public DbSet<InvoiceItem> InvoiceItems { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasSequence<int>("invoice_number_seq")
            .StartsAt(1)
            .IncrementsBy(1);


        modelBuilder.Entity<Invoice>(i =>
        {
            i.ToTable("invoices");

            i.HasKey(i => i.Id);

            i.HasIndex(i => i.Number)
                .IsUnique();

            i.Property(i => i.Number)
                .ValueGeneratedOnAdd()
                .HasDefaultValueSql("nextval('invoice_number_seq')");

            i.Property(i => i.Total_Value)
                .HasPrecision(18, 2);
        });


        modelBuilder.Entity<InvoiceItem>(ii =>
        {
            ii.ToTable("invoice_items");

            ii.HasKey(ii => ii.Id);

            ii.Property(ii => ii.Quantity)
                .HasPrecision(18, 3);

            ii.Property(ii => ii.UnitPrice)
                .HasPrecision(18, 2);


            ii.HasOne(ii => ii.Invoice)
                .WithMany(i => i.Items)
                .HasForeignKey(ii => ii.InvoiceId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}