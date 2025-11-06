function generatePassword() {
  const length = parseInt(document.getElementById("lengthRange").value, 10) || 12;
  const mode = document.querySelector('input[name="readability"]:checked').id;

  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+[]{}<>?/|";

  // Easy-to-say and easy-to-read pools
  const saySet = upper + lower;
  const readSet = "ABCDEFGHJKLMNPQRSTUVWXYZ" + "abcdefghijkmnopqrstuvwxyz" + "2346789";

  // If 'all' mode: use user-selected checkboxes
  if (mode === "all") {
    let pool = "";
    charOptions.forEach((opt) => {
      const el = document.getElementById(opt.id);
      if (el && el.checked) {
        // map known ids to defined character strings; fallback to opt.chars
        if (opt.id === "uppercase") pool += upper;
        else if (opt.id === "lowercase") pool += lower;
        else if (opt.id === "numbers") pool += numbers;
        else if (opt.id === "symbols") pool += symbols;
        else pool += opt.chars || "";
      }
    });

    if (!pool) {
      document.getElementById("password").textContent = "Please select at least one option!";
      return;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      password += pool[idx];
    }

    document.getElementById("password").textContent = password;
    return;
  }


  const pool = mode === "read" ? readSet : saySet;
  let password = "";
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    password += pool[idx];
  }
  document.getElementById("password").textContent = password;
}




function copyPassword() {
  const password = document.getElementById("password").textContent;
  navigator.clipboard.writeText(password).then(() => {
    alert("Password copied to clipboard!");
  });
}

// Configuration for include-character options
const charOptions = [
  { id: "uppercase", label: "Uppercase", chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", checked: true },
  { id: "lowercase", label: "Lowercase", chars: "abcdefghijklmnopqrstuvwxyz", checked: true },
  { id: "numbers", label: "Numbers", chars: "0123456789", checked: true },
  { id: "symbols", label: "Symbols", chars: "!@#$%^&*()_+[]{}<>?/|", checked: true },
];

// Presets for modes: which options are visible and whether they are editable
const modePresets = {
  all: { visible: ["uppercase", "lowercase", "numbers", "symbols"], editable: true },
  say: { visible: ["uppercase", "lowercase"], editable: false },
  read: { visible: ["uppercase", "lowercase", "numbers"], editable: false },
};

function renderIncludeCharacters(mode = "all") {
  const container = document.getElementById("includeCharsContainer");
  if (!container) return;
  container.innerHTML = "";

  const preset = modePresets[mode] || modePresets.all;

  charOptions.forEach((opt) => {
    if (!preset.visible.includes(opt.id)) return; // skip options not visible for this mode

    const wrapper = document.createElement("div");
    wrapper.className = "form-check";

    const input = document.createElement("input");
    input.className = "form-check-input";
    input.type = "checkbox";
    input.id = opt.id;
    // If preset is editable (mode=all), keep saved checked state; otherwise default checked
    input.checked = opt.checked;
    input.disabled = !preset.editable;
    input.addEventListener("change", () => {
      // Keep the option's checked state in the config for next render
      opt.checked = input.checked;
      generatePassword();
    });

    const label = document.createElement("label");
    label.className = "form-check-label";
    label.htmlFor = opt.id;
    label.textContent = opt.label;

    wrapper.appendChild(input);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });
}

function updateLengthValue() {
  const slider = document.getElementById("lengthRange");
  const number = document.getElementById("lengthNumber");
  number.value = slider.value;

  updateSliderFill(slider);
  generatePassword();
}

function updateSliderValue() {
  const slider = document.getElementById("lengthRange");
  const number = document.getElementById("lengthNumber");
  slider.value = number.value;

  updateSliderFill(slider);
  generatePassword();
}

function updateSliderFill(slider) {
  const min = parseInt(slider.min);
  const max = parseInt(slider.max);
  const val = parseInt(slider.value);
  const percentage = ((val - min) / (max - min)) * 100;
  slider.style.setProperty("--range-value", percentage.toString());
}

function handleModeChange() {
  const mode = document.querySelector('input[name="readability"]:checked').id;
  // Re-render the include-characters area to reflect the selected mode
  renderIncludeCharacters(mode);
  generatePassword();
}

window.onload = () => {
  // Initially render include characters for the default mode
  const initialMode = document.querySelector('input[name="readability"]:checked')?.id || "all";
  renderIncludeCharacters(initialMode);
  handleModeChange();
  updateSliderFill(document.getElementById("lengthRange"));
};
