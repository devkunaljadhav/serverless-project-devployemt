// ==========================================
// API ENDPOINT
// ==========================================
var API_ENDPOINT = "https://1pybdzksjl.execute-api.ap-south-1.amazonaws.com/employeeapi";

// Store employees
var employees = [];

// Employee currently being edited
var editingEmployeeId = null;

// =======================================
// SAVE / UPDATE EMPLOYEE
// =======================================
document.getElementById("saveemployee").onclick = function () {
  var employeeid = $("#employeeid").val().trim();
  var name = $("#name").val().trim();
  var department = $("#department").val();
  var salary = $("#salary").val().trim();

  // ================= VALIDATION =================
  if (employeeid === "") {
    showMessage("Please enter Employee ID.", "error");
    return;
  }
  if (name === "") {
    showMessage("Please enter Employee Name.", "error");
    return;
  }
  if (department === "") {
    showMessage("Please select Department.", "error");
    return;
  }
  if (salary === "") {
    showMessage("Please enter Salary.", "error");
    return;
  }
  if (Number(salary) <= 0) {
    showMessage("Salary must be greater than 0.", "error");
    return;
  }

  // ================= EMPLOYEE DATA =================
  var inputData = {
    "employeeid": employeeid,
    "name": name,
    "department": department,
    "salary": salary
  };

  // ================= EDIT MODE =================
  if (editingEmployeeId !== null) {
    updateEmployee(inputData);
    return;
  }

  // ================= CREATE MODE =================
  $("#saveemployee").prop("disabled", true).text("Saving...");

  $.ajax({
    url: API_ENDPOINT,
    type: "POST",
    data: JSON.stringify(inputData),
    contentType: "application/json; charset=utf-8",
    success: function (response) {
      showMessage("Employee added successfully!", "success");
      clearForm();
      $("#saveemployee").prop("disabled", false).text("Save Employee");
      loadEmployees();
    },
    error: function (xhr) {
      console.log(xhr);
      showMessage("Error saving employee.", "error");
      $("#saveemployee").prop("disabled", false).text("Save Employee");
    }
  });
};

// ========================================
// GET EMPLOYEES (button)
// ========================================
document.getElementById("getemployees").onclick = function () {
  loadEmployees();
};

// =======================================
// LOAD EMPLOYEES
// =======================================
function loadEmployees() {
  $("#getemployees").prop("disabled", true).text("Loading...");

  $.ajax({
    url: API_ENDPOINT,
    type: "GET",
    contentType: "application/json; charset=utf-8",
    success: function (response) {
      console.log("API Response:", response);
      employees = response;
      displayEmployees(employees);
      updateDashboard(employees);
      $("#getemployees").prop("disabled", false).text("View Employees");
    },
    error: function (xhr) {
      console.log(xhr);
      showMessage("Error retrieving employee data.", "error");
      $("#getemployees").prop("disabled", false).text("View Employees");
    }
  });
}

// =======================================
// DISPLAY EMPLOYEES
// =======================================
function displayEmployees(data) {
  var tableBody = $("#EmployeeTable tbody");
  tableBody.empty();

  if (!data || data.length === 0) {
    $("#emptyMessage").text("No employee records found.");
    return;
  }
  $("#emptyMessage").text("");

  $.each(data, function (i, employee) {
    var employeeId = escapeHTML(employee.employeeid);
    var employeeName = escapeHTML(employee.name);
    var employeeDepartment = escapeHTML(employee.department);
    var employeeSalary = Number(employee.salary).toLocaleString("en-IN");

    var row = `
      <tr>
        <td>${employeeId}</td>
        <td>${employeeName}</td>
        <td><span class="department">${employeeDepartment}</span></td>
        <td class="salary">₹ ${employeeSalary}</td>
        <td>
          <button class="edit-btn" onclick="editEmployee('${encodeURIComponent(employee.employeeid)}')">✏️ Edit</button>
          <button class="delete-btn" onclick="deleteEmployee('${encodeURIComponent(employee.employeeid)}')">🗑️ Delete</button>
        </td>
      </tr>
    `;
    tableBody.append(row);
  });
}

