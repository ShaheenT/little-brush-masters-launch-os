# Little Brush Masters — Launch OS

Production-ready V1 landing page + operating system for the premium parent/child mural experience.

## Launch objective

First 10 families.
Target average project value: R9,850.
Revenue target: R98,500 before add-ons.

## Tomorrow's setup

1. Replace `WHATSAPP_NUMBER` in `app/page.tsx` with the business WhatsApp number in international format, e.g. `2782...`.
2. Replace `metadataBase` in `app/layout.tsx` with the final domain.
3. Add your real logo/photography to `/public` when ready.
4. Run:
   - `npm install`
   - `npm run build`
   - `npm run dev`
5. Deploy to Vercel.
6. Connect the landing page CTA to the WhatsApp Business number.
7. Import `ops/lead-pipeline.csv` into your CRM or Google Sheets.
8. Use the scripts in `docs/` for enquiries, consultations, deposits, completion and referrals.

## Pricing

Little Brush Experience — R6,850 — one feature wall.
Little Brush Signature — R9,850 — two-wall creative transformation.
Childhood Masterpiece — R14,850 — larger room transformation.

The external customer-facing model is project/experience based. Internal costing can still be calculated per wall/hour.

## Important

The form currently opens a pre-filled WhatsApp message. It does not store personal data in a database. For a fully automated CRM, connect the form to your chosen CRM/Google Sheet/n8n workflow after the first launch.

## Suggested production stack

Next.js + Vercel
WhatsApp Business
HubSpot Free or Airtable
Google Drive
Calendly
Payment gateway / EFT
n8n for automation after the funnel is proven
