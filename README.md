# KalyanaSpace (ಕಲ್ಯಾಣಸ್ಪೇಸ್) — Wedding Hall Booking Marketplace MVP

A responsive, and interactive frontend-only MVP for a wedding hall discovery and booking marketplace initially targeting Karnataka, India (Bengaluru, Mysuru, Hubballi, Belagavi, and Mangaluru).

Built with **React**, **TypeScript**, **Tailwind CSS**, and **React Router**, following a maintainable component architecture, service-layer abstraction, and localized browser-persisted mock data ready for future Supabase integration.

---

## 🌟 Demo Credentials & Quick Access

KalyanaSpace includes a built-in **Demo Persona Toolbar** at the top of every screen to switch roles in a single click, or you can log in through the `/login` portal with the seeded credentials:

| Role | Email | Password | Persona & Scope |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@kalyanaspace.demo` | `Customer@123` | **Ananya & Karthik Rao** — Browses venues, compares halls, submits enquiries, tracks enquiry history. |
| **Hall Owner** | `owner@kalyanaspace.demo` | `Owner@123` | **Suresh Gowda (Sri Krishna Hospitality)** — Manages 6 prime venues, tracks leads, quotes prices, manages calendar blocks. |
| **Platform Admin** | `admin@kalyanaspace.demo` | `Admin@123` | **Pooja Hegde (Platform Ops Lead)** — Approves/rejects venue listings with reasons, governs users, reviews bookings. |

> **Note on Persistence & Reset**: All interactions (submitting an enquiry, editing a venue, blocking calendar dates, approving listings, adding reviews) persist in your browser's `localStorage`. You can restore original seed data anytime by clicking **Reset Seed** in the demo toolbar or from `/admin/settings`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0+ or v20+)
- npm (v9+ or v10+)

### Setup Instructions

1. **Clone or navigate to the project directory:**
   ```bash
   cd "Hall Booking - anti gravity"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   ```
   http://localhost:5173
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🏛️ Application Architecture & Portals

The application is structured into three dedicated user domains with role-based navigation and protected routes:

### 1. Customer Marketplace (`/`)
- **Homepage (`/`)**:
  - Hero section featuring authentic wedding venue photography and trust badges.
  - Multi-parameter search panel (City, Event Date, Guest Count, Max Budget).
  - Karnataka location quick-chips (Bengaluru, Mysuru, Hubballi, Belagavi, Mangaluru).
  - Featured handpicked venues and category cards (Traditional Kalyana Mantapa, Luxury Convention, Modern Banquet, Palace Lawns, Destination Resorts).
  - "How It Works" 3-step walkthrough and venue owner onboarding banner.
- **Venue Discovery & Filters (`/venues`)**:
  - Live filtering across Karnataka cities, price ranges (₹40,000 – ₹4,00,000+), capacity, central AC, car parking, catering policies (Pure Veg vs Veg & Non-Veg), and minimum star ratings.
  - Sorting by Recommended, Price (Low-to-High / High-to-Low), Rating, and Guest Capacity.
  - Grid / List layout toggles with responsive mobile filter drawer.
- **Venue Details (`/venues/:id`)**:
  - High-resolution gallery with thumbnail switcher.
  - Specifications: Guest capacity, dining hall seating, AC suites, car parking slots, power backup, bridal grooming lounges.
  - Direct Enquiry Panel: Generates verifiable demo enquiry references (`ENQ-2024-XXXX`) immediately synchronized with the Owner and Admin portals.
  - Reviews section with ability to write verified customer reviews.
  - Similar venues recommendations in the same city.
- **Side-by-Side Comparison (`/compare`)**:
  - Compare up to 3 wedding halls side-by-side with complete specification breakdowns.
- **Favorites (`/favorites`)**:
  - Shortlist preferred venues with persistent browser storage.
- **Customer Account & Enquiry History (`/account` & `/my-enquiries`)**:
  - Profile card and real-time enquiry status tracking.
  - Detail dialog with owner notes, quotation amounts, and site visit schedules.
  - Ability to withdraw pending enquiries.

### 2. Hall-Owner Dashboard (`/owner`)
- **Overview (`/owner`)**:
  - Live KPIs: Total Venues, Published Listings, New Enquiries, Follow-ups Required, Confirmed Bookings, Enquiry-to-Booking Conversion Rate.
  - Visual pipeline distribution bar chart.
  - Recent enquiries table and upcoming confirmed events list.
- **Venue Management (`/owner/venues`)**:
  - Portfolio grid showing owned properties with live badges.
  - Publish / Unpublish (Draft) instant toggles.
  - Multi-section Venue Editor (`/owner/venues/new` and `/owner/venues/edit/:id`):
    1. Basic Information (name, tagline, category, description)
    2. Location in Karnataka (city, locality, address, pin code, maps link)
    3. Pricing & Capacity (starting price, pricing model, guest min/max, dining capacity, room counts, advance %, cancellation policy)
    4. Amenities (central AC, generator backup, bridal suites, decor, parking capacity)
    5. Catering arrangements (Pure Veg vs Veg & Non-Veg, outside catering)
    6. Photo gallery (URL inputs and local file object URL preview)
    7. Review & publication
- **Enquiry Management (`/owner/enquiries`)**:
  - Lead management workflow: Filter by status (New, Contacted, Visit Scheduled, Quotation Shared, Converted, Closed).
  - Detail inspector: Update status, record follow-up dates, schedule site visits, issue quotations, log internal notes, and convert leads into confirmed bookings.
- **Availability Calendar (`/owner/calendar`)**:
  - Month navigation with venue selector.
  - Interactive day grid indicating Available (emerald), Booked (amber), and Blocked (gray).
  - One-click date blocking with custom maintenance reason.
  - Conflict warning preventing the accidental modification of confirmed customer bookings.
  - Detailed popup for booked dates showing customer reference.
- **Analytics & Conversion (`/owner/analytics`)**:
  - Funnel metrics: Enquiry-to-visit and enquiry-to-booking conversion percentages.
  - Monthly growth charts illustrating seasonal Karnataka Muhurtham spikes.
  - Venue performance comparisons.

### 3. Platform Administration (`/admin`)
- **Admin Overview (`/admin`)**:
  - Platform-wide statistics: Customers, Hall Owners, Total Venues, Pending Approvals, Enquiries, Bookings, Active Cities.
  - Live audit log displaying real-time platform actions.
  - Actionable alert banner for listings awaiting verification.
- **Venue Administration (`/admin/venues`)**:
  - Approve new listings (immediately publishes to marketplace).
  - Reject listings with a mandatory documented rejection reason.
  - Suspend / reactivate listings.
  - Curate Featured venues on the homepage.
- **User Governance (`/admin/users`)**:
  - Search and filter all customer and owner accounts.
  - Role management and account suspension controls.
  - Safety restriction: Seed superadmin is protected against accidental self-suspension.
- **Enquiry Oversight (`/admin/enquiries`)**:
  - Cross-platform enquiry queue with concierge coordinator assignment.
- **Booking Ledger (`/admin/bookings`)**:
  - Track confirmed wedding token reservations and mock advance payments.
- **Settings & Seed Reset (`/admin/settings`)**:
  - Storage health diagnostics and one-click database re-initialization.

---

## 🎨 Design System & Aesthetics

- **Palette**:
  - Backgrounds: Warm ivory (`#FBF9F4` / `#FDFCF9`)
  - Typography: Deep charcoal (`#1C2321`) & dark forest green
  - Primary Action: Deep emerald (`#1F5141` / `#153C30`)
  - Accents: Subtle temple gold (`#CFA73E` / `#B88E28`) & terracotta
