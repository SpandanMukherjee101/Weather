const backendUrl = (() => {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
        return 'http://localhost:3000';
    }
    return 'https://weather-sm-backend.vercel.app';
})();

let i = 1;

let day = {
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat',
    0: 'Sun'
};

let weather = {
    Clouds: 'cloudy',
    Clear: 'sunny',
    Rain: 'rainy',
    Thunderstorm: 'thunderstorms',
    Snow: 'snow',
    Fog: 'fog'
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getAuthHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    return headers;
}

async function readJson(response) {
    try {
        return await response.json();
    } catch (error) {
        return {};
    }
}

function getForecastData(weatherData, index) {
    if (!Array.isArray(weatherData) || weatherData.length === 0) {
        return {
            weatherType: 'Clear',
            maxTemp: 0,
            minTemp: 0,
            windSpeed: 0,
            humidity: 0,
            rainPercentage: 0
        };
    }

    return weatherData[Math.min(index, weatherData.length - 1)] || weatherData[0];
}

const start = async () => {
    await sleep(3500);
    if (page) {
        page.style.display = 'flex';
    }
    if (lc) {
        lc.style.display = 'none';
    }

    if (localStorage.getItem('token') !== null) {
        let city = localStorage.getItem('dc') || 'Kolkata';

        try {
            const response = await fetch(`${backendUrl}/weather/`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ city })
            });

            const weatherPayload = await readJson(response);
            if (!response.ok) {
                throw new Error(weatherPayload.message || 'Unable to load weather data');
            }

            const weatherData = Array.isArray(weatherPayload) && weatherPayload.length > 0
                ? weatherPayload
                : Array.from({ length: 5 }, () => getForecastData([], 0));

            const title = document.querySelector('#page-title h1');
            if (title) {
                title.textContent = city;
            }

            let accordionsItems = document.querySelectorAll('.accordion--item');
            accordionsItems.forEach((item, index) => {
                const forecast = getForecastData(weatherData, index * 8);
                const weatherClass = weather[forecast.weatherType] || 'sunny';
                item.classList.add(weatherClass);
            });

            let dates = document.querySelectorAll('.accordion--item .date');
            const d = new Date();
            i = d.getDay();
            const nextDate = new Date(d);
            let j = 1;
            dates.forEach((item) => {
                item.children[0].textContent = day[i] || 'Mon';
                item.children[1].textContent = nextDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                i = (i + 1) % 7;
                nextDate.setDate(d.getDate() + j);
                j++;
            });

            let temp = document.querySelectorAll('.accordion--item .temp');
            temp.forEach((item, index) => {
                const forecast = getForecastData(weatherData, index * 8);
                item.children[0].textContent = forecast.weatherType;
                item.children[1].children[0].textContent = `${forecast.maxTemp}`;
                item.children[1].children[1].textContent = `${forecast.minTemp}`;
            });

            let temp2 = document.querySelectorAll('.accordion--item .bottom-temp');
            temp2.forEach((item, index) => {
                const forecast = getForecastData(weatherData, index * 8);
                item.children[0].textContent = `${forecast.maxTemp}`;
                item.children[1].textContent = `${forecast.minTemp}`;
            });

            let read = document.querySelectorAll('.readings');
            read.forEach((item, index) => {
                const forecast = getForecastData(weatherData, index * 8);
                item.children[0].children[1].textContent = `${forecast.windSpeed}`;
                item.children[1].children[1].textContent = `${forecast.humidity}`;
                item.children[2].children[1].textContent = `${forecast.rainPercentage}`;
            });
        } catch (error) {
            console.error(error);
            alert(error.message || 'Unable to load weather data');
        }
    } else {
        location.assign('signin.html');
    }
};

let accordionsItems = document.querySelectorAll('.accordion li');

accordionsItems.forEach((item) => {
    item.addEventListener('click', () => {
        accordionsItems.forEach((item2) => {
            item2.classList.remove('opened');
        });

        item.classList.add('opened');
    });
});

const logoutButton = document.getElementById('logout');
if (logoutButton) {
    logoutButton.onclick = async () => {
        if (localStorage.getItem('token') !== null) {
            localStorage.removeItem('token');
            localStorage.removeItem('dc');
            alert('Log out successful!');
        } else {
            alert('Logged out already!');
        }
    };
}

const pro = document.getElementById('pro');
const menu = document.getElementById('menu');

if (pro && menu) {
    pro.addEventListener('mouseover', () => {
        menu.style.display = 'flex';
    });

    pro.addEventListener('mouseleave', () => {
        menu.style.display = 'none';
    });
}

const lc = document.querySelector('.loadercontainer');
const page = document.querySelector('#hero');