// =======================================
// EDIT EMPLOYEE
// =======================================
function editEmployee(encodedEmployeeId) {
  var employeeId = decodeURIComponent(encodedEmployeeId);
  var employee = employees.find(function (item) {
    return String(item.employeeid) === String(employeeId);
  });

  if (!employee) {
    showMessage("Employee not found.", "error");
    return;
  }

  // Put data into form
  $("#employeeid").val(employee.employeeid);
  $("#name").val(employee.name);
  $("#department").val(employee.department);
  $("#salary").val(employee.salary);

  // Store employee ID
  editingEmployeeId = employee.employeeid;

  // Change button
  $("#saveemployee").text("Update Employee");

  // Scroll to form
  window.scrollTo({ top: 0, behavior: "smooth" });

  showMessage("Edit mode enabled. Update the information and click Update Employee.", "success");
}

// =======================================
// UPDATE EMPLOYEE
// =======================================
function updateEmployee(inputData) {
  $("#saveemployee").prop("disabled", true).text("Updating...");

  $.ajax({
    url: API_ENDPOINT,
    type: "PUT",
    data: JSON.stringify(inputData),
    contentType: "application/json; charset=utf-8",
    success: function (response) {
      console.log("Update response:", response);
      showMessage("Employee updated successfully!", "success");
      editingEmployeeId = null;
      clearForm();
      $("#saveemployee").prop("disabled", false).text("Save Employee");
      loadEmployees();
    },
    error: function (xhr) {
      console.log(xhr);
      showMessage("Error updating employee.", "error");
      $("#saveemployee").prop("disabled", false).text("Update Employee");
    }
  });
}

// =======================================
// DELETE EMPLOYEE
// =======================================
function deleteEmployee(encodedEmployeeId) {
  var employeeId = decodeURIComponent(encodedEmployeeId);
  var employee = employees.find(function (item) {
    return String(item.employeeid) === String(employeeId);
  });
  var employeeName = employee ? employee.name : employeeId;

  // Confirmation
  var confirmation = confirm("Are you sure you want to delete " + employeeName + "?");
  if (!confirmation) {
    return;
  }

  $.ajax({
    url: API_ENDPOINT,
    type: "DELETE",
    data: JSON.stringify({ "employeeid": employeeId }),
    contentType: "application/json; charset=utf-8",
    success: function (response) {
      console.log("Delete response:", response);
      showMessage("Employee deleted successfully!", "success");
      loadEmployees();
    },
    error: function (xhr) {
      console.log(xhr);
      showMessage("Error deleting employee.", "error");
    }
  });
}

// ==========================================
// SEARCH
// =======================================
$("#searchEmployee").on("keyup", function () {
  var searchText = $(this).val().toLowerCase().trim();

  if (!employees || employees.length === 0) {
    return;
  }

  var filteredEmployees = employees.filter(function (employee) {
    return (
      String(employee.employeeid).toLowerCase().includes(searchText) ||
      String(employee.name).toLowerCase().includes(searchText) ||
      String(employee.department).toLowerCase().includes(searchText)
    );
  });

  displayEmployees(filteredEmployees);
});

// =======================================
// DASHBOARD
// =======================================
function updateDashboard(data) {
  $("#totalEmployees").text(data.length);

  var departments = [];
  $.each(data, function (i, employee) {
    if (employee.department && !departments.includes(employee.department)) {
      departments.push(employee.department);
    }
  });

  $("#totalDepartments").text(departments.length);
}

// =======================================
// CLEAR FORM
// =======================================
document.getElementById("clearForm").onclick = function () {
  clearForm();
};

function clearForm() {
  $("#employeeid").val("");
  $("#name").val("");
  $("#department").val("");
  $("#salary").val("");
  editingEmployeeId = null;
  $("#saveemployee").prop("disabled", false).text("Save Employee");
}

// ========================================
// MESSAGE
// ========================================
function showMessage(message, type) {
  var messageElement = $("#EmployeeSaved");
  messageElement.text(message);

  if (type === "success") {
    messageElement.css({ "color": "#15803d" });
  } else {
    messageElement.css({ "color": "#dc2626" });
  }

  setTimeout(function () {
    messageElement.text("");
  }, 5000);
}

// ========================================
// SECURITY
// ========================================
function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}