const backendUrl = (() => {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
        return 'http://localhost:3000';
    }
    return 'https://weather-sm-backend.vercel.app';
})();

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

const start = async () => {
    if (localStorage.getItem('token') === null) {
        location.assign('signin.html');
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/user/cities`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        const data = await readJson(response);
        if (!response.ok) {
            throw new Error(data.message || 'Error fetching cities');
        }

        const citiesList = document.getElementById('citiesList');
        if (citiesList) {
            citiesList.innerHTML = '';
            (data.cities || []).forEach((city) => {
                const li = document.createElement('li');
                li.textContent = city;
                citiesList.appendChild(li);
            });
        }
    } catch (error) {
        console.error(error);
        alert(error.message || 'Could not load cities');
    }
};

const changePassword = async () => {
    const oldPassword = document.getElementById('oldPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();

    if (!oldPassword || !newPassword) {
        return alert('Input fields cannot be empty!');
    }

    const token = localStorage.getItem('token');
    if (!token) {
        location.assign('signin.html');
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/auth/change-password`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ oldPassword, newPassword })
        });

        const data = await readJson(response);
        if (!response.ok) {
            throw new Error(data.message || 'Could not update password');
        }

        alert('Password updated successfully!');
        localStorage.removeItem('token');
        localStorage.removeItem('dc');
        alert('Please sign in again!');
        location.assign('signin.html');
    } catch (error) {
        console.error(error);
        alert(error.message || 'Could not update password');
    }
};

const updateCity = async () => {
    const oldCity = document.getElementById('oldCity').value.trim();
    const newCity = document.getElementById('newCity').value.trim();

    if (!oldCity || !newCity) {
        return alert('Input fields cannot be empty!');
    }

    const token = localStorage.getItem('token');
    if (!token) {
        location.assign('signin.html');
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/weather/update-city`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ oldCity, newCity })
        });

        const data = await readJson(response);
        if (!response.ok) {
            throw new Error(data.message || 'Could not update city');
        }

        alert('City updated successfully!');
        location.reload();
    } catch (error) {
        console.error(error);
        alert(error.message || 'Could not update city');
    }
};

const openCity = async () => {
    const city = document.getElementById('cityToChoose').value.trim();

    if (!city) {
        return alert('Input fields cannot be empty!');
    }

    localStorage.setItem('dc', city);
    location.assign('/');
};

const body = document.querySelector('body');
const mag = document.querySelector('.magneto');
const mag2 = document.querySelector('.magneto2');
const mag3 = document.querySelector('.magneto3');

const activate = (event) => {
    if (!mag || !mag2) {
        return;
    }

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

const activate2 = (event) => {
    if (!mag2) {
        return;
    }

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

const activate3 = (event) => {
    if (!mag3 || !mag2) {
        return;
    }

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

if (body) {
    body.addEventListener('mousemove', activate);
    body.addEventListener('mousemove', activate2);
    body.addEventListener('mousemove', activate3);
}