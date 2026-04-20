/* =============================================
   COSMOS PORTFOLIO — ENGINE
   Particle System, Animations, Interactions
   ============================================= */

(() => {
  'use strict';

  // ==============================================
  // LOADING SCREEN
  // ==============================================
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
      initHeroAnimations();
    }, 600);
  });

  // ==============================================
  // PARTICLE SYSTEM
  // ==============================================
  class ParticleSystem {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.mouse = { x: -9999, y: -9999 };
      this.mouseRadius = 120;
      this.particleCount = window.innerWidth < 768 ? 60 : 140;
      this.resize();
      this.createParticles();
      this.bindEvents();
      this.animate();
    }

    resize() {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }

    createParticles() {
      this.particles = [];
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -(Math.random() * 0.5 + 0.15),
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.1,
          hue: Math.random() > 0.5 ? 185 : 260, // cyan or violet
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.01,
        });
      }
    }

    bindEvents() {
      window.addEventListener('resize', () => {
        this.resize();
        this.createParticles();
      });

      document.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });

      document.addEventListener('mouseleave', () => {
        this.mouse.x = -9999;
        this.mouse.y = -9999;
      });
    }

    animate() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (const p of this.particles) {
        // Update pulse
        p.pulse += p.pulseSpeed;
        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

        // Mouse repulsion
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouseRadius && dist > 0) {
          const force = (this.mouseRadius - dist) / this.mouseRadius;
          const angle = Math.atan2(dy, dx);
          p.x += Math.cos(angle) * force * 3;
          p.y += Math.sin(angle) * force * 3;
        }

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.y < -10) {
          p.y = this.height + 10;
          p.x = Math.random() * this.width;
        }
        if (p.x < -10) p.x = this.width + 10;
        if (p.x > this.width + 10) p.x = -10;

        // Draw particle with glow
        this.ctx.save();
        this.ctx.globalAlpha = currentOpacity;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        // Gradient glow
        const gradient = this.ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.size * 3
        );
        gradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${currentOpacity})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 100%, 70%, 0)`);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // Core dot
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsla(${p.hue}, 100%, 85%, ${currentOpacity})`;
        this.ctx.fill();
        this.ctx.restore();
      }

      // Draw faint connections
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const a = this.particles[i];
          const b = this.particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const opacity = (1 - dist / 100) * 0.08;
            this.ctx.beginPath();
            this.ctx.moveTo(a.x, a.y);
            this.ctx.lineTo(b.x, b.y);
            this.ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
          }
        }
      }

      requestAnimationFrame(() => this.animate());
    }
  }

  // Init particle system
  const canvas = document.getElementById('particle-canvas');
  if (canvas) new ParticleSystem(canvas);

  // ==============================================
  // HERO ANIMATIONS
  // ==============================================
  function initHeroAnimations() {
    animateHeroName();
    setTimeout(startTypewriter, 1200);
  }

  function animateHeroName() {
    const container = document.getElementById('hero-name');
    if (!container) return;

    const name = 'Shlok Yagnick';
    const words = name.split(' ');

    container.innerHTML = '';

    let charGlobalIndex = 0;
    words.forEach((word, wordIdx) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';

      for (let i = 0; i < word.length; i++) {
        const charSpan = document.createElement('span');
        charSpan.className = 'char';
        if (wordIdx === 1) charSpan.classList.add('gradient-text');
        charSpan.textContent = word[i];
        charSpan.style.animationDelay = `${charGlobalIndex * 0.08 + 0.5}s`;
        wordSpan.appendChild(charSpan);
        charGlobalIndex++;
      }

      container.appendChild(wordSpan);
      if (wordIdx < words.length - 1) {
        container.appendChild(document.createTextNode(' '));
      }
    });
  }

  // ==============================================
  // TYPEWRITER EFFECT
  // ==============================================
  function startTypewriter() {
    const subtitle = document.getElementById('hero-subtitle');
    if (!subtitle) return;

    const texts = [
      'Machine Learning & Full Stack Developer',
      'Building Intelligent Systems',
      'Transforming Data Into Decisions',
    ];

    let textIndex = 0;
    let charIdx = 0;
    let isDeleting = false;

    const cursor = subtitle.querySelector('.cursor');

    function type() {
      const current = texts[textIndex];

      if (!isDeleting) {
        charIdx++;
        if (charIdx > current.length) {
          setTimeout(() => { isDeleting = true; type(); }, 2500);
          return;
        }
      } else {
        charIdx--;
        if (charIdx < 0) {
          charIdx = 0;
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
          setTimeout(type, 500);
          return;
        }
      }

      // Update text content (preserve cursor)
      subtitle.textContent = current.substring(0, charIdx);
      subtitle.appendChild(cursor);

      const speed = isDeleting ? 30 : 65;
      setTimeout(type, speed);
    }

    type();
  }

  // ==============================================
  // SCROLL REVEAL (Intersection Observer)
  // ==============================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ==============================================
  // 3D TILT EFFECT
  // ==============================================
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      card.style.transition = 'transform 0.1s ease';

      // Update glare position for project cards
      const glare = card.querySelector('.card-glare');
      if (glare) {
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        glare.style.setProperty('--mouse-x', `${percentX}%`);
        glare.style.setProperty('--mouse-y', `${percentY}%`);
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      card.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  });

  // ==============================================
  // DOCK NAVIGATION — Active Section Tracking
  // ==============================================
  const sections = document.querySelectorAll('section[id]');
  const dockLinks = document.querySelectorAll('.dock-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          dockLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('data-section') === id);
          });
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '-10% 0px -10% 0px',
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // Smooth scroll for dock links
  dockLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ==============================================
  // CONTACT TERMINAL
  // ==============================================
  const terminalOutput = document.getElementById('terminal-output');
  const terminalCommands = document.getElementById('terminal-commands');

  if (terminalCommands) {
    terminalCommands.addEventListener('click', (e) => {
      const btn = e.target.closest('.terminal-cmd');
      if (!btn) return;

      const action = btn.dataset.action;
      let outputHTML = '';

      switch (action) {
        case 'email':
          navigator.clipboard.writeText('shlokyagnick@gmail.com').then(() => {
            outputHTML = `
              <div class="terminal-line">
                <span class="prompt">❯</span>
                <span class="success">✓ Email copied: shlokyagnick@gmail.com</span>
              </div>
            `;
            renderOutput(outputHTML);
          }).catch(() => {
            outputHTML = `
              <div class="terminal-line">
                <span class="prompt">❯</span>
                <span>Email: shlokyagnick@gmail.com</span>
              </div>
            `;
            renderOutput(outputHTML);
          });
          return;

        case 'github':
          outputHTML = `
            <div class="terminal-line">
              <span class="prompt">❯</span>
              <span class="success">↗ Opening GitHub — github.com/Shlok0005</span>
            </div>
          `;
          setTimeout(() => {
            window.open('https://github.com/Shlok0005', '_blank');
          }, 400);
          break;

        case 'linkedin':
          outputHTML = `
            <div class="terminal-line">
              <span class="prompt">❯</span>
              <span class="success">↗ Opening LinkedIn profile...</span>
            </div>
          `;
          setTimeout(() => {
            window.open('https://www.linkedin.com/in/shlok-yagnick/', '_blank');
          }, 400);
          break;

        case 'about':
          outputHTML = `
            <div class="terminal-line">
              <span class="prompt">❯</span>
              <span>cat ~/about.txt</span>
            </div>
            <div class="terminal-line" style="padding-left: 22px; margin-top: 6px;">
              <span style="color: var(--cyan);">Name:</span>
              <span> Shlok Yagnick</span>
            </div>
            <div class="terminal-line" style="padding-left: 22px;">
              <span style="color: var(--cyan);">Role:</span>
              <span> ML Engineer & Full Stack Developer</span>
            </div>
            <div class="terminal-line" style="padding-left: 22px;">
              <span style="color: var(--cyan);">University:</span>
              <span> SRM Institute of Science & Technology</span>
            </div>
            <div class="terminal-line" style="padding-left: 22px;">
              <span style="color: var(--cyan);">Stack:</span>
              <span> Python, MERN, TensorFlow, Scikit-learn</span>
            </div>
            <div class="terminal-line" style="padding-left: 22px;">
              <span style="color: var(--cyan);">Status:</span>
              <span class="success"> Open to opportunities ✦</span>
            </div>
          `;
          break;
      }

      renderOutput(outputHTML);
    });
  }

  function renderOutput(html) {
    if (!terminalOutput) return;
    terminalOutput.innerHTML = '';

    // Small delay for "execution" feel
    setTimeout(() => {
      terminalOutput.innerHTML = `<div class="output-line">${html}</div>`;
    }, 150);
  }

  // ==============================================
  // PARALLAX — Background orbs depth on scroll
  // ==============================================
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const orbs = document.querySelectorAll('.bg-orb');
        orbs.forEach((orb, i) => {
          const speed = (i + 1) * 0.03;
          orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });

  // ==============================================
  // STAGGER REVEAL for project cards
  // ==============================================
  const projectCards = document.querySelectorAll('.project-card.reveal');
  const projectObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, index * 100);
          projectObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05 }
  );

  projectCards.forEach((card) => projectObserver.observe(card));

  // ==============================================
  // DOCK HIDE ON SCROLL UP/SHOW ON SCROLL DOWN
  // ==============================================
  let lastScrollY = 0;
  const dock = document.getElementById('dock');

  window.addEventListener('scroll', () => {
    if (!dock) return;
    const currentScrollY = window.scrollY;

    if (currentScrollY < 100) {
      dock.style.opacity = '1';
      dock.style.transform = 'translateX(-50%) translateY(0)';
    } else if (currentScrollY > lastScrollY) {
      // Scrolling down - show dock
      dock.style.opacity = '1';
      dock.style.transform = 'translateX(-50%) translateY(0)';
    } else {
      // Still show on scroll up
      dock.style.opacity = '1';
      dock.style.transform = 'translateX(-50%) translateY(0)';
    }

    lastScrollY = currentScrollY;
  });

})();
