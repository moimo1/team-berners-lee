document.getElementById('create-prescription-btn').addEventListener('click', function() {
  fetch('../../view/doctor/create-prescription-form.php', { credentials: 'same-origin' })
    .then(res => res.text())
    .then(html => {
      const modal = document.querySelector('.modal-container');
      modal.innerHTML = html;
      modal.style.display = 'block';
      const closeBtn = modal.querySelector('.close-btn');
      closeBtn.onclick = () => {
        modal.style.display = 'none';
        modal.innerHTML = '';
      };
    })
    .catch(err => console.error('Failed to load prescription form:', err));
});