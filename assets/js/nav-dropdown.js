/*
 * Masthead dropdown toggle.
 * A nav entry with children but no url renders as `.masthead__menu-toggle`
 * (an <a> without href, so it never navigates). Clicking it opens/closes the
 * submenu by toggling `is-open` on the parent <li>; CSS :hover keeps working
 * on top of that. Listeners are delegated on #site-nav because the greedy-nav
 * script moves whole <li>s between .visible-links and .hidden-links.
 */
(() => {
  "use strict";

  const nav = document.getElementById("site-nav");
  if (!nav) return;

  const PARENT = ".masthead__menu-item--has-children";

  const setOpen = (item, open) => {
    item.classList.toggle("is-open", open);
    const toggle = item.querySelector(".masthead__menu-toggle");
    if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  const closeAll = (except) => {
    nav.querySelectorAll(PARENT + ".is-open").forEach((item) => {
      if (item !== except) setOpen(item, false);
    });
  };

  const toggleFrom = (target) => {
    const toggle = target.closest(".masthead__menu-toggle");
    if (!toggle) return null;
    const item = toggle.closest(PARENT);
    if (!item) return null;
    const open = !item.classList.contains("is-open");
    closeAll(item);
    setOpen(item, open);
    return toggle;
  };

  nav.addEventListener("click", (event) => {
    if (toggleFrom(event.target)) event.preventDefault();
  });

  nav.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar") return;
    // An <a> without href fires no click from the keyboard, so drive it here.
    if (toggleFrom(event.target)) event.preventDefault();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(PARENT)) closeAll();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const open = nav.querySelector(PARENT + ".is-open");
    if (!open) return;
    const toggle = open.querySelector(".masthead__menu-toggle");
    setOpen(open, false);
    if (toggle) toggle.focus();
  });
})();