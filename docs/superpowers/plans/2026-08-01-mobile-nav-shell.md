# Mobile Nav Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the responsive breakpoint infrastructure and mobile navigation shell (bottom tab bar + "More" sheet + adjusted top bar) to `Uber Pulse.dc.html`, per `docs/superpowers/specs/2026-08-01-mobile-support-design.md`, step 1 of 8.

**Architecture:** This is a single-file app (`Uber Pulse.dc.html`) rendered by a small React-based runtime (`support.js`, generated from `dc-runtime`). The template lives inside `<x-dc>...</x-dc>` using `{{ prop }}` bindings and `sc-if`/`sc-for` directives; a `class Component extends DCLogic` at the bottom of the file (inside `<script type="text/x-dc" data-dc-script">`) holds real React state and a `renderVals()` method that computes every `{{ prop }}` the template uses. This is a genuinely interactive app, not a static mockup — new behavior (opening/closing the "More" sheet) needs real state + handlers, wired the same way `askPulseSheetOpen`/`openAskPulseSheet` already are.

The nav shell itself is CSS-only for the breakpoint switch (a `<style>` block with `@media (max-width:900px)`), plus new markup for the bottom tab bar and "More" sheet, plus new state/handlers for the sheet's open/closed state. No existing desktop markup, state, or behavior is removed or restructured — this is additive.

**Tech Stack:** Plain HTML/CSS, a `text/x-dc` templated React runtime (no npm build step in this repo — `support.js` is pre-generated and not edited here), no test framework (this is a vibe-coded prototype). Verification is manual, via opening the file in a browser and resizing.

---

## Before you start

Open `Uber Pulse.dc.html` directly in a browser (`file://` path, or any static file server) after each step to verify. There is no build step — editing the file is the deploy.

Reference line numbers below are from the file as of commit `bde635b`; if prior tasks in this plan have shifted lines, use the `grep`/context shown in each step to relocate, not the raw numbers.

---

### Task 1: Add mobile-menu state and handlers

**Files:**
- Modify: `Uber Pulse.dc.html` (state block ~line 1978, handler block ~line 2013)

- [ ] **Step 1: Add `mobileMoreOpen` to component state**

Find the `state = { ... }` block (starts around line 1978, begins `screen:'app', loginEmail:'', ...`). Add `mobileMoreOpen:false,` right after the `askPulseSheetOpen: false,` line:

```js
    askPulseSheetOpen: false,
    mobileMoreOpen: false,
```

- [ ] **Step 2: Add open/close handlers for the mobile sheet**

Find `closeAskPulseSheet = () => this.setState({askPulseSheetOpen:false, attachMenuOpen:false});` (around line 2016). Add two new handlers directly after it:

```js
  closeAskPulseSheet = () => this.setState({askPulseSheetOpen:false, attachMenuOpen:false});
  openMobileMore = () => this.setState({mobileMoreOpen:true});
  closeMobileMore = () => this.setState({mobileMoreOpen:false});
```

- [ ] **Step 3: Close the mobile sheet whenever navigation happens**

Every `go*` handler (`goHome`, `goCatalog`, `goAssistant`, `goRoadmap`, `goReport`, `goContribute`, `goDeveloper`, `goDocs`) currently calls `this.setState({...})` with a set of fields to reset. Add `mobileMoreOpen:false` to each of these calls so tapping a nav item — including one inside the "More" sheet — closes the sheet. Example for `goHome` (around line 2010):

```js
  goHome = () => this.setState({appScreen:'home', selectedEntryId:null, selectedPipelineId:null, mobileMoreOpen:false});
```

Apply the same `mobileMoreOpen:false` addition to the other seven `go*` handlers (`goCatalog`, `goAssistant`, `goRoadmap`, `goReport`, `goContribute`, `goDeveloper`, `goDocs`), each of which is a single-line or multi-line `setState({...})` call you can find by searching for `goCatalog =`, `goAssistant =`, etc. Also add it to `openAskPulseSheet` (so opening Ask Pulse from the More sheet closes the sheet):

