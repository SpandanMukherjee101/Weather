const scene = document.getElementById('scene');
const c = document.querySelector('.c');
const body = document.querySelector('body');

const start = async () => {
    if (localStorage.getItem('token') === null) {
        location.assign("file:///D:/Weather/frontend/signin.html");
    }    
};

for (let z = 0; z < 7; z++) {
    const grid = document.createElement('div');
    grid.classList.add('grid');
    
    grid.style.transform = `translateZ(${z * 30}px)`;

    for (let i = 0; i < 14 * 7; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        grid.appendChild(square);
        const activate = (event) => {
            let boundBox = c.getBoundingClientRect();
            const magstr = 15;
            const newX = ((event.clientX - boundBox.left) / c.offsetWidth) - 0.5;
            const newY = ((event.clientY - boundBox.top) / c.offsetHeight) - 0.5;
        
            gsap.to(square, {
                duration: 1,
                x: newX * magstr * z,
                y: newY * magstr * z,
                ease: Power4.easeOut
            });
        };
        body.addEventListener('mousemove', activate);
    }

    scene.appendChild(grid);    
}