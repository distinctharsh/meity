# Reports — Kaam ka flow (Hindi)

Yeh file block-by-block batati hai ki "reports" feature kaise kaam karta hai, kaunse files involved hain, aur agar aap future mein koi naya field add karna chahein to kin files/steps ko update karna hoga.

**Quick map (sabse important files)**

- Admin APIs:
  - [pages/api/admin/reports/index.js](pages/api/admin/reports/index.js) — list/create reports
  - [pages/api/admin/reports/[id].js](pages/api/admin/reports/[id].js) — read/update/delete single report
- Public APIs / frontend data:
  - [pages/api/documents/reports.js](pages/api/documents/reports.js) — public reports listing (filters, archived)
- Admin UI:
  - [components/admin/ReportForm.js](components/admin/ReportForm.js) — form to create/edit a report in admin
  - [pages/admin/reports.js](pages/admin/reports.js) — admin list page
- Public pages / UI:
  - [pages/documents/index.js](pages/documents/index.js) — main documents listing page (central UI)
  - [pages/documents/[slug].js](pages/documents/[slug].js) — pretty route that maps to a nav path
  - [pages/documents/report/[id].js](pages/documents/report/[id].js) — detail page showing files for a report
- Navigation helpers (affect which nav item is linked):
  - [components/SubNavTabs.jsx](components/SubNavTabs.jsx)
  - [components/Navbar.js](components/Navbar.js)
  - [components/RecentDocs.js](components/RecentDocs.js) — "View more" behaviour
- DB / schema references:
  - `lib/*.sql` (look at `lib/cms-schema.sql`, `lib/components-schema.sql`, etc.)
  - Tmp migration: `tmp/migrate-reports-navlink-to-navitem.sql`


## Block-by-block (flow)

1) Data model / database
- Table: `reports` (columns: id, title, year, file_url, item_count/files_count, nav_link or nav_item_id, is_active, is_archived, ...)
- If you add a field: add it to DB via ALTER TABLE (or a migration SQL file). Check `lib/` or `tmp/` for examples.

2) Admin create / edit (server-side)
- API: [pages/api/admin/reports/index.js](pages/api/admin/reports/index.js)
  - Handles POST to create a report. It first checks which DB columns exist (uses `SHOW COLUMNS`) to be tolerant during migrations.
  - Builds INSERT with only existing columns (nav_item_id vs nav_link, optional is_archived).
- API: [pages/api/admin/reports/[id].js](pages/api/admin/reports/[id].js)
  - Handles GET/PUT/DELETE for single report. PUT similarly detects columns and updates only present ones.

3) Admin UI
- [components/admin/ReportForm.js](components/admin/ReportForm.js)
  - The form state lists the fields shown to admin. When adding a new field, add it to this component's state, inputs, and include it in the payload sent to the admin API.
- [pages/admin/reports.js](pages/admin/reports.js)
  - Lists reports and shows `nav_name` / `nav_item_id` in the table. If you add a new column to admin listing, add the column in the SELECT (API) and the table here.

4) Public API (what the site pages call)
- [pages/api/documents/reports.js](pages/api/documents/reports.js)
  - This returns public report lists and supports `nav` or `nav_item` queries plus `archived_only` / `include_archived` flags.
  - It also checks for `is_archived` column using `SHOW COLUMNS` and adjusts WHERE clause accordingly.
  - If you add a public-facing field (e.g., `summary`), add it to the SELECT here and to the mapping the frontend expects.

5) Public pages / components
- [pages/documents/index.js](pages/documents/index.js)
  - Fetches `/api/documents/reports` with either `nav` or `nav_item` depending on router state, maps returned JSON to UI items.
  - If you add a new field used in listing (e.g., `summary`), update mapping here (the `mapped` array in useEffect) and render it.
- [pages/documents/[slug].js](pages/documents/[slug].js)
  - Pretty route: server-side maps `/documents/<slug>` to `?nav=/documents/<slug>` and reuses the same fetching logic.
- [pages/documents/report/[id].js](pages/documents/report/[id].js)
  - Shows all files for a report by calling `/api/documents/<id>/files` (if present). Add changes to fields used by this page.

6) Navigation & recent widget
- [components/SubNavTabs.jsx] and [components/Navbar.js] — these build links for nav items. If you change how nav links are stored (nav_link vs nav_item_id), both may require updates.
- [components/RecentDocs.js] — the "View more" button finds first child under `/documents` and routes to that pretty `/documents/<slug>` URL.


## If you need to add a NEW FIELD (step-by-step)
Follow this checklist to add a column `new_field` to reports safely:

1. Database migration
- Add column in DB (example):

  ALTER TABLE reports ADD COLUMN new_field VARCHAR(255) DEFAULT NULL;

- (Optional) add a migration SQL file under `tmp/` or `lib/` for tracking.

2. Server-side APIs (admin + public)
- Update admin API handlers to use the new column:
  - [pages/api/admin/reports/index.js] — when building INSERT, include `new_field` value.
  - [pages/api/admin/reports/[id].js] — include `new_field` in allowed update fields.
  - Note: this project uses `SHOW COLUMNS` guards. Either place your new column in the payload and the API will include it if column exists, OR if you add stricter checks, add `SHOW COLUMNS FROM reports LIKE 'new_field'` where needed.

3. Admin UI
- [components/admin/ReportForm.js]
  - Add `new_field` to the component's state default.
  - Add input control in the form JSX.
  - Ensure the submit payload includes `new_field`.
- [pages/admin/reports.js]
  - If you want to show it in listing, update the admin list API or mapping to include it.

4. Public API
- [pages/api/documents/reports.js]
  - Add `new_field` to the SELECT and the output JSON mapping.

5. Public Pages/UI
- [pages/documents/index.js] and [pages/documents/[slug].js]
  - Update the `mapped` object in the fetch logic to map `new_field` to the UI item.
  - Update UI rendering to show `new_field` where needed.

6. Tests & Verify
- Restart dev server:

  npm run dev

- Test admin create/update via Admin UI.
- Test public endpoint via curl or browser:

  curl "http://localhost:3000/api/documents/reports?nav=/documents/reports"

- Visit public pages and confirm the new field appears as expected.


## Troubleshooting tips (common issues)
- Duplicate page warning: Next.js warns when two files resolve to same route (e.g., `pages/documents.js` and `pages/documents/index.js`). Keep only one.
- Missing column errors: If server queries reference a column that doesn't exist, you'll get ER_NO_SUCH_TABLE/column errors. Use `SHOW COLUMNS` checks or deploy DB migration first.
- Don't clobber manual edits: Admin form code uses `slugify()` to auto-fill link. If you want manual edits to persist, only overwrite when link is empty or unchanged.


## Quick file checklist when editing reports
- API (admin create/list): [pages/api/admin/reports/index.js]
- API (admin item): [pages/api/admin/reports/[id].js]
- Public API: [pages/api/documents/reports.js]
- Admin form: [components/admin/ReportForm.js]
- Admin list page: [pages/admin/reports.js]
- Public listing page: [pages/documents/index.js]
- Pretty slug page: [pages/documents/[slug].js]
- Detail page: [pages/documents/report/[id].js]


---
