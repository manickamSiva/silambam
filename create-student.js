window.onload = function () {
  document.getElementById("studentForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const firstNameRaw = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const dob = document.getElementById("dob").value;
    const gender = document.getElementById("gender").value;

    // Capitalize first letter of first name
    const firstName = firstNameRaw.charAt(0).toUpperCase() + firstNameRaw.slice(1).toLowerCase();

    // Join name as Firstname.Lastname
    const fullName = `${firstName}.${lastName}`;

    // Calculate age from DOB
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    const student = {
      fullName,
      dob,
      age,
      gender,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    let students = JSON.parse(localStorage.getItem("students")) || [];
    students.push(student);
    localStorage.setItem("students", JSON.stringify(students));

    document.getElementById("studentForm").reset();
    document.getElementById("message").innerHTML =
      `<div class="alert alert-success">Student <strong>${fullName}</strong> (Age: ${age}) created successfully!</div>`;

    // Optional: Clear alert after 3 seconds
    setTimeout(() => {
      document.getElementById("message").innerHTML = "";
    }, 3000);
  });
};
