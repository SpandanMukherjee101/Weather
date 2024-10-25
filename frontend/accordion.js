const backendUrl = 'http://localhost:5000';

let i= 1;

let day={
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
    0: "Sun"
};

let weather={
    "Clouds": "cloudy",
    "Clear": "sunny",
    "Rain": "rainy",
    "Thunderstorm": "thunderstorms",
    "Snow": "snow",
    "Fog": "fog"
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const start= async () => {
    sleep(3500).then(() => {
        page.style.display= "flex";
        lc.style.display= "none";
     });
    if (localStorage.getItem('token')!==null) {
        let city = localStorage.getItem('dc');

        if (localStorage.getItem('dc')===null) {
            city = "Kolkata";
        }

        const token = localStorage.getItem('token');        
        
        const response = await fetch(`${backendUrl}/weather/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ city }),
        });
        
        const weatherData = await response.json();
        document.querySelector('#page-title h1').innerText = city;
        
        let accordionsItems = document.querySelectorAll('.accordion--item');

        i=0
        accordionsItems.forEach(item => {
            if(i> 33){
                i= 0;
            }
            item.classList.add(weather[weatherData[i].weatherType]);
            i+=8;

        });

        let dates = document.querySelectorAll('.accordion--item .date');
        
        const d = new Date();
        i= d.getDay();
        const nextDate = new Date(d);
        dates.forEach(item => {
            item.children[0].innerText= day[i];
            item.children[1].innerText= nextDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            i= (i+1)%7;
            nextDate.setDate(d.getDate() + 1);
        })
        
        let temp = document.querySelectorAll('.accordion--item .temp');

        i= 0;

        temp.forEach(item => {
            if(i> 33){
                i= 0;
            }    
            item.children[0].innerText= weatherData[i].weatherType;
            item.children[1].children[0].innerText= `${weatherData[i].maxTemp}`;
            item.children[1].children[1].innerText= `${weatherData[i].minTemp}`;
            i+= 8;
        });

        let temp2 = document.querySelectorAll('.accordion--item .bottom-temp');

        i= 0;

        temp2.forEach(item => {
            if(i> 33){
                i= 0;
            }
            item.children[0].innerText= `${weatherData[i].maxTemp}`;
            item.children[1].innerText= `${weatherData[i].minTemp}`;
            i+= 8;
        });

        let read = document.querySelectorAll('.readings');

        i= 0;

        read.forEach(item => {
            if(i> 33){
                i= 0;
            }
            item.children[0].children[1].innerText= `${weatherData[i].windSpeed}`;
            item.children[1].children[1].innerText= `${weatherData[i].humidity}`;
            item.children[2].children[1].innerText= `${weatherData[i].rainPercentage}`;
            i+= 8;
        });
    }
    else{
        location.assign("/signin.html");
    }
}

let accordionsItems = document.querySelectorAll('.accordion li');

accordionsItems.forEach(item => {
    
    item.addEventListener('click', () => {
        accordionsItems.forEach(item2 => {
            item2.classList.remove('opened');
        })

        item.classList.add('opened');
    });
})

document.getElementById('logout').onclick = async () => {
    if (localStorage.getItem('token')!==null) {
        localStorage.removeItem('token');
        localStorage.removeItem('dc');
        alert('Log out successful!')
    }
    else {
        alert('Logged out already!')
    }
};

const pro= document.getElementById("pro");
const menu= document.getElementById("menu");

pro.addEventListener("mouseover", () => {
    menu.style.display= "flex";
});

pro.addEventListener("mouseleave", () => {
    menu.style.display= "none";
});

const lc= document.querySelector(".loadercontainer");
const page= document.querySelector("#hero");