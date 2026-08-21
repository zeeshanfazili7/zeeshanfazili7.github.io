document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  const tiltCard = document.querySelector("[data-tilt]");

  menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    nav?.classList.toggle("open", !isOpen);
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton?.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
    });
  });

  if (tiltCard && window.matchMedia("(pointer: fine)").matches) {
    const visual = tiltCard.closest(".hero-visual");
    visual?.addEventListener("pointermove", (event) => {
      const bounds = visual.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      const rotateY = (x - 0.5) * 17;
      const rotateX = (0.5 - y) * 12;
      tiltCard.style.setProperty("--mx", `${x * 100}%`);
      tiltCard.style.setProperty("--my", `${y * 100}%`);
      tiltCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY - 7}deg)`;
    });
    visual?.addEventListener("pointerleave", () => {
      tiltCard.style.transform = "rotateY(-10deg) rotateX(4deg)";
    });
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  document.querySelectorAll(".reveal:not(.is-visible)").forEach((item) => {
    revealObserver.observe(item);
  });

  const sections = document.querySelectorAll("main section[id]");
  const navItems = nav?.querySelectorAll('a[href^="#"]');
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navItems?.forEach((item) => {
          item.classList.toggle("active", item.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-42% 0px -52%", threshold: 0 }
  );
  sections.forEach((section) => sectionObserver.observe(section));

  if (window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".project-tilt").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg) translateY(-2px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  const projectData = {
    atm: {
      title: "Mini ATM Machine",
      description: "A Python console application that follows a simple ATM flow from PIN verification to transaction confirmation.",
      concepts: ["Dictionary data", "While loop", "If / elif conditions", "Input validation"],
      learning: "I learned how a menu-driven program keeps running, checks user choices, and updates a balance safely."
    },
    bank: {
      title: "Bank Account Management System",
      description: "A beginner banking system for creating accounts and managing deposits, withdrawals, and balance checks.",
      concepts: ["Lists and indexes", "Account lookup", "Balance updates", "Validation rules"],
      learning: "I learned how related information can be stored, found by account number, and updated in the correct record."
    },
    cpp: {
      title: "C++ Logic Practice Lab",
      description: "A collection of small C++ programs made to practise core syntax and improve problem-solving logic.",
      concepts: ["For and while loops", "Variables and operators", "Console input / output", "Running totals"],
      learning: "I learned to trace a loop step by step, fix calculation mistakes, and understand how values change during execution."
    }
  };

  const modal = document.querySelector(".project-modal");
  const modalTitle = modal?.querySelector("#modal-title");
  const modalDescription = modal?.querySelector("[data-modal-description]");
  const modalConcepts = modal?.querySelector("[data-modal-concepts]");
  const modalLearning = modal?.querySelector("[data-modal-learning]");

  const closeModal = () => {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  };

  document.querySelectorAll("[data-project]").forEach((button) => {
    button.addEventListener("click", () => {
      const project = projectData[button.dataset.project];
      if (!project || !modal) return;
      modalTitle.textContent = project.title;
      modalDescription.textContent = project.description;
      modalLearning.textContent = project.learning;
      modalConcepts.replaceChildren(
        ...project.concepts.map((concept) => {
          const item = document.createElement("li");
          item.textContent = concept;
          return item;
        })
      );
      modal.hidden = false;
      document.body.classList.add("modal-open");
      modal.querySelector(".modal-close")?.focus();
    });
  });

  modal?.querySelectorAll("[data-modal-close]").forEach((button) => {
    button.addEventListener("click", closeModal);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal && !modal.hidden) closeModal();
  });

  const toast = document.querySelector(".toast");
  let toastTimer;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3800);
  };

  const PORTFOLIO_EMAIL = ""; // Add your email address here.
  const contactForm = document.querySelector("[data-contact-form]");
  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!PORTFOLIO_EMAIL) {
      showToast("Add your email address to PORTFOLIO_EMAIL in script.js to activate this form.");
      return;
    }
    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const sender = formData.get("email");
    const message = formData.get("message");
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${sender}\n\n${message}`);
    window.location.href = `mailto:${PORTFOLIO_EMAIL}?subject=${subject}&body=${body}`;
  });

  document.querySelectorAll("[data-year]").forEach((item) => {
    item.textContent = new Date().getFullYear();
  });
});
