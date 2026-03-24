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
    let door = document.querySelector('[data-js="door"]')
    door.addEventListener('click', () => {
      door.classList.toggle('active')
    })

    const handsElement = document.querySelector('[data-js="hands"]');
    const ribbonElement = document.querySelector('[data-js="ribbon"]');
    const secondSection = document.querySelector('[data-js="second-screen"]');
    const dragItems = document.querySelectorAll('[data-js="drag-item"]');
    const tableTopElement = document.querySelector('[data-js="table-top"]');
    const tableContainer = document.querySelector('.table-container');
    const enterElement = document.querySelector('[data-js="enter"]');
    const doorLottieElement = document.querySelector('[data-js="door-lottie"]');
    const seventhSection = document.querySelector('[data-js="seventh-screen"]');
    const fourthSection = document.querySelector('[data-js="fourth-screen"]');
    const switchElement = document.querySelector('[data-js="fourth-switch"]');
    const fireElement = document.querySelector('[data-js="fourth-fire"]');
    const starLayers = document.querySelectorAll('[data-js="star-layer"]');
    const stairsRibbons = document.querySelectorAll('[data-js="stairs-ribbon"]');
    const containerOfWindows = document.querySelector(
      "[data-js='second-screen-windows-container']",
    );

    function smoothScrollToSection(sectionElement, duration, offset = 0) {
      if (!sectionElement) {
        return;
      }

      const startY = window.scrollY;
      const targetY = sectionElement.getBoundingClientRect().top + startY + offset;
      const distance = targetY - startY;
      const startTime = performance.now();

      function animateScroll(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, startY + distance * progress);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      }

      requestAnimationFrame(animateScroll);
    }

    if (doorLottieElement) {
      doorLottieElement.style.cursor = "pointer";
      doorLottieElement.addEventListener("click", () => {
        const doorSrc = doorLottieElement.getAttribute("src");
        if (doorSrc && typeof doorLottieElement.load === "function") {
          doorLottieElement.load(doorSrc);
        } else if (typeof doorLottieElement.stop === "function") {
          doorLottieElement.stop();
        }
        if (typeof doorLottieElement.play === "function") {
          doorLottieElement.play();
        }
        window.setTimeout(() => {
          smoothScrollToSection(seventhSection, 3200, -30);
        }, 120);
      });
    }

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

    if (enterElement && secondSection) {
      enterElement.addEventListener("click", () => {
        smoothScrollToSection(secondSection, 2200, 20);
      });
    }
if (!handsElement || !tableTopElement || !tableContainer) {
  return;
}

const tablePositions = {
  desktop: {
    phone: { x: 0.34, y: 0.48 },
    torch: { x: 0.5, y: 0.2 },
  },
  mobile: {
    phone: { x: 0.54, y: 0.35 },
    torch: { x: 0.88, y: 0.35 },
  },
  mobileSmall: {
    phone: { x: 0.54, y: 0.67 },
    torch: { x: 0.98, y: 0.62 },
  },
};

let activeItem = null;
let activePointerId = null;
let itemWidth = 0;
let itemHeight = 0;
let wasOnTable = false;

function isDesktop() {
  return window.innerWidth > 1024;
}

function getScreenMode() {
  if (isDesktop()) {
    return "desktop";
  }

  if (window.innerWidth < 500) {
    return "mobileSmall";
  }

  return "mobile";
}

function getItemType(item) {
  return item.classList.contains("tourch") ? "torch" : "phone";
}

function isPointInside(x, y, rect) {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function returnItemToHands(item) {
  handsElement.appendChild(item);
  item.classList.remove("on-table");
  item.removeAttribute("style");
}

function putItemOnTable(item) {
  const tableRect = tableContainer.getBoundingClientRect();
  const mode = getScreenMode();
  const type = getItemType(item);
  const position = tablePositions[mode][type];

  const left = position.x * tableRect.width - itemWidth / 2;
  const top = position.y * tableRect.height - itemHeight / 2;

  tableContainer.appendChild(item);
  item.classList.add("on-table");
  item.style.position = "absolute";
  item.style.left = `${left}px`;
  item.style.top = `${top}px`;
  item.style.width = `${itemWidth}px`;
  item.style.height = `${itemHeight}px`;
  item.style.margin = "0";
  item.style.zIndex = "2";
}

function startDrag(item, event) {
  const styles = window.getComputedStyle(item);

  activeItem = item;
  activePointerId = event.pointerId;
  wasOnTable = item.classList.contains("on-table");
  itemWidth = parseFloat(styles.width);
  itemHeight = parseFloat(styles.height);

  item.classList.add("dragging");
  item.setPointerCapture(activePointerId);

  item.style.position = "fixed";
  item.style.left = `${event.clientX - itemWidth / 2}px`;
  item.style.top = `${event.clientY - itemHeight / 2}px`;
  item.style.width = `${itemWidth}px`;
  item.style.height = `${itemHeight}px`;
  item.style.margin = "0";
  item.style.zIndex = "9999";

  document.body.appendChild(item);
}

function moveDrag(event) {
  if (!activeItem || event.pointerId !== activePointerId) {
    return;
  }

  event.preventDefault();

  activeItem.style.left = `${event.clientX - itemWidth / 2}px`;
  activeItem.style.top = `${event.clientY - itemHeight / 2}px`;
}

function endDrag(event) {
  if (!activeItem || event.pointerId !== activePointerId) {
    return;
  }

  const item = activeItem;
  const overTable = isPointInside(
    event.clientX,
    event.clientY,
    tableTopElement.getBoundingClientRect(),
  );
  const overHands = isPointInside(
    event.clientX,
    event.clientY,
    handsElement.getBoundingClientRect(),
  );

  item.classList.remove("dragging");
  item.releasePointerCapture(activePointerId);

  activeItem = null;
  activePointerId = null;

  if (overTable || (wasOnTable && !overHands)) {
    putItemOnTable(item);
  } else {
    returnItemToHands(item);
  }
}

dragItems.forEach((item) => {
  item.addEventListener("pointerdown", (event) => {
    if (activeItem) {
      return;
    }

    event.preventDefault();
    startDrag(item, event);
  });
});

window.addEventListener("pointermove", moveDrag);
window.addEventListener("pointerup", endDrag);
window.addEventListener("pointercancel", endDrag);

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
