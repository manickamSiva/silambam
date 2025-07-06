let students = [];
let attendanceData = {};
let currentNote = "";

window.onload = function () {
  students = JSON.parse(localStorage.getItem("students")) || [];
  students.sort((a, b) => a.fullName.localeCompare(b.fullName));

  const today = new Date().toISOString().split("T")[0];
  const dateInput = document.getElementById("attendanceDate");
  dateInput.value = today;
  dateInput.addEventListener("change", loadAttendanceForDate);

  loadAttendanceForDate(); // Initial load
};

function loadAttendanceForDate() {
  const selectedDate = document.getElementById("attendanceDate").value;
  const savedData = JSON.parse(localStorage.getItem("attendanceRecords")) || {};

  if (savedData[selectedDate]) {
    attendanceData = savedData[selectedDate].attendanceData || {};
    currentNote = savedData[selectedDate].note || "";
    document.getElementById("leaveNote").value = currentNote;
    if (Object.values(attendanceData).every(status => status === "L")) {
      document.getElementById("leaveNoteContainer").style.display = "block";
    } else {
      document.getElementById("leaveNoteContainer").style.display = "none";
    }
  } else {
    attendanceData = {};
    currentNote = "";
    students.forEach(student => {
      attendanceData[student.fullName] = "";
    });
    document.getElementById("leaveNote").value = "";
    document.getElementById("leaveNoteContainer").style.display = "none";
  }

  renderAttendanceTable();
}

function renderAttendanceTable() {
  const tableBody = document.getElementById("attendanceTableBody");
  tableBody.innerHTML = "";

  students.forEach((student, index) => {
    const status = attendanceData[student.fullName] || "";
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${student.fullName}</td>
      <td>${student.gender}</td>
      <td>
        <button class="btn btn-sm btn-success me-2" onclick="setAttendance('${student.fullName}', 'P')">P</button>
        <button class="btn btn-sm btn-danger me-2" onclick="setAttendance('${student.fullName}', 'A')">A</button>
        <span id="status-${student.fullName}" class="ms-2 fw-bold">${status}</span>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function setAttendance(name, status) {
  attendanceData[name] = status;
  document.getElementById(`status-${name}`).innerText = status;
}

function markAll(status) {
  students.forEach(student => {
    attendanceData[student.fullName] = status;
    document.getElementById(`status-${student.fullName}`).innerText = status;
  });
  if (status === "L") {
    document.getElementById("leaveNoteContainer").style.display = "block";
  } else {
    document.getElementById("leaveNoteContainer").style.display = "none";
    document.getElementById("leaveNote").value = "";
  }
}

function markLeave() {
  markAll("L");
  document.getElementById("leaveNoteContainer").style.display = "block";
}

function saveAttendance() {
  const date = document.getElementById("attendanceDate").value;
  const note = document.getElementById("leaveNote").value;

  const savedData = JSON.parse(localStorage.getItem("attendanceRecords")) || {};
  savedData[date] = {
    attendanceData: { ...attendanceData },
    note: note
  };

  localStorage.setItem("attendanceRecords", JSON.stringify(savedData));
  alert("Attendance saved for " + date);
}

function exportAttendanceCSV() {
  const date = document.getElementById("attendanceDate").value;
  const savedData = JSON.parse(localStorage.getItem("attendanceRecords")) || {};

  if (!savedData[date]) {
    alert("No attendance data to export for selected date.");
    return;
  }

  const rows = [["Name", "Gender", "Status"]];
  students.forEach(student => {
    const status = savedData[date].attendanceData[student.fullName] || "-";
    rows.push([student.fullName, student.gender, status]);
  });

  const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `attendance_${date}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
