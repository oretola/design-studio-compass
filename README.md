# Design Studio Compass

An internal hub that organizes the DJDS design team's templates, guides, and
resources around the 7-phase architecture design process and links out to the
files in Google Drive.

This is a one-day hackathon v1: a single static page, no framework, no build step.

## Files
- `index.html` — page structure (sign-in gate + dashboard)
- `styles.css` — styling
- `app.js` — view logic (phase/type/need views, search, filters)
- `data.js` — all placeholder data + the shared team password

## Run locally
Just open `index.html` in a browser, or serve the folder:

```
npx serve .
```

## Deploy to Vercel
It's a plain static site, so no config is needed:

1. Push this folder to a Git repo (or run `vercel` from the folder).
2. Import it in Vercel — it auto-detects a static project.
3. Deploy. That's it.

## Password
The shared team password lives in `data.js` as `TEAM_PASSWORD` (currently
`djds2026`). Change it there.

⚠️ This is a client-side gate for a demo, not real security — the password is
visible in the source. For real protection, move to a Vercel password / auth
layer later.

## Notes
- All data is made-up placeholder; the Drive links are dummy `PLACEHOLDER` URLs.
- Swap real Drive folder/file links into `data.js` when ready.
- Concept Development is the fully fleshed-out phase (4 subphases); the other
  six carry a few sample resources each.
