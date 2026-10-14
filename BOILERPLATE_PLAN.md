# Boilerplate plan: designers build pages from the design system with an AI agent

Notes from the planning discussion (2026-10-03). Nothing here is built yet.

## Goal

A designer says "I want a new page in Email Inbox with X, Y and Z". The AI agent reads a skill file, uses the components from the design system, and builds the page. Designers are not code-savvy, so every technical step must be hidden behind plain-language requests.

## Decisions so far

- **React.** The Vue repo from the developers is not used. The design system stays React, built from the HOT Design System Figma file (this project).
- **Two repos.**
  - `HOT-Storybook`: the design system code, tokens, icons and the Storybook. Only the maintainer changes it. It gets numbered releases (tags such as `v0.4.0`) and the Storybook is hosted from it, so the Storybook is always the newest.
  - `Omni-Boilerplate`: what designers clone. It holds page layouts, example pages, mock data and the skill file. It installs the design system as a read-only dependency.
- **Why not one repo:** every prototype would carry its own frozen copy of the components, the agent could quietly edit a component, design system and page changes would mix, every prototype would carry extra files, hosting would need care, and there would be no version number to tell which design system a prototype uses.
- **The link:** one line in the boilerplate's `package.json` points at `HOT-Storybook` and a version, for example `"@hot/ui": "github:your-org/HOT-Storybook#v0.4.0"`. Pages import from it, for example `import { Button } from '@hot/ui'`. Start with a GitHub link and move to a package registry (npm or GitHub Packages) later if installs get slow.
- **A catalogue file** (component names, props, when to use each) ships inside the design system package. The skill file tells the agent to read it before building a page.

## How a designer starts

1. In Claude Code, say: "Clone the boilerplate repo using [link], install it, and run the dev server." The install step downloads the design system automatically. The designer never clones `HOT-Storybook`.
2. Say what page they want. The agent builds it from the components.
3. Say "publish this to my GitHub as [repo name]". The agent connects their new empty repo and pushes. Netlify or Vercel hosts it from there.
4. Whenever they want the newest components, say "update the design system". New prototypes get the newest version on creation. Prototypes in progress stay as they are until asked.

The maintainer says "release a new version" in the `HOT-Storybook` repo. The agent tags the release and writes a plain-language "what's new" note.

## To build: CLAUDE.md for the boilerplate (the skill file)

The boilerplate needs a short `CLAUDE.md` at its root. It is the skill file we planned, with a **getting started section at the top** so day one works smoothly.

**Getting started section (first, short):**
- How to install the project, which also pulls in the design system.
- How to start the dev server.
- What "publish this" means and how to do it: connect the designer's own GitHub repo and push.
- What "update the design system" means and how to do it, ending with a plain-language summary of what changed.

**Then the building rules:**
- Use only design-system components. Never edit them. Never invent new ones.
- Tokens only for colors and fonts. No raw values.
- Which page layout to start from, where files and routes go, and which mock data to use.
- If no component fits, report the gap clearly instead of inventing. The gaps become the design system backlog.
- Read the component catalogue before building.

## Still to build, in order

1. Turn this project into the `HOT-Storybook` library: library build, exports for components, tokens and icons, first version tag, hosted Storybook.
2. Remaining Figma components (checked 2026-10-03): Progress bar, Toast (Figma page "Banners"), Skeleton, Compact Button, Tags input and Phone input (Input Fields page), and Modal (Figma page "Modal (Design Internal)", many designs, needs a closer look first). Not for building: "Misc (Design Internal)" is loader experiments, "Page 23" is captured product buttons, "Rough" is empty, and the old "Input field", "Dropdown Menu" and "Old One" banner sets are older designs.
   - The Figma **"Rules"** page holds four design rules that belong in the skill file: always have a hover state for everything; show a tooltip after a slight delay when hovering active icons, and never block actions; tags and avatars always use value 300 for surface and 800 for text; in a component with inputs, the first input is active by default with a blinking cursor.
   - The Figma **"Componentes"** page (78 items) is the source for organisms and page layouts: Left Main Nav, Main Nav (44px), Left Nav, Side Nav_New, Activities / Notes panel (340px), Setup Guide Dropdown, All views, Team, SM_Section and about 15 full 1440x812 screens ("1" to "12", "Desktop - 4/5/6", "Main Designs").
3. Organisms from the real product screens (navigation, conversation list, conversation header, reply composer, details panel).
4. Page layouts (app shell with named regions, then page types such as three-pane inbox, settings, admin table).
5. About five example pages built only from components.
6. The generated catalogue file, and the `CLAUDE.md` above.
7. Guardrails: a check against raw colors and fonts, a check that only design-system components are imported, a screenshot comparison against the Storybook.
8. Test with about ten real designer requests and tune the skill.

## Last step (idea, 2026-10-10): write a finished prototype back to Figma

**Problem.** A designer can build a whole flow as an AI prototype without opening Figma, but devs ask for a Figma link to feed their own AI agent. Asking an AI agent to redraw the prototype in Figma works, but it is slow and uses a lot of tokens.

**Idea.** Make the conversion mechanical, with no AI in the loop:

1. Every Storybook component renders a marker with its name and props (for example `data-hot="Button"` plus variant, size, state). A one-time change inside each component.
2. A capture step (a Chrome extension, or a Playwright script that visits each screen and state) walks the rendered page. For marked components it records the name and props; for everything else it records layout from computed styles (direction, gap, padding, size) and text.
3. The result is a JSON tree of design-system components and auto-layout frames.
4. A plain Figma plugin (no AI) reads the JSON: imports each component from the DS library by key, sets variant properties and text, builds frames with auto-layout, and binds colours to the Figma variables.

Why it should work here: component props were built from the Figma variants, icon names match, and the Storybook tokens are generated from the Figma variables, so every lookup is a plain mapping.

**Related options.**
- Limit prototypes to design-system components and layout only (no custom CSS), so each page is a tree of components and conversion is trivial. Anything custom becomes a plain frame, flagged for a designer.
- Or skip Figma for the handoff: give devs the prototype link and an exported component and props spec their agent can read. Worth checking whether "devs need Figma" is a real requirement. (Their product is Vue, ours is React, so the code itself is not reusable, but the structure and tokens are.)
- Figma Code Connect maps Figma components to code, mostly Figma to code, so it helps with the mapping table only.
- Tools like html.to.design capture a page as raw frames, not as design-system instances.

**Known limits.** Auto-layout from computed CSS is imperfect on complex or absolutely positioned layouts; Figma shows one frame per screen and state, not live behaviour; anything outside the design system needs a fallback; components added in a prototype but missing in Figma.

**First step when we get here.** A spike on one screen end to end (for example the Page layout with the Conversations sidebar), and have a designer judge whether the Figma output is close enough to hand to devs.

## Open questions

- Are the repos private or public? If `HOT-Storybook` is private, designers must be members of the GitHub organisation and sign in once, and Netlify or Vercel need an access token. Making it public removes that friction.
- GitHub organisation or username.
- Will designers use Claude Code on the desktop app?
- How many designers, and how long do prototypes live? (Decides how strongly two repos pay off.)
- Is the earlier React prototype `Omni Boilerplate Final` a good base for `Omni-Boilerplate`? To check before starting.
