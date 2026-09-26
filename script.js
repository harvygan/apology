/*
 * The page stays framework-free on purpose: this project currently ships as
 * a static HTML experience, so the interactions live here in small, focused
 * pieces instead of adding a large dependency.
 */

const root = document.documentElement;
root.classList.add("js");

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const body = document.body;
const navToggle = $("#nav-toggle");
const navMenu = $("#nav-menu");
const navLinks = $$(".nav-menu a");

function closeNavigation() {
  body.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open navigation");
}

navToggle?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navLinks.forEach((link) => link.addEventListener("click", closeNavigation));

const sectionIds = ["home", "memories", "reasons", "letter", "always"];
const sectionObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-30% 0px -60% 0px", threshold: 0 })
  : null;

sectionIds.forEach((id) => {
  const section = document.getElementById(id);
  if (section && sectionObserver) sectionObserver.observe(section);
});

const revealItems = $$(".reveal");
revealItems.forEach((item) => item.classList.add("reveal-ready"));
$(".hero-copy")?.classList.add("is-visible");
$(".hero-art")?.classList.add("is-visible");

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -45px 0px" });
  revealItems.forEach((item) => revealObserver.observe(item));
}

/* Music: the player is the supplied YouTube track, kept visually hidden. */
const songFrame = $("#song-frame");
const musicToggle = $("#music-toggle");
const musicMute = $("#music-mute");
const musicLabel = $("#music-label");
const musicIcon = $("#music-icon");
let musicPlaying = false;
let musicMuted = false;

function sendYouTubeCommand(func, args = []) {
  songFrame?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), "*");
}

function updateMusicUi() {
  if (!musicLabel || !musicToggle) return;
  musicLabel.textContent = musicPlaying ? "pause music" : "play music";
  musicToggle.setAttribute("aria-label", musicPlaying ? "Pause our song" : "Play our song");
  if (musicIcon) musicIcon.textContent = musicPlaying ? "Ⅱ" : "♪";
  musicMute?.setAttribute("aria-label", musicMuted ? "Unmute music" : "Mute music");
  musicMute?.setAttribute("aria-pressed", String(musicMuted));
  if (musicMute) musicMute.textContent = musicMuted ? "⊘" : "⌁";
}

function startMusic() {
  sendYouTubeCommand("playVideo");
  musicPlaying = true;
  updateMusicUi();
}

function pauseMusic() {
  sendYouTubeCommand("pauseVideo");
  musicPlaying = false;
  updateMusicUi();
}

musicToggle?.addEventListener("click", () => {
  if (musicPlaying) pauseMusic();
  else startMusic();
});

musicMute?.addEventListener("click", () => {
  musicMuted = !musicMuted;
  sendYouTubeCommand(musicMuted ? "mute" : "unMute");
  updateMusicUi();
});

$$('[data-start-music]').forEach((button) => button.addEventListener("click", startMusic));

songFrame?.addEventListener("load", () => {
  sendYouTubeCommand("addEventListener", ["onStateChange"]);
  if (!prefersReducedMotion) window.setTimeout(startMusic, 500);
});

window.addEventListener("message", (event) => {
  if (typeof event.data !== "string") return;
  try {
    const payload = JSON.parse(event.data);
    if (payload.event !== "onStateChange") return;
    if (payload.info === 1) musicPlaying = true;
    if ([0, 2, 5].includes(payload.info)) musicPlaying = false;
    updateMusicUi();
  } catch {
    // Messages from the embed that are not JSON can be ignored safely.
  }
});

window.addEventListener("pointerdown", (event) => {
  if (event.target.closest("#music-dock")) return;
  if (!musicPlaying) startMusic();
}, { once: true, passive: true });

/* Photo stories */
const storyViewer = $("#story-viewer");
const storyBackdrop = $("#story-backdrop");
const storyImage = $("#story-image");
const storyCaption = $("#story-caption");
const storyProgress = $("#story-progress");
const storyCounter = $("#story-counter");
const storyPhoto = $(".story-photo");
const storyStage = $("#story-stage");
const storyButtons = $$(".story-thumb");
const storyCaptions = [
  "My favorite smile.",
  "A little moment that became one of my favorites.",
  "The small things are everything.",
  "Every version of you is beautiful to me.",
  "A memory I never want to lose.",
  "You make ordinary days feel special.",
  "Always you."
];
const stories = storyButtons.map((button, index) => {
  const image = $("img", button);
  return { src: image?.getAttribute("src") || "", alt: image?.getAttribute("alt") || "A favorite memory", caption: storyCaptions[index] };
});
let storyIndex = 0;
let storyTimer = null;
let storyLastFocus = null;

function clearStoryTimer() {
  if (storyTimer) window.clearTimeout(storyTimer);
  storyTimer = null;
}

function scheduleStory() {
  clearStoryTimer();
  if (prefersReducedMotion || storyViewer?.hidden) return;
  storyTimer = window.setTimeout(() => showStory(storyIndex + 1), 5000);
}

