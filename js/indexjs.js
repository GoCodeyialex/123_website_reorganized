function fetchData(endpoint, elementClass) {
  const eventSource = new EventSource(endpoint);

  eventSource.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log(data); // Log the received data to the console

    // Only process data where the name starts with "123"
    if (data.name.startsWith("123")) {
      if (data.name === "123快乐十分") {
        processResult(data, elementClass);
      } else if (data.name === "123赛车") {
        processResult(data, ".result2");
      } else if (data.name === "123快三") {
        processResult(data, ".result3");
      } else if (data.name === "123时时彩") {
        processResult(data, ".result4");
      } else if (data.name === "123快乐8") {
        processResult(data, ".result5");
      } else if (data.name === "123PC蛋蛋") {
        processResult(data, ".result6");
      } else if (data.name === "123飞艇") {
        processResult(data, ".result7");
      } else if (data.name === "123十一选五") {
        processResult(data, ".result8");
      } else if (data.name === "123六合彩") {
        processResult(data, ".result9");
      }
    }
  };

  eventSource.onerror = function(error) {
    console.error('Error fetching data from SSE server:', error);
    setTimeout(function() {
      fetchData(endpoint, elementClass);
    }, 2000);
  };
}

// Function to process the result and update the HTML elements
function processResult(data, elementClass) {
  // Access specific properties of the data object
  const numbers = data.number.split(',');

  // Update the content of the HTML elements with the received data
  const $element = $(elementClass);
  $element.css("display", "none");

  // Clear existing content in the element
  $element.empty();

  // Create a new <div> element for the bold text
  const $boldTxt = $('<div class="maintxt4"></div>');
  const $boldSpan = $('<span class="boldtxt"></span>').text(data.name);
  const $unixTimeSpan = $('<span class="unixtime"></span>').text(data.resultopen.unixtime);
  $boldTxt.append($boldSpan).append(', ').append($unixTimeSpan);
  $element.append($boldTxt);

  // Append resultnums for each number
  numbers.forEach(function(number) {
    const $resultnum = $('<div class="resultnum"></div>').text(number.trim());
    $element.append($resultnum);
  });

  // Create and append next lottery time text and timestamp
  const $nextlotteryText = $('<div class="maintxt2">NEXT LOTTERY TIME: </div>');
  $element.append($nextlotteryText);

  const nextUnixTime = data.next[0].resultopen.unixtime;
  const $nextlotteryContainer = $('<div class="nextlottery-container"></div>');
  const $nextlotteryUnixTime = $('<span class="maintxt3"></span>').text(nextUnixTime);
  const $nextCountdownSpan = $('<span class="maintxt3"></span>');
  $nextlotteryContainer.append($nextlotteryUnixTime).append(' ').append($nextCountdownSpan);
  $element.append($nextlotteryContainer);

  // Function to update the time left
  function updateTimeLeft() {
    const currentTime = Math.floor(Date.now() / 1000); // Current Unix time in seconds
    const timeLeft = nextUnixTime - currentTime;

    if (timeLeft > 0) {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      const formattedTime = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      $nextCountdownSpan.text(formattedTime);
    } else {
      $nextCountdownSpan.text('00:00');
      clearInterval(countdownInterval); // Stop the countdown when it reaches 0
    }
  }

  // Update the time left every second
  const countdownInterval = setInterval(updateTimeLeft, 1000);

  // Initial update
  updateTimeLeft();

  // Display the container
  $element.fadeIn(300);
}

// Example usage
$(document).ready(function() {
  fetchData("http://localhost:3001/api?token=07dd4d5a72f5740ef0f035f201951476", ".result1");
});
