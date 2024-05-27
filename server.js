const express = require('express');
const EventSource = require('eventsource');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

const targetUrl = 'https://v2.kaj789.com/sse';
const token = 'Bearer 6^tN;HXr%_,AdY?N}dX,Qt2hZ!z6v</12i@SE;T=}Rka3R$zmo';

app.use(cors());

app.get('/api', async (req, res) => {
  try {
    const eventSource = new EventSource(targetUrl, {
      headers: {
        'Authorization': token
      }
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    eventSource.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
  
      if (eventData.name.startsWith("123")) {
        res.write(`data: ${JSON.stringify(eventData)}\n\n`);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Error connecting to SSE server:', error);
      res.status(500).send(`Error connecting to SSE server: ${error.message}`);
    };

  } catch (error) {
    console.error('Proxy server error:', error);
    res.status(500).send(`Proxy server error: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
