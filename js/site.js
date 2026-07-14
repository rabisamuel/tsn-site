// The Sixteenth Night — site behavior
// All blocks check for required elements before running, so this file
// is safe to load on every page even when features only exist on one.

(function () {
  "use strict";

  // ---------- Mobile nav toggle ----------
  const toggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");

  if (toggle && navList) {
    toggle.addEventListener("click", function () {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      navList.classList.toggle("open");
    });

    navList.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navList.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---------- Scroll-triggered fade-in ----------
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".fade-in").forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll(".fade-in").forEach(function (el) {
      el.classList.add("visible");
    });
  }

  // ---------- Newsletter form ----------
  // If you wire this to Mailchimp/Buttondown/ConvertKit, remove the e.preventDefault()
  // line and set the form's `action` attribute to the provider's endpoint.
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = newsletterForm.querySelector(".newsletter-input");
      const btn = newsletterForm.querySelector("button");
      if (input && input.value && btn) {
        btn.textContent = "Subscribed";
        btn.disabled = true;
        input.value = "";
      }
    });
  }

  // ---------- Gallery image modal ----------
  // Only runs on pages that have both gallery images and a modal element.
  const galleryModal = document.getElementById("imgModal");
  const galleryImgs = document.querySelectorAll(".gallery-img");

  if (galleryModal && galleryImgs.length > 0) {
    const modalImg = document.getElementById("modalImg");
    const caption = document.getElementById("caption");
    const closeBtn = galleryModal.querySelector(".close");

    galleryImgs.forEach(function (img) {
      img.addEventListener("click", function () {
        galleryModal.style.display = "block";
        modalImg.src = img.dataset.full || img.src;
        caption.textContent = img.dataset.caption || img.alt || "";
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        galleryModal.style.display = "none";
      });
    }

    galleryModal.addEventListener("click", function (e) {
      if (e.target === galleryModal) {
        galleryModal.style.display = "none";
      }
    });

    // Esc key closes the modal
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && galleryModal.style.display === "block") {
        galleryModal.style.display = "none";
      }
    });
  }
  // ---------- Trailer modal ----------
  const trailerPoster = document.getElementById("trailerPoster");
  const trailerModal = document.getElementById("trailerModal");
  const trailerIframe = document.getElementById("trailerIframe");
  const trailerClose = document.getElementById("trailerModalClose");
  const TRAILER_EMBED = "https://www.youtube.com/embed/7UCQMHaWK-o?autoplay=1&rel=0";

  if (trailerPoster && trailerModal && trailerIframe) {
    function openTrailer() {
      trailerIframe.src = TRAILER_EMBED;
      trailerModal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
    function closeTrailer() {
      trailerIframe.src = "";
      trailerModal.classList.remove("active");
      document.body.style.overflow = "";
    }

    trailerPoster.addEventListener("click", openTrailer);
    trailerPoster.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openTrailer();
      }
    });

    if (trailerClose) {
      trailerClose.addEventListener("click", closeTrailer);
    }

    trailerModal.addEventListener("click", function (e) {
      if (e.target === trailerModal) closeTrailer();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && trailerModal.classList.contains("active")) {
        closeTrailer();
      }
    });
  }
})();


// ---------- Amazon regional routing ----------
const amazonDomains = {
  US: "https://www.amazon.com/dp/",
  CA: "https://www.amazon.ca/dp/",
  GB: "https://www.amazon.co.uk/dp/",
  AU: "https://www.amazon.com.au/dp/",
  IN: "https://www.amazon.in/dp/",
  DE: "https://www.amazon.de/dp/",
  FR: "https://www.amazon.fr/dp/",
  IT: "https://www.amazon.it/dp/",
  ES: "https://www.amazon.es/dp/",
  NL: "https://www.amazon.nl/dp/",
  JP: "https://www.amazon.co.jp/dp/",
  MX: "https://www.amazon.com.mx/dp/",
  BR: "https://www.amazon.com.br/dp/",
  AE: "https://www.amazon.ae/dp/",
  SG: "https://www.amazon.sg/dp/",
  SE: "https://www.amazon.se/dp/",
  PL: "https://www.amazon.pl/dp/"
};

// PLACEHOLDER: replace with the real ASIN once the KDP listing is live.
// Every .amazon-buy element uses data-asin, so one change here is not
// needed — update the data-asin attributes in the HTML instead.
const ASIN_PLACEHOLDER = "PLACEHOLDER_ASIN";

const amazonButtons = document.querySelectorAll(".amazon-buy");
if (amazonButtons.length > 0) {
  const setLinks = function (countryCode) {
    amazonButtons.forEach(function (btn) {
      const asin = btn.getAttribute("data-asin");
      // Skip routing until the real ASIN is in place
      if (!asin || asin === ASIN_PLACEHOLDER) return;
      const base = amazonDomains[countryCode] || amazonDomains.US;
      btn.href = base + asin;
    });
  };

  const cachedCountry = sessionStorage.getItem("tsn_country");
  if (cachedCountry) {
    setLinks(cachedCountry);
  } else {
    fetch("https://api.country.is")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        const country = (data && data.country) || "US";
        sessionStorage.setItem("tsn_country", country);
        setLinks(country);
      })
      .catch(function () {
        setLinks("US");
      });
  }
}
