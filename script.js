// ===========================
// AUDIO SETUP & MANAGEMENT
// ===========================
let bgMusicEnabled = false;
const bgAudio = new Audio();
bgAudio.volume = 0.3;
bgAudio.loop = true;

// Create or get audio controls
let audioControls = document.querySelector('.audio-controls');
if (!audioControls) {
  audioControls = document.createElement('div');
  audioControls.className = 'audio-controls';
  document.body.appendChild(audioControls);
}

// Create music toggle button
const musicBtn = document.createElement('button');
musicBtn.className = 'audio-btn';
musicBtn.textContent = '🎵';
musicBtn.title = 'Toggle Background Music';

// Create hover sound toggle button
const hoverSoundBtn = document.createElement('button');
hoverSoundBtn.className = 'audio-btn';
hoverSoundBtn.textContent = '🔊';
hoverSoundBtn.title = 'Toggle Hover Sounds';

// Add buttons to controls
if (audioControls.children.length === 0) {
  audioControls.appendChild(musicBtn);
  audioControls.appendChild(hoverSoundBtn);
}

let hoverSoundsEnabled = false;

// Music toggle
musicBtn.addEventListener('click', function() {
  bgMusicEnabled = !bgMusicEnabled;
  musicBtn.classList.toggle('active');
  
  if (bgMusicEnabled) {
    // Create a simple beep sound using Web Audio API as background
    playHoverSound();
    // In real deployment, load actual background music
    // bgAudio.src = 'background-music.mp3';
    // bgAudio.play();
  } else {
    bgAudio.pause();
  }
});

// Hover sounds toggle
hoverSoundBtn.addEventListener('click', function() {
  hoverSoundsEnabled = !hoverSoundsEnabled;
  hoverSoundBtn.classList.toggle('active');
});

// ===========================
// SOUND EFFECT FUNCTION (Web Audio API)
// ===========================
function playHoverSound(frequency = 800, duration = 100) {
  if (!hoverSoundsEnabled && !bgMusicEnabled) return;
  
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (e) {
    // Audio context not available, silently fail
  }
}

// Play sounds on button hover when enabled
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.cta-btn, .learn-more, .service-card').forEach(element => {
    element.addEventListener('mouseenter', function() {
      if (hoverSoundsEnabled) {
        playHoverSound(600, 80);
      }
    });
  });
});

// ===========================
// MOBILE MENU CLOSE ON LINK CLICK
// ===========================
const menuToggle = document.getElementById('menu-toggle');
const sidebarLinks = document.querySelectorAll('.sidebar ul li a');

sidebarLinks.forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.checked = false;
    if (hoverSoundsEnabled) {
      playHoverSound(700, 100);
    }
  });
});

// ===========================
// ACTIVE NAVIGATION HIGHLIGHTING
// ===========================
function setActiveNavigation() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  sidebarLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', setActiveNavigation);

// ===========================
// SMOOTH SCROLLING
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href && href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        if (hoverSoundsEnabled) {
          playHoverSound(650, 120);
        }
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// ===========================
// SCROLL REVEAL ANIMATIONS
// ===========================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all cards for scroll animations
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.service-card, .blog-card, .testimonial-card').forEach(card => {
    card.classList.add('scroll-reveal');
    observer.observe(card);
  });
});

// ===========================
// FORM VALIDATION & SUBMISSION
// ===========================
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const fullName = contactForm.querySelector('input[placeholder="Full Name"]')?.value.trim();
    const email = contactForm.querySelector('input[placeholder="Email Address"]')?.value.trim();
    const phone = contactForm.querySelector('input[placeholder="Phone Number"]')?.value.trim();
    const message = contactForm.querySelector('textarea[placeholder="Your Message"]')?.value.trim();

    // Clear previous messages
    const existingMessage = contactForm.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Validation
    if (!fullName || !email || !phone || !message) {
      showFormMessage(contactForm, 'Please fill in all fields.', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {

      showFormMessage(contactForm, 'Please enter a valid email address.', 'error');
      return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9\s+\-()]+$/;
    if (!phoneRegex.test(phone) || phone.length < 10) {
      showFormMessage(contactForm, 'Please enter a valid phone number.', 'error');
      return;
    }

    // Success message
    showFormMessage(contactForm, '✓ Message sent successfully! We will contact you soon.', 'success');

    // Optional: Reset form
    contactForm.reset();

    // Log form data (in real application, send to server)
    console.log({
      name: fullName,
      email: email,
      phone: phone,
      message: message
    });
  });
}

