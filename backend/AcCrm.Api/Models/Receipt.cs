using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AcCrm.Api.Models;

public class Receipt
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid PaymentId { get; set; }
    
    public DateTime IssueDate { get; set; } = DateTime.UtcNow;
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal AmountGBP { get; set; }
    
    // Navigation Properties
    public virtual Payment Payment { get; set; } = null!;
} 