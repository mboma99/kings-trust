// Simple test script to verify the scraping logic works
// This can be run with Node.js to test the function

const https = require('https');

async function testFunds() {
  try {
    const donationUrl = 'https://events.kingstrust.org.uk/fundraisers/theworldpaymakers';

    console.log('Testing donation scraping...');

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

    // Simple HTML parsing
    const moneyRegex = /<h3[^>]*class="money mt0"[^>]*>.*?<strong[^>]*>(£[\d,]+(?:\.\d{2})?)<\/strong>/i;
    const match = htmlContent.match(moneyRegex);

    if (match && match[1]) {
      console.log('✅ Successfully scraped amount:', match[1]);
    } else {
      console.log('❌ Could not find donation amount');
      console.log('First 500 chars of HTML:', htmlContent.substring(0, 500));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testFunds();
}

module.exports = testFunds;
