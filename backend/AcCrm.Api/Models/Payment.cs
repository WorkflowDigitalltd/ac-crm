using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AcCrm.Api.Models;

public class Payment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid SaleId { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal AmountPaidGBP { get; set; }
    
    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    
    [Required]
    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.Cash;
    
    [StringLength(100)]
    public string? Reference { get; set; }
    
    [StringLength(500)]
    public string? Notes { get; set; }
    
    // For tracking if this is a deposit, partial payment, etc.
    [StringLength(50)]
    public string? PaymentType { get; set; } // "Deposit", "Partial", "Final", etc.
    
    // Navigation Properties
    public virtual Sale Sale { get; set; } = null!;
    public virtual ICollection<Receipt> Receipts { get; set; } = new List<Receipt>();
} 