document.addEventListener("DOMContentLoaded", () => {

    const track = document.getElementById("carouselTrack");
    const slides = Array.from(track.children);
    const nextButton = document.getElementById("nextBtn");
    const prevButton = document.getElementById("prevBtn");
    const indicatorsNav = document.querySelector(".carousel-indicators");
    const indicators = Array.from(indicatorsNav.children);

    const slideWidth = slides[0].getBoundingClientRect().width;
    let currentIndex = 0;
    let autoSlideInterval;

    const moveToSlide = (targetIndex) => {
        if (targetIndex < 0) {
            targetIndex = slides.length - 1;
        } else if (targetIndex >= slides.length) {
            targetIndex = 0;
        }

        track.style.transform = 'translateX(-' + (slideWidth * targetIndex) + 'px)';
        
        slides[currentIndex].classList.remove('active');
        indicators[currentIndex].classList.remove('active');
        
        currentIndex = targetIndex;
        
        slides[currentIndex].classList.add('active');
        indicators[currentIndex].classList.add('active');
    };

    nextButton.addEventListener("click", () => {
        moveToSlide(currentIndex + 1);
        resetAutoSlide();
    });

    prevButton.addEventListener("click", () => {
        moveToSlide(currentIndex - 1);
        resetAutoSlide();
    });

    indicatorsNav.addEventListener("click", e => {
        const targetIndicator = e.target.closest('span.indicator');
        if (!targetIndicator) return;

        const targetIndex = indicators.findIndex(dot => dot === targetIndicator);
        moveToSlide(targetIndex);
        resetAutoSlide();
    });
    
    window.addEventListener('resize', () => {
        const newSlideWidth = slides[0].getBoundingClientRect().width;
        track.style.transition = 'none'; 
        track.style.transform = 'translateX(-' + (newSlideWidth * currentIndex) + 'px)';
        setTimeout(() => {
            track.style.transition = 'transform 0.6s ease-in-out'; 
        }, 50);
    });

    const startAutoSlide = () => {
        autoSlideInterval = setInterval(() => {
            moveToSlide(currentIndex + 1);
        }, 7000); 
    };

    const resetAutoSlide = () => {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    };

    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.2 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);


    fadeElements.forEach(el => {
        observer.observe(el);
    });
    
    startAutoSlide();
});