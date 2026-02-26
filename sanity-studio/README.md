# Routiq CMS — Sanity Studio

This folder contains the **Sanity Studio** that powers the Routiq landing page's
dynamic release notes and download management.

---

## 🗂 Folder Structure

```
sanity-studio/
├── schemas/
│   ├── index.ts        ← registers all schemas
│   ├── release.ts      ← Release document schema
│   └── faqItem.ts      ← FAQ item schema
├── sanity.config.ts    ← studio config (project ID, plugins)
├── sanity.cli.ts       ← CLI config (for deployments)
├── package.json
└── tsconfig.json
```

---

## 🚀 First-Time Setup (do this once)

### Step 1 — Create a Sanity project

1. Go to **[sanity.io](https://sanity.io)** and sign in / create a free account.
2. Click **"New project"** → give it a name like `Routiq`.
3. Choose dataset: keep it as **`production`**.
4. Copy your **Project ID** from the dashboard URL or the project settings page.

---

### Step 2 — Add your Project ID everywhere

You need to set your Project ID in **two places**:

#### A. `sanity-studio/sanity.config.ts`
```ts
projectId: 'YOUR_PROJECT_ID',   // ← replace this
dataset:   'production',
```

#### B. `sanity-studio/sanity.cli.ts`
```ts
projectId: 'YOUR_PROJECT_ID',   // ← replace this
dataset:   'production',
```

#### C. `Landing_page/releases.html`  (in the `<script>` tag at the top)
```html
<script>
    window.SANITY_CONFIG = {
        projectId: 'YOUR_PROJECT_ID',   // ← replace this
        dataset:   'production',
        apiVersion: '2024-01-01',
        token: '',   // ← see Step 4 if your dataset is private
    };
</script>
```

---

### Step 3 — Configure CORS for your landing page

By default Sanity blocks requests from unknown origins.

1. Go to **[sanity.io/manage](https://sanity.io/manage)** → your project → **API → CORS Origins**
2. Click **"Add CORS Origin"**
3. Add:
   - `http://localhost` (for local development)
   - `http://127.0.0.1` (for local development)
   - The URL where your landing page is hosted (e.g. `https://routiq.app`)
4. Check **"Allow credentials"** only if you use a token.

---

### Step 4 — (Optional) API Token for private datasets

If your Sanity dataset is set to **private**, the landing page needs a read-only token.

1. Go to your project → **API → Tokens → Add API Token**
2. Name it: `Landing Page Viewer`
3. Role: **Viewer** (read-only)
4. Copy the token.
5. Paste it into `releases.html`:
   ```js
   window.SANITY_CONFIG = {
       ...
       token: 'sk...your_token_here',
   };
   ```

> 💡 For a **public** dataset (recommended for a landing page), leave `token: ''`
> and the page will work without any auth.

---

### Step 5 — Run the Studio locally

```powershell
cd sanity-studio
npm run dev
```

Your studio will open at **http://localhost:3333**

---

### Step 6 — Create your first Release

1. Inside the Studio, click **📦 Releases** in the sidebar.
2. Click **"Create new Release"**.
3. Fill in:
   | Field | Example |
   |---|---|
   | Version Number | `v1.3.0` |
   | Release Name | `The Gamification Update` |
   | Release Date | `2026-02-25` |
   | Mark as Latest | ✅ tick this for the newest version |
   | Color Theme | Purple |
   | Emoji | 🎮 |
   | Description | Short summary |
   | Changelog Items | Add items with tags (NEW / FIX / IMPROVED / PERF) |
   | Android APK File | Upload your `.apk` file |
   | iOS Build File | Upload your `.ipa` file |
   | Source ZIP | Upload or leave blank |
   | GitHub Release URL | Fallback link for source |

4. Click **Publish** (top right).
5. Refresh `releases.html` — your release appears instantly!

---

### Step 7 — Deploy the Studio (optional)

If you want a permanent Studio URL your team can access:

```powershell
cd sanity-studio
npm run deploy
```

You'll get a URL like: `https://routiq.sanity.studio`

---

## 📡 How the Frontend Fetches Data

`releases.html` uses a **GROQ query** sent directly to Sanity's Content API:

```groq
*[_type == "release"] | order(releaseDate desc) {
    version, releaseName, releaseDate, isLatest,
    colorTheme, emoji, description,
    changelog[] { tag, featureTitle, detail },
    apkFile { asset-> { _ref, url } },
    iosFile  { asset-> { _ref, url } },
    sourceZip { asset-> { _ref, url } },
    githubUrl
}
```

- **APK/iOS/Source** download buttons show real files if uploaded, or a **"Coming Soon"** badge if not uploaded.
- The **hero badge** ("Latest: v1.3.0 — February 2026") is automatically populated from the release marked `isLatest: true`.
- **Filters** (New, Fix, Improvement, Performance) read from the changelog item tags.
- **Skeleton loaders** appear while the API fetches data.

---

## 🛠 Available Commands

| Command | Description |
|---|---|
| `npm run dev` | Start Studio locally at localhost:3333 |
| `npm run deploy` | Deploy Studio to sanity.studio |
| `npm run build` | Build Studio for self-hosting |

---

## 📋 Schema Reference

### Release document

| Field | Type | Required | Notes |
|---|---|---|---|
| `version` | string | ✅ | Must match `v1.2.3` format |
| `releaseName` | string | ✅ | e.g. "The Gamification Update" |
| `releaseDate` | date | ✅ | Controls sort order |
| `isLatest` | boolean | — | Only one should be true |
| `colorTheme` | string | — | `purple` / `blue` / `emerald` / `amber` |
| `emoji` | string | — | Single emoji for card icon |
| `description` | text | ✅ | Max 300 chars |
| `changelog` | array | ✅ | Min 1 item required |
| `apkFile` | file | — | `.apk` uploads only |
| `iosFile` | file | — | `.ipa` uploads only |
| `sourceZip` | file | — | `.zip` / `.tar.gz` |
| `githubUrl` | url | — | Fallback for source button |
| `internalNotes` | text | — | Not shown on website |

### Changelog item tags

| Tag | Label | Color |
|---|---|---|
| `new` | NEW | Purple |
| `fix` | FIX | Green |
| `improvement` | IMPROVED | Blue |
| `performance` | PERF | Amber |
| `breaking` | BREAKING | Red |
