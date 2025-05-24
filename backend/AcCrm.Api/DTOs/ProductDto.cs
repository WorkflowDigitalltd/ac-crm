using System.ComponentModel.DataAnnotations;
using AcCrm.Api.Models;

namespace AcCrm.Api.DTOs;

public class ProductDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal PriceGBP { get; set; }
    public decimal? RecurringPriceGBP { get; set; }
    public bool IsRecurring { get; set; }
    public RecurrenceType RecurrenceType { get; set; }
    public int RecurrenceInterval { get; set; }
}

public class CreateProductDto
{
    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(1000)]
    public string? Description { get; set; }
    
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal PriceGBP { get; set; }
    
    [Range(0.01, double.MaxValue, ErrorMessage = "Recurring price must be greater than 0")]
    public decimal? RecurringPriceGBP { get; set; }
    
    public bool IsRecurring { get; set; } = false;
    
    public RecurrenceType RecurrenceType { get; set; } = RecurrenceType.None;
    
    [Range(1, int.MaxValue, ErrorMessage = "Recurrence interval must be at least 1")]
    public int RecurrenceInterval { get; set; } = 1;
}

public class UpdateProductDto
{
    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(1000)]
    public string? Description { get; set; }
    
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal PriceGBP { get; set; }
    
    [Range(0.01, double.MaxValue, ErrorMessage = "Recurring price must be greater than 0")]
    public decimal? RecurringPriceGBP { get; set; }
    
    public bool IsRecurring { get; set; } = false;
    
    public RecurrenceType RecurrenceType { get; set; } = RecurrenceType.None;
    
    [Range(1, int.MaxValue, ErrorMessage = "Recurrence interval must be at least 1")]
    public int RecurrenceInterval { get; set; } = 1;
} 