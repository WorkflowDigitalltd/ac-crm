using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AcCrm.Api.Models;

public class Quote
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid CustomerId { get; set; }
    
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    
    public QuoteStatus Status { get; set; } = QuoteStatus.Draft;
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmountGBP { get; set; }
    
    // Navigation Properties
    public virtual Customer Customer { get; set; } = null!;
    public virtual ICollection<QuoteItem> QuoteItems { get; set; } = new List<QuoteItem>();
    public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();
} 