using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AcCrm.Api.Models;

public class QuoteItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid QuoteId { get; set; }
    
    [Required]
    public Guid ProductId { get; set; }
    
    [Required]
    public int Quantity { get; set; } = 1;
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal PriceGBP { get; set; }
    
    // Navigation Properties
    public virtual Quote Quote { get; set; } = null!;
    public virtual Product Product { get; set; } = null!;
} 