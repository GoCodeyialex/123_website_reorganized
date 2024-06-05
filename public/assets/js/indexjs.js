function fetchData(endpoint, elementClass) {
  const eventSource = new EventSource(endpoint);

  eventSource.onmessage = function (event) {
    const data = JSON.parse(event.data);
    const classMap = {
      "123快乐十分": elementClass,
      "123赛车": ".result2",
      "123快三": ".result3",
      "123时时彩": ".result4",
      "123快乐8": ".result5",
      "123PC蛋蛋": ".result6",
      "123飞艇": ".result7",
      "123十一选五": ".result8",
      "123六合彩": ".result9",
    };

    const process = (item, fn) => fn(item, classMap[item.name]);

    (Array.isArray(data) ? data : [data]).forEach((item) =>
      process(item, processResultInitial)
    );
    !Array.isArray(data) && process(data, processResult);
  };

  eventSource.onerror = function (error) {
    console.error("Error fetching data from SSE server:", error);
    setTimeout(function () {
      fetchData(endpoint, elementClass);
    }, 2000);
  };
}

function processResultInitial(data, elementClass) {
  const numbers = data.number.split(",");
  const $element = $(elementClass);
  $element.css("display", "none");
  $element.empty();

  const $boldTxt = $('<div class="maintxt4"></div>');
  const $boldSpan = $('<span class="boldtxt"></span>').text(data.name);
  const $unixTimeSpan = $('<span class="unixtime"></span>').text(data.unixtime);
  $boldTxt.append($boldSpan).append(", ").append($unixTimeSpan);
  $element.append($boldTxt);

  numbers.forEach(function (number) {
    const $resultnum = $('<div class="resultnum"></div>').text(number.trim());
    $element.append($resultnum);
  });

  const $nextlotteryText = $('<div class="maintxt2">NEXT LOTTERY TIME: </div>');
  $element.append($nextlotteryText);

  const nextUnixTime = data.nextUnixtime;
  const $nextlotteryContainer = $('<div class="nextlottery-container"></div>');
  const $nextlotteryUnixTime = $('<span class="maintxt3"></span>').text(
    nextUnixTime
  );
  const $nextCountdownSpan = $('<span class="maintxt3"></span>');
  $nextlotteryContainer
    .append($nextlotteryUnixTime)
    .append(" ")
    .append($nextCountdownSpan);
  $element.append($nextlotteryContainer);

  function updateTimeLeft() {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeLeft = nextUnixTime - currentTime;

    if (timeLeft > 0) {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      const formattedTime = `${minutes < 10 ? "0" : ""}${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
      $nextCountdownSpan.text(formattedTime);
    } else {
      $nextCountdownSpan.text("00:00");
      clearInterval(countdownInterval);
    }
  }

  const countdownInterval = setInterval(updateTimeLeft, 1000);

  updateTimeLeft();

  $element.fadeIn(300);
}

function processResult(data, elementClass) {
  const numbers = data.number.split(",");
  const $element = $(elementClass);
  $element.css("display", "none");
  $element.empty();
  const $boldTxt = $('<div class="maintxt4"></div>');
  const $boldSpan = $('<span class="boldtxt"></span>').text(data.name);
  const $unixTimeSpan = $('<span class="unixtime"></span>').text(
    data.resultopen.unixtime
  );
  $boldTxt.append($boldSpan).append(", ").append($unixTimeSpan);
  $element.append($boldTxt);

  numbers.forEach(function (number) {
    const $resultnum = $('<div class="resultnum"></div>').text(number.trim());
    $element.append($resultnum);
  });

  const $nextlotteryText = $('<div class="maintxt2">NEXT LOTTERY TIME: </div>');
  $element.append($nextlotteryText);

  const nextUnixTime = data.next[0].resultopen.unixtime;
  const $nextlotteryContainer = $('<div class="nextlottery-container"></div>');
  const $nextlotteryUnixTime = $('<span class="maintxt3"></span>').text(
    nextUnixTime
  );
  const $nextCountdownSpan = $('<span class="maintxt3"></span>');
  $nextlotteryContainer
    .append($nextlotteryUnixTime)
    .append(" ")
    .append($nextCountdownSpan);
  $element.append($nextlotteryContainer);

  function updateTimeLeft() {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeLeft = nextUnixTime - currentTime;

    if (timeLeft > 0) {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      const formattedTime = `${minutes < 10 ? "0" : ""}${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
      $nextCountdownSpan.text(formattedTime);
    } else {
      $nextCountdownSpan.text("00:00");
      clearInterval(countdownInterval);
    }
  }

  const countdownInterval = setInterval(updateTimeLeft, 1000);

  updateTimeLeft();

  $element.fadeIn(300);
}

$(document).ready(function () {
  fetchData(
    "http://localhost:3001/api?token=07dd4d5a72f5740ef0f035f201951476",
    ".result1"
  );
});
