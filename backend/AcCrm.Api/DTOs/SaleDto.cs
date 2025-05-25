using AcCrm.Api.Models;

namespace AcCrm.Api.DTOs;

public class SaleDto
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public DateTime SaleDate { get; set; }
    public decimal TotalAmountGBP { get; set; }
    public decimal TotalRecurringAmountGBP { get; set; }
    public decimal TotalPaidGBP { get; set; }
    public decimal OutstandingBalanceGBP { get; set; }
    public SaleStatus Status { get; set; }
    public Guid? QuoteId { get; set; }
    public string? Notes { get; set; }
    public List<SaleItemDto> SaleItems { get; set; } = new List<SaleItemDto>();
    public List<PaymentDto> Payments { get; set; } = new List<PaymentDto>();
}

public class CreateSaleDto
{
    public Guid CustomerId { get; set; }
    public DateTime SaleDate { get; set; } = DateTime.UtcNow;
    public Guid? QuoteId { get; set; }
    public string? Notes { get; set; }
    public List<CreateSaleItemDto> SaleItems { get; set; } = new List<CreateSaleItemDto>();
}

public class UpdateSaleDto
{
    public DateTime SaleDate { get; set; }
    public SaleStatus Status { get; set; }
    public string? Notes { get; set; }
    public List<CreateSaleItemDto> SaleItems { get; set; } = new List<CreateSaleItemDto>();
} 