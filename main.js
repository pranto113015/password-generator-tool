function generatePassword() {
  const length = parseInt(document.getElementById("lengthRange").value);
  const mode = document.querySelector('input[name="readability"]:checked').id;

  let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let lower = "abcdefghijklmnopqrstuvwxyz";
  let numbers = "0123456789";
  let symbols = "!@#$%^&*()_+[]{}<>?/|";

  let allChars = "";

  if (mode === "say") {
    allChars = upper + lower;
  } else if (mode === "read") {
    const safeUpper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const safeLower = "abcdefghijkmnopqrstuvwxyz";
    const safeNumbers = "2346789";
    allChars = safeUpper + safeLower + safeNumbers;
  } else {
    const useUpper = document.getElementById("uppercase").checked;
    const useLower = document.getElementById("lowercase").checked;
    const useNumbers = document.getElementById("numbers").checked;
    const useSymbols = document.getElementById("symbols").checked;

    if (useUpper) allChars += upper;
    if (useLower) allChars += lower;
    if (useNumbers) allChars += numbers;
    if (useSymbols) allChars += symbols;
  }

  if (allChars === "") {
    document.getElementById("password").textContent =
      "Please select at least one option!";
    return;
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    const randIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randIndex];
  }

  document.getElementById("password").textContent = password;
}

function copyPassword() {
  const password = document.getElementById("password").textContent;
  navigator.clipboard.writeText(password).then(() => {
    alert("Password copied to clipboard!");
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
  const checkboxes = ["uppercase", "lowercase", "numbers", "symbols"];

  checkboxes.forEach((id) => {
    document.getElementById(id).disabled = mode !== "all";
  });

  generatePassword();
}

window.onload = () => {
  handleModeChange();
  updateSliderFill(document.getElementById("lengthRange"));
};
