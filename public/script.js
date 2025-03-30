let currentIndex = 0;
const items = document.querySelectorAll(".carousel-item");

function updateCarousel() {
    items.forEach((item, index) => {
        item.classList.remove("active", "prev", "next");

        if (index === currentIndex) {
            item.classList.add("active");
        } else if (index === (currentIndex - 1 + items.length) % items.length) {
            item.classList.add("prev");
        } else if (index === (currentIndex + 1) % items.length) {
            item.classList.add("next");
        } else {
            item.style.opacity = "0"; // Hide non-relevant elements
        }
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarousel();
}

// Initialize carousel on load
updateCarousel();
