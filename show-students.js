let students = [];

window.onload = function () {
  students = JSON.parse(localStorage.getItem("students")) || [];
  updateCounts();
  renderTable(students);
};

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
      <td><a href="#" onclick="showAttendance(${index})">${student.fullName}</a></td>
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

function updateCounts() {
  document.getElementById("totalCount").innerText = `Total: ${students.length}`;
  document.getElementById("maleCount").innerText = `Male: ${students.filter(s => s.gender === "Male").length}`;
  document.getElementById("femaleCount").innerText = `Female: ${students.filter(s => s.gender === "Female").length}`;
}

function filterStudents(gender) {
  if (gender === 'all') {
    renderTable(students);
  } else {
    const filtered = students.filter(s => s.gender === gender);
    renderTable(filtered);
  }
}

function deleteStudent(index) {
  const student = students[index];
  if (confirm(`Are you sure you want to delete ${student.fullName}?`)) {
    students.splice(index, 1);
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
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function showAttendance(index) {
  const student = students[index];
  const attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords")) || {};

  const modalBody = document.getElementById("attendanceDetails");
  modalBody.innerHTML = `
    <div class="d-flex justify-content-between mb-3">
      <h5>${student.fullName}</h5>
      <div>
        <select id="monthSelect" class="form-select d-inline w-auto me-2">
          ${[...Array(12)].map((_, i) => `<option value="${i}">${new Date(0, i).toLocaleString('default', { month: 'long' })}</option>`).join('')}
        </select>
        <select id="yearSelect" class="form-select d-inline w-auto">
          ${generateYearOptions()}
        </select>
      </div>
    </div>
    <div id="calendar"></div>
  `;

  document.getElementById("monthSelect").value = new Date().getMonth();
  document.getElementById("yearSelect").value = new Date().getFullYear();

  document.getElementById("monthSelect").addEventListener("change", () => renderCalendar(student));
  document.getElementById("yearSelect").addEventListener("change", () => renderCalendar(student));

  renderCalendar(student);
  new bootstrap.Modal(document.getElementById("attendanceModal")).show();
}

function generateYearOptions() {
  const currentYear = new Date().getFullYear();
  let options = "";
  for (let i = currentYear - 2; i <= currentYear + 1; i++) {
    options += `<option value="${i}">${i}</option>`;
  }
  return options;
}

function renderCalendar(student) {
  const month = parseInt(document.getElementById("monthSelect").value);
  const year = parseInt(document.getElementById("yearSelect").value);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords")) || {};

  let table = `<table class="table table-bordered">
    <thead><tr>
      ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => `<th>${d}</th>`).join('')}
    </tr></thead>
    <tbody><tr>`;

  let dayCount = 0;
  for (let i = 0; i < firstDay; i++) {
    table += `<td></td>`;
    dayCount++;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    let status = "";
    if (
      attendanceRecords[dateStr] &&
      attendanceRecords[dateStr].attendanceData &&
      attendanceRecords[dateStr].attendanceData[student.fullName]
    ) {
      status = attendanceRecords[dateStr].attendanceData[student.fullName];
    }

    let className = "";
    if (status === "P") className = "table-success";
    else if (status === "A") className = "table-danger";
    else if (status === "L") className = "table-warning";

    table += `<td class="${className}">${day}<br><small>${status}</small></td>`;
    dayCount++;

    if (dayCount % 7 === 0 && day !== daysInMonth) {
      table += `</tr><tr>`;
    }
  }

  while (dayCount % 7 !== 0) {
    table += `<td></td>`;
    dayCount++;
  }

  table += `</tr></tbody></table>`;
  document.getElementById("calendar").innerHTML = table;
}
