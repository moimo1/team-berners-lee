function openPrescriptionModal(prescriptionData) {
  const modal = document.getElementById('prescriptionModal');
  
  if (!modal) {
    console.error('Prescription modal not found!');
    return;
  }
  
  console.log('Opening modal with data:', prescriptionData);
  
  // Populate prescription info
  document.getElementById('prescriptionId').textContent = prescriptionData.prescriptionId || '-';
  document.getElementById('patientName').textContent = prescriptionData.patientName || '-';
  document.getElementById('doctorName').textContent = prescriptionData.doctorName || '-';
  
  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date) ? 'N/A' : date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  document.getElementById('dateIssued').textContent = formatDate(prescriptionData.dateIssued);
  document.getElementById('prescriptionStatus').textContent = prescriptionData.status || '-';
  document.getElementById('dueDate').textContent = formatDate(prescriptionData.dueDate);

  // Populate medicines table
  const medicinesTableBody = document.getElementById('medicinesTableBody');
  medicinesTableBody.innerHTML = '';

  if (prescriptionData.medicines && prescriptionData.medicines.length > 0) {
    prescriptionData.medicines.forEach(medicine => {
      const row = document.createElement('tr');
      
      // Map medicine field names to handle different response formats
      const medicineName = medicine.medicineName || medicine.name || medicine.generic_name || 'N/A';
      const dosage = medicine.dosage || medicine.dose || 'N/A';
      const quantity = medicine.quantity || medicine.amount || medicine.remaining_amount || 'N/A';
      const frequency = medicine.frequency || medicine.freq || '-';
      const duration = medicine.duration || medicine.days || '-';
      const instructions = medicine.instructions || medicine.special_instructions || '';
      
      row.innerHTML = `
        <td>
          <div class="medicine-name">${escapeHtml(medicineName)}</div>
        </td>
        <td>${escapeHtml(dosage)}</td>
        <td><span class="quantity-badge">${escapeHtml(quantity.toString())}</span></td>
        <td>${escapeHtml(frequency)}</td>
        <td>${escapeHtml(duration)}</td>
        <td>
          ${instructions ? `<div class="instructions">${escapeHtml(instructions)}</div>` : 'N/A'}
        </td>
      `;
      medicinesTableBody.appendChild(row);
    });
  } else {
    medicinesTableBody.innerHTML = '<tr><td colspan="6" class="no-medicines">No medicines found</td></tr>';
  }

  // Show modal
  modal.classList.add('active');
}

function closePrescriptionModal() {
  const modal = document.getElementById('prescriptionModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function confirmPrescription() {
  const prescriptionId = document.getElementById('prescriptionId').textContent;
  
  if (!prescriptionId || prescriptionId === '-') {
    alert('Invalid prescription ID');
    return;
  }
  
  // Use existing update-prescription-amount.php or create appropriate endpoint
  fetch('../../controller/update-prescription-amount.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    credentials: 'same-origin',
    body: new URLSearchParams({
      prescID: prescriptionId,
      status: 'completed'
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success || data.status === 'success') {
      alert('Prescription marked as completed');
      closePrescriptionModal();
      location.reload();
    } else {
      alert('Error updating prescription: ' + (data.message || 'Unknown error'));
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error updating prescription');
  });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
  const modal = document.getElementById('prescriptionModal');
  if (modal && event.target === modal) {
    closePrescriptionModal();
  }
});