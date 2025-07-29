
// Slideshow functionality
let slides = document.querySelectorAll('.slide');
let index = 0;

function showNextSlide() {
  slides[index].classList.remove('active');
  index = (index + 1) % slides.length;
  slides[index].classList.add('active');
}

setInterval(showNextSlide, 3000);

// Team requirements functionality
document.addEventListener('DOMContentLoaded', () => {
  const daysSelect = document.getElementById('days');
  const daysContainer = document.getElementById('daysContainer');
  
  // Team member types
  const teamTypes = [
    { id: 'photographer', label: 'Photographer' },
    { id: 'videographer', label: 'Videographer' },
    { id: 'candid', label: 'Candid/Portrait Photographer' },
    { id: 'cinematographer', label: 'Cinematographer' },
    { id: 'drone', label: 'Drone Operator' }
  ];

  // Create team selector for a specific day
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

  // Handle days selection change
  daysSelect.addEventListener('change', () => {
    const numberOfDays = parseInt(daysSelect.value) || 0;
    daysContainer.innerHTML = ''; // Clear existing sections

    // Create a section for each day
    for (let i = 1; i <= numberOfDays; i++) {
      const daySection = createTeamSelector(i);
      daysContainer.appendChild(daySection);
    }

    // Add quantity button handlers
    setupQuantityButtons();
    updateHighlightsPrice(); // Update price when days change
  });

  // Setup quantity button handlers
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

  // Check requirements and update output options
  function updateOutputOptions() {
    const numberOfDays = parseInt(daysSelect.value) || 0;
    let totalCinematographers = 0;

    // Count cinematographers across all days
    for (let i = 1; i <= numberOfDays; i++) {
      const cinematographerInput = document.getElementById(`cinematographer_day${i}`);
      if (cinematographerInput) {
        totalCinematographers += parseInt(cinematographerInput.value) || 0;
      }
    }

    const highlightsCheckbox = document.getElementById('highlightsCheckbox');
    const highlightsInfo = document.getElementById('highlightsInfo');
    
    // Update highlights availability
    if (totalCinematographers > 0) {
      highlightsCheckbox.disabled = false;
      highlightsInfo.textContent = '';
    } else {
      highlightsInfo.textContent = 'Please add cinematographer(s) for highlights';
      highlightsCheckbox.checked = false;
      highlightsCheckbox.disabled = true;
    }

    // Update full length availability
    const fullLengthCheckbox = document.getElementById('fullLengthCheckbox');
    const fullLengthInfo = document.getElementById('fullLengthInfo');
    
    if (numberOfDays > 0) {
      fullLengthCheckbox.disabled = false;
      fullLengthInfo.textContent = '';
    } else {
      fullLengthInfo.textContent = 'Please select number of days';
      fullLengthCheckbox.checked = false;
      fullLengthCheckbox.disabled = true;
    }
  }

  // Setup album quantity handlers
  function setupAlbumQuantityHandlers() {
    const albumQuantityInput = document.getElementById('albumQuantity');
    const albumButtons = document.querySelectorAll('.quantity-btn[data-type="albums"]');
    const albumCheckbox = document.getElementById('albumCheckbox');
    
    albumButtons.forEach(button => {
      button.addEventListener('click', () => {
        const currentValue = parseInt(albumQuantityInput.value) || 0;
        
        if (button.classList.contains('plus') && currentValue < 10) {
          albumQuantityInput.value = currentValue + 1;
          albumCheckbox.checked = true;
        } else if (button.classList.contains('minus') && currentValue > 0) {
          albumQuantityInput.value = currentValue - 1;
          if (currentValue === 1) {
            albumCheckbox.checked = false;
          }
        }
      });
    });

    albumCheckbox.addEventListener('change', () => {
      if (!albumCheckbox.checked) {
        albumQuantityInput.value = 0;
      } else if (albumQuantityInput.value === '0') {
        albumQuantityInput.value = 1;
      }
    });
  }

  // Add event listeners for output updates
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('quantity-btn') && 
        (e.target.dataset.type.includes('cinematographer') || 
         e.target.dataset.type === 'albums')) {
      updateOutputOptions();
    }
  });

  // Initialize album quantity handlers
  setupAlbumQuantityHandlers();

  // Google Sign In functionality
  function initializeGoogleSignIn() {
    const googleSignInBtn = document.getElementById('googleSignInBtn');
    const userProfile = document.getElementById('userProfile');
    const whatsappSection = document.getElementById('whatsappSection');
    const submitQuoteBtn = document.getElementById('submitQuote');
    const whatsappInput = document.getElementById('whatsapp');

    // Load Google Sign-In API
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: 'YOUR_GOOGLE_CLIENT_ID' // Replace with your Google Client ID
      }).then(auth2 => {
        googleSignInBtn.addEventListener('click', () => {
          auth2.signIn().then(googleUser => {
            const profile = googleUser.getBasicProfile();
            
            // Update UI with user info
            document.getElementById('userPhoto').src = profile.getImageUrl();
            document.getElementById('userName').textContent = profile.getName();
            document.getElementById('userEmail').textContent = profile.getEmail();
            
            // Show/hide elements
            googleSignInBtn.style.display = 'none';
            userProfile.style.display = 'flex';
            whatsappSection.style.display = 'block';
            
            // Enable submit button if WhatsApp number is valid
            validateForm();
          });
        });
      });
    });

    // Validate WhatsApp number
    whatsappInput.addEventListener('input', () => {
      const isValid = /^[0-9]{10}$/.test(whatsappInput.value);
      validateForm();
    });

    function validateForm() {
      const isWhatsappValid = /^[0-9]{10}$/.test(whatsappInput.value);
      const isUserSignedIn = userProfile.style.display === 'flex';
      submitQuoteBtn.disabled = !(isWhatsappValid && isUserSignedIn);
    }
  }

  // Initialize Google Sign In when the API is loaded
  window.onload = function() {
    initializeGoogleSignIn();
  };

  // Handle form submission
  document.getElementById('quoteForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Collect form data and send to your backend
    const formData = {
      eventType: document.getElementById('eventType').value,
      subEvent: document.getElementById('subEvent').value,
      eventDate: document.getElementById('eventDate').value,
      days: document.getElementById('days').value,
      teamRequirements: [], // Collect team requirements for each day
      extras: Array.from(document.querySelectorAll('input[name="extras"]:checked')).map(cb => cb.value),
      outputs: {
        highlights: document.getElementById('highlightsCheckbox').checked,
        fullLength: document.getElementById('fullLengthCheckbox').checked,
        albums: document.getElementById('albumCheckbox').checked ? 
                parseInt(document.getElementById('albumQuantity').value) : 0
      },
      contact: {
        email: document.getElementById('userEmail').textContent,
        whatsapp: document.getElementById('whatsapp').value
      }
    };

    // Here you would send the formData to your backend
    console.log('Form submitted:', formData);
    // Add your API call here
  });
});
