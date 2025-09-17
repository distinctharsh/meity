# MEITY Clone — Hindi Developer Guide (Tree + Steps)

> Is project me Next.js (pages router), Tailwind CSS aur custom admin CMS use hota hai. Neeche folder tree, aur kaun si file me kya likhna/banana hota hai — sari cheeze step-by-step.

---

## Project Tree (High-level)

```
C:/xampp/htdocs/meity-clone
├─ components/                 # Reusable UI components
│  ├─ admin/                   # Admin-only UI (layout, forms, widgets)
│  ├─ icons/                   # SVG/icon components
│  ├─ *.js                     # Site components (Header, Footer, etc.)
│
├─ lib/
│  ├─ db.js                    # MySQL connection (pool)
│  └─ cms-schema.sql           # DB schema
│
├─ pages/                      # Next.js pages router
│  ├─ _app.js                  # Global wrapper (Header/Navbar hide on /admin)
│  ├─ _document.js             # HTML document tweaks
│  ├─ index.js                 # Home page
│  ├─ ministry/ *.js           # Ministry sub-pages
│  ├─ offerings/ *.js          # Offerings sub-pages
│  ├─ documents/ *.js          # Documents sub-pages
│  ├─ media/ *.js              # Media sub-pages
│  ├─ admin/ *.js              # Admin pages (login, dashboard, modules)
│  └─ api/                     # Serverless API routes (Admin CMS backend)
│     └─ admin/
│        ├─ auth/ *.js         # login, logout, signup, verify
│        ├─ announcements/     # CRUD + toggle-status
│        ├─ media/             # CRUD + upload
│        ├─ navigation/        # CRUD for menu
│        ├─ offerings/         # CRUD
│        ├─ settings/          # site settings
│        ├─ slider/            # CRUD + reorder
│        └─ stats.js           # dashboard stats
│
├─ public/                     # Static assets (images, favicon)
├─ styles/                     # CSS files (Tailwind + custom)
├─ utils/                      # Helpers (auth, api, errorHandler)
├─ setup-*.js / *.sql          # DB/CMS setup scripts
├─ README.md / PROJECT_GUIDE.md # English guides
└─ DEVELOPER_GUIDE_HI.md       # (ye file) Hindi guide
```

---

## Global Behavior

- `pages/_app.js`: Admin routes (`/admin...`) par `Header`/`Navbar` hide hote hain. Normal pages par ye auto show hote hain.
- `components/Navbar.js`: Site ke menu links hardcoded array se aate hain. New page link yahin add karein.
- `utils/auth.js`: Admin token (`admin_token`) ko handle karta hai; unauthorized par `/admin/login` redirect.

---

## 1) New Page kaise banayein (Public Site)

Example: `Ministry > About` jaisa simple page.

Steps:
1. `pages/` me path follow karke file banayein. E.g. `pages/ministry/vision.js`.
2. React component export karein (default export). Tailwind classes allowed.
3. Navigation me link add karna ho to `components/Navbar.js` me `navItems` array update karein.

Minimal template:
```jsx
// pages/ministry/vision.js
export default function VisionPage() {
  return (
    <main id="main" className="px-[4%] py-8">
      <h1 className="text-3xl font-bold mb-4">Vision</h1>
      <p className="text-gray-700">Page content here...</p>
    </main>
  );
}
```

Navbar me link add karein:
```js
// components/Navbar.js (navItems me Ministry ke items me add)
{ text: 'Vision', href: '/ministry/vision' }
```

Notes:
- Agar `Footer`, `Header`, `Navbar` chahiye to kuch nahi karna — ye `_app.js` se aa jayega.
- Page-level SEO chahiye to Head use karein (optional):
```jsx
import Head from 'next/head';
...
<Head><title>Vision | MEITY</title></Head>
```

---

## 2) New Component kaise banayein (Reusable UI)

Steps:
1. `components/` me `MyWidget.js` file banayein.
2. Named/default export React component.
3. Jis page me chahiye, import karke use karein.

Template:
```jsx
// components/MyWidget.js
export default function MyWidget({ title }) {
  return (
    <section className="bg-white border rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div>Content...</div>
    </section>
  );
}
```

Use on a page:
```jsx
import MyWidget from '@/components/MyWidget';

export default function SomePage() {
  return (
    <main className="px-[4%] py-8">
      <MyWidget title="Hello" />
    </main>
  );
}
```

Notes:
- Icons ke liye `components/icons/*.js` dekhein ya naya icon component banayein.
- Global styles: `styles/globals.css`, custom: `styles/style2.css`, module CSS optional.

---

## 3) Admin Panel me kaise kaam karein

Admin routes: `pages/admin/*.js`
- Layout wrap: `components/admin/AdminLayout.js`
- Auth token check: `localStorage.admin_token` + redirect to `/admin/login`
- Data fetch: `/api/admin/...` endpoints

