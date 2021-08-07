const allSections = document.getElementsByTagName("section");
const sectionCount = allSections.length;
const allArrows = document.getElementsByClassName("arrow");

// Hide all arrows on each section
function clearArrows() {
  for (const arrow of allArrows) {
    arrow.style.visibility = "hidden";
  }
  return false;
}
// Required for section skillset background color animation
function changeSkillsetBackgroundSize(section) {
  if (section.dataset.id == 3) {
    section.style.backgroundSize = "100%";
  }
}

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    clearArrows();
    changeSkillsetBackgroundSize(entry.target);
    // Finds and Displays only arrows in section in viewport
    const sectionArrows = [...entry.target.getElementsByClassName("arrow")];
    sectionArrows.forEach((arrow) => {
      arrow.style.visibility = "visible";
    });
  }
};

// Detects when user scrolls into another section tag, triggers revealSection function
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.8,
});

for (let i = 0; i < allSections.length; i++) {
  sectionObserver.observe(allSections[i]);
}

const linearAnimation = (sPos, tPosRelative, frame) =>
  sPos + (tPosRelative / 40) * frame;

function smoothScroll(target) {
  const targetPosition = target.offsetTop - window.scrollY;
  const startPosition = window.pageYOffset;
  let frame = 1;
  function step() {
    window.scrollTo(0, linearAnimation(startPosition, targetPosition, frame));
    // As far as i can see, using current time as logic condition ocasionally overshoots the animation by 1 frame
    if (frame < 40) window.requestAnimationFrame(step);
    frame++;
  }
  window.requestAnimationFrame(step);
}

// Scroll up or down to another section depending on parameters
function arrow(event, direction) {
  const target = event.target.closest("section").dataset.id;
  let section = event.target.closest("section").dataset.id;
  direction === "up" && section !== 1 && section--;
  direction === "down" && section !== sectionCount && section++;
  smoothScroll(document.getElementsByClassName(`section--${section}`)[0]); // Cross-browser scroll animation
  return false;
}

function toggleShowDescription(event) {
  const showText = "...show description...";
  const hideText = "...hide description...";
  const element = event.target;
  const toggleElement = event.target.previousElementSibling;
  if (toggleElement.classList.contains("hidden")) {
    toggleElement.classList.remove("hidden");
    element.innerHTML = hideText;
  } else {
    toggleElement.classList.add("hidden");
    element.innerHTML = showText;
  }
  return false;
}

////////////////////////////////////////
// Slider animation
const refContainer = document.getElementById("slider-refs");
const btnLeft = document.getElementById("slider__btn--left");
const btnRight = document.getElementById("slider__btn--right");
const slides = document.querySelectorAll(".slide");
const slidesLength = slides.length;
let currentSlide = 0;
// IIFE which adds clickable dots(divs) which relate to different slides by data-slide property
(function createRefButtons() {
  slides.forEach((slide, i) => {
    refContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="slide-ref dot-ref" data-slide="${i}"></button>`
    );
  });
})();
const sliderRefButtons = [...document.getElementsByClassName("slide-ref")];
function goToSlide(slideNumber) {
  const target = sliderRefButtons.filter((button) => {
    return button.dataset.slide == slideNumber;
  })[0];
  changeActiveStyles(target);
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - slideNumber)}%)`;
  });
}
refContainer.addEventListener("click", function (e) {
  const target = e.target;
  if (target.classList.contains("slide-ref")) {
    currentSlide = target.dataset.slide;
    goToSlide(currentSlide);
  }
});
function changeActiveStyles(target) {
  removeActiveRefClass();
  target.classList.add("active-ref");
}
function removeActiveRefClass() {
  sliderRefButtons.forEach((button) => {
    button.classList.remove("active-ref");
  });
}
goToSlide(currentSlide);
btnRight.addEventListener("click", () => {
  currentSlide != slidesLength - 1 ? currentSlide++ : (currentSlide = 0);
  goToSlide(currentSlide);
});
btnLeft.addEventListener("click", () => {
  currentSlide != 0 ? currentSlide-- : (currentSlide = slidesLength - 1);
  goToSlide(currentSlide);
});

////////////////////////////////////////
// Logic for social sections which makes anchor tags move in a circle
const socials = document.querySelectorAll(".social");
const socialsLength = socials.length;
const angleGap = 360 / socialsLength; //angle difference between two adjacent anchor tags
let angleChange = 0;
// Im used to using degrees so function toRadians helps me work easier with angles
function toRadians(angle) {
  return angle * (Math.PI / 180);
}
// Purpose is for responsiveness of the page
function getRadius(windowWidth) {
  return windowWidth < 720 ? 100 : 150;
}
let circleRadius = getRadius(window.innerWidth);
window.addEventListener(
  "resize",
  () => (circleRadius = getRadius(window.innerWidth))
);
function updateCircle() {
  socials.forEach((social, i) => {
    // Get width and height of the anchor tag
    // offWidth and offHeight are needed to center the element to the wanted position,
    const offWidth = social.offsetWidth / 2;
    const offHeight = social.offsetHeight / 2;
    const degree = toRadians(i * angleGap + angleChange);
    const cos = Math.round(circleRadius * Math.cos(degree));
    const sin = Math.round(circleRadius * Math.sin(degree));
    social.style.transform = `translate(${sin - offWidth}px, ${
      -cos - offHeight
    }px)`;
  });
  angleChange !== 359 ? angleChange++ : (angleChange = 0);
  setTimeout(updateCircle, 200);
}
updateCircle();
clearArrows();
// Following assures section arrows are shown and skillset section animation is played on page load if logic is satisfied
const height = window.innerHeight / 2;
const width = window.innerWidth / 2;
const sectionInCenter = document
  .elementFromPoint(width, height)
  .closest("section");
changeSkillsetBackgroundSize(sectionInCenter);
const sectionArrows = [...sectionInCenter.getElementsByClassName("arrow")];
sectionArrows.forEach((arrow) => {
  arrow.style.visibility = "visible";
});
