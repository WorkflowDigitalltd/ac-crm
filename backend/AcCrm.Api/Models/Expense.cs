using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AcCrm.Api.Models;

public class Expense
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal AmountGBP { get; set; }

    [Required]
    public DateTime ExpenseDate { get; set; }

    [Required]
    public ExpenseCategory Category { get; set; }

    public string? Vendor { get; set; }

    public string? Reference { get; set; }

    public string? Notes { get; set; }

    // For future implementation: attachment/receipt storage
    public string? AttachmentPath { get; set; }

    public bool IsTaxDeductible { get; set; } = true;
}
