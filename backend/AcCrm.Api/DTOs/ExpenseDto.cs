using AcCrm.Api.Models;
using System;

namespace AcCrm.Api.DTOs;

public class ExpenseDto
{
    public Guid Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal AmountGBP { get; set; }
    public DateTime ExpenseDate { get; set; }
    public ExpenseCategory Category { get; set; }
    public string CategoryText { get; set; } = string.Empty; // Text representation of the category
    public string? Vendor { get; set; }
    public string? Reference { get; set; }
    public string? Notes { get; set; }
    public string? AttachmentPath { get; set; }
    public bool IsTaxDeductible { get; set; }
}

public class CreateExpenseDto
{
    public string Description { get; set; } = string.Empty;
    public decimal AmountGBP { get; set; }
    public DateTime ExpenseDate { get; set; }
    public ExpenseCategory Category { get; set; }
    public string? Vendor { get; set; }
    public string? Reference { get; set; }
    public string? Notes { get; set; }
    public bool IsTaxDeductible { get; set; } = true;
}

public class UpdateExpenseDto
{
    public string Description { get; set; } = string.Empty;
    public decimal AmountGBP { get; set; }
    public DateTime ExpenseDate { get; set; }
    public ExpenseCategory Category { get; set; }
    public string? Vendor { get; set; }
    public string? Reference { get; set; }
    public string? Notes { get; set; }
    public bool IsTaxDeductible { get; set; }
}
