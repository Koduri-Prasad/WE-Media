// Slideshow functionality
let slides = document.querySelectorAll('.slide');
let index = 0;
function showNextSlide() {
  slides[index].classList.remove('active');
  index = (index + 1) % slides.length;
  slides[index].classList.add('active');
}
setInterval(showNextSlide, 3000);

document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for Get a Quote nav
  const navGetAQuote = document.getElementById('navGetAQuote');
  if (navGetAQuote) {
    navGetAQuote.addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('getaquote').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // --- DAY-WISE WORKFORCE SECTION (REPLACED WITH YOUR REQUESTED LOGIC) ---
  const daysSelect = document.getElementById('days');
  const daysContainer = document.getElementById('daysContainer');
  const teamTypes = [
    { id: 'photographer', label: 'Photographer' },
    { id: 'videographer', label: 'Videographer' },
    { id: 'candid', label: 'Candid/Portrait Photographer' },
    { id: 'cinematographer', label: 'Cinematographer' },
    { id: 'drone', label: 'Drone Operator' }
  ];

  function createTeamSelector(dayNumber) {
    const daySection = document.createElement('fieldset');
    daySection.className = 'day-workforce-section';
    daySection.innerHTML = `
      <legend>Day ${dayNumber} Team Requirements</legend>
      <div class="manpower-selection">
        ${teamTypes.map(type => `
          <div class="manpower-item">
            <label for="${type.id}_day${dayNumber}">${type.label}:</label>
            <div class="quantity-selector">
              <button type="button" class="quantity-btn minus" data-type="${type.id}_day${dayNumber}">−</button>
              <input type="number" id="${type.id}_day${dayNumber}" 
                     name="${type.id}_day${dayNumber}" 
                     value="0" min="0" max="10" readonly>
              <button type="button" class="quantity-btn plus" data-type="${type.id}_day${dayNumber}">+</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    return daySection;
  }

  function setupQuantityButtons() {
    const quantityButtons = document.querySelectorAll('.quantity-btn');
    quantityButtons.forEach(button => {
      button.addEventListener('click', () => {
        const type = button.dataset.type;
        const input = document.getElementById(type);
        const currentValue = parseInt(input.value);
        if (button.classList.contains('plus') && currentValue < 10) {
          input.value = currentValue + 1;
        } else if (button.classList.contains('minus') && currentValue > 0) {
          input.value = currentValue - 1;
        }
      });
    });
  }

  daysSelect.addEventListener('change', () => {
    const numberOfDays = parseInt(daysSelect.value) || 0;
    daysContainer.innerHTML = '';
    for (let i = 1; i <= numberOfDays; i++) {
      const daySection = createTeamSelector(i);
      daysContainer.appendChild(daySection);
    }
    setupQuantityButtons();
  });

  // Album quantity plus/minus
  document.querySelectorAll('.quantity-btn[data-type="albums"]').forEach(btn => {
    btn.addEventListener('click', function() {
      const input = document.getElementById('albumQuantity');
      let val = parseInt(input.value, 10);
      if (this.classList.contains('plus') && val < 10) input.value = val + 1;
      if (this.classList.contains('minus') && val > 0) input.value = val - 1;
    });
  });

  // Modal logic
  const openQuoteModalBtn = document.getElementById('openQuoteModal');
  const openCallModalBtn = document.getElementById('openCallModal');
  const contactModal = document.getElementById('contactModal');
  const closeModalBtn = document.getElementById('closeModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalContactForm = document.getElementById('modalContactForm');
  let modalType = 'quote';

  if (openQuoteModalBtn) {
    openQuoteModalBtn.addEventListener('click', () => {
      modalType = 'quote';
      modalTitle.textContent = 'Get a Quote - Contact Details';
      contactModal.style.display = 'flex';
    });
  }
  if (openCallModalBtn) {
    openCallModalBtn.addEventListener('click', () => {
      modalType = 'call';
      modalTitle.textContent = 'Request a Call - Contact Details';
      contactModal.style.display = 'flex';
    });
  }
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      contactModal.style.display = 'none';
      modalContactForm.reset();
    });
  }
  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) {
        contactModal.style.display = 'none';
        modalContactForm.reset();
      }
    });
  }

  if (modalContactForm) {
    modalContactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('modalName').value.trim();
      const email = document.getElementById('modalEmail').value.trim();
      const phone = document.getElementById('modalPhone').value.trim();
      if (!name) {
        alert('Please enter your name.');
        return;
      }
      if (!validateEmail(email)) {
        alert('Please enter a valid email.');
        return;
      }
      if (!/^[0-9]{10}$/.test(phone)) {
        alert('Please enter a valid 10 digit phone number.');
        return;
      }
      if (modalType === 'quote') {
        alert('Thank you! We will contact you soon with your quote.');
      } else {
        alert('Thank you! We will call you soon.');
      }
      contactModal.style.display = 'none';
      modalContactForm.reset();
    });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});
