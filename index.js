    const sectionCount = document.getElementsByTagName("section").length;
const allSections = document.getElementsByTagName("section");
const allArrows = document.getElementsByClassName("arrow");

function clearArrows(){
    for (const arrow of allArrows) {
        arrow.style.visibility = "hidden";
    }
    return false;
}
clearArrows();

const revealSection = function(entries, observer){
    const [entry] = entries;
    if(entry.isIntersecting){
        clearArrows();
        const sectionArrows = [...entry.target.getElementsByClassName("arrow")];
        sectionArrows.forEach(arrow=>{
            arrow.style.visibility = "visible";
        })
    }
}

const sectionObserver = new IntersectionObserver(
    revealSection,{root:null,threshold:0.8}
);

for( let i = 0 ; i < allSections.length ; i++ ){
    sectionObserver.observe(allSections[i]);
}

function arrow(event, direction){
    const target = event.target.closest("section").dataset.id;
    let section = event.target.closest("section").dataset.id;
    direction === 'up' && section !== 1 && section-- ;
    direction === 'down' && section !== sectionCount && section++;
    document.getElementsByClassName(`section--${section}`)[0].scrollIntoView({behavior:"smooth"});
    return false;
}

function toggleShowDescription(event){
    const showText = "...show description...";
    const hideText = "...hide description...";
    const element = event.target;
    const toggleElement = event.target.nextElementSibling;
    if(toggleElement.classList.contains("hidden")){
        toggleElement.classList.remove("hidden");
        element.innerHTML = hideText;
    }else{
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
(function createRefButtons(){
    slides.forEach((slide,i)=>{
        refContainer.insertAdjacentHTML("beforeend",
        `<button class="slide-ref" data-slide="${i}">${slide.id}</button>`)
    })
})();
const sliderRefButtons = [...document.getElementsByClassName("slide-ref")];
function goToSlide(slideNumber){
    const target = sliderRefButtons.filter((button)=>{
        return button.dataset.slide == slideNumber; 
    })[0];
    changeActiveStyles(target);
    slides.forEach((slide,i)=>{
        slide.style.transform = `translateX(${100 * (i - slideNumber)}%)`;
        // slide.classList.add("hidden");
    })
}
refContainer.addEventListener("click",function(e){
    const target = e.target;
    if(target.classList.contains("slide-ref")){
        currentSlide = target.dataset.slide;
        goToSlide(currentSlide);

    }
})
function changeActiveStyles(target){
    removeActiveRefClass();
    target.classList.add("active-ref");
}
function removeActiveRefClass(){
    sliderRefButtons.forEach(button=>{
        button.classList.remove("active-ref");
    })
}
goToSlide(currentSlide);
btnRight.addEventListener('click',()=>{
    currentSlide != slidesLength - 1 ? currentSlide++: currentSlide = 0;
    goToSlide(currentSlide);
});
btnLeft.addEventListener('click',()=>{
    currentSlide != 0 ? currentSlide-- : currentSlide = slidesLength - 1;
    goToSlide(currentSlide);
});

////////////////////////////////////////
// Circular anchors
const socials = document.querySelectorAll(".social");
const socialsLength = socials.length;
const angleGap = 360 / socialsLength;
let angleChange = 0;
function toRadians (angle) {
    return angle * (Math.PI/180);
}
function updateCircle(){
    socials.forEach((social,i)=>{
        const offWidth = social.offsetWidth / 2;
        const offHeight = social.offsetHeight / 2;
        const degree = toRadians(i * angleGap + angleChange);
        const cos = Math.round(150 * Math.cos(degree));
        const sin = Math.round(150 * Math.sin(degree));
        social.style.transform = 
        `translate(${sin - offWidth}px, ${-cos - offHeight}px)`;
    })
    angleChange !== 359 ? angleChange++: angleChange = 0;
    setTimeout(updateCircle, 200);
}
// Timeout because offsetWidth and offsetHeight return nonsensical values otherwise
setTimeout(() => {
        updateCircle();
}, 100);

