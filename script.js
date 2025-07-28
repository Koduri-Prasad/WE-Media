// --- Wait for DOM to be fully loaded ---
// Add this at the very top after DOMContentLoaded
console.log("JavaScript file loaded!");
console.log("Days select found:", document.getElementById("days"));
console.log("Days container found:", document.getElementById("daysContainer"));
document.addEventListener("DOMContentLoaded", function() {
  
  // --- Slideshow Functionality ---
  const slides = document.querySelectorAll('.slide');
  let slideIndex = 0;
  
  function showSlide() {
    if (slides.length > 0) {
      slides.forEach(slide => slide.classList.remove('active'));
      slides[slideIndex].classList.add('active');
      slideIndex = (slideIndex + 1) % slides.length;
    }
  }
  
  // Start slideshow if slides exist
  if (slides.length > 0) {
    setInterval(showSlide, 3000);
  }

  // --- Navbar Scroll Behavior ---
  window.addEventListener('scroll', () => {
    const header = document.getElementById('mainHeader');
    if (header) {
      if (window.scrollY > window.innerHeight - 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  // --- Navbar Active Link and Smooth Scroll ---
  document.querySelectorAll('a.navlink').forEach(link => {
    link.addEventListener('click', function(e) {
      // Remove active class from all nav links
      document.querySelectorAll('a.navlink').forEach(a => a.classList.remove('active'));
      // Add active class to clicked link
      this.classList.add('active');
      
      const toId = this.getAttribute('href');
      const target = document.querySelector(toId);
      
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: "smooth"
        });
      }
    });
  });

  // --- Dynamic Quote Form Generation ---
  const daysSelect = document.getElementById("days");
  const daysContainer = document.getElementById("daysContainer");
  
  // Define available roles and hour options
  const roles = [
    "Photographer", 
    "Videographer", 
    "Candid Photographer", 
    "Cinematographer", 
    "Drone"
  ];
  const hourOptions = [2, 4, 6, 8];
  
  if (daysSelect && daysContainer) {
    daysSelect.addEventListener("change", function() {
      const numDays = parseInt(this.value);
      
      // Clear previous content
      daysContainer.innerHTML = "";
      
      // Generate day sections if valid number selected
      if (!isNaN(numDays) && numDays > 0 && numDays <= 5) {
        for (let dayNum = 1; dayNum <= numDays; dayNum++) {
          // Create main container for this day
          const daySection = document.createElement("div");
          daySection.className = "day-workforce-section";
          
          // Create and add heading
          const heading = document.createElement("h3");
          heading.textContent = `Day ${dayNum} - Workforce`;
          daySection.appendChild(heading);
          
          // Create role entries for each role
          roles.forEach(role => {
            const roleKey = role.replace(/\s+/g, '').toLowerCase();
            
            const roleDiv = document.createElement("div");
            roleDiv.className = "role-entry";
            
            // Create checkbox and label
            const checkboxLabel = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = `day${dayNum}_${roleKey}_enabled`;
            checkbox.id = `day${dayNum}_${roleKey}_checkbox`;
            
            checkboxLabel.appendChild(checkbox);
            checkboxLabel.appendChild(document.createTextNode(` ${role}`));
            
            // Create quantity input
            const qtyLabel = document.createElement("label");
            qtyLabel.textContent = "Qty: ";
            const qtyInput = document.createElement("input");
            qtyInput.type = "number";
            qtyInput.name = `day${dayNum}_${roleKey}_qty`;
            qtyInput.min = "1";
            qtyInput.max = "10";
            qtyInput.disabled = true; // Disabled by default
            qtyInput.value = "1"; // Default value
            
            qtyLabel.appendChild(qtyInput);
            
            // Create hours select
            const hoursLabel = document.createElement("label");
            hoursLabel.textContent = "Hours: ";
            const hoursSelect = document.createElement("select");
            hoursSelect.name = `day${dayNum}_${roleKey}_hours`;
            hoursSelect.disabled = true; // Disabled by default
            
            // Add default option
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "--Select Hours--";
            hoursSelect.appendChild(defaultOption);
            
            // Add hour options
            hourOptions.forEach(hours => {
              const option = document.createElement("option");
              option.value = hours;
              option.textContent = `${hours} hrs`;
              hoursSelect.appendChild(option);
            });
            
            hoursLabel.appendChild(hoursSelect);
            
            // Add event listener to checkbox to enable/disable inputs
            checkbox.addEventListener('change', function() {
              qtyInput.disabled = !this.checked;
              hoursSelect.disabled = !this.checked;
              
              if (!this.checked) {
                qtyInput.value = "1";
                hoursSelect.value = "";
              }
            });
            
            // Append all elements to role div
            roleDiv.appendChild(checkboxLabel);
            roleDiv.appendChild(qtyLabel);
            roleDiv.appendChild(hoursLabel);
            
            // Add role div to day section
            daySection.appendChild(roleDiv);
          });
          
          // Add day section to container
          daysContainer.appendChild(daySection);
        }
      }
    });
  }

  // --- Quote Form Submit Handler ---
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Collect form data
      const formData = new FormData(this);
      const data = {};
      
      // Get basic form data
      for (let [key, value] of formData.entries()) {
        data[key] = value;
      }
      
      // Display collected data (you can modify this to send to backend)
      console.log('Quote Form Data:', data);
      alert('Thank you! Your quote request has been submitted. We will contact you soon with a personalized quote.');
      
      // Reset form
      this.reset();
      daysContainer.innerHTML = "";
    });
  }

  // --- Contact Form Handler (if exists) ---
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert("Thanks! We'll contact you soon.");
      this.reset();
    });
  }
});
            
