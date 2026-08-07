# Trip Planner

A location-agnostic trip planner. Collect restaurants, experiences and places
first, then build a day-by-day itinerary from what you have collected.

All data is stored in the browser's `localStorage` on the device you are using.
Nothing is sent anywhere.

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

## On the phone

The build includes a web app manifest and a service worker. Once the site is
served over HTTPS (or from `localhost`), open it in Safari, then Share → Add to
Home Screen. It launches full screen and works offline; map tiles you have
already viewed stay cached.

## Syncing between devices

The app works fully without this — everything is written to the device first, so
it keeps working with no signal. Sync just keeps the laptop and the phone
showing the same trip.

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste in `supabase/schema.sql`, and run it.
   This creates the table, locks it down so only you can read your own row, and
   makes an image bucket.
3. In **Settings → API**, copy the **Project URL** and the **anon** key.
4. Either copy `.env.example` to `.env.local` and fill those in, or paste them
   into **Trip → Sync** in the app.
5. Sign in with your email. A link is sent; open it on that device. Repeat on
   the phone with the same address.

Notes:

- The anon key is meant to be public. Row level security is what protects the
  data: every row is tied to the signed-in user.
- Whichever device saved most recently wins. There is no per-field merging, so
  avoid editing the same trip on both devices while offline.
- Images are uploaded to the storage bucket on first sync and replaced by a URL,
  so the trip document itself stays small.
- Free Supabase projects pause after about a week of no use. If sync stops,
  open the Supabase dashboard once to wake it.

`Export file` / `Import file` under **Trip → Backup** still work, and are worth
doing before you travel.

## Structure

| Path | Purpose |
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

The three collections (restaurants, experiences, locations) all render through
`CollectionPage`; each supplies its own categories, extra form fields and meta
line. To add a field to one of them, edit its wrapper, not the shared page.

Distances are straight-line from the accommodation, scaled by a detour factor
and divided by the travel mode's average speed. They are estimates. Any value
typed into an item's "Travel time" field overrides the estimate.
