const apiUrl = 'http://localhost:3001/api'; // URL of your proxy server

async function fetchData() {
  try {
    const response = await fetch(apiUrl); // No need to add headers here; the proxy server handles it

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to fetch data: ${errorMessage}`);
    }

    const data = await response.json();
    console.log(data); // You can process the data here
  } catch (error) {
    console.error('Error fetching data:', error);
    // No download log functionality
  }
}

fetchData();
