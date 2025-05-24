using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AcCrm.Api.Models;

public class Sale
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid CustomerId { get; set; }
    
    [Required]
    public Guid ProductId { get; set; }
    
    public DateTime SaleDate { get; set; } = DateTime.UtcNow;
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmountGBP { get; set; }
    
    public RecurrenceType? RecurrenceType { get; set; }
    
    public int? RecurrenceInterval { get; set; }
    
    public DateTime? NextDueDate { get; set; }
    
    public SaleStatus Status { get; set; } = SaleStatus.Active;
    
    public Guid? QuoteId { get; set; }
    
    // Navigation Properties
    public virtual Customer Customer { get; set; } = null!;
    public virtual Product Product { get; set; } = null!;
    public virtual Quote? Quote { get; set; }
    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
} 