const backendUrl = (() => {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
        return 'http://localhost:3000';
    }
    return 'https://weather-sm-backend.vercel.app';
})();

const video = document.querySelector('video');
const ld = document.querySelector('.ld');
const vid = document.querySelector('video');

function playVid() {
    if (vid) {
        vid.play();
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function readJson(response) {
    try {
        return await response.json();
    } catch (error) {
        return {};
    }
}

const start = () => {
    if (ld) {
        ld.innerHTML = '<p>Click to continue...</p>';
    }

    if (ld) {
        ld.addEventListener('click', async () => {
            await sleep(750);
            playVid();
            if (ld) {
                ld.style.display = 'none';
            }
            if (video) {
                video.play().catch((error) => {
                    console.error('Autoplay was prevented:', error);
                });
            }

            if (localStorage.getItem('token') !== null) {
                location.assign('/');
            }
        });
    }
};

const signupButton = document.getElementById('signup');
const signinButton = document.getElementById('signin');

if (signupButton) {
    signupButton.onclick = async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            return alert('Input fields cannot be empty!');
        }

        try {
            const response = await fetch(`${backendUrl}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await readJson(response);
            if (response.ok) {
                alert('Sign up successful! Please sign in!');
            } else {
                alert(data.message || 'Sign up failed');
            }
        } catch (error) {
            console.error(error);
            alert('Could not complete sign up');
        }

        if (localStorage.getItem('token') !== null) {
            location.assign('/');
        }
    };
}

if (signinButton) {
    signinButton.onclick = async (event) => {
        event.preventDefault();
        if (localStorage.getItem('token') !== null) {
            alert('User is signed-in!');
            location.assign('/');
            return;
        }

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            return alert('Input fields cannot be empty!');
        }

        try {
            const response = await fetch(`${backendUrl}/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await readJson(response);
            const token = data.result;
            if (response.ok && token) {
                localStorage.setItem('token', token);
                alert('Sign in successful!');
                location.assign('/');
            } else {
                alert(data.message || 'Sign in failed');
            }
        } catch (error) {
            console.error(error);
            alert('Could not sign in');
        }
    };
}

const mag = document.querySelector('.magneto');

if (mag) {
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
}

start();