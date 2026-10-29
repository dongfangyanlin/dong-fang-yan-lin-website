(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.body.classList.add("page-enter");
    }

    const menuToggle = document.querySelector(".menu-toggle");
    const pageNav = document.querySelector(".page-nav");

    if (menuToggle && pageNav) {
        const openLabel = menuToggle.getAttribute("aria-label");
        const closeLabel = document.documentElement.lang.startsWith("zh")
            ? "關閉導覽選單"
            : "Close navigation menu";
        const closeMenu = () => {
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", openLabel);
            pageNav.classList.remove("is-open");
        };

        menuToggle.addEventListener("click", () => {
            const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", String(!isExpanded));
            menuToggle.setAttribute("aria-label", isExpanded ? openLabel : closeLabel);
            pageNav.classList.toggle("is-open", !isExpanded);
        });

        window.matchMedia("(min-width: 561px)").addEventListener("change", (event) => {
            if (event.matches) {
                closeMenu();
            }
        });

        pageNav.addEventListener("click", (event) => {
            if (event.target instanceof Element && event.target.closest("a")) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
                closeMenu();
                menuToggle.focus();
            }
        });
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
        return;
    }

    const textElements = document.querySelectorAll(
        ".container h1, .container h2, .container h3, .container p, .container li, .subtitle, .tagline, .hero-quote"
    );
    let contentOrder = 0;

    textElements.forEach((element) => {
        if (/^H[1-3]$/.test(element.tagName)) {
            contentOrder = 0;
        } else {
            contentOrder += 1;
        }

        element.style.setProperty("--reveal-delay", `${Math.min(contentOrder * 75, 300)}ms`);
    });

    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) {
                continue;
            }

            const element = entry.target;
            element.classList.add("text-reveal");
            observer.unobserve(element);
        }
    }, { threshold: 0.15 });

    textElements.forEach((element) => observer.observe(element));

    const images = document.querySelectorAll(".hero-logo, .stream-cover");
    const imageObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) {
                continue;
            }

            const element = entry.target;
            element.classList.add("image-reveal");
            imageObserver.unobserve(element);
        }
    }, { threshold: 0.1 });

    images.forEach((image, index) => {
        image.style.setProperty("--image-reveal-delay", `${Math.min(index * 100, 700)}ms`);
        imageObserver.observe(image);
    });
})();
