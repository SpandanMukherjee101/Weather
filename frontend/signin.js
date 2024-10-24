const backendUrl = 'http://localhost:5000';

const video = document.querySelector("video");
const ld = document.querySelector(".ld");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const start = () => {
    ld.innerHTML="<p>Click to continue...</p>"

    ld.addEventListener('click', async () => {
        await sleep(750);
        ld.style.display = "none";
        video.play().catch(error => {
            console.error("Autoplay was prevented:", error);
        });

        if (localStorage.getItem('token') !== null) {
            location.assign("file:///D:/Weather/frontend/index.html");
        }
    });
}

document.getElementById('signup').onclick = async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const response = await fetch(`${backendUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
        alert('Sign up successful! Plz sign in!');
    } else {
        alert(data.message);
    }
    if (localStorage.getItem('token') !== null) {
        location.assign("file:///D:/Weather/frontend/index.html")
    }
};

document.getElementById('signin').onclick = async (event) => {
    event.preventDefault();
    if (localStorage.getItem('token') !== null) {
        alert('User is signed-in!');
    }
    else {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const response = await fetch(`${backendUrl}/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        token = data.token;
        if (response.ok) {
            localStorage.setItem('token', token);
            alert('Sign in successful!');
        } else {
            alert(data.message);
        }
    }
    if (localStorage.getItem('token') !== null) {
        location.assign("file:///D:/Weather/frontend/index.html")
    }
};

const mag = document.querySelector(".magneto");

const activate = (event) => {
    let boundBox = mag.getBoundingClientRect();
    const magstr = 100;
    const newX = ((event.clientX - boundBox.left) / mag.offsetWidth) - 0.5;
    const newY = ((event.clientY - boundBox.top) / mag.offsetHeight) - 0.5;

    gsap.to(mag, {
        duration: 1,
        x: newX * magstr,
        y: newY * magstr,
        ease: Power4.easeOut
    });
};

const reset = (event) => {
    gsap.to(mag, {
        duration: 1,
        x: 0,
        y: 0,
        ease: Elastic.easeOut
    });
};

mag.addEventListener('mousemove', activate);
mag.addEventListener('mouseleave', reset);