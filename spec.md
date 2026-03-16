# DirectNest

## Current State
A SearchPage exists at `/search` with basic filter UI (state, property type, listing type, bedrooms, max price slider, amenities, verified-only checkbox). Filtering is triggered manually by clicking the Search button. All data comes from `mockDisplayProperties`.

## Requested Changes (Diff)

### Add
- Min price input alongside max price to form a full price range filter
- Auto-apply filters on any filter change (real-time filtering without needing to click Search)
- Sort options: Price Low-High, Price High-Low, Newest, Most Bedrooms
- Active filter count badge on mobile filter toggle
- Clear All Filters button that resets all filters at once

### Modify
- Search page layout: sidebar (desktop) + collapsible filter panel (mobile) with results in main area
- Price filter: replace single max-price slider with min/max price inputs + a range slider
- Results header: show count, sort dropdown, and active filter tags
- Filter state should persist in URL query params so search results are shareable/bookmarkable

### Remove
- Manual Search button as primary trigger (keep it, but filters also auto-apply)

## Implementation Plan
1. Update SearchPage to use URL query params (`useSearchParams`) to store filter state
2. Replace price slider with a min/max dual input + optional slider for price range
3. Add sort select with options: newest, price-asc, price-desc, bedrooms-desc
4. Add sidebar layout on desktop (filters left, results right) and collapsible filter sheet on mobile
5. Add "Clear All" button and active filter tags with individual remove badges
6. Wire auto-filtering: filter logic runs on every state change (no separate doSearch trigger)
