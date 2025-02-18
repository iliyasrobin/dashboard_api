// Fetch data from API
async function fetchData() {
  try {
    const response = await fetch(
      "http://49.0.39.93:1008/api/testtnas_dashboard"
    );
    const data = await response.json();
    populateTable(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Populate table with data
function populateTable(data) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  data.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                    <td>${item.buyer_id}</td>
                    <td>${item.buyer}</td>
                    <td>${item.po}</td>
                    <td>${item.qty_pcs}</td>
                    <td>${item.assign_date}</td>
                    <td class="editable-date">${item.shipment_etd}</td>
                    <td>
                        <button class="edit-btn" onclick="enableEdit(this)">Edit</button>
                    </td>
                `;
    tbody.appendChild(row);
  });
}

// Enable edit mode
function enableEdit(button) {
  const row = button.closest("tr");
  const dateCell = row.querySelector(".editable-date");
  const currentDate = dateCell.textContent;

  // Create date input
  const dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.value = currentDate;

  // Replace text with input
  dateCell.innerHTML = "";
  dateCell.appendChild(dateInput);

  // Change buttons
  button.outerHTML = `
                <button class="save-btn" onclick="saveDate(this)">Save</button>
                <button class="cancel-btn" onclick="cancelEdit(this)">Cancel</button>
            `;
}

// Save edited date
function saveDate(button) {
  const row = button.closest("tr");
  const dateInput = row.querySelector('input[type="date"]');
  const newDate = dateInput.value;

  // Update cell content
  const dateCell = row.querySelector(".editable-date");
  dateCell.textContent = newDate;

  // Change buttons back to edit
  row.querySelector("td:last-child").innerHTML = `
                <button class="edit-btn" onclick="enableEdit(this)">Edit</button>
            `;
}

// Cancel edit
function cancelEdit(button) {
  const row = button.closest("tr");
  const originalDate = row.querySelector(".editable-date").dataset.originalDate;

  // Restore original content
  const dateCell = row.querySelector(".editable-date");
  dateCell.textContent = originalDate;

  // Change buttons back to edit
  row.querySelector("td:last-child").innerHTML = `
                <button class="edit-btn" onclick="enableEdit(this)">Edit</button>
            `;
}

async function updateShipmentDate(id, newDate) {
  try {
    const response = await fetch(
      `http://49.0.39.93:1008/api/testtnas_dashboard/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shipment_etd: newDate }),
      }
    );

    if (!response.ok) {
      throw new Error("Update failed");
    }
  } catch (error) {
    console.error("Error updating date:", error);
  }
}

fetchData();
