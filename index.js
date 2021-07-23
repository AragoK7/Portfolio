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
        console.log("isIntersecting", entry.target)
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