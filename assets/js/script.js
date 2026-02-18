document.addEventListener("DOMContentLoaded", function () {
  const firstRow = document.querySelector(".first-row");
  const secondRow = document.querySelector(".second-row");
  const projectsContainer = document.querySelector(".projects");
  const swipeLeftBtn = document.getElementById("swipe-left");
  const swipeRightBtn = document.getElementById("swipe-right");

  const normalizeText = (str) => (str || "").replace(/\s+/g, " ").trim();

  const splitTextIntoCharacters = (element) => {
    const raw = element.textContent || "";
    const text = normalizeText(raw);
    element.innerHTML = "";

    text.split("").forEach((char, index) => {
      const span = document.createElement("span");
      span.className = "char-animated";
      if (char === " ") {
        span.innerHTML = "&nbsp;";
      } else {
        span.textContent = char;
      }
      span.style.animationDelay = `${index * 0.05}s`;
      element.appendChild(span);
    });
  };

  const splitTextIntoWords = (element) => {
    const raw = element.textContent || "";
    const text = normalizeText(raw);
    if (!text) return;
    const words = text.split(" ");
    element.innerHTML = "";

    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.className = "word-animated";
      span.textContent = word;
      span.style.animationDelay = `${index * 0.12}s`;
      element.appendChild(span);
      element.appendChild(document.createTextNode(" "));
    });
  };

  const animateSpans = (element) => {
    const chars = element.querySelectorAll(".char-animated, .word-animated");
    chars.forEach((char) => char.classList.add("animate"));
  };

  const introElements = document.querySelectorAll(".intro-text p");

  const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateSpans(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  introElements.forEach((element) => {
    if (element.closest(".first-row") || element.closest(".second-row")) return;
    splitTextIntoWords(element);
    observer.observe(element);
  });

  const projectCards = document.querySelectorAll(".projects .project-card");
  if (projectCards.length) {
    const projectsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = Array.from(projectCards);
            const idx = cards.indexOf(entry.target);
            const delay = (idx >= 0 ? idx : 0) * 0.12;
            entry.target.style.transitionDelay = `${delay}s`;
            entry.target.classList.add("animate");
            projectsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    projectCards.forEach((card) => projectsObserver.observe(card));
  }

  if (swipeLeftBtn && swipeRightBtn && projectsContainer) {
    const scrollAmount = 400;
    let isScrolling = false;

    const smoothScroll = (target, duration = 600) => {
      if (isScrolling) return;
      isScrolling = true;

      const start = projectsContainer.scrollLeft;
      const distance = target - start;
      const startTime = Date.now();

      const animateScroll = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeProgress =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        projectsContainer.scrollLeft = start + distance * easeProgress;

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          isScrolling = false;
        }
      };

      requestAnimationFrame(animateScroll);
    };

    swipeLeftBtn.addEventListener("click", function () {
      smoothScroll(projectsContainer.scrollLeft - scrollAmount);
    });

    swipeRightBtn.addEventListener("click", function () {
      smoothScroll(projectsContainer.scrollLeft + scrollAmount);
    });
  }

  window.addEventListener("scroll", function () {
    const scrollY = window.scrollY;

    const firstRowTranslate = -(scrollY * 0.5);
    console.log(firstRowTranslate);

    const secondRowTranslate = scrollY * 0.5;

    if (firstRow) {
      firstRow.style.transform = `translateX(calc(-50% + ${firstRowTranslate}px))`;
    }

    if (secondRow) {
      secondRow.style.transform = `translateX(calc(-50% + ${secondRowTranslate}px))`;
    }
  });

  const hamburger = document.getElementById("hamburger");
  const navMenus = document.getElementById("nav-menus");
  const closeBtn = document.querySelector(".close-btn");

  if (hamburger && navMenus) {
    hamburger.addEventListener("click", () => {
      navMenus.classList.add("active");
    });
  }

  if (closeBtn && navMenus) {
    closeBtn.addEventListener("click", () => {
      navMenus.classList.remove("active");
    });
  }

  const navLinks = document.querySelectorAll(".nav-menus li a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenus) navMenus.classList.remove("active");
    });
  });
});
