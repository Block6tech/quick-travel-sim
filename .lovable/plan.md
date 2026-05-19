## Goal
Show the splash screen only on the very first site load, not on every page navigation.

## Root cause
In `src/App.tsx`, `showSplash` is initialized to `true` on every mount of `App`. While `App` shouldn't normally remount during in-app navigation, it does re-trigger on full page loads (refresh, external link, opening a deep link like `/plans/GB`). The splash has no persistence check, so any fresh load shows it again.

## Change
Persist a "splash already shown" flag in `sessionStorage` so the splash only plays once per browser session (first visit/tab open), and never again until the tab is closed.

### `src/App.tsx`
- Initialize `showSplash` from `sessionStorage.getItem("splashShown") !== "1"`.
- In the existing `useEffect` timer, when hiding the splash, also set `sessionStorage.setItem("splashShown", "1")`.
- If `showSplash` starts as `false`, skip the timer entirely.

This keeps the splash for true first-time loads and removes it on all subsequent navigations/refreshes within the session.

## Out of scope
No changes to `SplashScreen.tsx`, routing, or animations.