function renderStoryProgress() {
  if (!storyProgress) return;
  storyProgress.innerHTML = stories.map((_, index) => `<span class="${index < storyIndex ? "is-complete" : ""} ${index === storyIndex ? "is-current" : ""}"></span>`).join("");
}

function showStory(nextIndex) {
  if (!stories.length) return;
  storyIndex = (nextIndex + stories.length) % stories.length;
  const story = stories[storyIndex];
  storyPhoto?.classList.add("is-changing");
  window.setTimeout(() => {
    if (!storyImage || !storyBackdrop || !storyCaption) return;
    storyImage.src = story.src;
    storyImage.alt = story.alt;
    storyBackdrop.style.backgroundImage = `url("${story.src}")`;
    storyCaption.textContent = story.caption;
    storyCounter.textContent = `${storyIndex + 1} / ${stories.length}`;
    renderStoryProgress();
    storyPhoto?.classList.remove("is-changing");
  }, prefersReducedMotion ? 0 : 110);
  scheduleStory();
}

function openStory(index) {
  storyLastFocus = document.activeElement;
  storyViewer.hidden = false;
  body.classList.add("dialog-open");
  showStory(index);
  $("#story-close")?.focus();
}

function closeStory() {
  clearStoryTimer();
  if (storyViewer) storyViewer.hidden = true;
  body.classList.remove("dialog-open");
  storyLastFocus?.focus();
}

storyButtons.forEach((button) => button.addEventListener("click", () => openStory(Number(button.dataset.storyIndex || 0))));
$("#story-close")?.addEventListener("click", closeStory);
$("#story-prev")?.addEventListener("click", () => showStory(storyIndex - 1));
$("#story-next")?.addEventListener("click", () => showStory(storyIndex + 1));

storyStage?.addEventListener("pointerenter", clearStoryTimer);
storyStage?.addEventListener("pointerleave", scheduleStory);
storyStage?.addEventListener("focusin", clearStoryTimer);
storyStage?.addEventListener("focusout", scheduleStory);

let touchStartX = 0;
storyStage?.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
storyStage?.addEventListener("touchend", (event) => {
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) < 42) return;
  showStory(delta < 0 ? storyIndex + 1 : storyIndex - 1);
}, { passive: true });

/* Gallery lightbox */
const lightbox = $("#lightbox");
const lightboxImage = $("#lightbox-image");
const lightboxCaption = $("#lightbox-caption");
const memoryTiles = $$(".memory-tile");
let lightboxLastFocus = null;

function openLightbox(tile) {
  lightboxLastFocus = document.activeElement;
  lightboxImage.src = tile.dataset.full || "";
  lightboxImage.alt = $("img", tile)?.alt || "A favorite memory";
  lightboxCaption.textContent = tile.dataset.caption || "A memory I hold close.";
  lightbox.hidden = false;
  body.classList.add("dialog-open");
  $("#lightbox-close")?.focus();
}

function closeLightbox() {
  if (lightbox) lightbox.hidden = true;
  body.classList.remove("dialog-open");
  lightboxLastFocus?.focus();
}

memoryTiles.forEach((tile) => tile.addEventListener("click", () => openLightbox(tile)));
$("#lightbox-close")?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => { if (event.target === lightbox) closeLightbox(); });

/* Final note: a small reveal instead of a loud celebration. */
const finalMessageButton = $("#final-message-button");
const finalMessage = $("#final-message");

function createTinyHearts() {
  if (prefersReducedMotion) return;
  for (let index = 0; index < 7; index += 1) {
    const heart = document.createElement("span");
    heart.className = "tiny-heart";
    heart.textContent = "♡";
    heart.style.left = `${45 + Math.random() * 10}%`;
    heart.style.top = `${58 + Math.random() * 8}%`;
    heart.style.setProperty("--drift", `${-40 + Math.random() * 80}px`);
    heart.style.animationDelay = `${index * 80}ms`;
    document.body.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove(), { once: true });
  }
}

finalMessageButton?.addEventListener("click", () => {
  const isOpen = !finalMessage.hidden;
  finalMessage.hidden = isOpen;
  finalMessageButton.setAttribute("aria-expanded", String(!isOpen));
  finalMessageButton.innerHTML = isOpen ? "One more thing <span aria-hidden=\"true\">♡</span>" : "Keep this little note <span aria-hidden=\"true\">♡</span>";
  if (!isOpen) createTinyHearts();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNavigation();
    if (storyViewer && !storyViewer.hidden) closeStory();
    if (lightbox && !lightbox.hidden) closeLightbox();
  }
  if (storyViewer && !storyViewer.hidden) {
    if (event.key === "ArrowLeft") showStory(storyIndex - 1);
    if (event.key === "ArrowRight") showStory(storyIndex + 1);
  }
});
