# CarrierDirect Logistics - Freight & Auto Transport System
## Instant Quotation, Booking & 50% Deposit Engine

A production-ready, full-stack logistics freight and auto transport quotation engine built strictly in accordance with **LOGISTICS_APP_DEVELOPER_BLUEPRINT.md**.

---

### 🌐 Official Live Production Deployments
- **Main Vercel Production URL:** [https://carrier-quote-engine-sigma.vercel.app](https://carrier-quote-engine-sigma.vercel.app)
- **Direct Vercel Deployment:** [https://carrier-quote-engine-oxln83fz7-carrierdirect-logistics.vercel.app](https://carrier-quote-engine-oxln83fz7-carrierdirect-logistics.vercel.app)
- **Secondary Live Global CDN:** [https://carrierdirect-logistics.surge.sh](https://carrierdirect-logistics.surge.sh)
- **GitHub Pages Mirror:** [https://marman14.github.io/carrier-quote-engine/](https://marman14.github.io/carrier-quote-engine/)
- **GitHub Repository:** [https://github.com/marman14/carrier-quote-engine](https://github.com/marman14/carrier-quote-engine)

---

### 🔑 Carrier Dispatch Hub (Admin Portal)
- **Access Location:** Navigate to the **"Carrier Dispatch Hub"** tab
- **Master Admin Password:** `admin123`
- **Convenience Features:**
  - `[Auto-Fill Key]` - automatically types `admin123` and logs in with 1 click.
  - `[Copy Key]` - copies `admin123` to clipboard with visual feedback.
  - `[Lock / Logout]` - securely relocks the dashboard at any time.

---

### 🛠️ Key Architectural Features
1. **Multi-Step Instant Quote Calculator:**
   - **Step 1: Route & US Zip Lookup:** Validates postal codes in real-time via `https://api.zippopotam.us/us/{ZIP}`, queries highway driving mileage via OSRM (`project-osrm.org`), with freight industry standard fallback to Haversine × 1.20 Road Tortuosity.
   - **Step 2: Cargo Specifications:** Supports Auto/Vehicles, Palletized Freight/LTL, and Heavy Equipment/Machinery with running vs inoperable winch accessorials and open vs enclosed trailer rigs.
   - **Step 3: Speed Tiers & Financial Breakdown:**
     - **Standard Linehaul:** Base contract rate.
     - **Expedited Rush (+25%):** Priority team driver transit (2–4 days).
     - **Economy Backhaul (-15%):** Flexible route discount (6–10 days).
   - **Transparent Itemized Financial Breakdown:**
     - Base Linehaul Charge (`miles × ratePerMile`)
     - Floating Diesel Fuel Surcharge (`12%`)
     - Accessorials (Door fee, Enclosed fee, Inop fee)
     - **Total Contract Rate**
     - **50% Lock-in Deposit (Due Today)**
     - **Remaining COD Balance (Due upon delivery to driver)**

2. **Payment & Official Bill of Lading (BOL):**
   - Stripe 50% deposit checkout flow (`/api/create-deposit-checkout`) with 1-click test simulation.
   - Generates official corporate Bill of Lading (BOL) complete with:
     - DOT #3892104 | MC #941824 | FMCSA Active verification
     - Unique Tracking Number (e.g. `TRK-9104`) & BOL Invoice Number
     - Shipper and Consignee contact manifests
     - Itemized financial audit box
     - Signature execution blocks for Shipper, Carrier Driver, and Consignee Receiver
     - One-click Print / Save PDF stylesheet (`@media print`)

3. **One-Click Native Device SMS Protocol (`sms:`):**
   - Instant mobile dispatcher communication button:
     `sms:+12147789921?&body=Hi%20Dispatch...`
   - Pre-populated with tracking code, cargo item, route, and deposit confirmation at **$0.00 cost** and **0.0-second delay**.

4. **Carrier Dispatch Hub & Settable Pricing Controls:**
   - Adjustable parameters: `Rate Per Mile` ($1.40), `Minimum Fee` ($350), `Door Fee` ($120), `Fuel Surcharge` (12%), `Rush Surcharge` (25%), `Economy Discount` (15%), `Deposit Percentage` (50%).
   - Saving immediately refreshes the public calculator in real-time and persists to `localStorage`.
   - Live Load Dispatch Manifest Table with real-time status advances (Booked ➔ In Transit ➔ Delivered).

5. **Hostinger SMTP Email Notification Engine:**
   - Connected via `smtp.hostinger.com:465` (SSL).
   - Dual automated dispatch:
     1. **Shipper Receipt:** Official HTML Bill of Lading with tracking details.
     2. **Fleet Alert:** Internal load notification to `dispatch@carrier.com`.
