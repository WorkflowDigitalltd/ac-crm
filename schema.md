# Mini CRM Database Schema Documentation

This document provides a comprehensive overview of the Mini CRM database schema, API endpoints, and related information. It serves as a reference for developers working on the project.

## Database Schema

### Entities & Relationships

#### Customer

| Field     | Type      | Description                   |
|-----------|-----------|-------------------------------|
| Id        | Guid/UUID | Unique customer identifier    |
| Name      | String    | Customer name                 |
| Email     | String    | Customer email address        |
| Phone     | String    | Customer phone number         |
| Address   | String    | Customer address              |
| Postcode  | String    | Customer postcode             |
| CreatedAt | DateTime  | When the customer was created |

**Navigation Properties:**
- `Sales`: Collection of Sale entities associated with this customer
- `Quotes`: Collection of Quote entities associated with this customer

#### Product/Service

| Field              | Type           | Description                                   |
|--------------------|----------------|-----------------------------------------------|
| Id                 | Guid/UUID      | Unique product/service ID                     |
| Name               | String         | Product/service name                          |
| Description        | String         | Details (optional)                            |
| PriceGBP           | Decimal        | Default price in GBP (£)                      |
| IsRecurring        | Boolean        | True if recurring                             |
| RecurrenceType     | Enum           | None/Daily/Weekly/Monthly/Annually/Custom     |
| RecurrenceInterval | Integer        | Every X units (e.g. every 3 months)           |

**RecurrenceType Enum Values:**
- `None`: Not recurring
- `Daily`: Recurs daily
- `Weekly`: Recurs weekly
- `Monthly`: Recurs monthly
- `Annually`: Recurs annually
- `Custom`: Custom recurrence pattern

**Navigation Properties:**
- `Sales`: Collection of Sale entities associated with this product

#### Sale/Order

| Field              | Type           | Description                                   |
|--------------------|----------------|-----------------------------------------------|
| Id                 | Guid/UUID      | Unique sale/order ID                          |
| CustomerId         | FK (Customer)  | Linked customer                               |
| ProductId          | FK (Product)   | Linked product/service                        |
| SaleDate           | DateTime       | Date of sale/order                            |
| TotalAmountGBP     | Decimal        | Amount due in GBP (£)                         |
| RecurrenceType     | Enum (opt)     | Overrides product (optional)                   |
| RecurrenceInterval | Integer (opt)  | Overrides product (optional)                   |
| NextDueDate        | DateTime       | Next payment/renewal due                      |
| Status             | Enum           | Active/Overdue/Cancelled/Complete             |
| QuoteId            | FK (Quote)     | Linked quote (optional)                        |

**SaleStatus Enum Values:**
- `Active`: Sale is active
- `Overdue`: Payment is overdue
- `Cancelled`: Sale has been cancelled
- `Complete`: Sale is complete

**Navigation Properties:**
- `Customer`: The customer associated with this sale
- `Product`: The product associated with this sale
- `Quote`: The quote associated with this sale (if any)
- `Payments`: Collection of Payment entities associated with this sale
- `Invoices`: Collection of Invoice entities associated with this sale

#### Payment

| Field           | Type         | Description                                |
|-----------------|--------------|--------------------------------------------|
| Id              | Guid/UUID    | Unique payment ID                          |
| SaleId          | FK (Sale)    | Linked sale/order                          |
| AmountPaidGBP   | Decimal      | Amount paid in GBP (£)                     |
| PaymentDate     | DateTime     | Date of payment                            |
| RenewalPeriod   | String       | Period this payment is for (e.g. 2025-05)  |
| PaymentMethod   | String       | e.g. bank, card, cash                      |
| Reference       | String       | Optional payment reference                 |

**Navigation Properties:**
- `Sale`: The sale associated with this payment
- `Receipts`: Collection of Receipt entities associated with this payment

#### Expense

| Field         | Type      | Description                    |
|---------------|-----------|--------------------------------|
| Id            | Guid/UUID | Unique expense ID              |
| Category      | String    | Expense type/category          |
| AmountGBP     | Decimal   | Expense amount in GBP (£)      |
| Date          | DateTime  | Date incurred                  |
| Description   | String    | Notes/details                  |
| AttachmentUrl | String    | Optional file/receipt link     |

#### Quote

| Field        | Type          | Description                    |
|--------------|---------------|--------------------------------|
| Id           | Guid/UUID     | Unique quote ID                |
| CustomerId   | FK (Customer) | Linked customer                |
| CreatedDate  | DateTime      | Quote creation date            |
| Status       | Enum          | Draft/Sent/Accepted/Rejected/Expired |
| TotalAmountGBP | Decimal     | Quoted amount in GBP (£)       |

