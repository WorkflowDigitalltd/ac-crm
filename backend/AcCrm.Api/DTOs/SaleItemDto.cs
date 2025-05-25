using AcCrm.Api.Models;

namespace AcCrm.Api.DTOs;

public class SaleItemDto
{
    public Guid Id { get; set; }
    public Guid SaleId { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPriceGBP { get; set; }
    public decimal? UnitRecurringPriceGBP { get; set; }
    public RecurrenceType? RecurrenceOverride { get; set; }
    public int? RecurrenceIntervalOverride { get; set; }
    public string? Notes { get; set; }
    public decimal LineTotal { get; set; }
    public decimal? LineRecurringTotal { get; set; }
}

public class CreateSaleItemDto
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; } = 1;
    public decimal UnitPriceGBP { get; set; }
    public decimal? UnitRecurringPriceGBP { get; set; }
    public RecurrenceType? RecurrenceOverride { get; set; }
    public int? RecurrenceIntervalOverride { get; set; }
    public string? Notes { get; set; }
}

public class UpdateSaleItemDto
{
    public int Quantity { get; set; }
    public decimal UnitPriceGBP { get; set; }
    public decimal? UnitRecurringPriceGBP { get; set; }
    public RecurrenceType? RecurrenceOverride { get; set; }
    public int? RecurrenceIntervalOverride { get; set; }
    public string? Notes { get; set; }
} 