function showFormMessage(form, message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `form-message ${type}`;
  messageDiv.textContent = message;

  form.insertBefore(messageDiv, form.firstChild);

  // Auto-remove success message after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      messageDiv.style.opacity = '0';
      messageDiv.style.transition = 'opacity 0.3s ease';
      setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
  }
}

// ===========================
// BUTTON RIPPLE EFFECT
// ===========================
const buttons = document.querySelectorAll('.cta-btn');

buttons.forEach(button => {
  button.addEventListener('click', (e) => {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });

  // Add ripple effect styling
  if (!document.querySelector('style[data-ripple]')) {
    const style = document.createElement('style');
    style.setAttribute('data-ripple', 'true');
    style.textContent = `
      .cta-btn {
        position: relative;
        overflow: hidden;
      }
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
      }
      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
});

// ===========================
// CARD STAGGER ANIMATION
// ===========================
function staggerCards() {
  const cards = document.querySelectorAll('.service-card, .blog-card, .testimonial-card');
  cards.forEach((card, index) => {
    card.style.animationDelay = (index * 0.1) + 's';
  });
}

document.addEventListener('DOMContentLoaded', staggerCards);

// ===========================
// NAVBAR SCROLL EFFECT
// ===========================
let lastScrollTop = 0;
const navbar = document.querySelector('.hamburger');

window.addEventListener('scroll', () => {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > 100) {
    navbar?.style.color = '#4b0082';
  } else {
    navbar?.style.color = '#4b0082';
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ===========================
// LAZY LOADING IMAGES
// ===========================
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ===========================
// ACCESSIBILITY IMPROVEMENTS
// ===========================
// Keyboard navigation for sidebar
const hamburger = document.querySelector('.hamburger');
hamburger?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    menuToggle.checked = !menuToggle.checked;
  }
});

// ===========================
// PAGE LOAD ANIMATION
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '1';
  
  // Animate elements on page load
  const animatedElements = document.querySelectorAll('section, header');
  animatedElements.forEach((el, index) => {
    el.style.animationDelay = (index * 0.1) + 's';
  });
});

// ===========================
// UTILITY FUNCTIONS
// ===========================

// Debounce function for scroll events
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Get current page name
function getCurrentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

// ===========================
// MODAL FUNCTIONALITY
// ===========================
const modal = document.getElementById('contactModal');
const btn = document.getElementById('bookAppointmentBtn');
const span = document.getElementsByClassName('close')[0];
const modalForm = document.getElementById('modalContactForm');

// Open modal
btn.onclick = function(event) {
  event.preventDefault();
  modal.style.display = 'block';
}

// Close modal when clicking X
span.onclick = function() {
  modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

// Handle modal form submission
modalForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get form values
  const firstName = modalForm.querySelector('input[placeholder="First Name"]').value.trim();
  const lastName = modalForm.querySelector('input[placeholder="Last Name"]').value.trim();
  const email = modalForm.querySelector('input[placeholder="Email Address"]').value.trim();
  const message = modalForm.querySelector('textarea[placeholder="Your Message"]').value.trim();

  // Clear previous messages
  const existingMessage = modalForm.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }

  // Validation
  if (!firstName || !lastName || !email || !message) {
    showModalMessage(modalForm, 'Please fill in all fields.', 'error');
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showModalMessage(modalForm, 'Please enter a valid email address.', 'error');
    return;
  }

  // Success message
  showModalMessage(modalForm, '✓ Message sent successfully! We will contact you soon.', 'success');

  // Optional: Reset form
  modalForm.reset();

  // Close modal after 3 seconds
  setTimeout(() => {
    modal.style.display = 'none';
  }, 3000);

  // Log form data (in real application, send to server)
  console.log({
    firstName: firstName,
    lastName: lastName,
    email: email,
    message: message
  });
});

function showModalMessage(form, message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `form-message ${type}`;
  messageDiv.textContent = message;

  form.insertBefore(messageDiv, form.firstChild);

  // Auto-remove success message after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      messageDiv.style.opacity = '0';
      messageDiv.style.transition = 'opacity 0.3s ease';
      setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
  }
}

console.log('✓ Professional website script loaded successfully!');
