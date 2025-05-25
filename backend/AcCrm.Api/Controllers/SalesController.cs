using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AcCrm.Api.Data;
using AcCrm.Api.Models;
using AcCrm.Api.DTOs;

namespace AcCrm.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesController : ControllerBase
{
    private readonly AcCrmDbContext _context;

    public SalesController(AcCrmDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SaleDto>>> GetSales()
    {
        var sales = await _context.Sales
            .Include(s => s.Customer)
            .Include(s => s.SaleItems)
                .ThenInclude(si => si.Product)
            .Include(s => s.Payments)
            .ToListAsync();

        var saleDtos = sales.Select(s => new SaleDto
        {
            Id = s.Id,
            CustomerId = s.CustomerId,
            CustomerName = s.Customer.Name,
            CustomerEmail = s.Customer.Email,
            SaleDate = s.SaleDate,
            TotalAmountGBP = s.TotalAmountGBP,
            TotalRecurringAmountGBP = s.TotalRecurringAmountGBP,
            TotalPaidGBP = s.TotalPaidGBP,
            OutstandingBalanceGBP = s.OutstandingBalanceGBP,
            Status = s.Status,
            QuoteId = s.QuoteId,
            Notes = s.Notes,
            SaleItems = s.SaleItems.Select(si => new SaleItemDto
            {
                Id = si.Id,
                SaleId = si.SaleId,
                ProductId = si.ProductId,
                ProductName = si.Product.Name,
                Quantity = si.Quantity,
                UnitPriceGBP = si.UnitPriceGBP,
                UnitRecurringPriceGBP = si.UnitRecurringPriceGBP,
                RecurrenceOverride = si.RecurrenceOverride,
                RecurrenceIntervalOverride = si.RecurrenceIntervalOverride,
                Notes = si.Notes,
                LineTotal = si.LineTotal,
                LineRecurringTotal = si.LineRecurringTotal
            }).ToList(),
            Payments = s.Payments.Select(p => new PaymentDto
            {
                Id = p.Id,
                SaleId = p.SaleId,
                AmountPaidGBP = p.AmountPaidGBP,
                PaymentDate = p.PaymentDate,
                PaymentMethod = p.PaymentMethod,
                PaymentMethodText = p.PaymentMethod.ToString(),
                Reference = p.Reference,
                Notes = p.Notes,
                PaymentType = p.PaymentType
            }).ToList()
        }).ToList();

        return Ok(saleDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SaleDto>> GetSale(Guid id)
    {
        var sale = await _context.Sales
            .Include(s => s.Customer)
            .Include(s => s.SaleItems)
                .ThenInclude(si => si.Product)
            .Include(s => s.Payments)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sale == null)
        {
            return NotFound();
        }

        var saleDto = new SaleDto
        {
            Id = sale.Id,
            CustomerId = sale.CustomerId,
            CustomerName = sale.Customer.Name,
            CustomerEmail = sale.Customer.Email,
            SaleDate = sale.SaleDate,
            TotalAmountGBP = sale.TotalAmountGBP,
            TotalRecurringAmountGBP = sale.TotalRecurringAmountGBP,
            TotalPaidGBP = sale.TotalPaidGBP,
            OutstandingBalanceGBP = sale.OutstandingBalanceGBP,
            Status = sale.Status,
            QuoteId = sale.QuoteId,
            Notes = sale.Notes,
            SaleItems = sale.SaleItems.Select(si => new SaleItemDto
            {
                Id = si.Id,
                SaleId = si.SaleId,
                ProductId = si.ProductId,
                ProductName = si.Product.Name,
                Quantity = si.Quantity,
                UnitPriceGBP = si.UnitPriceGBP,
                UnitRecurringPriceGBP = si.UnitRecurringPriceGBP,
                RecurrenceOverride = si.RecurrenceOverride,
                RecurrenceIntervalOverride = si.RecurrenceIntervalOverride,
                Notes = si.Notes,
                LineTotal = si.LineTotal,
                LineRecurringTotal = si.LineRecurringTotal
            }).ToList(),
            Payments = sale.Payments.Select(p => new PaymentDto
            {
                Id = p.Id,
                SaleId = p.SaleId,
                AmountPaidGBP = p.AmountPaidGBP,
                PaymentDate = p.PaymentDate,
                PaymentMethod = p.PaymentMethod,
                PaymentMethodText = p.PaymentMethod.ToString(),
                Reference = p.Reference,
                Notes = p.Notes,
                PaymentType = p.PaymentType
            }).ToList()
        };

        return Ok(saleDto);
    }

    [HttpGet("customer/{customerId}")]
    public async Task<ActionResult<IEnumerable<SaleDto>>> GetSalesByCustomer(Guid customerId)
    {
        var sales = await _context.Sales
            .Include(s => s.Customer)
            .Include(s => s.SaleItems)
                .ThenInclude(si => si.Product)
            .Include(s => s.Payments)
            .Where(s => s.CustomerId == customerId)
            .ToListAsync();

        var saleDtos = sales.Select(s => new SaleDto
        {
            Id = s.Id,
            CustomerId = s.CustomerId,
            CustomerName = s.Customer.Name,
            CustomerEmail = s.Customer.Email,
            SaleDate = s.SaleDate,
            TotalAmountGBP = s.TotalAmountGBP,
            TotalRecurringAmountGBP = s.TotalRecurringAmountGBP,
            TotalPaidGBP = s.TotalPaidGBP,
            OutstandingBalanceGBP = s.OutstandingBalanceGBP,
            Status = s.Status,
            QuoteId = s.QuoteId,
            Notes = s.Notes,
            SaleItems = s.SaleItems.Select(si => new SaleItemDto
            {
                Id = si.Id,
                SaleId = si.SaleId,
                ProductId = si.ProductId,
                ProductName = si.Product.Name,
                Quantity = si.Quantity,
                UnitPriceGBP = si.UnitPriceGBP,
                UnitRecurringPriceGBP = si.UnitRecurringPriceGBP,
                RecurrenceOverride = si.RecurrenceOverride,
                RecurrenceIntervalOverride = si.RecurrenceIntervalOverride,
                Notes = si.Notes,
                LineTotal = si.LineTotal,
                LineRecurringTotal = si.LineRecurringTotal
            }).ToList(),
            Payments = s.Payments.Select(p => new PaymentDto
            {
                Id = p.Id,
                SaleId = p.SaleId,
                AmountPaidGBP = p.AmountPaidGBP,
                PaymentDate = p.PaymentDate,
                PaymentMethod = p.PaymentMethod,
                PaymentMethodText = p.PaymentMethod.ToString(),
                Reference = p.Reference,
                Notes = p.Notes,
                PaymentType = p.PaymentType
            }).ToList()
        }).ToList();

        return Ok(saleDtos);
    }

    [HttpPost]
    public async Task<ActionResult<SaleDto>> CreateSale(CreateSaleDto createSaleDto)
    {
        // Validate customer exists
        var customer = await _context.Customers.FindAsync(createSaleDto.CustomerId);
        if (customer == null)
        {
            return BadRequest("Customer not found");
        }

        // Validate all products exist
        var productIds = createSaleDto.SaleItems.Select(si => si.ProductId).ToList();
        var products = await _context.Products.Where(p => productIds.Contains(p.Id)).ToListAsync();
        if (products.Count != productIds.Count)
        {
            return BadRequest("One or more products not found");
        }

        var sale = new Sale
        {
            CustomerId = createSaleDto.CustomerId,
            SaleDate = createSaleDto.SaleDate,
            QuoteId = createSaleDto.QuoteId,
            Notes = createSaleDto.Notes
        };

        _context.Sales.Add(sale);

        // Add sale items
        foreach (var itemDto in createSaleDto.SaleItems)
        {
            var product = products.First(p => p.Id == itemDto.ProductId);
            var saleItem = new SaleItem
            {
                SaleId = sale.Id,
                ProductId = itemDto.ProductId,
                Quantity = itemDto.Quantity,
                UnitPriceGBP = itemDto.UnitPriceGBP,
                UnitRecurringPriceGBP = itemDto.UnitRecurringPriceGBP,
                RecurrenceOverride = itemDto.RecurrenceOverride,
                RecurrenceIntervalOverride = itemDto.RecurrenceIntervalOverride,
                Notes = itemDto.Notes
            };
            _context.SaleItems.Add(saleItem);
        }

        await _context.SaveChangesAsync();

        // Calculate totals
        await UpdateSaleTotals(sale.Id);

        return CreatedAtAction(nameof(GetSale), new { id = sale.Id }, await GetSale(sale.Id));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSale(Guid id, UpdateSaleDto updateSaleDto)
    {
        var sale = await _context.Sales
            .Include(s => s.SaleItems)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sale == null)
        {
            return NotFound();
        }

        sale.SaleDate = updateSaleDto.SaleDate;
        sale.Status = updateSaleDto.Status;
        sale.Notes = updateSaleDto.Notes;

        // Remove existing sale items
        _context.SaleItems.RemoveRange(sale.SaleItems);

        // Add updated sale items
        foreach (var itemDto in updateSaleDto.SaleItems)
        {
            var saleItem = new SaleItem
            {
                SaleId = sale.Id,
                ProductId = itemDto.ProductId,
                Quantity = itemDto.Quantity,
                UnitPriceGBP = itemDto.UnitPriceGBP,
                UnitRecurringPriceGBP = itemDto.UnitRecurringPriceGBP,
                RecurrenceOverride = itemDto.RecurrenceOverride,
                RecurrenceIntervalOverride = itemDto.RecurrenceIntervalOverride,
                Notes = itemDto.Notes
            };
            _context.SaleItems.Add(saleItem);
        }

        await _context.SaveChangesAsync();

        // Recalculate totals
        await UpdateSaleTotals(id);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSale(Guid id)
    {
        var sale = await _context.Sales.FindAsync(id);
        if (sale == null)
        {
            return NotFound();
        }

        _context.Sales.Remove(sale);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("recalculate-totals")]
    public async Task<IActionResult> RecalculateTotals()
    {
        var sales = await _context.Sales
            .Include(s => s.SaleItems)
            .Include(s => s.Payments)
            .ToListAsync();

        foreach (var sale in sales)
        {
            // Recalculate totals
            sale.TotalAmountGBP = sale.SaleItems.Sum(si => si.LineTotal);
            sale.TotalRecurringAmountGBP = sale.SaleItems
                .Where(si => si.LineRecurringTotal.HasValue)
                .Sum(si => si.LineRecurringTotal.Value);
            sale.TotalPaidGBP = sale.Payments.Sum(p => p.AmountPaidGBP);
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = $"Recalculated totals for {sales.Count} sales" });
    }

    private async Task UpdateSaleTotals(Guid saleId)
    {
        var sale = await _context.Sales
            .Include(s => s.SaleItems)
            .Include(s => s.Payments)
            .FirstOrDefaultAsync(s => s.Id == saleId);

        if (sale != null)
        {
            sale.TotalAmountGBP = sale.SaleItems.Sum(si => si.LineTotal);
            sale.TotalRecurringAmountGBP = sale.SaleItems
                .Where(si => si.LineRecurringTotal.HasValue)
                .Sum(si => si.LineRecurringTotal.Value);
            sale.TotalPaidGBP = sale.Payments.Sum(p => p.AmountPaidGBP);

            await _context.SaveChangesAsync();
        }
    }
} 