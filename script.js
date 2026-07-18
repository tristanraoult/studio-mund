document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Custom Cursor
  const cursorInner = document.querySelector('.custom-cursor--inner');
  const cursorOuter = document.querySelector('.custom-cursor--outer');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  
  if (cursorInner && cursorOuter) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorInner.style.left = mouseX + 'px';
      cursorInner.style.top = mouseY + 'px';
    });

    // Custom cursor damping effect
    const renderCursor = () => {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      cursorX += dx * 0.15;
      cursorY += dy * 0.15;
      cursorOuter.style.left = cursorX + 'px';
      cursorOuter.style.top = cursorY + 'px';
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    // Hover states for clickable elements
    const clickables = document.querySelectorAll('a, button, select, input, textarea, .portfolio-item, .clickable');
    clickables.forEach(item => {
      item.addEventListener('mouseenter', () => {
        document.body.classList.add('hovering-clickable');
      });
      item.addEventListener('mouseleave', () => {
        document.body.classList.remove('hovering-clickable');
      });
    });
  }

  // 2. Page Loader
  const pageLoader = document.querySelector('.page-loader');
  if (pageLoader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        pageLoader.classList.add('fade-out');
      }, 800);
    });
    // Fallback if load event already fired
    if (document.readyState === 'complete') {
      setTimeout(() => {
        pageLoader.classList.add('fade-out');
      }, 800);
    }
  }

  // 3. Mobile Hamburger Menu
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu-overlay');
  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.classList.toggle('overflow-hidden');
    });

    // Close menu when clicking link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.classList.remove('overflow-hidden');
      });
    });
  }

  // 4. Split Text Titles
  const splitTitleElements = document.querySelectorAll('.split-text-reveal');
  splitTitleElements.forEach(el => {
    const text = el.textContent.trim();
    el.textContent = '';
    
    // Split by word to keep structure
    const words = text.split(' ');
    words.forEach((word, idx) => {
      const container = document.createElement('span');
      container.className = 'split-word-container';
      
      const span = document.createElement('span');
      span.className = 'split-word';
      span.textContent = word + (idx < words.length - 1 ? '\u00A0' : ''); // add non-breaking space
      span.style.transitionDelay = `${idx * 0.08}s`;
      
      container.appendChild(span);
      el.appendChild(container);
    });
  });

  // 5. Scroll Reveal with Intersection Observer
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Start counter if it is a stat element
        if (entry.target.classList.contains('stat-number')) {
          animateCounter(entry.target);
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // 6. Count-up Stats Animation
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    let count = 0;
    const duration = 1500; // ms
    const stepTime = Math.max(Math.floor(duration / target), 15);
    
    const timer = setInterval(() => {
      count += Math.ceil(target / (duration / stepTime));
      if (count >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = count + suffix;
      }
    }, stepTime);
  }

  // 7. Magnetic CTA Buttons
  const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .magnetic-target');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const position = btn.getBoundingClientRect();
      const x = e.clientX - position.left - (position.width / 2);
      const y = e.clientY - position.top - (position.height / 2);
      
      // Move button slightly towards cursor
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });

  // 8. Contact Form & RDV Booking Handling
  const bookingForm = document.getElementById('bookingForm');
  const successMessage = document.getElementById('bookingSuccess');
  
  if (bookingForm && successMessage) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validate inputs
      const name = document.getElementById('fullName').value.trim();
      const email = document.getElementById('companyEmail').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const company = document.getElementById('companyName').value.trim();
      const message = document.getElementById('projectDesc').value.trim();
      
      if (!name || !email || !phone || !company || !message) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
      }
      
      // Animate submit button
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'ENVOI EN COURS...';
      submitBtn.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        bookingForm.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1500);
    });
  }

  // Active Page Link Indication
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link-item, .mobile-menu-links a, .footer-links-list a');
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    const isProjectDetail = currentPath.startsWith('projet-') && linkPath === 'projets.html';
    if (linkPath === currentPath || isProjectDetail) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

});
