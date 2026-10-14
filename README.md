# Slack ↔ Teams Connector

A prototype of the Connected Chat Apps page, built with the Hiver (HOT) design-system components from `hot-storybook`.

```bash
npm install
npm run dev
```

| URL | Shows |
| --- | --- |
| `/` | Start page (empty). "Connect an app" opens the modal |
| `/#/connect` | The Connect modal already open |
| `/#/filled` | The page with connected apps in every status |
| `/preview-email` | The invite email preview (opened from "Preview email") |

Deployed on Vercel. `vercel.json` sends every path to `index.html` so `/preview-email` works on its own.
