const express = require('express');
const EventSource = require('eventsource');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001; // Port for the proxy server

const targetUrl = 'https://v2.kaj789.com/sse'; // Target SSE endpoint
const token = 'Bearer 6^tN;HXr%_,AdY?N}dX,Qt2hZ!z6v</12i@SE;T=}Rka3R$zmo'; // Authorization token

app.use(cors());

// Proxy endpoint
app.get('/api', async (req, res) => {
  try {
    // Create a new EventSource instance to connect to the SSE endpoint
    const eventSource = new EventSource(targetUrl, {
      headers: {
        'Authorization': token
      }
    });

    // Set the appropriate Content-Type header for SSE responses
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Set up event listeners for different types of events
    eventSource.onmessage = (event) => {
      // Send the received data as the response to the client
      const eventData = JSON.parse(event.data);
      
      // Check if the name starts with "123"
      if (eventData.name.startsWith("123")) {
        // Send the received data as the response to the client
        res.write(`data: ${JSON.stringify(eventData)}\n\n`); // Send SSE data
      }
    };

    eventSource.onerror = (error) => {
      // Log any errors that occur during the SSE connection
      console.error('Error connecting to SSE server:', error);
      // Send an error response to the client
      res.status(500).send(`Error connecting to SSE server: ${error.message}`);
    };

  } catch (error) {
    console.error('Proxy server error:', error);
    res.status(500).send(`Proxy server error: ${error.message}`);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
