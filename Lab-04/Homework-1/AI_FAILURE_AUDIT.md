# Homework 1 — AI failure audit

Only observed findings are listed. Each entry records the AI output, the bug,
how it was detected and the fix.

| # | AI output | Bug observed | Detection | Fix |
|---|---|---|---|---|
| 1 | `CategoryFilter` set `aria-current="page"` on the active filter pill | The header `NavLink` already sets `aria-current="page"`, so two elements claimed to be the current page | DevTools Elements: two `[aria-current=page]` nodes on `/gallery` | Changed the pill to `aria-current="true"` |
| 2 | Lightbox image CSS `width: 100%; aspect-ratio: 16 / 9` | On a laptop screen the dialog was taller than the viewport; the Source row was hidden behind an inner scrollbar | Opened `?photo=p01` at 1920×1080 and saw the dialog scrollbar | Added `max-height: 50dvh` (first tried 60dvh, still overflowed) |
| 3 | Claimed only the first 3 thumbnails load initially because the rest use `loading="lazy"` | At 375px Chrome fetched 7 of 9 thumbnails on load: lazy images inside Chrome's distance threshold are fetched early | DevTools Network, Img filter, reload | Corrected the claim in the README; code unchanged (behaviour is by design) |