**QuoteStatus Enum Values:**
- `Draft`: Quote is in draft state
- `Sent`: Quote has been sent to the customer
- `Accepted`: Quote has been accepted by the customer
- `Rejected`: Quote has been rejected by the customer
- `Expired`: Quote has expired

**Navigation Properties:**
- `Customer`: The customer associated with this quote
- `QuoteItems`: Collection of QuoteItem entities associated with this quote
- `Sales`: Collection of Sale entities created from this quote

#### QuoteItem

| Field     | Type         | Description                 |
|-----------|--------------|-----------------------------|
| Id        | Guid/UUID    | Unique item ID              |
| QuoteId   | FK (Quote)   | Linked quote                |
| ProductId | FK (Product) | Linked product/service      |
| Quantity  | Integer      | Quantity                    |
| PriceGBP  | Decimal      | Price per unit in GBP (£)   |

**Navigation Properties:**
- `Quote`: The quote associated with this quote item
- `Product`: The product associated with this quote item

#### Invoice

| Field         | Type         | Description                 |
|---------------|--------------|-----------------------------|
| Id            | Guid/UUID    | Unique invoice ID           |
| SaleId        | FK (Sale)    | Linked sale/order           |
| IssueDate     | DateTime     | Invoice date                |
| DueDate       | DateTime     | Payment due date            |
| TotalAmountGBP | Decimal     | Invoice total in GBP (£)    |
| Status        | Enum         | Unpaid/PartiallyPaid/Paid/Overdue |

**InvoiceStatus Enum Values:**
- `Unpaid`: Invoice has not been paid
- `PartiallyPaid`: Invoice has been partially paid
- `Paid`: Invoice has been fully paid
- `Overdue`: Invoice is overdue

**Navigation Properties:**
- `Sale`: The sale associated with this invoice

#### Receipt

| Field       | Type          | Description                 |
|-------------|---------------|-----------------------------||
| Id          | Guid/UUID     | Unique receipt ID           |
| PaymentId   | FK (Payment)  | Linked payment              |
| IssueDate   | DateTime      | Receipt issued date         |
| AmountGBP   | Decimal       | Amount paid in GBP (£)      |

**Navigation Properties:**
- `Payment`: The payment associated with this receipt

## Relationships Overview

- Customer → Sales/Orders → Payments → Receipts
- Customer → Quotes → QuoteItems
- Quotes → Sales (if accepted)
- Sales/Orders → Invoices
- Expense is standalone (not tied to customer)

## API Endpoints

### Customers

- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get a specific customer by ID
- `POST /api/customers` - Create a new customer
- `PUT /api/customers/{id}` - Update an existing customer
- `DELETE /api/customers/{id}` - Delete a customer

### Products

- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get a specific product by ID
- `POST /api/products` - Create a new product
- `PUT /api/products/{id}` - Update an existing product
- `DELETE /api/products/{id}` - Delete a product

### Sales

- `GET /api/sales` - Get all sales
- `GET /api/sales/{id}` - Get a specific sale by ID
- `POST /api/sales` - Create a new sale
- `PUT /api/sales/{id}` - Update an existing sale
- `DELETE /api/sales/{id}` - Delete a sale

## Frontend Components

### Product Components

- `ProductList.js` - Displays a list of products with their details
- `ProductModal.js` - Form for creating and editing products

### Customer Components

- `CustomerList.js` - Displays a list of customers
- `CustomerModal.js` - Form for creating and editing customers

### Sale Components

- `SaleList.js` - Displays a list of sales
- `SaleModal.js` - Form for creating and editing sales

## Development Environment

### Docker Setup

The application is containerized using Docker with the following services:

- **Database (PostgreSQL)**: Runs on port 5432
- **Backend (.NET Core)**: Runs on port 5000
- **Frontend (React)**: Runs on port 3000

### Connection Strings

- **Development**: `Host=db;Port=5432;Database=accrm_db;Username=admin;Password=ac123456789`

## Notes for Developers

1. All IDs use Guid/UUID format instead of integers for better scalability and security.
2. The system uses UK date format (DD-MM-YYYY) and GBP (£) currency.
3. When working with recurring products/services, make sure to properly set the RecurrenceType and RecurrenceInterval fields.
4. The database is designed to handle relationships between entities, so make sure to use the navigation properties when needed.
5. All monetary values are stored in GBP (£) and should be displayed with the £ symbol in the UI.

## Future Development Considerations

1. Implement authentication and authorization
2. Add reporting functionality
3. Implement email notifications for invoices, quotes, etc.
4. Add payment processing integration
5. Implement file uploads for attachments
