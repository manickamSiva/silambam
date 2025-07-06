const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");

// Show/hide submit button based on inputs
function checkInputs() {
  if (usernameInput.value.trim() !== "" && passwordInput.value.trim() !== "") {
    submitBtn.style.display = "block";
  } else {
    submitBtn.style.display = "none";
  }
}

usernameInput.addEventListener("input", checkInputs);
passwordInput.addEventListener("input", checkInputs);

// Handle form submission
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (username === "username" && password === "12345") {
    // ✅ Redirect to attendance page if correct
    window.location.href = "attendance.html";
  } else {
    // ❌ Show error alert
    alert("Invalid username or password.");
  }
});
