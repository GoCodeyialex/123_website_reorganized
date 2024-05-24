const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001; // Port for the proxy server

const targetUrl = 'https://v2.kaj789.com/sse'; // Target API URL

// Middleware to handle CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Proxy endpoint
app.get('/api', async (req, res) => {
  try {
    const response = await fetch(targetUrl, {
      headers: {
        Authorization: req.headers.authorization // Pass authorization header from client to target server
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data from target server');
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy server error:', error);
    res.status(500).send('Proxy server error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
