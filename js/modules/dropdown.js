/* ==========================================================================
   Custom dropdown — replaces native <select> with a styled menu
   - Always-visible chevron
   - Keyboard accessible (Arrow keys, Enter, Esc)
   - Click outside to close
   ========================================================================== */

export function initDropdowns() {
  document.querySelectorAll(".brands__dropdown").forEach(setupDropdown);
}

function setupDropdown(dropdown) {
  const toggle = dropdown.querySelector(".brands__dropdown-toggle");
  const valueEl = dropdown.querySelector(".brands__dropdown-value");
  const menu = dropdown.querySelector(".brands__dropdown-menu");
  const items = [...dropdown.querySelectorAll(".brands__dropdown-item")];
  if (!toggle || !valueEl || !menu || !items.length) return;

  let focusedIndex = -1;

  function open() {
    dropdown.classList.add("is-open");
    dropdown.setAttribute("aria-expanded", "true");
    // Move focus to selected item or first
    const selected = items.findIndex((i) =>
      i.classList.contains("is-selected")
    );
    focusedIndex = selected >= 0 ? selected : 0;
    items[focusedIndex].focus();
  }

  function close() {
    dropdown.classList.remove("is-open");
    dropdown.setAttribute("aria-expanded", "false");
    focusedIndex = -1;
  }

  function select(item) {
    items.forEach((i) => i.classList.remove("is-selected"));
    item.classList.add("is-selected");
    valueEl.textContent = item.textContent.trim();
    valueEl.classList.remove("brands__dropdown-value--placeholder");
    dropdown.setAttribute("data-value", item.dataset.value);
    close();
    toggle.focus();
  }

  toggle.addEventListener("click", () => {
    if (dropdown.classList.contains("is-open")) close();
    else open();
  });

  items.forEach((item, idx) => {
    item.addEventListener("click", () => select(item));
    item.addEventListener("mouseenter", () => (focusedIndex = idx));
  });

  // Click outside closes
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) close();
  });

  // Keyboard: ArrowDown / ArrowUp / Enter / Esc / Home / End
  dropdown.addEventListener("keydown", (e) => {
    const isOpen = dropdown.classList.contains("is-open");

    if (e.key === "Escape") {
      e.preventDefault();
      close();
      toggle.focus();
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      if (!isOpen) {
        if (e.target === toggle) {
          e.preventDefault();
          open();
        }
        return;
      }
      if (focusedIndex >= 0) {
        e.preventDefault();
        select(items[focusedIndex]);
      }
      return;
    }

    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusedIndex = (focusedIndex + 1) % items.length;
      items[focusedIndex].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusedIndex = (focusedIndex - 1 + items.length) % items.length;
      items[focusedIndex].focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      focusedIndex = 0;
      items[0].focus();
    } else if (e.key === "End") {
      e.preventDefault();
      focusedIndex = items.length - 1;
      items[focusedIndex].focus();
    }
  });
}