- **Typography Pairing**:
  - Interface: **Inter** (clean, modern legibility)
  - Headings: **Playfair Display** (royal, traditional wedding character)
- **Localization**:
  - English & Kannada (**ಕನ್ನಡ**) toggle with extensible translation dictionary (`src/locales/`).

---

## 🔌 Future Supabase Integration Roadmap

The application has been engineered with a clean separation of concerns. UI components interact **strictly** through service modules rather than touching browser storage directly:

- `authService` -> `supabase.auth` (Sign up, Sign in, session tokens)
- `venueService` -> `supabase.from('venues')` (PostgreSQL with RLS)
- `enquiryService` -> `supabase.from('enquiries')` (Real-time leads)
- `bookingService` -> `supabase.from('bookings')` (Transactions & tokens)
- `availabilityService` -> `supabase.from('venue_availability')` (Calendar locks)
- `userService` -> `supabase.from('profiles')` (RBAC user profiles)
- `reviewService` -> `supabase.from('reviews')` (Community feedback)

To connect Supabase in the future:
1. Provide Supabase project URL and anon key in `.env`.
2. Swap the localStorage methods in `src/services/*.ts` with Supabase client queries.
3. No UI components or forms require rewriting.

---

## 📄 License & Credits
Built for Karnataka Wedding Hall Booking Market Demonstration. All sample photography sourced from Unsplash with architectural and banquet venue references.
