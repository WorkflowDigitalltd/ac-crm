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
    
    [StringLength(20)]
    public string? RenewalPeriod { get; set; }
    
    [StringLength(50)]
    public string? PaymentMethod { get; set; }
    
    [StringLength(100)]
    public string? Reference { get; set; }
    
    // Navigation Properties
    public virtual Sale Sale { get; set; } = null!;
    public virtual ICollection<Receipt> Receipts { get; set; } = new List<Receipt>();
} 