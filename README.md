# Trip Planner

Collect restaurants, experiences, places, and inspiration. 
Pin them on a map and arrange them like a moodboard!
Then build a day-by-day itinerary from what you've collected.

All data is stored in the browser's `localStorage` on the device you are using.

(this project was for fun and it is mostly vibe coded)

## Running it

```
npm install
npm run dev
```

Open http://localhost:5173.

`npm run dev` also prints a Network address (e.g. `http://192.168.1.103:5173`).
Open that on your phone while both devices are on the same wi-fi.

## Building

```
npm run build     # outputs to dist/
npm run preview   # serve the built site locally
```

`dist/` is a plain static site with relative paths, so it can be hosted from any
static host or subdirectory.

## Syncing between devices

Sync keeps your laptop and the phone showing the same trip. 
The app will work without syncing and without signal as everything is written to device first.

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste in `supabase/schema.sql`, and run it.
   This creates the table, locks it so only you can read your own row, and
   makes an image bucket.
3. In **Settings → API**, copy the **Project URL** and the **anon** key.
4. Either copy `.env.example` to `.env.local` and fill those in, or paste them
   into **Trip -> Sync** in the app.
5. Sign in with your email. A link is sent; open it on that device. Repeat on
   the phone with the same address.

Notes:

- The anon key is public. The data is protected by row level security: every row is tied to the signed-in user.
- Whichever device saved most recently wins. There is no per-field merging, so
  avoid editing the same trip on both devices while offline.
- Images are uploaded to the storage bucket on first sync and replaced by a URL so the trip document stays small.
- It's a free Supabase project, so it'll pause after about a week of no use. If sync stops,
  open the Supabase dashboard once to wake it.

## Contents

| File | Purpose |
| --- | --- |
| `src/App.jsx` | Shell, tab state, shared context |
| `src/store.js` | localStorage load/save, export/import |
| `src/supabase.js` | Client creation and credential storage |
| `src/sync.js` | Pull/push, image uploads, sync status |
| `supabase/schema.sql` | Table, row level security, image bucket |
| `src/utils.js` | Distance, travel time, date and time helpers |
| `src/categories.js` | Categories, travel modes, per-type colours |
| `src/components/CollectionPage.jsx` | Shared list + form for the three collections |
| `src/components/MapView.jsx` | Leaflet map, category filters |
| `src/components/Itinerary.jsx` | Day schedule |
