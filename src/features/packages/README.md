# Packages feature

Tour package listing (`/packages`) and details (`/packages/:slug/:packageId`).

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173/packages/exotic-goa-beach-and-heritage-getaway/4`.

The details page calls `GET /public/packages/{packageId}` (no auth). To work on the UI without the backend,
use the bundled mock (a trimmed copy of package 4):

```bash
# .env.local
VITE_PACKAGES_MOCK=true
```

Restart `npm run dev` after changing env vars. Type check with `npx tsc -b`.

## Structure

| Folder | Contents |
| --- | --- |
| `types/` | `package.ts` (list), `packageDetail.ts` (full detail response) |
| `api/`, `hooks/` | API calls and TanStack Query hooks (`usePackageDetail`, `usePackagesSearchInfinite`) |
| `utils/` | `packageDetailFormat.ts` (currency, dates, 12h times, labels, normalisers), `packageDetailIcons.ts` |
| `mock/` | `packageDetail.mock.ts` |
| `components/detail/` | One component per section of the details page |
| `pages/` | `PackagesPage.tsx`, `PackageDetailsPage.tsx` |

## Details page sections

Gallery + lightbox, sticky section nav (scroll-spy), overview facts, itinerary accordion timeline, activities grid +
detail drawer, stay & meals, transport & pickup, inclusions / exclusions, policies, operator footer, and a booking card
(sticky sidebar on desktop, fixed bottom bar on mobile). Sections with no data are hidden.

## Review & reservation (`/packages/:slug/:packageId/review?departureId=…`)

Book Now on the details page opens the review page with the selected departure. The user picks a departure and pickup
point (pickup points are filtered by `departureId`), traveller counts per price row (child ages within the row's age
range), optional paid activities, and fills one guest form per adult and child (the first adult is the lead guest).
Infant quantity is sent in `travellers` only; infants are not included in `guestDetails`.

Reserve calls `POST /package-reservations` (`reservePackageApi`). Guests are allowed; the bearer token is sent only if
the user is signed in. An `X-Idempotency-Key` is generated per unique payload, so retrying the same request returns
the existing booking. Non-lead guests without email/mobile inherit the lead guest's contact.

## Payment (`/packages/booking/:bookingId/payment`)

After a successful reservation the review page stores the response in `sessionStorage` (`utils/reservationStorage.ts`)
and opens the payment page, which shows the reservation summary (reference, departure, travellers, pricing,
deposit/amount due now, balance) and an expiry countdown from `expiresAt`. Payment uses the package payment endpoints
(`/package-payments/mpesa/pay`, `/package-payments/econet`, `/package-payments/cpay/initiate|pay|card/initiate`) with
`{ packageBookingId, phoneNumber }` via `api/packagePayment.api.ts`: M-Pesa and EcoCash
confirm directly, C-Pay asks for an OTP, and card payment opens the gateway iframe and polls `/payments/status/{id}`.
On success the user lands on `/packages/booking/:bookingId/confirmed`.

## Notes

- `departures`, `transport` and `pickupPoints` are mapped to view models by `normalizeDepartures` /
  `normalizeTransport` / `normalizePickupPoints`, so components never deal with raw nulls.
- Book Now requires a departure and opens the review page; Enquire and Contact operator only show an info popup.
- Printing the page (Ctrl+P) prints only the package content with every itinerary day expanded.
- Dark mode follows the app-wide `.dark` class.
