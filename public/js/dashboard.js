document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }
    
    fetch('/api/get/trainings', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        let actualDate = localStorage.getItem("actualPageDate");
        if (!actualDate) {
            localStorage.setItem("actualPageDate", new Date())
        }
        const specifiedMonth = new Date(localStorage.getItem('actualPageDate'));
        generateDateTitle(specifiedMonth);
        generateCalendar(specifiedMonth, 'main-calendar-month', data);
    });
});

function generateMonthPage(page){
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }
    
    let specifiedMonth = new Date(localStorage.getItem('actualPageDate'));
    specifiedMonth.setDate(1);
    
    if (page === 'previous') {
        specifiedMonth.setMonth(specifiedMonth.getMonth() - 1);
    } else if (page === 'next') {
        specifiedMonth.setMonth(specifiedMonth.getMonth() + 1);
    }
    
    fetch('/api/get/trainings', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        localStorage.setItem("actualPageDate", specifiedMonth);
        generateDateTitle(specifiedMonth);
        generateCalendar(specifiedMonth, 'main-calendar-month', data);
    });
}

function generateDateTitle(specifiedMonth){
    const monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const actualMonth = monthsList[specifiedMonth.getMonth()];
    const actualYear = specifiedMonth.getFullYear();

    document.getElementById('month').innerText = actualMonth + ' ' + actualYear;
}

function generateCalendar(specifiedMonth, containerId, data) {
    let firstDayOfMonth = new Date(specifiedMonth.getFullYear(), specifiedMonth.getMonth(), 1).getDay();
    firstDayOfMonth = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    let dayCounter = 1;
    const numberOfDays = new Date(specifiedMonth.getFullYear(), specifiedMonth.getMonth() + 1, 0).getDate();
    const calendarContainer = document.getElementById(containerId);

    // Reset calendar container
    calendarContainer.innerHTML = '';

    let daysLeft = numberOfDays;
    const totalWeeks = Math.ceil((firstDayOfMonth + numberOfDays) / 7);

    // Headers of table
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Satursday', 'Sunday'];
    const daysHeader = document.createElement('tr');
    daysOfWeek.forEach(day => {
        const header = document.createElement('th');
        const headerValue = document.createElement('p');

        headerValue.innerText = day;

        header.appendChild(headerValue);
        daysHeader.appendChild(header);
    });
    calendarContainer.appendChild(daysHeader);

    // Content of table
    for (let week = 0; week < totalWeeks; week++) {
        const singleWeek = document.createElement('tr');
        for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
            if (week === 0 && dayOfWeek < firstDayOfMonth || daysLeft <= 0) {
                singleWeek.appendChild(generateDayCell(null)); // Empty cell
            } else {
                singleWeek.appendChild(generateDayCell(dayCounter, specifiedMonth, data));
                dayCounter++;
                daysLeft--;
            }
        }
        calendarContainer.appendChild(singleWeek);
    }
}

function generateDayCell(day, specifiedMonth, data) {
    const singleDay = document.createElement('td');
    if (day !== null) {
        const formattedDate = customizeDateFormat(day, specifiedMonth);
        singleDay.setAttribute('id', formattedDate);
        singleDay.setAttribute('class', 'td-active');
        data.trainings.forEach(singleTraining => {
            if (singleTraining.date.slice(0,10) == customizeDateFormat(day, specifiedMonth)) {
                singleDay.setAttribute('class', 'cell-active-training');
            }
        });
        singleDay.setAttribute('onClick', `location.href="/dashboard/${formattedDate}"`);
        singleDay.innerText = day;
    } else {
        singleDay.setAttribute('class', 'td-inactive');
    }
    return singleDay;
}

function customizeDateFormat(dayCounter, fullDate) {
    const year = String(fullDate.getFullYear());
    const month = String(fullDate.getMonth() + 1).length === 1 ? "0" + String(fullDate.getMonth() + 1) : String(fullDate.getMonth() + 1);
    const day = String(dayCounter).length === 1 ? "0" + String(dayCounter) : String(dayCounter);

    return year + "-" + month + "-" + day;
}
