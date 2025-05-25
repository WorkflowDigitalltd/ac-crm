using AcCrm.Api.Models;

namespace AcCrm.Api.DTOs;

public class PaymentDto
{
    public Guid Id { get; set; }
    public Guid SaleId { get; set; }
    public decimal AmountPaidGBP { get; set; }
    public DateTime PaymentDate { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public string PaymentMethodText { get; set; } = string.Empty;
    public string? Reference { get; set; }
    public string? Notes { get; set; }
    public string? PaymentType { get; set; }
}

public class CreatePaymentDto
{
    public Guid SaleId { get; set; }
    public decimal AmountPaidGBP { get; set; }
    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.Cash;
    public string? Reference { get; set; }
    public string? Notes { get; set; }
    public string? PaymentType { get; set; }
}

public class UpdatePaymentDto
{
    public decimal AmountPaidGBP { get; set; }
    public DateTime PaymentDate { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public string? Reference { get; set; }
    public string? Notes { get; set; }
    public string? PaymentType { get; set; }
} 