```js
  openAskPulseSheet = () => this.setState({askPulseSheetOpen:true, attachMenuOpen:false, mobileMoreOpen:false});
```

- [ ] **Step 4: Verify by reading the diff**

Run: `git diff "Uber Pulse.dc.html" | grep -c "mobileMoreOpen:false"`
Expected: `9` (8 `go*` handlers + `openAskPulseSheet`), plus the state declaration and the two new handler lines are additional (not counted by this grep since they don't match `mobileMoreOpen:false` exactly — the state line is `mobileMoreOpen:false,` which does match, so expect `10`).

Actually run it and confirm the count is at least 9 (one per navigation-closing call) — don't hardcode trust in the exact number, eyeball the diff with `git diff "Uber Pulse.dc.html"` and confirm every `go*` handler and `openAskPulseSheet` got the addition.

- [ ] **Step 5: Commit**

```bash
git add "Uber Pulse.dc.html"
git commit -m "Add mobile nav sheet state and handlers"
```

---

### Task 2: Expose new props from renderVals()

**Files:**
- Modify: `Uber Pulse.dc.html` (`renderVals()` return block, ~line 2508-2530)

- [ ] **Step 1: Add a screen-title lookup and "more" active flag**

Find the top of `renderVals()` (around line 2242-2245, right after `const s = this.state;` and the `navStyle` const). Add two new consts right after the `navStyle` definition:

```js
    const navStyle = (active) => 'display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;text-align:left;background:'+(active?'#F6F6F6':'none')+';border:none;color:'+(active?'#0A0A0A':'#6B6B6B')+';font-weight:'+(active?'700':'500')+';border-radius:10px;padding:10px 12px;font-size:13.5px;cursor:pointer;';
    const MOBILE_SCREEN_TITLES = { home:'Home', catalog:'Data Catalog', assistant:'AI Assistant', roadmap:'Roadmap', developer:'Developer Tools', report:'Report Issue', contribute:'Contribute', docs:'Documentation' };
    const mobileScreenTitle = MOBILE_SCREEN_TITLES[s.appScreen] || 'Pulse for Uber';
    const mobileMoreActive = ['assistant','developer','report','contribute','docs'].includes(s.appScreen);
    const mobileNavStyle = (active) => 'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;flex:1;min-height:48px;background:none;border:none;color:'+(active?'#0A0A0A':'#6B6B6B')+';font-weight:'+(active?'700':'500')+';font-size:10.5px;cursor:pointer;padding:6px 4px;';
```

- [ ] **Step 2: Add the new props to the returned object**

Find the line `askPulseSheetOpen: s.askPulseSheetOpen, openAskPulseSheet: this.openAskPulseSheet,` (around line 2522). Add the mobile nav props directly after the `askPulseSheetTitle` line that follows it:

```js
      askPulseSheetOpen: s.askPulseSheetOpen, openAskPulseSheet: this.openAskPulseSheet,
      closeAskPulseSheet: this.closeAskPulseSheet, expandAskPulseSheet: this.expandAskPulseSheet,
      askPulseSheetTitle: activeChatSession ? activeChatSession.title : 'Ask Pulse',
      mobileMoreOpen: s.mobileMoreOpen, openMobileMore: this.openMobileMore, closeMobileMore: this.closeMobileMore,
      mobileScreenTitle, mobileMoreActive,
      mobileNavStyle_home: mobileNavStyle(s.appScreen==='home'), mobileNavStyle_catalog: mobileNavStyle(s.appScreen==='catalog'),
      mobileNavStyle_roadmap: mobileNavStyle(s.appScreen==='roadmap'), mobileNavStyle_more: mobileNavStyle(mobileMoreActive),
```

- [ ] **Step 3: Verify by reading the diff**

Run: `git diff "Uber Pulse.dc.html"`
Expected: the new consts and the new returned props are present, nothing else in `renderVals()` changed.

- [ ] **Step 4: Commit**

```bash
git add "Uber Pulse.dc.html"
git commit -m "Expose mobile nav props from renderVals"
```

---

### Task 3: Add the responsive CSS

**Files:**
- Modify: `Uber Pulse.dc.html` (`<style>` block inside `<helmet>`, lines 15-25)

- [ ] **Step 1: Add breakpoint CSS classes**

Find the closing `</style>` tag inside `<helmet>` (around line 25, right after the `.pulse-tt:hover .pulse-tt-bubble` rule). Insert new rules before it:

```css
    .pulse-tt:hover .pulse-tt-bubble { visibility:visible; opacity:1; }

    .pulse-bottom-nav, .pulse-mobile-sheet-overlay { display:none; }
    .pulse-mobile-title { display:none; }

    @media (max-width:900px) {
      .pulse-desktop-sidebar { display:none !important; }
      .pulse-desktop-topbar-wordmark { display:none !important; }
      .pulse-desktop-topbar-askpulse-label { display:none !important; }
      .pulse-desktop-topbar-account-label { display:none !important; }
      .pulse-mobile-title { display:block !important; }
      .pulse-content-shell { max-width:none !important; padding:20px 16px 88px 16px !important; }
      .pulse-bottom-nav {
        display:flex; position:fixed; left:0; right:0; bottom:0; height:60px;
        background:#FFFFFF; border-top:1px solid #E5E5E5; z-index:30; box-sizing:border-box;
      }
      .pulse-mobile-sheet-overlay {
        display:flex; position:fixed; inset:0; background:rgba(10,10,10,0.4); z-index:40;
        align-items:flex-end; justify-content:center;
      }
      .pulse-mobile-sheet {
        background:#FFFFFF; width:100%; max-width:600px; border-radius:16px 16px 0 0;
        padding:8px 12px 24px 12px; box-sizing:border-box; max-height:70vh; overflow-y:auto;
      }
      .pulse-mobile-sheet button {
        min-height:44px;
      }
    }
```

- [ ] **Step 2: Verify by reading the diff**

Run: `git diff "Uber Pulse.dc.html"`
Expected: only the new CSS block is added inside `<style>`, nothing else changed.

- [ ] **Step 3: Commit**

```bash
git add "Uber Pulse.dc.html"
git commit -m "Add responsive breakpoint CSS for mobile nav shell"
```

---

### Task 4: Mark up desktop sidebar/topbar with the new classes, add page-title span

**Files:**
- Modify: `Uber Pulse.dc.html` (top bar ~line 83-95, sidebar ~line 99, content wrapper ~line 136-137)

- [ ] **Step 1: Tag the top bar's wordmark, Ask Pulse label, and account label**

Find (around line 83-95):

```html
      <div style="display:flex; align-items:center; justify-content:space-between; height:60px; padding:0 28px; background:#FFFFFF; border-bottom:1px solid #E5E5E5; position:sticky; top:0; z-index:20; box-sizing:border-box;">
        <span onClick="{{ goHome }}" style="font-size:16px; font-weight:800; letter-spacing:-0.3px; color:#0A0A0A; cursor:pointer;">Pulse for Uber</span>
        <div style="display:flex; align-items:center; gap:10px;">
          <button onClick="{{ openAskPulseSheet }}" style="display:flex; align-items:center; gap:8px; background:#0A0A0A; border:none; color:#FFFFFF; border-radius:999px; padding:8px 16px; font-size:13px; font-weight:700; cursor:pointer;">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="flex-shrink:0;"><path d="M12 3l1.7 4.9L18.6 9.4l-4.9 1.7L12 16l-1.7-4.9L5.4 9.4l4.9-1.7L12 3z"/><path d="M18.5 14.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z"/></svg>
            Ask Pulse
          </button>
          <div style="display:flex; align-items:center; gap:8px; margin-left:4px; padding-left:14px; border-left:1px solid #E5E5E5; cursor:pointer;" onClick="{{ logout }}">
            <div style="width:30px; height:30px; border-radius:50%; background:#DFF3E6; color:#067A3E; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700;">PD</div>
            <div style="font-size:12px; color:#6B6B6B; line-height:1.3;">Data Consumer<div style="font-size:10px; color:#9B9B9B;">Click to log out</div></div>
          </div>
        </div>
      </div>
```

Replace it with (adds `class` attributes and a mobile page-title span; no inline styles removed, only classes added and one new span):

```html
      <div style="display:flex; align-items:center; justify-content:space-between; height:60px; padding:0 28px; background:#FFFFFF; border-bottom:1px solid #E5E5E5; position:sticky; top:0; z-index:20; box-sizing:border-box;">
        <span onClick="{{ goHome }}" class="pulse-desktop-topbar-wordmark" style="font-size:16px; font-weight:800; letter-spacing:-0.3px; color:#0A0A0A; cursor:pointer;">Pulse for Uber</span>
        <span class="pulse-mobile-title" style="font-size:15px; font-weight:800; letter-spacing:-0.3px; color:#0A0A0A;">{{ mobileScreenTitle }}</span>
        <div style="display:flex; align-items:center; gap:10px;">
          <button onClick="{{ openAskPulseSheet }}" style="display:flex; align-items:center; gap:8px; background:#0A0A0A; border:none; color:#FFFFFF; border-radius:999px; padding:8px 16px; font-size:13px; font-weight:700; cursor:pointer;">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="flex-shrink:0;"><path d="M12 3l1.7 4.9L18.6 9.4l-4.9 1.7L12 16l-1.7-4.9L5.4 9.4l4.9-1.7L12 3z"/><path d="M18.5 14.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z"/></svg>
            <span class="pulse-desktop-topbar-askpulse-label">Ask Pulse</span>
          </button>
          <div style="display:flex; align-items:center; gap:8px; margin-left:4px; padding-left:14px; border-left:1px solid #E5E5E5; cursor:pointer;" onClick="{{ logout }}">
            <div style="width:30px; height:30px; border-radius:50%; background:#DFF3E6; color:#067A3E; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700;">PD</div>
            <div class="pulse-desktop-topbar-account-label" style="font-size:12px; color:#6B6B6B; line-height:1.3;">Data Consumer<div style="font-size:10px; color:#9B9B9B;">Click to log out</div></div>
          </div>
        </div>
      </div>
```

- [ ] **Step 2: Tag the sidebar as desktop-only**

Find (around line 99):

```html
        <div style="width:232px; flex-shrink:0; background:#FFFFFF; border-right:1px solid #E5E5E5; display:flex; flex-direction:column; padding:16px 12px; position:sticky; top:60px; align-self:flex-start; height:calc(100vh - 60px); box-sizing:border-box;">
```

Replace with (adds `class="pulse-desktop-sidebar"`, nothing else changes):

```html
        <div class="pulse-desktop-sidebar" style="width:232px; flex-shrink:0; background:#FFFFFF; border-right:1px solid #E5E5E5; display:flex; flex-direction:column; padding:16px 12px; position:sticky; top:60px; align-self:flex-start; height:calc(100vh - 60px); box-sizing:border-box;">
```

- [ ] **Step 3: Tag the content wrapper so mobile CSS can widen it**

Find (around line 136-137):

```html
        <div style="flex:1; min-width:0; display:flex; flex-direction:column; min-height:0;">
          <div style="max-width:1180px; margin:0 auto; padding:32px 32px 80px 32px; width:100%; box-sizing:border-box; display:flex; flex-direction:column; flex:1; min-height:0;">
```

Replace the second line with (adds `class="pulse-content-shell"`, nothing else changes):

```html
        <div style="flex:1; min-width:0; display:flex; flex-direction:column; min-height:0;">
          <div class="pulse-content-shell" style="max-width:1180px; margin:0 auto; padding:32px 32px 80px 32px; width:100%; box-sizing:border-box; display:flex; flex-direction:column; flex:1; min-height:0;">
```

- [ ] **Step 4: Verify by reading the diff**

Run: `git diff "Uber Pulse.dc.html"`
Expected: four `class="..."` attributes added, one new `<span class="pulse-mobile-title">` added, no other text changed (no inline style values altered, no lines removed).

- [ ] **Step 5: Commit**

```bash
git add "Uber Pulse.dc.html"
git commit -m "Tag desktop nav elements with responsive classes"
```

---

### Task 5: Add the bottom tab bar and "More" sheet markup

**Files:**
- Modify: `Uber Pulse.dc.html` (end of the `isApp` block, before its closing `</sc-if>` around line 1147; the exact line will have shifted from earlier tasks — locate via the `grep` in Step 1)

- [ ] **Step 1: Locate the insertion point**

Run: `grep -n "</sc-if>$" "Uber Pulse.dc.html" | tail -5`

Find the `</sc-if>` that closes the `<sc-if value="{{ isApp }}" ...>` block opened at line 80 — it's the one immediately followed later by the login block's structure ending and then `</x-dc>`. Confirm by running:

`sed -n '1140,1150p' "Uber Pulse.dc.html"`

You should see the closing `</div>` of the two-column flex layout (sidebar + content), then the closing `</div>` of the outer `min-height:100vh` app wrapper, then `</sc-if>`, then `</x-dc>`.

- [ ] **Step 2: Insert the bottom nav and sheet before the app block's closing tags**

Immediately before the final `</div></div></sc-if>` sequence that closes the `isApp` block (i.e., insert as the last children of the outermost `isApp` wrapper `<div>`, still inside `<sc-if value="{{ isApp }}" ...>`), add:

```html
      <div class="pulse-bottom-nav">
        <button onClick="{{ goHome }}" style="{{ mobileNavStyle_home }}">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9a1 1 0 0 0 1 1h4v-6h3v6h4a1 1 0 0 0 1-1v-9"/></svg>
          <span>Home</span>
        </button>
        <button onClick="{{ goCatalog }}" style="{{ mobileNavStyle_catalog }}">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4" width="17" height="16" rx="2.5"/><path d="M3.5 9.5h17M9.5 9.5V20"/></svg>
          <span>Catalog</span>
        </button>
        <button onClick="{{ goRoadmap }}" style="{{ mobileNavStyle_roadmap }}">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3v18"/><path d="M5 4.5h11.5l-2.2 3.75L16.5 12H5"/></svg>
          <span>Roadmap</span>
        </button>
        <button onClick="{{ openMobileMore }}" style="{{ mobileNavStyle_more }}">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>
          <span>More</span>
        </button>
      </div>

      <sc-if value="{{ mobileMoreOpen }}" hint-placeholder-val="{{ false }}">
        <div class="pulse-mobile-sheet-overlay" onClick="{{ closeMobileMore }}">
          <div class="pulse-mobile-sheet" onClick="{{ stopClick }}">
            <div style="width:36px; height:4px; background:#E5E5E5; border-radius:2px; margin:6px auto 14px auto;"></div>
            <button onClick="{{ goAssistant }}" style="display:flex; align-items:center; gap:12px; width:100%; box-sizing:border-box; text-align:left; background:none; border:none; padding:12px 8px; font-size:14px; font-weight:600; color:#0A0A0A; cursor:pointer;">AI Assistant / Ask Pulse</button>
            <button onClick="{{ goDeveloper }}" style="display:flex; align-items:center; gap:12px; width:100%; box-sizing:border-box; text-align:left; background:none; border:none; padding:12px 8px; font-size:14px; font-weight:600; color:#0A0A0A; cursor:pointer;">Developer Tools</button>
            <button onClick="{{ goDocs }}" style="display:flex; align-items:center; gap:12px; width:100%; box-sizing:border-box; text-align:left; background:none; border:none; padding:12px 8px; font-size:14px; font-weight:600; color:#0A0A0A; cursor:pointer;">Documentation</button>
            <button onClick="{{ goReport }}" style="display:flex; align-items:center; gap:12px; width:100%; box-sizing:border-box; text-align:left; background:none; border:none; padding:12px 8px; font-size:14px; font-weight:600; color:#0A0A0A; cursor:pointer;">Report Issue</button>
            <button onClick="{{ goContribute }}" style="display:flex; align-items:center; gap:12px; width:100%; box-sizing:border-box; text-align:left; background:none; border:none; padding:12px 8px; font-size:14px; font-weight:600; color:#0A0A0A; cursor:pointer;">Contribute</button>
            <div style="height:1px; background:#EFEFEF; margin:8px 0;"></div>
            <button onClick="{{ logout }}" style="display:flex; align-items:center; gap:12px; width:100%; box-sizing:border-box; text-align:left; background:none; border:none; padding:12px 8px; font-size:14px; font-weight:600; color:#A93327; cursor:pointer;">Log out</button>
          </div>
        </div>
      </sc-if>
```

Note: `stopClick` already exists in the component (`stopClick = (e) => e.stopPropagation();`, used elsewhere for stopping sheet-close-on-inside-click), so no new handler is needed for it — just confirm it's already exposed in `renderVals()`'s return object (search `stopClick:` in the file); if it isn't in the returned props object yet, add `stopClick: this.stopClick,` next to the other handler exports.

Note also: the design spec calls for Pipeline Log in the More sheet too. It's reached today via the Data Catalog page's "Pipeline Log" tab (`onCatalogTabPipeline`), not a separate `appScreen`. Add it as a second catalog entry point:

```html
            <button onClick="{{ goCatalog }}" style="display:flex; align-items:center; gap:12px; width:100%; box-sizing:border-box; text-align:left; background:none; border:none; padding:12px 8px; font-size:14px; font-weight:600; color:#0A0A0A; cursor:pointer;">Data Catalog</button>
```

placed right before the "AI Assistant / Ask Pulse" button in the sheet (Pipeline Log is a tab inside Catalog, so this just gets the user to the Catalog page where both tabs are visible — no new state needed).

- [ ] **Step 3: Verify `stopClick` is exported**

Run: `grep -n "stopClick:" "Uber Pulse.dc.html"`
Expected: at least one match inside the `renderVals()` return object (not just the method definition). If only the method definition shows up, add `stopClick: this.stopClick,` to the returned props object near the other simple handler exports (e.g. next to `logout: this.logout,`).

- [ ] **Step 4: Open the file in a browser and manually verify**

Open `Uber Pulse.dc.html` in a browser, log in with the demo credentials (`pulse-demo@uber.com` / `Pulse2026`), then:

1. Resize the window below 900px wide (or use browser devtools device toolbar).
2. Confirm the left sidebar and desktop top bar wordmark/Ask-Pulse-label/account-label disappear, and a page title ("Home") appears in the top bar instead.
3. Confirm a bottom tab bar with Home / Catalog / Roadmap / More appears, fixed to the bottom.
4. Tap "More" — confirm a bottom sheet slides up with Data Catalog, AI Assistant / Ask Pulse, Developer Tools, Documentation, Report Issue, Contribute, Log out.
5. Tap outside the sheet (on the dark overlay) — confirm it closes.
6. Tap "Roadmap" in the bottom bar — confirm it navigates and the "Roadmap" tab is now highlighted (bold/dark) in the bottom bar, and the top-bar title updates to "Roadmap".
7. Open "More" again, tap "AI Assistant / Ask Pulse" — confirm it navigates to the Assistant screen and the sheet closes, and the bottom bar's "More" tab shows as active (bold) since Assistant is one of the "more" screens.
8. Resize back above 900px — confirm the desktop sidebar, top bar wordmark, Ask Pulse button label, and account label all reappear exactly as before, and the bottom tab bar disappears.

- [ ] **Step 5: Commit**

```bash
git add "Uber Pulse.dc.html"
git commit -m "Add mobile bottom tab bar and More sheet"
```

---

### Task 6: Update the backlog

**Files:**
- Modify: `backlog.txt`

- [ ] **Step 1: Note progress on the mobile support item**

Per CLAUDE.md, only remove a backlog item once it's fully done — this plan covers step 1 of 8 from the design doc, so the item stays, but change its status to reflect it's underway. Find:

```
[open] Mobile support — make sure the site is mobile compatible
```

Replace with:

```
[in progress] Mobile support — make sure the site is mobile compatible. See docs/superpowers/specs/2026-08-01-mobile-support-design.md. Step 1/8 (nav shell) done.
```

- [ ] **Step 2: Commit**

```bash
git add backlog.txt
git commit -m "Mark mobile support in progress after nav shell step"
```
