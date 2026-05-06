# PAF Backend — Frontend Integration Guide

Everything the Vue SPA team needs to integrate with the staging API.

---

## 1. Environment

| Item | Value |
|------|-------|
| Environment | Staging |
| API base URL | `http://api.premiumabrahamicfoods.co.uk/api/v1` |
| Admin panel | `http://api.premiumabrahamicfoods.co.uk/admin` |
| Currency | GBP |
| Country default | GB |

> ⚠️ **HTTP only** — SSL is not yet provisioned. If your frontend runs on HTTPS, browsers will block calls due to mixed-content. Either run frontend on HTTP for staging, or wait for HTTPS to be configured.

---

## 2. Authentication

Sanctum **bearer tokens** (recommended for SPA + simple to integrate).

### Flow
1. `POST /auth/register` or `POST /auth/login` → response includes `token`
2. Store token (e.g. `localStorage`)
3. Send on every authenticated request:
   ```
   Authorization: Bearer <token>
   Accept: application/json
   Content-Type: application/json
   ```
4. `POST /auth/logout` revokes the current token

### Endpoints
| Method | Path | Auth | Body |
|--------|------|------|------|
| POST | `/auth/register` | – | `first_name, last_name, email, password, password_confirmation, phone?` |
| POST | `/auth/login` | – | `email, password, revoke_others?` |
| POST | `/auth/forgot-password` | – | `email` |
| POST | `/auth/reset-password` | – | `email, token, password, password_confirmation` |
| POST | `/auth/logout` | ✓ | – |
| GET  | `/auth/user` | ✓ | – |

### Register/Login response
```json
{
  "customer": { "id": 1, "first_name": "...", "email": "...", ... },
  "token": "1|abc123..."
}
```

---

## 3. Shop (public)

### Categories
| Method | Path | Description |
|--------|------|-------------|
| GET | `/shop/categories` | List active categories (with children) |
| GET | `/shop/categories/{slug}` | Category detail |

### Products
| Method | Path | Query params |
|--------|------|--------------|
| GET | `/shop/products` | `category=<slug>`, `sort=newest\|price_asc\|price_desc\|name\|bestselling`, `per_page=12`, `page=1` |
| GET | `/shop/products/featured` | – (returns up to 8) |
| GET | `/shop/products/{slug}` | – (returns product + pricing block) |
| GET | `/shop/search?q=<term>` | Min 2 chars, max 20 results |

### Product response shape
```json
{
  "data": {
    "id": 1, "name": "...", "slug": "...", "sku": "...",
    "short_description": "...", "description": "...",
    "price": "9.99", "compare_at_price": "12.99",
    "unit": "each", "stock_status": "in_stock",
    "is_featured": true,
    "halal_certification": "...", "ingredients": "...",
    "allergens": "...", "storage_instructions": "...",
    "country_of_origin": "GB",
    "category": { ... },
    "images": [...], "primary_image": { ... },
    "variants": [...], "has_variants": false,
    "discount_percentage": 23
  }
}
```

`/shop/products/{slug}` also includes a `pricing` block:
```json
{
  "pricing": {
    "base_price": "9.99",
    "final_price": "8.49",
    "discounts": [...],
    "total": "8.49"
  }
}
```

---

## 4. Cart

Two modes — automatically picks based on auth state:
- **Guest:** pass a `session_id` (frontend generates a UUID and reuses it). Can also send via `X-Cart-Session` header.
- **Authenticated:** cart is tied to the customer.

| Method | Path | Body |
|--------|------|------|
| GET | `/cart` | – |
| POST | `/cart/items` | `product_id, variant_id?, quantity, session_id?` |
| PUT | `/cart/items/{itemKey}` | `quantity` (0 removes) |
| DELETE | `/cart/items/{itemKey}` | – |
| POST | `/cart/promo` | `code` |
| DELETE | `/cart/promo` | – |

`itemKey` is `"<product_id>-<variant_id|null>"` (returned in cart response).

### Cart response shape
```json
{
  "cart": {
    "items": [
      {
        "key": "1-null",
        "product_id": 1, "variant_id": null,
        "name": "...", "variant_name": null,
        "sku": "...", "image": "path/to/img.jpg",
        "quantity": 2,
        "unit_price": "8.49",
        "total": "16.98"
      }
    ],
    "item_count": 2,
    "subtotal": "16.98",
    "promotion_code": null
  }
}
```

---

## 5. Checkout & Payments (Stripe)

### Step 1 — Get shipping rates
`POST /shipping/rates`

### Step 2 — Create checkout
`POST /checkout`
```json
{
  "email": "buyer@example.com",
  "phone": "07000000000",
  "session_id": "<uuid>",      // required if guest
  "billing_address": {
    "first_name": "...", "last_name": "...",
    "address_line_1": "...", "address_line_2": "...",
    "city": "...", "county": "...", "postcode": "...",
    "country": "GB"             // ISO-2
  },
  "shipping_address": { ... },  // same shape
  "shipping_method": "DHL_EXPRESS",
  "shipping_amount": 9.99,
  "notes": "..."
}
```
Response:
```json
{
  "order": { "order_number": "PAF-20260505-0001", ... },
  "client_secret": "pi_xxx_secret_yyy"
}
```

