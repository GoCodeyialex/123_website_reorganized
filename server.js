const express = require('express');
const EventSource = require('eventsource');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

const targetUrl = 'https://v2.kaj789.com/sse';
const apiUrl2 = 'https://v2.kaj789.com/api/';
const token = 'Bearer 6^tN;HXr%_,AdY?N}dX,Qt2hZ!z6v</12i@SE;T=}Rka3R$zmo';

app.use(cors());

app.get('/getData', async (req, res) => {
    const { name } = req.query;
    const url = apiUrl2 + name;
    const apiResponse = await axios.get(url,{
      headers: {
        'Authorization': token
      }
    });

    res.json(apiResponse.data);
});


app.get('/api', async (req, res) => {
    const eventSource = new EventSource(targetUrl, {
      headers: {
        'Authorization': token
      }
    });

    const response = await axios.get('https://api.kaj789.com/api/call');
    const apiData = response.data.filter(entry => entry.name && entry.name.startsWith("123"));

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.write(`data: ${JSON.stringify(apiData)}\n\n`);

    eventSource.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
  
      if (eventData.name.startsWith("123")) {
        res.write(`data: ${JSON.stringify(eventData)}\n\n`);
      }
    };
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
