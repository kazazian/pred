document.addEventListener('DOMContentLoaded', () => {
    let lights = document.querySelectorAll('[data-js="lightOn"]');
    let index = 0;
    lights.forEach((light) => {
        let broken = false;
        light.addEventListener('click', () => {
            const options = ['images/LightOff.png', 'images/LightOn.png'];
            light.src = broken ? options[1] : options[0];
            if (!broken) {
                let Sound = new Audio("glass.mp3")
                Sound.play()
            }
            broken = !broken
        });
    })
});