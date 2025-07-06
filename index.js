document.addEventListener("DOMContentLoaded", () => {
  // --- Navbar Dropdown Logic ---
  const schoolName = document.getElementById("schoolName");
  const dropdown = document.getElementById("dropdown");
  const profile = document.getElementById("profile");
  const upload = document.getElementById("upload");

  schoolName?.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!schoolName.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });

  // --- Profile Image Upload ---
  if (profile && upload) {
    profile.style.backgroundImage = "url('logo.png')";
    profile.addEventListener("click", () => upload.click());

    upload.addEventListener("change", () => {
      const file = upload.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          profile.style.backgroundImage = `url('${reader.result}')`;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // --- Typewriter Effect ---
  const text = "Welcome to Nethaji Silambam School";
  const typeEl = document.getElementById("typewriterText");
  let index = 0;
  let isDeleting = false;

  function typeLoop() {
    if (!typeEl) return;
    typeEl.textContent = text.substring(0, index);
    if (!isDeleting) {
      index++;
      if (index <= text.length) {
        setTimeout(typeLoop, 100);
      } else {
        isDeleting = true;
        setTimeout(typeLoop, 1500);
      }
    } else {
      index--;
      if (index >= 0) {
        setTimeout(typeLoop, 50);
      } else {
        isDeleting = false;
        setTimeout(typeLoop, 500);
      }
    }
  }

  typeLoop();

  // --- Quote Carousel ---
  const quoteTrack = document.querySelector(".quote-track");
  const quoteSlides = Array.from(quoteTrack?.children || []);
  const quoteNextBtn = document.querySelector(".next-btn");
  const quotePrevBtn = document.querySelector(".prev-btn");
  let quoteCurrentIndex = 0;

  const updateQuoteCarousel = () => {
    if (!quoteTrack || quoteSlides.length === 0) return;
    const slideWidth = quoteSlides[0].getBoundingClientRect().width;
    quoteTrack.style.transform = `translateX(-${quoteCurrentIndex * slideWidth}px)`;
  };

  const moveToNextQuote = () => {
    quoteCurrentIndex = (quoteCurrentIndex + 1) % quoteSlides.length;
    updateQuoteCarousel();
  };

  const moveToPrevQuote = () => {
    quoteCurrentIndex = (quoteCurrentIndex - 1 + quoteSlides.length) % quoteSlides.length;
    updateQuoteCarousel();
  };

  quoteNextBtn?.addEventListener("click", moveToNextQuote);
  quotePrevBtn?.addEventListener("click", moveToPrevQuote);
  window.addEventListener("resize", updateQuoteCarousel);

  updateQuoteCarousel();
  setInterval(() => moveToNextQuote(), 5000);

  // --- Image Carousel (Ground Images) ---
  const imgCarousel = document.querySelector(".carousel");
  const imgSlides = document.querySelectorAll(".carousel-slide");
  const imgNextBtn = document.querySelector(".carousel-container .img-next-btn");
  const imgPrevBtn = document.querySelector(".carousel-container .img-prev-btn");
  let imgCurrentIndex = 0;

  const updateImageCarousel = () => {
    const slideWidth = imgSlides[0]?.clientWidth || 0;
    if (imgCarousel) {
      imgCarousel.style.transform = `translateX(-${imgCurrentIndex * slideWidth}px)`;
    }
  };

  imgNextBtn?.addEventListener("click", () => {
    imgCurrentIndex = (imgCurrentIndex + 1) % imgSlides.length;
    updateImageCarousel();
  });

  imgPrevBtn?.addEventListener("click", () => {
    imgCurrentIndex = (imgCurrentIndex - 1 + imgSlides.length) % imgSlides.length;
    updateImageCarousel();
  });

  window.addEventListener("resize", updateImageCarousel);
  updateImageCarousel();
});
