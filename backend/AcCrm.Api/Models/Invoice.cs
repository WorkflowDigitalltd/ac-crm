using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AcCrm.Api.Models;

public enum InvoiceStatus
{
    Unpaid = 0,
    PartiallyPaid = 1,
    Paid = 2,
    Overdue = 3
}

public class Invoice
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid SaleId { get; set; }
    
    public DateTime IssueDate { get; set; } = DateTime.UtcNow;
    
    public DateTime DueDate { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmountGBP { get; set; }
    
    public InvoiceStatus Status { get; set; } = InvoiceStatus.Unpaid;
    
    // Navigation Properties
    public virtual Sale Sale { get; set; } = null!;
} 