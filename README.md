# Canteen Chaos — Render Workflows

This is a separate TypeScript Render Workflows service for the Canteen Chaos project.
It deliberately lives outside the existing Express app so the original app remains
unchanged while you set up and demonstrate Render Workflows.

## What it does

The `processCanteenOrder` flow runs three checkpointed steps:

1. `validate-order` — validates the incoming order and calculates its item count/subtotal.
2. `create-kitchen-ticket` — creates a structured kitchen ticket with `QUEUED` status.
3. `create-customer-receipt` — returns a customer-facing confirmation.

`workflowHealthCheck` is a tiny task you can run to verify the service is registered.

**Important:** This starter creates a workflow result; it does not yet write to the
existing app's JSON order store or update the live staff dashboard. That requires
wiring the flow trigger into the Express order-creation route and deciding how the
workflow should safely update the app's order store. Do not claim that live integration
until that wiring has been implemented and tested.

## Local setup (Windows PowerShell or Git Bash)

```bash
npm install
npm run build
```

The workflow definitions are registered when Render loads `dist/index.js`.

## Deploy on Render

In Render Dashboard → New → Workflow:

- Choose **My own workflow**.
- Connect the GitHub repository containing this folder.
- Set **Root Directory** to `render-workflow` if you place this folder at the
  repository root under that name.
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

If you instead create a separate repository whose root is this folder's contents,
leave Root Directory blank.

## Example flow input

Use this JSON-shaped input when manually starting `processCanteenOrder` from the
Render dashboard (the dashboard may ask for positional flow arguments; pass this
object as the single argument):

```json
{
  "orderId": "DEMO-1001",
  "customerName": "Demo Student",
  "pickupSlot": "12:30 PM",
  "items": [
    {
      "dishId": "dish-01",
      "name": "Paneer Roll",
      "quantity": 2,
      "unitPrice": 60
    },
    {
      "dishId": "dish-02",
      "name": "Masala Chaas",
      "quantity": 1,
      "unitPrice": 25
    }
  ]
}
```

Expected result: 3 total items, subtotal ₹145, a `KT-DEMO-1001` kitchen ticket,
and a receipt with status `QUEUED`.

## Before connecting this to the live app

The current Canteen Chaos backend uses a local JSON data store. A deployed workflow
cannot safely modify that file directly because workflow task instances are separate
from the Express service. For true end-to-end integration, the backend should trigger
this flow using the Render SDK (or API), and the workflow should communicate back
through an authenticated backend endpoint or a shared database.