### 3.1 Admin page banana (UI screen)
Steps:
1. `pages/admin/my-module.js` create karein.
2. Top par auth check ya directly `AdminLayout` me wrap karein (AdminLayout khud redirect handle karta hai jab token na ho).
3. UI banayein (forms, tables). Data ke liye `utils/auth.js -> authenticatedFetch` use karein.

Template:
```jsx
// pages/admin/my-module.js
import AdminLayout from '@/components/admin/AdminLayout';
import { authenticatedFetch } from '@/utils/auth';
import { useEffect, useState } from 'react';

export default function AdminMyModule() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await authenticatedFetch('/api/admin/my-module');
      if (data) setItems(data);
    })();
  }, []);

  return (
    <AdminLayout>
      <div className="bg-white rounded-xl border p-6">
        <h1 className="text-2xl font-bold mb-4">My Module</h1>
        {/* Table/List */}
        {items.map(i => (<div key={i.id}>{i.name}</div>))}
      </div>
    </AdminLayout>
  );
}
```

Sidebar link add karein:
- `components/admin/AdminLayout.js` me `navigation` array me new item:
```js
{ name: 'My Module', href: '/admin/my-module', icon: '🧩', description: 'Manage my stuff' }
```

### 3.2 Admin API route banana (CRUD)
Server code: `pages/api/admin/<module>/...`

Common patterns:
- List/Create: `index.js` (GET, POST)
- Detail/Update/Delete: `[id].js` (GET, PUT, DELETE)
- Extra actions (e.g., `reorder.js`, `toggle-status.js`)

Example: `pages/api/admin/tags/index.js`
```js
import pool from '@/lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const [rows] = await pool.query('SELECT * FROM tags ORDER BY id DESC');
      return res.status(200).json(rows);
    }
    if (req.method === 'POST') {
      const { name } = req.body;
      if (!name) return res.status(400).json({ message: 'name required' });
      const [result] = await pool.query('INSERT INTO tags (name) VALUES (?)', [name]);
      return res.status(201).json({ id: result.insertId, name });
    }
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
```

DB access:
- `lib/db.js` MySQL pool. Make sure `.env` vars set ho (ya `lib/db.js` me creds sahi).
- Schema add/alter: `lib/cms-schema.sql` ya apna migration SQL.

Auth/Protection:
- Admin endpoints JWT verify karte hain (see existing `pages/api/admin/auth/verify.js`). Iss pattern ko reuse karein for protected actions — ya request headers me `Authorization: Bearer <token>` aayega aur client `utils/auth.js` already bhej deta hai.

### 3.3 Existing Admin modules ka reference
- Slider: UI `components/admin/SliderForm.js`, API `pages/api/admin/slider/*`
- Announcements: UI `components/admin/AnnouncementForm.js`, API `pages/api/admin/announcements/*`
- Offerings: UI `components/admin/OfferingForm.js`, API `pages/api/admin/offerings/*`
- Navigation: Admin page `pages/admin/navigation.js`, API `pages/api/admin/navigation/*`

---

## 4) Navigation/Menu update karna
- Public Navbar: `components/Navbar.js` — `navItems` array me item add/edit.
- Admin Sidebar: `components/admin/AdminLayout.js` — `navigation` array me item add/edit.
- CMS-driven menu (if enabled later): `pages/api/admin/navigation/*` endpoints + `pages/admin/navigation.js` se manage.

---

## 5) Media/Images
- Public assets: `public/images/...` me rakhein. UI me path `/images/...` se use hoga.
- Admin upload: `pages/api/admin/media/upload.js` + `pages/admin/media.js` se manage.

---

## 6) Common Utilities
- `utils/auth.js`: `authenticatedFetch(url, options)` use karein taaki token headers auto lag jaayen, aur 401 par login redirect ho.
- `utils/errorHandler.js`, `utils/debug.js`: logging/help.

---

## 7) Quick Recipes

- New public section with multiple pages:
  - `pages/section-a/index.js` + `pages/section-a/sub1.js` ...
  - `components/Navbar.js` me dropdown items add karein.

- New admin CRUD module:
  - UI page: `pages/admin/<module>.js`
  - API: `pages/api/admin/<module>/index.js` + `pages/api/admin/<module>/[id].js`
  - DB table create/update in `lib/cms-schema.sql` ya migration.
  - Admin sidebar entry in `AdminLayout.js`.

---

## 8) Gotchas
- Admin pages me `Header`/`Navbar` auto hide: `_app.js` me logic `router.pathname.startsWith('/admin')`.
- Token decode errors par AdminLayout auto redirect karta hai.
- Always use `authenticatedFetch` for admin APIs; warna 401 handling miss ho sakti hai.
- Navigation links duplicate na rakhein: `components/navData.js` legacy data hai; current Navbar `components/Navbar.js` use karta hai.

---

Happy building! Agar aapko aur examples chahiye hon to existing modules (Announcements/Slider/Offerings) ki files jaldi dekh lo — wahi patterns reuse karne se sab consistent rahega.
