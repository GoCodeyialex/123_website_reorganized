
document.addEventListener('DOMContentLoaded', async function() {
        const fetchData = async() => {
                const name = document.body.getAttribute('data-name');
                const response = await fetch('http://localhost:3001/getData?name=' + name);

                const responseData = await response.json();
                const data = responseData.data[0];
                let datetime = data.resultopen.datetime;
                datetime = datetime.replace(' at ', ' ').replace(' GMT+8', '');
        
                const date = new Date(datetime);
                const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const dayName = daysOfWeek[date.getUTCDay()]; // Use getUTCDay() to match the time zone

                const formattedDatetime = `${dayName}, ${datetime}`;

                const $element = $(".txtbold");
                $element.empty();
                $element.append(data.term).append(', ').append(formattedDatetime);
                
                
                const numbers = data.number.split(',');
                const $elementnumber = $(".resultnum2");
                $elementnumber.empty();

                numbers.forEach(function(number) {
                        const $resultnum = $('<div class="resultnum2"></div>').text(number.trim());
                        $elementnumber.append($resultnum);
                });
                
                const notCurrentTerm = data.term - 1
                const previosTerm = notCurrentTerm - 20;
                const termResponse = await fetch('http://localhost:3001/getData?name=' + name + '/' + previosTerm + '/' + notCurrentTerm);
                const termData = await termResponse.json();
                const $resultTable = $('.resulttable')
                $resultTable.empty();

                termData.data.forEach((term) => {
                        const date = new Date(datetime);
                        let dateHistory = term.resultopen.datetime;
                        dateHistory = dateHistory.replace(' at ', ' ').replace(' GMT+8', '');
                        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        const dayName = daysOfWeek[date.getUTCDay()];
                        const formattedDatetime = `${dayName}, ${datetime}`;
                        
                        const numbers = term.number.split(',');

                        const $rowElement = $('<div class="row bordergray2 pb10 pt10"></div>');
                        $rowElement.append($('<div class="col-xs-5  col-md-3 mt5"></div>').text(term.term));
                        $rowElement.append($('<div class="hidden-xs  col-md-3 mt5 pr0"></div>').text(formattedDatetime));  

                        numbers.forEach(function(number) {
                                $rowElement.append($('<div class="resultnum3"></div>').text(number.trim()));
                        });

                        $resultTable.append($rowElement);

                })

                const nextUnixTime = data.next[0].resultopen.unixtime;

                function updateTimeLeft() {
                        const currentTime = Math.floor(Date.now() / 1000);
                        const timeLeft = nextUnixTime - currentTime;
                        const $countdown = $(".countdown");
                        
                        if (timeLeft > 0) {
                                const minutes = Math.floor(timeLeft / 60);
                                const seconds = timeLeft % 60;
                                const formattedTime = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                                $countdown.text(formattedTime);
                        } else {
                                fetchData();
                                $countdown.text('00:00');
                                clearInterval(countdownInterval);
                        }
                }

                const countdownInterval = setInterval(updateTimeLeft, 1000);
                
                updateTimeLeft();
                
                $element.fadeIn(300);
                $resultTable.fadeIn(300);
        }

        const loadMoreResults = async () => {
                const name = document.body.getAttribute('data-name');
                const response = await fetch('http://localhost:3001/getData?name=' + name);
                const responseData = await response.json();
                const endTerm = responseData.term - 20;
                const startTerm = endTerm - 20;

                const termResponse = await fetch('http://localhost:3001/getData?name=' + name + '/' + startTerm + '/' + endTerm);
                const termData = await termResponse.json();
                
                termData.data.forEach((term) => {
                        const date = new Date(datetime);
                        let dateHistory = term.resultopen.datetime;
                        dateHistory = dateHistory.replace(' at ', ' ').replace(' GMT+8', '');
                        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        const dayName = daysOfWeek[date.getUTCDay()];
                        const formattedDatetime = `${dayName}, ${datetime}`;
                        
                        const numbers = term.number.split(',');

                        const $rowElement = $('<div class="row bordergray2 pb10 pt10"></div>');
                        $rowElement.append($('<div class="col-xs-5  col-md-3 mt5"></div>').text(term.term));
                        $rowElement.append($('<div class="hidden-xs  col-md-3 mt5 pr0"></div>').text(formattedDatetime));  

                        numbers.forEach(function(number) {
                                $rowElement.append($('<div class="resultnum3"></div>').text(number.trim()));
                        });

                        $resultTable.append($rowElement);

                })

                console.log("hello");

        }
        
        $('.loadresult').on('click', loadMoreResults);

        fetchData();

});
