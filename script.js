/* ==============================
   Romantic Apology Website Scripts
   Handles menu, animation, gallery, modal, music
================================= */

const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("#nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const revealItems = document.querySelectorAll(".reveal");
const typingText = document.querySelector(".typing-text");
const rippleTargets = document.querySelectorAll(".ripple-link");
const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const closeLightbox = document.querySelector("#close-lightbox");
const loveModal = document.querySelector("#love-modal");
const openModal = document.querySelector("#open-modal");
const closeModal = document.querySelector("#close-modal");
const audio = document.querySelector("#background-music");
const playBtn = document.querySelector("#play-btn");
const pauseBtn = document.querySelector("#pause-btn");
const volumeSlider = document.querySelector("#volume-slider");
const loopToggle = document.querySelector("#loop-toggle");

let lastFocusedElement = null;

function closeMenu() {
  body.classList.remove("menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
}

function openDialog(dialog, focusTarget) {
  lastFocusedElement = document.activeElement;
  dialog.hidden = false;
  body.classList.add("modal-open");
  setTimeout(() => focusTarget?.focus(), 20);
}

function closeDialog(dialog) {
  dialog.hidden = true;
  body.classList.remove("modal-open");
  lastFocusedElement?.focus();
}

menuToggle?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    if (!lightbox.hidden) closeDialog(lightbox);
    if (!loveModal.hidden) closeDialog(loveModal);
  }
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -60px 0px" });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

function typeHeroText() {
  if (!typingText) return;
  const text = typingText.dataset.text || "";
  let index = 0;

  function writeNextCharacter() {
    typingText.textContent = text.slice(0, index);
    index += 1;

    if (index <= text.length) {
      window.setTimeout(writeNextCharacter, text[index - 1] === "\n" ? 170 : 34);
    }
  }

  writeNextCharacter();
}

window.addEventListener("load", typeHeroText);

rippleTargets.forEach((target) => {
  target.addEventListener("click", (event) => {
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");

    ripple.className = "ripple";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

    target.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
});

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    const image = item.querySelector("img");
    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = image?.alt || "Expanded memory image";
    openDialog(lightbox, closeLightbox);
  });
});

closeLightbox?.addEventListener("click", () => closeDialog(lightbox));
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeDialog(lightbox);
});

function createHeartBurst() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  for (let i = 0; i < 24; i += 1) {
    const heart = document.createElement("span");
    const angle = (Math.PI * 2 * i) / 24;
    const distance = 90 + Math.random() * 130;

    heart.className = "burst-heart";
    heart.textContent = "❤";
    heart.style.left = `${centerX}px`;
    heart.style.top = `${centerY}px`;
    heart.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    heart.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
    heart.style.animationDelay = `${Math.random() * 0.14}s`;

    document.body.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove());
  }
}

openModal?.addEventListener("click", () => {
  openDialog(loveModal, closeModal);
  createHeartBurst();
});

closeModal?.addEventListener("click", () => closeDialog(loveModal));
loveModal?.addEventListener("click", (event) => {
  if (event.target === loveModal) closeDialog(loveModal);
});

if (audio) {
  audio.volume = Number(volumeSlider?.value || 0.45);
}

async function playMusic() {
  if (!audio) return;

  try {
    await audio.play();
    playBtn?.setAttribute("aria-label", "Music is playing");
  } catch (error) {
    playBtn?.setAttribute("aria-label", "Tap to play music");
  }
}

function playMusicAfterFirstInteraction() {
  playMusic();
  window.removeEventListener("pointerdown", playMusicAfterFirstInteraction);
  window.removeEventListener("keydown", playMusicAfterFirstInteraction);
}

window.addEventListener("load", playMusic);
window.addEventListener("pointerdown", playMusicAfterFirstInteraction, { once: true });
window.addEventListener("keydown", playMusicAfterFirstInteraction, { once: true });

playBtn?.addEventListener("click", async () => {
  playMusic();
});

pauseBtn?.addEventListener("click", () => {
  audio.pause();
});

volumeSlider?.addEventListener("input", () => {
  audio.volume = Number(volumeSlider.value);
});

loopToggle?.addEventListener("change", () => {
  audio.loop = loopToggle.checked;
});
