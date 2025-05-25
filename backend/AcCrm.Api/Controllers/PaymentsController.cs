using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AcCrm.Api.Data;
using AcCrm.Api.Models;
using AcCrm.Api.DTOs;

namespace AcCrm.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly AcCrmDbContext _context;

    public PaymentsController(AcCrmDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PaymentDto>>> GetPayments()
    {
        var payments = await _context.Payments
            .Include(p => p.Sale)
                .ThenInclude(s => s.Customer)
            .ToListAsync();

        var paymentDtos = payments.Select(p => new PaymentDto
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
        }).ToList();

        return Ok(paymentDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PaymentDto>> GetPayment(Guid id)
    {
        var payment = await _context.Payments
            .Include(p => p.Sale)
                .ThenInclude(s => s.Customer)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (payment == null)
        {
            return NotFound();
        }

        var paymentDto = new PaymentDto
        {
            Id = payment.Id,
            SaleId = payment.SaleId,
            AmountPaidGBP = payment.AmountPaidGBP,
            PaymentDate = payment.PaymentDate,
            PaymentMethod = payment.PaymentMethod,
            PaymentMethodText = payment.PaymentMethod.ToString(),
            Reference = payment.Reference,
            Notes = payment.Notes,
            PaymentType = payment.PaymentType
        };

        return Ok(paymentDto);
    }

    [HttpGet("sale/{saleId}")]
    public async Task<ActionResult<IEnumerable<PaymentDto>>> GetPaymentsBySale(Guid saleId)
    {
        var payments = await _context.Payments
            .Where(p => p.SaleId == saleId)
            .ToListAsync();

        var paymentDtos = payments.Select(p => new PaymentDto
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
        }).ToList();

        return Ok(paymentDtos);
    }

    [HttpPost]
    public async Task<ActionResult<PaymentDto>> CreatePayment(CreatePaymentDto createPaymentDto)
    {
        // Validate sale exists
        var sale = await _context.Sales
            .Include(s => s.Payments)
            .FirstOrDefaultAsync(s => s.Id == createPaymentDto.SaleId);
        
        if (sale == null)
        {
            return BadRequest("Sale not found");
        }

        // Validate payment amount doesn't exceed outstanding balance
        var currentPaid = sale.Payments.Sum(p => p.AmountPaidGBP);
        var outstandingBalance = sale.TotalAmountGBP - currentPaid;
        
        if (createPaymentDto.AmountPaidGBP > outstandingBalance)
        {
            return BadRequest($"Payment amount (£{createPaymentDto.AmountPaidGBP:F2}) exceeds outstanding balance (£{outstandingBalance:F2})");
        }

        var payment = new Payment
        {
            SaleId = createPaymentDto.SaleId,
            AmountPaidGBP = createPaymentDto.AmountPaidGBP,
            PaymentDate = createPaymentDto.PaymentDate,
            PaymentMethod = createPaymentDto.PaymentMethod,
            Reference = createPaymentDto.Reference,
            Notes = createPaymentDto.Notes,
            PaymentType = createPaymentDto.PaymentType
        };

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        // Update sale totals
        await UpdateSalePaidTotal(createPaymentDto.SaleId);

        return CreatedAtAction(nameof(GetPayment), new { id = payment.Id }, await GetPayment(payment.Id));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePayment(Guid id, UpdatePaymentDto updatePaymentDto)
    {
        var payment = await _context.Payments.FindAsync(id);
        if (payment == null)
        {
            return NotFound();
        }

        // Validate new payment amount doesn't exceed outstanding balance
        var sale = await _context.Sales
            .Include(s => s.Payments)
            .FirstOrDefaultAsync(s => s.Id == payment.SaleId);

        if (sale != null)
        {
            var otherPayments = sale.Payments.Where(p => p.Id != id).Sum(p => p.AmountPaidGBP);
            var outstandingBalance = sale.TotalAmountGBP - otherPayments;
            
            if (updatePaymentDto.AmountPaidGBP > outstandingBalance)
            {
                return BadRequest($"Payment amount (£{updatePaymentDto.AmountPaidGBP:F2}) exceeds outstanding balance (£{outstandingBalance:F2})");
            }
        }

        payment.AmountPaidGBP = updatePaymentDto.AmountPaidGBP;
        payment.PaymentDate = updatePaymentDto.PaymentDate;
        payment.PaymentMethod = updatePaymentDto.PaymentMethod;
        payment.Reference = updatePaymentDto.Reference;
        payment.Notes = updatePaymentDto.Notes;
        payment.PaymentType = updatePaymentDto.PaymentType;

        await _context.SaveChangesAsync();

        // Update sale totals
        await UpdateSalePaidTotal(payment.SaleId);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePayment(Guid id)
    {
        var payment = await _context.Payments.FindAsync(id);
        if (payment == null)
        {
            return NotFound();
        }

        var saleId = payment.SaleId;
        _context.Payments.Remove(payment);
        await _context.SaveChangesAsync();

        // Update sale totals
        await UpdateSalePaidTotal(saleId);

        return NoContent();
    }

    [HttpGet("methods")]
    public ActionResult<IEnumerable<object>> GetPaymentMethods()
    {
        var paymentMethods = Enum.GetValues<PaymentMethod>()
            .Select(pm => new { Value = (int)pm, Text = pm.ToString() })
            .ToList();

        return Ok(paymentMethods);
    }

    private async Task UpdateSalePaidTotal(Guid saleId)
    {
        var sale = await _context.Sales
            .Include(s => s.Payments)
            .FirstOrDefaultAsync(s => s.Id == saleId);

        if (sale != null)
        {
            sale.TotalPaidGBP = sale.Payments.Sum(p => p.AmountPaidGBP);
            await _context.SaveChangesAsync();
        }
    }
} 