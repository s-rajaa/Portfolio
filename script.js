import * as THREE from 'three';
    const canvas = document.getElementById('three-bg');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60 - 20;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.12, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const geometry2 = new THREE.BufferGeometry();
    const pos2 = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      pos2[i * 3] = (Math.random() - 0.5) * 90;
      pos2[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos2[i * 3 + 2] = (Math.random() - 0.5) * 70 - 30;
    }
    geometry2.setAttribute('position', new THREE.BufferAttribute(pos2, 3));
    const material2 = new THREE.PointsMaterial({ color: 0x9d4edd, size: 0.09, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
    const particles2 = new THREE.Points(geometry2, material2);
    scene.add(particles2);

    let time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.002;
      particles.rotation.y = time * 0.1;
      particles.rotation.x = Math.sin(time * 0.2) * 0.1;
      particles2.rotation.y = -time * 0.08;
      particles2.rotation.x = Math.cos(time * 0.15) * 0.05;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ========== LOADING ANIMATION - HIDE WHEN PAGE FULLY LOADED ==========
    window.addEventListener('load', function() {
      const loadingOverlay = document.getElementById('loadingOverlay');
      if (loadingOverlay) {
        setTimeout(function() {
          loadingOverlay.classList.add('hide');
          setTimeout(function() {
            loadingOverlay.style.display = 'none';
          }, 500);
        }, 500); // Small delay to ensure smooth animation
      }
    });

    // Fallback: hide loading after 3 seconds max (in case something doesn't load)
    setTimeout(function() {
      const loadingOverlay = document.getElementById('loadingOverlay');
      if (loadingOverlay && loadingOverlay.style.display !== 'none') {
        loadingOverlay.classList.add('hide');
        setTimeout(function() {
          loadingOverlay.style.display = 'none';
        }, 500);
      }
    }, 3000);

    // Set body padding top based on navbar height
    function setBodyPadding() {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        const navbarHeight = navbar.offsetHeight;
        document.body.style.paddingTop = navbarHeight + 'px';
      }
    }
    setBodyPadding();
    window.addEventListener('resize', setBodyPadding);

    // Initialize AOS
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true, offset: 100 });

    // Navbar functionality
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Hamburger menu toggle
    if (hamburger) {
      hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        const spans = hamburger.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
          spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
          spans[1].style.opacity = '0';
          spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
          spans[0].style.transform = 'none';
          spans[1].style.opacity = '1';
          spans[2].style.transform = 'none';
        }
      });
    }

    // Close mobile menu when clicking a nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          if (hamburger) {
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
          }
        }
      });
    });

    // Active link highlighting
    function updateActiveLink() {
      let current = '';
      const scrollPos = window.scrollY + 100;
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
      navLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1);
        if (href === current) link.classList.add('active');
        else link.classList.remove('active');
      });
    }
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    // Smooth scroll with offset for fixed navbar
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === "#" || targetId === "") return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const navbarHeight = document.querySelector('.navbar').offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      });
    });

    // RESUME DOWNLOAD - DOWNLOADS YOUR ACTUAL Raja_Resume.pdf FILE
    document.getElementById('resumeBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      
      const link = document.createElement('a');
      link.href = 'Raja_Resume.pdf';
      link.download = 'Raja_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast('Resume downloaded successfully!', '#38bdf8');
    });

    // Google Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameInput = this.querySelector('input[placeholder="Your Name"]');
        const emailInput = this.querySelector('input[placeholder="Your Email"]');
        const msgTextarea = this.querySelector('textarea');
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = msgTextarea.value.trim();
        
        if (!name) {
          showToast('Please enter your name.', '#ef4444');
          return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
          showToast('Please enter a valid email address.', '#ef4444');
          return;
        }
        
        if (!message) {
          showToast('Please tell me about your project.', '#ef4444');
          return;
        }
        
        const GOOGLE_FORM_ID = '1FAIpQLSeKTskvL4XyG9uncYSNE2aCjlIC7Mzq9dGjd8oMIJnxTqPqfw';
        const formUrl = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;
        
        const formData = new FormData();
        formData.append('entry.1345746856', name);
        formData.append('entry.1117149924', email);
        formData.append('entry.1773003349', message);
        
        fetch(formUrl, {
          method: 'POST',
          mode: 'no-cors',
          body: formData
        }).catch(() => {});
        
        showToast(`Thanks ${name}! I'll get back to you soon.`, '#38bdf8');
        contactForm.reset();
      });
    }

    function showToast(message, color) {
      const existing = document.querySelector('.custom-toast');
      if (existing) existing.remove();
      const toast = document.createElement('div');
      toast.className = 'custom-toast';
      toast.textContent = message;
      toast.style.backgroundColor = color;
      toast.style.color = color === '#ef4444' ? 'white' : '#020617';
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }

    // Scroll to top button
    const scrollBtn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) scrollBtn.classList.add('show');
      else scrollBtn.classList.remove('show');
    });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Disabled links toast
    document.querySelectorAll('.project-link.disabled').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Live demo coming soon! Stay tuned.', '#38bdf8');
      });
    });

    // Custom cursor - desktop only
    if (window.innerWidth > 768) {
      const cursor = document.createElement('div');
      cursor.className = 'custom-cursor';
      const cursorDot = document.createElement('div');
      cursorDot.className = 'cursor-dot';
      document.body.appendChild(cursor);
      document.body.appendChild(cursorDot);

      let mouseX = 0, mouseY = 0;
      let cursorX = 0, cursorY = 0;
      let dotX = 0, dotY = 0;

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        dotX += (mouseX - dotX) * 0.3;
        dotY += (mouseY - dotY) * 0.3;
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';
        requestAnimationFrame(animateCursor);
      }
      animateCursor();

      const interactive = document.querySelectorAll('a, button, .btn, .project-card, .skill-card, .service-card, input, textarea, .nav-link');
      interactive.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
          cursor.style.background = 'rgba(56, 189, 248, 0.4)';
          cursorDot.style.opacity = '0';
        });
        el.addEventListener('mouseleave', () => {
          cursor.style.transform = 'translate(-50%, -50%) scale(1)';
          cursor.style.background = '#38bdf8';
          cursorDot.style.opacity = '1';
        });
      });
    }