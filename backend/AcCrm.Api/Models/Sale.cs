using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AcCrm.Api.Models;

public class Sale
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid CustomerId { get; set; }
    
    public DateTime SaleDate { get; set; } = DateTime.UtcNow;
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmountGBP { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalRecurringAmountGBP { get; set; } = 0;
    
    // Auto-calculated from payments
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalPaidGBP { get; set; } = 0;
    
    // Outstanding balance
    public decimal OutstandingBalanceGBP => TotalAmountGBP - TotalPaidGBP;
    
    public SaleStatus Status { get; set; } = SaleStatus.Active;
    
    public Guid? QuoteId { get; set; }
    
    [StringLength(1000)]
    public string? Notes { get; set; }
    
    // Navigation Properties
    public virtual Customer Customer { get; set; } = null!;
    public virtual Quote? Quote { get; set; }
    public virtual ICollection<SaleItem> SaleItems { get; set; } = new List<SaleItem>();
    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
} 