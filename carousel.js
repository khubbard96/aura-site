(function() {
    if (
        document.readyState === "complete" ||
        (document.readyState !== "loading" && !document.documentElement.doScroll)
    ) {
        init();
    } else {
        document.addEventListener("DOMContentLoaded", init);
    }
    const defaultDir="left";
    var carouselContainer;
    var carouselImages;
    var init=function() {
        //controls
        carouselContainer=document.getElementsById("home-page-carousel");
        carouselImages=carouselContainer.getElementsByClassName("carousel-images");
        let controlsCont=document.getElementsByClassName("carusel-controls");
        let arrowLeft=controlsCont.getElementsByClassName("carousel-left")[0];
        let arrowRight=controlsCont.getElementsByClassName("carousel-right")[0];
        arrowLeft.onclick=function() {
            advanceCarousel("left");
        }
        arrowRight.onclick=function() {
            advanceCarousel("right");
        }
        carouselImages[0].dataset.active=true;
        carouselImages[1].dataset.staged=true;
        carouselImages[carouselImages.length-1].dataset.staged=true;
    }


    var advanceCarousel=function(direction) {
        if(!direction) direction=defaultDir;


    }

});