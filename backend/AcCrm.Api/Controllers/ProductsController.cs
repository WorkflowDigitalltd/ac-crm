using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AcCrm.Api.Data;
using AcCrm.Api.Models;
using AcCrm.Api.DTOs;

namespace AcCrm.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AcCrmDbContext _context;

    public ProductsController(AcCrmDbContext context)
    {
        _context = context;
    }

    // GET: api/products
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
    {
        var products = await _context.Products
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                PriceGBP = p.PriceGBP,
                RecurringPriceGBP = p.RecurringPriceGBP,
                IsRecurring = p.IsRecurring,
                RecurrenceType = p.RecurrenceType,
                RecurrenceInterval = p.RecurrenceInterval
            })
            .ToListAsync();

        return Ok(products);
    }

    // GET: api/products/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProduct(Guid id)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
        {
            return NotFound();
        }

        var productDto = new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            PriceGBP = product.PriceGBP,
            RecurringPriceGBP = product.RecurringPriceGBP,
            IsRecurring = product.IsRecurring,
            RecurrenceType = product.RecurrenceType,
            RecurrenceInterval = product.RecurrenceInterval
        };

        return Ok(productDto);
    }

    // POST: api/products
    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto createProductDto)
    {
        var product = new Product
        {
            Name = createProductDto.Name,
            Description = createProductDto.Description,
            PriceGBP = createProductDto.PriceGBP,
            RecurringPriceGBP = createProductDto.RecurringPriceGBP,
            IsRecurring = createProductDto.IsRecurring,
            RecurrenceType = createProductDto.RecurrenceType,
            RecurrenceInterval = createProductDto.RecurrenceInterval
        };

        // Validate recurrence logic
        if (product.IsRecurring && product.RecurrenceType == RecurrenceType.None)
        {
            return BadRequest("Recurring products must have a valid recurrence type.");
        }

        if (product.IsRecurring && product.RecurringPriceGBP == null)
        {
            return BadRequest("Recurring products must have a recurring price.");
        }

        if (!product.IsRecurring)
        {
            product.RecurrenceType = RecurrenceType.None;
            product.RecurrenceInterval = 1;
            product.RecurringPriceGBP = null;
        }

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        var productDto = new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            PriceGBP = product.PriceGBP,
            RecurringPriceGBP = product.RecurringPriceGBP,
            IsRecurring = product.IsRecurring,
            RecurrenceType = product.RecurrenceType,
            RecurrenceInterval = product.RecurrenceInterval
        };

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, productDto);
    }

    // PUT: api/products/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(Guid id, UpdateProductDto updateProductDto)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
        {
            return NotFound();
        }

        product.Name = updateProductDto.Name;
        product.Description = updateProductDto.Description;
        product.PriceGBP = updateProductDto.PriceGBP;
        product.RecurringPriceGBP = updateProductDto.RecurringPriceGBP;
        product.IsRecurring = updateProductDto.IsRecurring;
        product.RecurrenceType = updateProductDto.RecurrenceType;
        product.RecurrenceInterval = updateProductDto.RecurrenceInterval;

        // Validate recurrence logic
        if (product.IsRecurring && product.RecurrenceType == RecurrenceType.None)
        {
            return BadRequest("Recurring products must have a valid recurrence type.");
        }

        if (product.IsRecurring && product.RecurringPriceGBP == null)
        {
            return BadRequest("Recurring products must have a recurring price.");
        }

        if (!product.IsRecurring)
        {
            product.RecurrenceType = RecurrenceType.None;
            product.RecurrenceInterval = 1;
            product.RecurringPriceGBP = null;
        }

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ProductExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/products/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(Guid id)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
        {
            return NotFound();
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ProductExists(Guid id)
    {
        return _context.Products.Any(e => e.Id == id);
    }
} 