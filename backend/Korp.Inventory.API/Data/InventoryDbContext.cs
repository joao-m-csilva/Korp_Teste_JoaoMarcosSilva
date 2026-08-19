using Korp.Inventory.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Korp.Inventory.API.Data;

public class InventoryDbContext : DbContext
{
    public InventoryDbContext(DbContextOptions<InventoryDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("products");

            entity.HasKey(p => p.Id);

            entity.Property(p => p.Id)
                .HasColumnName("id");

            entity.Property(p => p.Code)
                .HasColumnName("code");

            entity.HasIndex(p => p.Code)
                .IsUnique();

            entity.Property(p => p.Description)
                .HasColumnName("description");

            entity.Property(p => p.Unit)
                .HasColumnName("unit");

            entity.Property(p => p.Balance)
                .HasColumnName("balance");
        });

        modelBuilder.Entity<Product>().HasData(
            new Product
            {
                Id = 1,
                Code = "000001",
                Description = "CLP Siemens Simatic S7-1200 CPU 1214C",
                Unit = "UN",
                Balance = 10
            },
            new Product
            {
                Id = 2,
                Code = "000002",
                Description = "CLP WEG Clic-02 24VCC",
                Unit = "UN",
                Balance = 15
            },
            new Product
            {
                Id = 3,
                Code = "000003",
                Description = "Módulo de Expansão Digital Siemens SM 1223",
                Unit = "UN",
                Balance = 8
            },
            new Product
            {
                Id = 4,
                Code = "000004",
                Description = "IHM Siemens Simatic KTP700 Basic 7\"",
                Unit = "UN",
                Balance = 5
            },
            new Product
            {
                Id = 5,
                Code = "000005",
                Description = "IHM WEG cMT2078X 7\"",
                Unit = "UN",
                Balance = 6
            },
            new Product
            {
                Id = 6,
                Code = "000006",
                Description = "IHM Schneider Harmony ST6 10\"",
                Unit = "UN",
                Balance = 3
            },
            new Product
            {
                Id = 7,
                Code = "000007",
                Description = "Inversor de Frequência WEG CFW300 2cv 220V",
                Unit = "UN",
                Balance = 12
            },
            new Product
            {
                Id = 8,
                Code = "000008",
                Description = "Inversor de Frequência WEG CFW500 5cv 380V",
                Unit = "UN",
                Balance = 8
            },
            new Product
            {
                Id = 9,
                Code = "000009",
                Description = "Inversor de Frequência Siemens Sinamics G120C 3kW",
                Unit = "UN",
                Balance = 5
            },
            new Product
            {
                Id = 10,
                Code = "000010",
                Description = "Soft Starter WEG SSW07 17A 220-575V",
                Unit = "UN",
                Balance = 7
            },
            new Product
            {
                Id = 11,
                Code = "000011",
                Description = "Disjuntor Motor WEG MPW18 (4-6.3A)",
                Unit = "UN",
                Balance = 25
            },
            new Product
            {
                Id = 12,
                Code = "000012",
                Description = "Disjuntor Motor Schneider GV2ME14 (6-10A)",
                Unit = "UN",
                Balance = 20
            },
            new Product
            {
                Id = 13,
                Code = "000013",
                Description = "Disjuntor Termomagnético Siemens 5SL6 10A Unipolar",
                Unit = "UN",
                Balance = 60
            },
            new Product
            {
                Id = 14,
                Code = "000014",
                Description = "Disjuntor Miniatura MDW Curva C 16A Bipolar",
                Unit = "UN",
                Balance = 50
            },
            new Product
            {
                Id = 15,
                Code = "000015",
                Description = "Disjuntor Miniatura MDW Curva C 32A Tripolar",
                Unit = "UN",
                Balance = 40
            },
            new Product
            {
                Id = 16,
                Code = "000016",
                Description = "Interruptor Diferencial Residual (DR) 40A 30mA Tetrapolar",
                Unit = "UN",
                Balance = 15
            },
            new Product
            {
                Id = 17,
                Code = "000017",
                Description = "Dispositivo de Proteção contra Surtos (DPS) Clamper 275V 45kA",
                Unit = "UN",
                Balance = 30
            },
            new Product
            {
                Id = 18,
                Code = "000018",
                Description = "Contator Tripolar WEG CWM9-10 24VCC",
                Unit = "UN",
                Balance = 45
            },
            new Product
            {
                Id = 19,
                Code = "000019",
                Description = "Contator Tripolar WEG CWM25-10 220VCA",
                Unit = "UN",
                Balance = 35
            },
            new Product
            {
                Id = 20,
                Code = "000020",
                Description = "Contator Tripolar Schneider LC1D18 24VCC",
                Unit = "UN",
                Balance = 25
            },
            new Product
            {
                Id = 21,
                Code = "000021",
                Description = "Mini Contator WEG CWC07-10 24VCC",
                Unit = "UN",
                Balance = 50
            },
            new Product
            {
                Id = 22,
                Code = "000022",
                Description = "Relé de Sobrecarga Térmico WEG RW27-2D (7-10A)",
                Unit = "UN",
                Balance = 20
            },
            new Product
            {
                Id = 23,
                Code = "000023",
                Description = "Relé de Falta de Fase Altronic 220V",
                Unit = "UN",
                Balance = 18
            },
            new Product
            {
                Id = 24,
                Code = "000024",
                Description = "Relé de Interface Finder 24VCC 1NA/1NF",
                Unit = "UN",
                Balance = 100
            },
            new Product
            {
                Id = 25,
                Code = "000025",
                Description = "Relé de Estado Sólido (SSR) Novus 40A 24-280VCA",
                Unit = "UN",
                Balance = 12
            },
            new Product
            {
                Id = 26,
                Code = "000026",
                Description = "Relé Temporizador WEG RTW17 0-30s 24V/220V",
                Unit = "UN",
                Balance = 25
            },
            new Product
            {
                Id = 27,
                Code = "000027",
                Description = "Fonte de Alimentação Mean Well MDR-60-24 (24V 2.5A)",
                Unit = "UN",
                Balance = 30
            },
            new Product
            {
                Id = 28,
                Code = "000028",
                Description = "Fonte de Alimentação Siemens Sitop PSU100S 24V 10A",
                Unit = "UN",
                Balance = 10
            },
            new Product
            {
                Id = 29,
                Code = "000029",
                Description = "Fonte Chaveada WEG PSS24-W 24V 5A",
                Unit = "UN",
                Balance = 20
            },
            new Product
            {
                Id = 30,
                Code = "000030",
                Description = "Botão Pulsador Faceado Verde 22mm WEG",
                Unit = "PC",
                Balance = 80
            },
            new Product
            {
                Id = 31,
                Code = "000031",
                Description = "Botão Pulsador Faceado Vermelho 22mm WEG",
                Unit = "PC",
                Balance = 80
            },
            new Product
            {
                Id = 32,
                Code = "000032",
                Description = "Botão Cogumelo de Emergência com Trava 22mm",
                Unit = "PC",
                Balance = 40
            },
            new Product
            {
                Id = 33,
                Code = "000033",
                Description = "Chave Seletora 2 Posições Fixas 22mm",
                Unit = "PC",
                Balance = 35
            },
            new Product
            {
                Id = 34,
                Code = "000034",
                Description = "Sinaleiro LED Verde 24VCC 22mm",
                Unit = "PC",
                Balance = 100
            },
            new Product
            {
                Id = 35,
                Code = "000035",
                Description = "Sinaleiro LED Vermelho 220VCA 22mm",
                Unit = "PC",
                Balance = 100
            },
            new Product
            {
                Id = 36,
                Code = "000036",
                Description = "Sinaleiro Sonoro (Cigarra) 24VCC 22mm",
                Unit = "PC",
                Balance = 20
            },
            new Product
            {
                Id = 37,
                Code = "000037",
                Description = "Sensor Indutivo PNP M18 Faceado Sense",
                Unit = "UN",
                Balance = 45
            },
            new Product
            {
                Id = 38,
                Code = "000038",
                Description = "Sensor Indutivo NPN M12 Não-Faceado Novus",
                Unit = "UN",
                Balance = 30
            },
            new Product
            {
                Id = 39,
                Code = "000039",
                Description = "Sensor Capacitivo PNP M30 Autonics",
                Unit = "UN",
                Balance = 15
            },
            new Product
            {
                Id = 40,
                Code = "000040",
                Description = "Sensor Fotoelétrico Difuso 100mm Sick",
                Unit = "UN",
                Balance = 12
            },
            new Product
            {
                Id = 41,
                Code = "000041",
                Description = "Chave Fim de Curso Haste Flexível Metaltex",
                Unit = "UN",
                Balance = 25
            },
            new Product
            {
                Id = 42,
                Code = "000042",
                Description = "Borne de Passagem 2,5mm² Cinza WEG",
                Unit = "PC",
                Balance = 500
            },
            new Product
            {
                Id = 43,
                Code = "000043",
                Description = "Borne de Terra 4mm² Verde/Amarelo WEG",
                Unit = "PC",
                Balance = 200
            },
            new Product
            {
                Id = 44,
                Code = "000044",
                Description = "Trilho DIN 35mm x 7.5mm Perfurado (Barra 2m)",
                Unit = "BR",
                Balance = 50
            },
            new Product
            {
                Id = 45,
                Code = "000045",
                Description = "Canaleta Recortada Cinza 50x50mm (Barra 2m)",
                Unit = "BR",
                Balance = 80
            },
            new Product
            {
                Id = 46,
                Code = "000046",
                Description = "Cabo de Cobre Flexível 2,5mm² Preto (Rolo 100m)",
                Unit = "RL",
                Balance = 10
            },
            new Product
            {
                Id = 47,
                Code = "000047",
                Description = "Cabo de Cobre Flexível 1,5mm² Vermelho (Rolo 100m)",
                Unit = "RL",
                Balance = 15
            },
            new Product
            {
                Id = 48,
                Code = "000048",
                Description = "Cabo de Rede Industrial Blindado Cat6",
                Unit = "M",
                Balance = 300
            },
            new Product
            {
                Id = 49,
                Code = "000049",
                Description = "Switch Ethernet Industrial Não Gerenciável 5 Portas",
                Unit = "UN",
                Balance = 8
            },
            new Product
            {
                Id = 50,
                Code = "000050",
                Description = "Multímetro Digital Fluke 115",
                Unit = "UN",
                Balance = 5
            }
        );
    }
}