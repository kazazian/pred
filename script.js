document.addEventListener('DOMContentLoaded', () => {
    const lights = document.querySelectorAll('[data-js="lightOn"]');
    lights.forEach((light) => {
        let broken = false;
        light.addEventListener('click', () => {
            const options = ['images/LightOff.png', 'images/LightOn.png'];
            light.src = broken ? options[1] : options[0];
            if (!broken) {
                const sound = new Audio("glass.mp3");
                sound.play();
            }
            broken = !broken;
        });
    });

    const handsElement = document.querySelector('[data-js="hands"]');
    const ribbonElement = document.querySelector('[data-js="ribbon"]');
    const secondSection = document.querySelector('[data-js="second-screen"]');
    const fourthSection = document.querySelector('[data-js="fourth-screen"]');
    const switchElement = document.querySelector('[data-js="fourth-switch"]');
    const fireElement = document.querySelector('[data-js="fourth-fire"]');
    const starLayers = document.querySelectorAll('[data-js="star-layer"]');
    const stairsRibbons = document.querySelectorAll('[data-js="stairs-ribbon"]');
    const containerOfWindows = document.querySelector(
      "[data-js='second-screen-windows-container']",
    );

    function positionRibbon() {
      if (!handsElement || !ribbonElement || !secondSection) {
        return;
      }

      if (window.innerWidth < 1024) {
        ribbonElement.style.top = "";
        ribbonElement.style.bottom = "";
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

    if (fourthSection && switchElement && fireElement) {
      const fireFrames = ["images/fire1.svg", "images/fire2.svg"];
      let fireFrameIndex = 0;
      let fireIntervalId = null;
      let switchIsOn = false;
      let hasSwitched = false;

      function stopFireAnimation() {
        if (fireIntervalId !== null) {
          window.clearInterval(fireIntervalId);
          fireIntervalId = null;
        }
      }

      function startFireAnimation() {
        stopFireAnimation();
        fireIntervalId = window.setInterval(() => {
          fireFrameIndex = (fireFrameIndex + 1) % fireFrames.length;
          fireElement.src = fireFrames[fireFrameIndex];
        }, 90);
      }

      function updateFourthScreen() {
        switchElement.src = switchIsOn ? "images/on.svg" : "images/off.svg";
        fourthSection.classList.toggle(
          "show-extra",
          hasSwitched && !switchIsOn,
        );

        if (switchIsOn) {
          fourthSection.classList.add("fire-active");
          startFireAnimation();
        } else {
          fourthSection.classList.remove("fire-active");
          stopFireAnimation();
          fireFrameIndex = 0;
          fireElement.src = fireFrames[fireFrameIndex];
        }
      }

      switchElement.addEventListener("click", () => {
        hasSwitched = true;
        switchIsOn = !switchIsOn;
        updateFourthScreen();
      });

      updateFourthScreen();
    }

    starLayers.forEach((starLayer) => {
      const SPIN_DURATION = 1200;
      const STOP_DURATION = 3000;
      let currentAnimation = null;

      const playAnimation = (keyframes, options) => {
        currentAnimation?.cancel();
        currentAnimation = starLayer.animate(keyframes, options);
      };
      starLayer.addEventListener("mouseenter", () => {
        playAnimation(
          [
            { transform: "translate(-50%, -50%) rotate(0deg)" },
            { transform: "translate(-50%, -50%) rotate(360deg)" },
          ],
          {
            duration: SPIN_DURATION,
            iterations: Infinity,
            easing: "linear",
          },
        );
      });
      starLayer.addEventListener("mouseleave", () => {
        if (!currentAnimation) {
          return;
        }
        const currentAngle =
          (((currentAnimation.currentTime ?? 0) % SPIN_DURATION) /
            SPIN_DURATION) *
          360;
        playAnimation(
          [
            {
              transform: `translate(-50%, -50%) rotate(${currentAngle}deg)`,
            },
            {
              transform: `translate(-50%, -50%) rotate(${currentAngle + 540}deg)`,
            },
          ],
          {
            duration: STOP_DURATION,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
          },
        );
      });
    });

    stairsRibbons.forEach((stairsRibbon) => {
      stairsRibbon.addEventListener("click", () => {
        stairsRibbon.style.display = "none";
      });
    });

    window.addEventListener("resize", positionRibbon);
    window.addEventListener("load", positionRibbon);
    requestAnimationFrame(positionRibbon);
});
