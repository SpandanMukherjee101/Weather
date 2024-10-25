const backendUrl = 'http://localhost:5000';

const start = async () => {
    if (localStorage.getItem('token') === null) {
        location.assign("/signin.html")
    }
    else {
        const token= localStorage.getItem('token');
        const response = await fetch(`${backendUrl}/user/cities`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        const data = await response.json();

        if (response.ok) {
            const citiesList = document.getElementById('citiesList');
            citiesList.innerHTML = '';
    
            data.cities.forEach(city => {
                const li = document.createElement('li');
                li.textContent = city;
                citiesList.appendChild(li);
            });
        } else {
            alert(data.message || 'Error fetching cities');
        }
    }
};

const changePassword = async () => {
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const token = localStorage.getItem('token');

    const response = await fetch(`${backendUrl}/auth/change-password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await response.json();
    if (response.ok) {
        alert('Password updated successfully!');
        localStorage.removeItem('token');
        localStorage.removeItem('dc');
        alert("Plz sign-in again!");
        location.assign("/signin.html");
    } else {
        alert(data.message);
    }
};

const updateCity = async () => {
    const oldCity = document.getElementById('oldCity').value;
    const newCity = document.getElementById('newCity').value;
    const token = localStorage.getItem('token');

    const response = await fetch(`${backendUrl}/weather/update-city`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ oldCity, newCity }),
    });
    console.log(response);    
    const data = await response.json();
    if (response.ok) {
        alert('City updated successfully!');
        location.reload();
    } else {
        alert(data.message);
    }
};

const openCity= async () => {
    const City = document.getElementById('cityToChoose').value;
    localStorage.setItem('dc', City);
    location.assign("/");
}

const body= document.querySelector("body");

const mag = document.querySelector(".magneto");

const activate = (event) => {
    let boundBox = mag2.getBoundingClientRect();
    const magstr = 10;
    const newX = ((event.clientX - boundBox.left) / mag2.offsetWidth) - 0.5;
    const newY = ((event.clientY - boundBox.top) / mag2.offsetHeight) - 0.5;

    gsap.to(mag, {
        duration: 1,
        x: newX * magstr,
        y: newY * magstr,
        ease: Power4.easeOut
    });
};

const mag2 = document.querySelector(".magneto2");

const activate2 = (event) => {
    let boundBox = mag2.getBoundingClientRect();
    const magstr = 10;
    const newX = ((event.clientX - boundBox.left) / mag2.offsetWidth) - 0.5;
    const newY = ((event.clientY - boundBox.top) / mag2.offsetHeight) - 0.5;

    gsap.to(mag2, {
        duration: 1,
        x: newX * magstr,
        y: newY * magstr,
        ease: Power4.easeOut
    });
};

const mag3 = document.querySelector(".magneto3");

const activate3 = (event) => {
    let boundBox = mag2.getBoundingClientRect();
    const magstr = 10;
    const newX = ((event.clientX - boundBox.left) / mag2.offsetWidth) - 0.5;
    const newY = ((event.clientY - boundBox.top) / mag2.offsetHeight) - 0.5;

    gsap.to(mag3, {
        duration: 1,
        x: newX * magstr,
        y: newY * magstr,
        ease: Power4.easeOut
    });
};

body.addEventListener('mousemove', activate);
body.addEventListener('mousemove', activate2);
body.addEventListener('mousemove', activate3);