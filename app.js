let currentEditingRow = null;

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

function populateTable(data) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  data.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
              <td>${item.id}</td>
              <td>${item.buyer_id}</td>
              <td>${item.buyer}</td>
              <td>${item.po}</td>
              <td>${item.qty_pcs}</td>
               <td>${new Date(item.assign_date).toLocaleDateString()}</td>
              
               <td class="${getDateStatusClass(item.shipment_etd)}">
                  ${new Date(item.shipment_etd).toLocaleDateString()}
              </td>
              <td>${item.color}</td>

              <td>${item.total_lead_time}</td>
              <td>${item.order_free_time}</td>
              <td>${item.lab_dip_submission_plan}</td>
              <td>${item.item}</td>
              <td>${item.lab_dip_submission_actual}</td>
              <td>${item.fabric_booking_plan}</td>
              
             
             
          `;
    row.addEventListener("click", () => showModal(row, item));
    tbody.appendChild(row);
  });
}

function getDateStatusClass(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const shipDate = new Date(dateString);
  shipDate.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((shipDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "expired";
  if (diffDays <= 3) return "warning";
  return "";
}

function showModal(row, item) {
  currentEditingRow = { row, item };
  const modal = document.getElementById("editModal");
  const dateInput = document.getElementById("shipmentDate");

  dateInput.value = new Date(item.shipment_etd).toISOString().split("T")[0];
  modal.style.display = "block";
}

function closeModal() {
  document.getElementById("editModal").style.display = "none";
  currentEditingRow = null;
}

async function saveChanges() {
  const newDate = document.getElementById("shipmentDate").value;

  try {
    //  API call
    await fetch(
      `http://49.0.39.93:1008/api/testtnas_dashboard/${currentEditingRow.item.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...currentEditingRow.item,
          shipment_etd: newDate,
        }),
      }
    );

    // Update local data
    currentEditingRow.item.shipment_etd = newDate;
    const dateCell = currentEditingRow.row.cells[6];
    dateCell.textContent = new Date(newDate).toLocaleDateString();
    dateCell.className = getDateStatusClass(newDate);

    closeModal();
  } catch (error) {
    console.error("Error saving data:", error);
  }
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("editModal");
  if (event.target === modal) {
    closeModal();
  }
};


fetchData();
