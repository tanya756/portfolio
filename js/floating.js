// Floating effect for decorative images
const desktop = document.querySelector('.desktop');
const cellphone = document.querySelector('.cellphone');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (desktop) {
        desktop.style.transform = `translateY(calc(-50% + ${scrollY * 0.15}px))`;
    }
    if (cellphone) {
        cellphone.style.transform = `translateY(calc(-50% + ${scrollY * -0.1}px))`;
    }
});
