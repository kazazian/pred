document.addEventListener('DOMContentLoaded', () => {
    let lights = document.querySelectorAll('[data-js="lightOn"]');
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

    const handsElement = document.querySelector("#hands");
    const ribbonElement = document.querySelector("#ribbon");
    const secondSection = document.querySelector(".second");
    const containerOfWindows = document.querySelector(
      "[data-js='second-screen-windows-container']",
    );

    function positionRibbon() {
      if (!handsElement || !ribbonElement || !secondSection) {
        return;
      }

      if (window.innerWidth < 1024) {
        ribbonElement.style.top = "auto";
        ribbonElement.style.bottom = "0px";
        return;
      }

      const handsRect = handsElement.getBoundingClientRect();
      const sectionRect = secondSection.getBoundingClientRect();
      const ribbonRect = ribbonElement.getBoundingClientRect();
      const ribbonTop = handsRect.bottom - sectionRect.top - ribbonRect.height / 2;

      ribbonElement.style.top = `${ribbonTop}px`;
      ribbonElement.style.bottom = "auto";
    }

    if (containerOfWindows) {
      const WINDOW_SIZE = 200;
      const WINDOW_GAP = 20;
      const WINDOW_STEP = WINDOW_SIZE + WINDOW_GAP;

      function fillContainer() {
        const containerWidth = containerOfWindows.getBoundingClientRect().width;
        const columns = Math.floor(containerWidth / WINDOW_STEP);

        containerOfWindows.style.gridTemplateColumns = `repeat(auto-fit, ${WINDOW_SIZE}px)`;
        containerOfWindows.innerHTML = "";

        for (let i = 0; i < columns; i += 1) {
          const window = document.createElement("img");
          window.classList.add("window");
          window.src = "images/window.svg";
          containerOfWindows.appendChild(window);
        }
      }

      window.addEventListener("resize", fillContainer);
      fillContainer();
    }

    window.addEventListener("resize", positionRibbon);
    window.addEventListener("load", positionRibbon);
    requestAnimationFrame(positionRibbon);
});
