const https = require('https');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const donationUrl = 'https://events.kingstrust.org.uk/fundraisers/theworldpaymakers';

    // Make the HTTP request
    const htmlContent = await new Promise((resolve, reject) => {
      const req = https.get(donationUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      });

      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });

    // Simple HTML parsing without external dependencies
    // Look for the pattern: <h3 class="money mt0"><strong>£amount</strong>
    const moneyRegex = /<h3[^>]*class="money mt0"[^>]*>.*?<strong[^>]*>(£[\d,]+(?:\.\d{2})?)<\/strong>/i;
    const match = htmlContent.match(moneyRegex);

    let amount = 'Not found';
    if (match && match[1]) {
      amount = match[1];
    }

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    };

  } catch (error) {
    console.error('Error scraping funds:', error);

    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 'Error loading funds',
        error: error.message
      }),
    };
  }
};
