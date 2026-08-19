using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Korp.Inventory.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "products",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    code = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    unit = table.Column<string>(type: "text", nullable: false),
                    balance = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_products", x => x.id);
                });

            migrationBuilder.InsertData(
                table: "products",
                columns: new[] { "id", "balance", "code", "description", "unit" },
                values: new object[,]
                {
                    { 1, 10m, "000001", "CLP Siemens Simatic S7-1200 CPU 1214C", "UN" },
                    { 2, 15m, "000002", "CLP WEG Clic-02 24VCC", "UN" },
                    { 3, 8m, "000003", "Módulo de Expansão Digital Siemens SM 1223", "UN" },
                    { 4, 5m, "000004", "IHM Siemens Simatic KTP700 Basic 7\"", "UN" },
                    { 5, 6m, "000005", "IHM WEG cMT2078X 7\"", "UN" },
                    { 6, 3m, "000006", "IHM Schneider Harmony ST6 10\"", "UN" },
                    { 7, 12m, "000007", "Inversor de Frequência WEG CFW300 2cv 220V", "UN" },
                    { 8, 8m, "000008", "Inversor de Frequência WEG CFW500 5cv 380V", "UN" },
                    { 9, 5m, "000009", "Inversor de Frequência Siemens Sinamics G120C 3kW", "UN" },
                    { 10, 7m, "000010", "Soft Starter WEG SSW07 17A 220-575V", "UN" },
                    { 11, 25m, "000011", "Disjuntor Motor WEG MPW18 (4-6.3A)", "UN" },
                    { 12, 20m, "000012", "Disjuntor Motor Schneider GV2ME14 (6-10A)", "UN" },
                    { 13, 60m, "000013", "Disjuntor Termomagnético Siemens 5SL6 10A Unipolar", "UN" },
                    { 14, 50m, "000014", "Disjuntor Miniatura MDW Curva C 16A Bipolar", "UN" },
                    { 15, 40m, "000015", "Disjuntor Miniatura MDW Curva C 32A Tripolar", "UN" },
                    { 16, 15m, "000016", "Interruptor Diferencial Residual (DR) 40A 30mA Tetrapolar", "UN" },
                    { 17, 30m, "000017", "Dispositivo de Proteção contra Surtos (DPS) Clamper 275V 45kA", "UN" },
                    { 18, 45m, "000018", "Contator Tripolar WEG CWM9-10 24VCC", "UN" },
                    { 19, 35m, "000019", "Contator Tripolar WEG CWM25-10 220VCA", "UN" },
                    { 20, 25m, "000020", "Contator Tripolar Schneider LC1D18 24VCC", "UN" },
                    { 21, 50m, "000021", "Mini Contator WEG CWC07-10 24VCC", "UN" },
                    { 22, 20m, "000022", "Relé de Sobrecarga Térmico WEG RW27-2D (7-10A)", "UN" },
                    { 23, 18m, "000023", "Relé de Falta de Fase Altronic 220V", "UN" },
                    { 24, 100m, "000024", "Relé de Interface Finder 24VCC 1NA/1NF", "UN" },
                    { 25, 12m, "000025", "Relé de Estado Sólido (SSR) Novus 40A 24-280VCA", "UN" },
                    { 26, 25m, "000026", "Relé Temporizador WEG RTW17 0-30s 24V/220V", "UN" },
                    { 27, 30m, "000027", "Fonte de Alimentação Mean Well MDR-60-24 (24V 2.5A)", "UN" },
                    { 28, 10m, "000028", "Fonte de Alimentação Siemens Sitop PSU100S 24V 10A", "UN" },
                    { 29, 20m, "000029", "Fonte Chaveada WEG PSS24-W 24V 5A", "UN" },
                    { 30, 80m, "000030", "Botão Pulsador Faceado Verde 22mm WEG", "PC" },
                    { 31, 80m, "000031", "Botão Pulsador Faceado Vermelho 22mm WEG", "PC" },
                    { 32, 40m, "000032", "Botão Cogumelo de Emergência com Trava 22mm", "PC" },
                    { 33, 35m, "000033", "Chave Seletora 2 Posições Fixas 22mm", "PC" },
                    { 34, 100m, "000034", "Sinaleiro LED Verde 24VCC 22mm", "PC" },
                    { 35, 100m, "000035", "Sinaleiro LED Vermelho 220VCA 22mm", "PC" },
                    { 36, 20m, "000036", "Sinaleiro Sonoro (Cigarra) 24VCC 22mm", "PC" },
                    { 37, 45m, "000037", "Sensor Indutivo PNP M18 Faceado Sense", "UN" },
                    { 38, 30m, "000038", "Sensor Indutivo NPN M12 Não-Faceado Novus", "UN" },
                    { 39, 15m, "000039", "Sensor Capacitivo PNP M30 Autonics", "UN" },
                    { 40, 12m, "000040", "Sensor Fotoelétrico Difuso 100mm Sick", "UN" },
                    { 41, 25m, "000041", "Chave Fim de Curso Haste Flexível Metaltex", "UN" },
                    { 42, 500m, "000042", "Borne de Passagem 2,5mm² Cinza WEG", "PC" },
                    { 43, 200m, "000043", "Borne de Terra 4mm² Verde/Amarelo WEG", "PC" },
                    { 44, 50m, "000044", "Trilho DIN 35mm x 7.5mm Perfurado (Barra 2m)", "BR" },
                    { 45, 80m, "000045", "Canaleta Recortada Cinza 50x50mm (Barra 2m)", "BR" },
                    { 46, 10m, "000046", "Cabo de Cobre Flexível 2,5mm² Preto (Rolo 100m)", "RL" },
                    { 47, 15m, "000047", "Cabo de Cobre Flexível 1,5mm² Vermelho (Rolo 100m)", "RL" },
                    { 48, 300m, "000048", "Cabo de Rede Industrial Blindado Cat6", "M" },
                    { 49, 8m, "000049", "Switch Ethernet Industrial Não Gerenciável 5 Portas", "UN" },
                    { 50, 5m, "000050", "Multímetro Digital Fluke 115", "UN" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_products_code",
                table: "products",
                column: "code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "products");
        }
    }
}
