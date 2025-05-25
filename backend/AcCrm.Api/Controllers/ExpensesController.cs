using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AcCrm.Api.Data;
using AcCrm.Api.Models;
using AcCrm.Api.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AcCrm.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExpensesController : ControllerBase
{
    private readonly AcCrmDbContext _context;

    public ExpensesController(AcCrmDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExpenseDto>>> GetExpenses()
    {
        var expenses = await _context.Expenses.ToListAsync();

        var expenseDtos = expenses.Select(e => new ExpenseDto
        {
            Id = e.Id,
            Description = e.Description,
            AmountGBP = e.AmountGBP,
            ExpenseDate = e.ExpenseDate,
            Category = e.Category,
            CategoryText = e.Category.ToString(),
            Vendor = e.Vendor,
            Reference = e.Reference,
            Notes = e.Notes,
            AttachmentPath = e.AttachmentPath,
            IsTaxDeductible = e.IsTaxDeductible
        }).ToList();

        return Ok(expenseDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ExpenseDto>> GetExpense(Guid id)
    {
        var expense = await _context.Expenses.FindAsync(id);

        if (expense == null)
        {
            return NotFound();
        }

        var expenseDto = new ExpenseDto
        {
            Id = expense.Id,
            Description = expense.Description,
            AmountGBP = expense.AmountGBP,
            ExpenseDate = expense.ExpenseDate,
            Category = expense.Category,
            CategoryText = expense.Category.ToString(),
            Vendor = expense.Vendor,
            Reference = expense.Reference,
            Notes = expense.Notes,
            AttachmentPath = expense.AttachmentPath,
            IsTaxDeductible = expense.IsTaxDeductible
        };

        return Ok(expenseDto);
    }

    [HttpGet("categories")]
    public ActionResult<IEnumerable<object>> GetExpenseCategories()
    {
        var categories = Enum.GetValues(typeof(ExpenseCategory))
            .Cast<ExpenseCategory>()
            .Select(c => new { value = (int)c, text = c.ToString() })
            .ToList();

        return Ok(categories);
    }

    [HttpPost]
    public async Task<ActionResult<ExpenseDto>> CreateExpense(CreateExpenseDto createExpenseDto)
    {
        var expense = new Expense
        {
            Description = createExpenseDto.Description,
            AmountGBP = createExpenseDto.AmountGBP,
            ExpenseDate = createExpenseDto.ExpenseDate,
            Category = createExpenseDto.Category,
            Vendor = createExpenseDto.Vendor,
            Reference = createExpenseDto.Reference,
            Notes = createExpenseDto.Notes,
            IsTaxDeductible = createExpenseDto.IsTaxDeductible
        };

        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();

        var expenseDto = new ExpenseDto
        {
            Id = expense.Id,
            Description = expense.Description,
            AmountGBP = expense.AmountGBP,
            ExpenseDate = expense.ExpenseDate,
            Category = expense.Category,
            CategoryText = expense.Category.ToString(),
            Vendor = expense.Vendor,
            Reference = expense.Reference,
            Notes = expense.Notes,
            AttachmentPath = expense.AttachmentPath,
            IsTaxDeductible = expense.IsTaxDeductible
        };

        return CreatedAtAction(nameof(GetExpense), new { id = expense.Id }, expenseDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateExpense(Guid id, UpdateExpenseDto updateExpenseDto)
    {
        var expense = await _context.Expenses.FindAsync(id);

        if (expense == null)
        {
            return NotFound();
        }

        expense.Description = updateExpenseDto.Description;
        expense.AmountGBP = updateExpenseDto.AmountGBP;
        expense.ExpenseDate = updateExpenseDto.ExpenseDate;
        expense.Category = updateExpenseDto.Category;
        expense.Vendor = updateExpenseDto.Vendor;
        expense.Reference = updateExpenseDto.Reference;
        expense.Notes = updateExpenseDto.Notes;
        expense.IsTaxDeductible = updateExpenseDto.IsTaxDeductible;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ExpenseExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteExpense(Guid id)
    {
        var expense = await _context.Expenses.FindAsync(id);
        if (expense == null)
        {
            return NotFound();
        }

        _context.Expenses.Remove(expense);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("summary/monthly")]
    public async Task<ActionResult<IEnumerable<object>>> GetMonthlySummary(int year)
    {
        if (year == 0)
        {
            year = DateTime.Now.Year;
        }

        var expenses = await _context.Expenses
            .Where(e => e.ExpenseDate.Year == year)
            .ToListAsync();

        var monthlySummary = Enumerable.Range(1, 12)
            .Select(month => new
            {
                Month = month,
                MonthName = new DateTime(year, month, 1).ToString("MMMM"),
                TotalAmount = expenses
                    .Where(e => e.ExpenseDate.Month == month)
                    .Sum(e => e.AmountGBP),
                TaxDeductibleAmount = expenses
                    .Where(e => e.ExpenseDate.Month == month && e.IsTaxDeductible)
                    .Sum(e => e.AmountGBP),
                Count = expenses.Count(e => e.ExpenseDate.Month == month)
            })
            .ToList();

        return Ok(monthlySummary);
    }

    [HttpGet("summary/category")]
    public async Task<ActionResult<IEnumerable<object>>> GetCategorySummary(int year, int month)
    {
        if (year == 0)
        {
            year = DateTime.Now.Year;
        }

        var query = _context.Expenses.AsQueryable();

        if (year > 0)
        {
            query = query.Where(e => e.ExpenseDate.Year == year);
        }

        if (month > 0)
        {
            query = query.Where(e => e.ExpenseDate.Month == month);
        }

        var expenses = await query.ToListAsync();

        var categorySummary = Enum.GetValues(typeof(ExpenseCategory))
            .Cast<ExpenseCategory>()
            .Select(category => new
            {
                Category = category,
                CategoryName = category.ToString(),
                TotalAmount = expenses
                    .Where(e => e.Category == category)
                    .Sum(e => e.AmountGBP),
                Count = expenses.Count(e => e.Category == category)
            })
            .Where(c => c.Count > 0) // Only include categories with expenses
            .OrderByDescending(c => c.TotalAmount)
            .ToList();

        return Ok(categorySummary);
    }

    private bool ExpenseExists(Guid id)
    {
        return _context.Expenses.Any(e => e.Id == id);
    }
}
