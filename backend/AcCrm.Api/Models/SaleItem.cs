using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AcCrm.Api.Models;

public class SaleItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid SaleId { get; set; }
    
    [Required]
    public Guid ProductId { get; set; }
    
    [Required]
    public int Quantity { get; set; } = 1;
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal UnitPriceGBP { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal? UnitRecurringPriceGBP { get; set; }
    
    // Override recurrence from product if needed
    public RecurrenceType? RecurrenceOverride { get; set; }
    
    public int? RecurrenceIntervalOverride { get; set; }
    
    [StringLength(500)]
    public string? Notes { get; set; }
    
    // Calculated property for line total
    public decimal LineTotal => Quantity * UnitPriceGBP;
    
    public decimal? LineRecurringTotal => UnitRecurringPriceGBP.HasValue ? Quantity * UnitRecurringPriceGBP.Value : null;
    
    // Navigation Properties
    public virtual Sale Sale { get; set; } = null!;
    public virtual Product Product { get; set; } = null!;
} 