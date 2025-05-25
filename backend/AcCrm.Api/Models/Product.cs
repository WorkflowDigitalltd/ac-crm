using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AcCrm.Api.Models;

public class Product
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(1000)]
    public string? Description { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal PriceGBP { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal? RecurringPriceGBP { get; set; }
    
    public bool IsRecurring { get; set; } = false;
    
    public RecurrenceType RecurrenceType { get; set; } = RecurrenceType.None;
    
    public int RecurrenceInterval { get; set; } = 1;
    
    // Navigation Properties
    public virtual ICollection<QuoteItem> QuoteItems { get; set; } = new List<QuoteItem>();
} 