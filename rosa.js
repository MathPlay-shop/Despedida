const petalContainer = document.querySelector(".falling-petals");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const story = document.querySelector("#story");
const letter = document.querySelector("#love-letter");
const replayButton = document.querySelector("#replay");
const elapsedTimer = document.querySelector("#elapsed-timer");

if (elapsedTimer) {
  const timerValues = {
    years: elapsedTimer.querySelector('[data-elapsed="years"]'),
    days: elapsedTimer.querySelector('[data-elapsed="days"]'),
    hours: elapsedTimer.querySelector('[data-elapsed="hours"]'),
    minutes: elapsedTimer.querySelector('[data-elapsed="minutes"]'),
    seconds: elapsedTimer.querySelector('[data-elapsed="seconds"]')
  };

  function updateElapsedTimer() {
    const now = new Date();
    const startDate = new Date(2019, 0, 21);

    if (now < startDate) {
      Object.values(timerValues).forEach((value) => {
        if (value) value.textContent = "0";
      });
      return;
    }

    let years = now.getFullYear() - startDate.getFullYear();
    const anniversaryThisYear = new Date(now.getFullYear(), 0, 21);

    if (now < anniversaryThisYear) {
      years -= 1;
    }

    const lastAnniversaryYear = startDate.getFullYear() + years;
    const daysSinceAnniversary = Math.floor(
      (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) -
        Date.UTC(lastAnniversaryYear, 0, 21)) /
        86400000
    );
    const elapsed = {
      years,
      days: daysSinceAnniversary,
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds()
    };

    Object.entries(elapsed).forEach(([unit, amount]) => {
      const value = timerValues[unit];
      if (value) {
        value.textContent = unit === "hours" || unit === "minutes" || unit === "seconds"
          ? String(amount).padStart(2, "0")
          : String(amount);
      }
    });
  }

  updateElapsedTimer();
  window.setInterval(updateElapsedTimer, 1000);
}

if (story && letter && replayButton) {
  let revealTimer;

  function revealLetter() {
    story.classList.add("is-open");
    letter.setAttribute("aria-hidden", "false");
    letter.inert = false;
  }

  function replayStory() {
    window.clearTimeout(revealTimer);
    replayButton.blur();
    story.classList.remove("is-open");
    letter.setAttribute("aria-hidden", "true");
    letter.inert = true;
    revealTimer = window.setTimeout(revealLetter, 3000);
  }

  revealTimer = window.setTimeout(revealLetter, 2400);
  replayButton.addEventListener("click", replayStory);
}

if (petalContainer && !reducedMotion.matches) {
  const maxPetals = 5;

  function dropPetal() {
    if (petalContainer.childElementCount >= maxPetals) {
      petalContainer.firstElementChild.remove();
    }

    const petal = document.createElement("span");
    const start = 36 + Math.random() * 28;
    const startY = 18 + Math.random() * 9;
    const drift = (Math.random() - 0.5) * 78;
    const driftStart = (Math.random() - 0.5) * 16;
    const driftMid = drift * 0.48 + (Math.random() - 0.5) * 18;
    const direction = Math.random() < 0.5 ? -1 : 1;
    const spin = direction * (420 + Math.random() * 540);
    const fallDistance = petalContainer.clientHeight * 0.76;
    const width = 10 + Math.random() * 8;
    const duration = 4.2 + Math.random() * 1.8;

    petal.className = "falling-petal";
    petal.style.left = `${start}%`;
    petal.style.setProperty("--petal-start-y", `${startY}%`);
    petal.style.setProperty("--petal-width", `${width}px`);
    petal.style.setProperty("--petal-height", `${width * (0.56 + Math.random() * 0.16)}px`);
    petal.style.setProperty("--drift-start", `${driftStart}px`);
    petal.style.setProperty("--drift-mid", `${driftMid}px`);
    petal.style.setProperty("--drift-end", `${drift}px`);
    petal.style.setProperty("--drift", `${drift}px`);
    petal.style.setProperty("--spin-mid", `${spin * 0.55}deg`);
    petal.style.setProperty("--spin", `${spin}deg`);
    petal.style.setProperty("--spin-end", `${spin * 1.35}deg`);
    petal.style.setProperty("--fall-time", `${duration}s`);
    petal.style.setProperty("--fall-distance", `${fallDistance}px`);
    petal.style.setProperty("--fall-y-start", `${fallDistance * 0.12}px`);
    petal.style.setProperty("--fall-y-mid", `${fallDistance * 0.5}px`);
    petal.style.setProperty("--fall-y-end", `${fallDistance * 0.82}px`);
    petal.addEventListener("animationend", () => petal.remove(), { once: true });
    petalContainer.append(petal);
  }

  window.setTimeout(() => {
    dropPetal();
    window.setInterval(dropPetal, 1450);
  }, 900);
}