### Step 3 — Confirm with Stripe.js (frontend)
```js
const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
await stripe.confirmCardPayment(client_secret, {
  payment_method: { card: cardElement, billing_details: {...} }
});
```

### Step 4 — Verify with backend
`POST /checkout/confirm` with `order_number` → returns finalised order.

> The Stripe webhook (`POST /webhooks/stripe`) updates `payment_status` to `paid` server-side. `confirm` simply checks that has happened.

---

## 6. Customer (authenticated)

### Account
| Method | Path | Body |
|--------|------|------|
| GET | `/account` | – |
| PUT | `/account` | `first_name?, last_name?, email?, phone?` |
| PUT | `/account/password` | `current_password, password, password_confirmation` |

### Addresses
Standard `apiResource` — `GET/POST /addresses`, `GET/PUT/DELETE /addresses/{id}`, plus:
- `POST /addresses/{id}/default` — mark default

Body for create/update:
```json
{
  "type": "shipping",          // or "billing"
  "is_default": true,
  "label": "Home",
  "first_name": "...", "last_name": "...",
  "company": "...",
  "address_line_1": "...", "address_line_2": "...",
  "city": "...", "county": "...", "postcode": "...",
  "country": "GB",             // ISO-2
  "phone": "..."
}
```

### Orders
| Method | Path |
|--------|------|
| GET | `/orders` |
| GET | `/orders/{orderNumber}` |
| POST | `/orders/{orderNumber}/cancel` |

### Order response shape
```json
{
  "data": {
    "order_number": "PAF-20260505-0001",
    "status": "processing",        // pending|confirmed|processing|ready_to_ship|shipped|out_for_delivery|delivered|cancelled|refunded|partially_refunded
    "payment_status": "paid",      // pending|paid|failed|refunded|partially_refunded
    "subtotal": "16.98", "discount_amount": "0.00",
    "shipping_amount": "9.99", "tax_amount": "0.00",
    "total": "26.97", "currency": "GBP",
    "shipping_address": {...}, "billing_address": {...},
    "shipping_method": "DHL_EXPRESS",
    "promotion_code": null,
    "items": [...], "shipments": [...],
    "paid_at": "2026-05-05T...", "shipped_at": null, "delivered_at": null,
    "created_at": "2026-05-05T..."
  }
}
```

---

## 7. Wholesale (feature-flagged — confirm if enabled)

| Method | Path | Body |
|--------|------|------|
| GET | `/wholesale/application` | – |
| POST | `/wholesale/application` | See below |

```json
{
  "company_name": "...", "contact_name": "...",
  "email": "...", "phone": "...",
  "company_registration": "...", "vat_number": "...",
  "business_description": "...", "website": "https://...",
  "address": {
    "address_line_1": "...", "address_line_2": "...",
    "city": "...", "county": "...", "postcode": "...",
    "country": "GB"
  }
}
```

---

## 8. Errors

Laravel-standard JSON errors.

### 422 Validation
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

### 401 / 403 / 404 / 500
```json
{ "message": "Unauthenticated." }
```

Always send `Accept: application/json` so Laravel returns JSON instead of redirecting.

---

## 9. CORS / Cookies

- Allowed origin = `FRONTEND_URL` env var on backend.
- `supports_credentials: true` is set, so if you use cookie auth you must set `withCredentials`.
- For **bearer-token** auth (recommended) you don't need `withCredentials`.

### What we need from you
1. **Your staging frontend URL** so backend can set `FRONTEND_URL` and `SANCTUM_STATEFUL_DOMAINS`.
2. Confirm preferred auth: **bearer tokens** (simpler) vs **cookie/SPA mode** (requires `GET /sanctum/csrf-cookie` first).

---

## 10. Stripe — what frontend needs

- The **Stripe publishable key** (we'll send out-of-band — never commit it).
- Use `@stripe/stripe-js` + Stripe Elements.
- Test card: `4242 4242 4242 4242`, any future expiry, any CVC, any postcode.

---

## 11. Quick sanity-check requests

```bash
# Health check — list products
curl http://api.premiumabrahamicfoods.co.uk/api/v1/shop/products \
  -H "Accept: application/json"

# Register
curl -X POST http://api.premiumabrahamicfoods.co.uk/api/v1/auth/register \
  -H "Accept: application/json" -H "Content-Type: application/json" \
  -d '{"first_name":"Test","last_name":"User","email":"test@example.com","password":"password123","password_confirmation":"password123"}'
```

---

## Contact / questions

Open issues against the backend repo or ping the backend dev. An OpenAPI 3 spec is also available at `docs/openapi.yaml` for Postman/Insomnia import.
