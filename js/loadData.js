document.addEventListener('DOMContentLoaded', async function() {
        let currentEndTerm = null;
        let displayResult = 20;
    
        const fetchData = async () => {
            try {
                const name = document.body.getAttribute('data-name');
                const response = await fetch(`http://localhost:3001/getData?name=${name}`);
                const responseData = await response.json();
                const data = responseData.data[0];
                updateCurrentResults(data);
                currentEndTerm = data.term - 1;
                await updateResults(name, currentEndTerm, displayResult);
    
                const nextUnixTime = data.next[0].resultopen.unixtime;
                setupCountdown(nextUnixTime);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        const updateCurrentResults = (data) => {
            const formattedDatetime = formatDatetime(data.resultopen.datetime);
            $(".txtbold").empty().append(`${data.term}, ${formattedDatetime}`);
    
            const numbers = data.number.split(',');
            const $elementnumber = $(".resultnum2").empty();
            numbers.forEach(number => {
                $elementnumber.append($('<div class="resultnum2"></div>').text(number.trim()));
            });
        };

        const updateResults = async (name, endTerm, displayResult) => {
                try {
                    const startTerm = endTerm - displayResult;
                    const termResponse = await fetch(`http://localhost:3001/getData?name=${name}/${startTerm}/${endTerm}`);
                    const termData = await termResponse.json();
                    const $resultTable = $('.resulttable');

                    $resultTable.empty();
        
                    termData.data.forEach(term => {
                        appendResultRow($resultTable, term);
                    });
        
                    currentEndTerm = startTerm;
                } catch (error) {
                    console.error('Error fetching previous results:', error);
                }
        };
    
        const updatePreviousResults = async (name, endTerm) => {
            try {
                endTerm = endTerm - 1;
                const startTerm = endTerm - 20;
                const termResponse = await fetch(`http://localhost:3001/getData?name=${name}/${startTerm}/${endTerm}`);
                const termData = await termResponse.json();
                const $resultTable = $('.resulttable'); 
    
                termData.data.forEach(term => {
                    appendResultRow($resultTable, term);
                });
    
                currentEndTerm = startTerm;
            } catch (error) {
                console.error('Error fetching previous results:', error);
            }
        };
    
        const appendResultRow = ($resultTable, term) => {
            const formattedDatetime = formatDatetime(term.resultopen.datetime, true);
            const numbers = term.number.split(',');
    
            const $rowElement = $('<div class="row bordergray2 pb10 pt10"></div>');
            $rowElement.append($('<div class="col-xs-5 col-md-3 mt5"></div>').text(term.term));
            $rowElement.append($('<div class="hidden-xs col-md-3 mt5 pr0"></div>').text(formattedDatetime));
            
            numbers.forEach(number => {
                $rowElement.append($('<div class="resultnum3"></div>').text(number.trim()));
            });
    
            $resultTable.append($rowElement);
        };
    
        const formatDatetime = (datetime, shortDay = false) => {
            let formatted = datetime.replace(' at ', ' ').replace(' GMT+8', '');
            const date = new Date(formatted);
            const daysOfWeek = shortDay ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : 
                                          ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayName = daysOfWeek[date.getUTCDay()];
            return `${dayName}, ${formatted}`;
        };
    
        const setupCountdown = (nextUnixTime) => {
            const updateTimeLeft = () => {
                const currentTime = Math.floor(Date.now() / 1000);
                const timeLeft = nextUnixTime - currentTime;
                const $countdown = $(".countdown");
                
                if (timeLeft > 0) {
                    const minutes = Math.floor(timeLeft / 60);
                    const seconds = timeLeft % 60;
                    $countdown.text(`${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
                } else {
                    fetchData();
                    $countdown.text('00:00');
                    clearInterval(countdownInterval);
                }
            };
    
            const countdownInterval = setInterval(updateTimeLeft, 1000);
            updateTimeLeft();
        };
    
        const loadMoreResults = async () => {
            try {
                displayResult = displayResult + 20
                const name = document.body.getAttribute('data-name');
                const startTerm = currentEndTerm - displayResult;
                await updatePreviousResults(name, currentEndTerm);
                currentEndTerm = startTerm;
            } catch (error) {
                console.error('Error loading more results:', error);
            }
        };
    
        $('.loadresult').on('click', loadMoreResults);
    
        fetchData();
    });
    