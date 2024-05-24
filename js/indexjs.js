const token = 'Bearer 6^tN;HXr%_,AdY?N}dX,Qt2hZ!z6v</12i@SE;T=}Rka3R$zmo';
const apiUrl = 'https://v2.kaj789.com/sse';

async function fetchData() {
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': token
      }
    });

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
