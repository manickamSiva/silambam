let students = [];

window.onload = function () {
  students = JSON.parse(localStorage.getItem("students")) || [];
  updateCounts();
  renderTable(students);
};

// Render students based on filtered array
function renderTable(data) {
  const tableBody = document.getElementById("studentTableBody");
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center">No students found.</td></tr>`;
    return;
  }

  data.sort((a, b) => a.fullName.localeCompare(b.fullName));
  data.forEach((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${student.fullName}</td>
      <td>${student.age}</td>
      <td>${student.gender}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteStudent(${index})">
          <i class="bi bi-trash"></i> Delete
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Count stats
function updateCounts() {
  document.getElementById("totalCount").innerText = `Total: ${students.length}`;
  document.getElementById("maleCount").innerText = `Male: ${students.filter(s => s.gender === "Male").length}`;
  document.getElementById("femaleCount").innerText = `Female: ${students.filter(s => s.gender === "Female").length}`;
}

// Filter student list
function filterStudents(gender) {
  if (gender === 'all') {
    renderTable(students);
  } else {
    const filtered = students.filter(s => s.gender === gender);
    renderTable(filtered);
  }
}

// Delete student and refresh
function deleteStudent(index) {
  const realIndex = students.findIndex((_, i) => i === index);
  if (confirm(`Are you sure you want to delete ${students[realIndex].fullName}?`)) {
    students.splice(realIndex, 1);
    localStorage.setItem("students", JSON.stringify(students));
    updateCounts();
    renderTable(students);
  }
}
function exportToCSV() {
  if (students.length === 0) {
    alert("No student data to export.");
    return;
  }

  const header = ["Name", "Age", "Gender", "DOB"];
  const rows = students.map(student => [
    student.fullName,
    student.age,
    student.gender,
    student.dob
  ]);

  let csvContent = "data:text/csv;charset=utf-8," 
    + header.join(",") + "\n"
    + rows.map(e => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "students.csv");
  document.body.appendChild(link); // Required for Firefox

  link.click();
  document.body.removeChild(link);
}
