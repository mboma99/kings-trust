# 12 Days of Giving - Kings Trust Charity Event

A festive charity fundraising website with real-time donation tracking.

## Features

- Real-time donation amount tracking
- Interactive timeline of events
- Festive snow animation
- Mobile-responsive design
- Individual event pages

## Deployment on Netlify

This site is optimized for deployment on Netlify's free tier.

### Quick Deploy

1. Push this repository to GitHub
2. Connect your GitHub repository to Netlify
3. Netlify will automatically detect the `netlify.toml` configuration
4. Your site will be deployed automatically

### Manual Deploy

1. Run `npm install` (optional - no build process needed)
2. Upload the contents to Netlify's drag-and-drop interface
3. The serverless function will handle donation tracking

### Local Development

To test the serverless function locally:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Start local development server
netlify dev
```

## File Structure

```
├── static/                 # Main website files
│   ├── index.html         # Homepage
│   ├── style.css          # Main styles
│   ├── main.js           # JavaScript functionality
│   ├── events.css        # Event page styles
│   └── events/           # Individual event pages
├── netlify/
│   └── functions/
│       └── funds.js      # Serverless function for donation tracking
├── netlify.toml          # Netlify configuration
└── package.json          # Node.js configuration
```

## How it Works

- The site uses a Netlify Function (`funds.js`) to scrape donation amounts from the Kings Trust website
- The main JavaScript (`main.js`) fetches this data and updates the progress bar
- All static assets are served directly from the `static` folder
- CORS is handled automatically by the serverless function

## API Endpoint

- `/.netlify/functions/funds` - Returns current donation amount in JSON format

Example response:
```json
{
  "amount": "£12,500"
}
```
