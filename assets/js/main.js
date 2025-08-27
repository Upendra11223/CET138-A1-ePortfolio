// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initScrollIndicator();
  initCardAnimations();
  initRippleEffect();
  initParticleBackground();
  initSmoothScrolling();
  initYearCounter();
  initTypingEffect();
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Simple “active” indicator for in-page nav links
const links = document.querySelectorAll('.menu a[href^="#"]');
const sections = Array.from(links).map(a => document.querySelector(a.getAttribute('href')));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    const id = '#' + e.target.id;
    const link = document.querySelector('.menu a[href="'+id+'"]');
    if (!link) return;
    link.style.color = e.isIntersecting ? '#fff' : 'var(--muted)';
  });
}, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

sections.forEach(s => s && observer.observe(s));

// Animated year in footer
const yearSpan = document.getElementById('year');
if (yearSpan) {
  const currentYear = new Date().getFullYear();
  let displayedYear = 2000;
  const interval = setInterval(() => {
    if (displayedYear < currentYear) {
      displayedYear++;
      yearSpan.textContent = displayedYear;
    } else {
      clearInterval(interval);
    }
  }, 30);
}

// Scroll-triggered card fade-in
function revealCardsOnScroll() {
  const cards = document.querySelectorAll('.card');
  const trigger = window.innerHeight * 0.85;
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < trigger) {
      card.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealCardsOnScroll);
window.addEventListener('DOMContentLoaded', revealCardsOnScroll);

// Button ripple effect
document.querySelectorAll('.btn.primary').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';
    ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Scroll progress indicator
function initScrollIndicator() {
  const scrollIndicator = document.createElement('div');
  scrollIndicator.className = 'scroll-indicator';
  document.body.appendChild(scrollIndicator);

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollIndicator.style.width = scrolled + '%';
  });
}

// Enhanced card animations with stagger effect
function initCardAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 150); // Stagger animation
      }
    });
  }, observerOptions);

  document.querySelectorAll('.card, h2, .pdf-list li').forEach(card => {
    observer.observe(card);
  });
}

// Enhanced ripple effect
function initRippleEffect() {
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Particle background effect
function initParticleBackground() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '-1';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 10000);
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
      ctx.fill();
      
      // Connect nearby particles
      particles.slice(index + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 100)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(animateParticles);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });

  resizeCanvas();
  createParticles();
  animateParticles();
}

// Smooth scrolling for navigation
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Animated year counter
function initYearCounter() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    const currentYear = new Date().getFullYear();
    let displayYear = currentYear - 10;
    
    const counter = setInterval(() => {
      if (displayYear < currentYear) {
        displayYear++;
        yearElement.textContent = displayYear;
      } else {
        clearInterval(counter);
      }
    }, 50);
  }
}

// Typing effect for hero text
function initTypingEffect() {
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid #6366f1';
    
    let index = 0;
    const typeWriter = () => {
      if (index < text.length) {
        heroTitle.textContent += text.charAt(index);
        index++;
        setTimeout(typeWriter, 100);
      } else {
        setTimeout(() => {
          heroTitle.style.borderRight = 'none';
        }, 1000);
      }
    };
    
    setTimeout(typeWriter, 1000);
  }
}

// Mouse trail effect
document.addEventListener('mousemove', (e) => {
  const trail = document.createElement('div');
  trail.style.position = 'fixed';
  trail.style.left = e.clientX + 'px';
  trail.style.top = e.clientY + 'px';
  trail.style.width = '4px';
  trail.style.height = '4px';
  trail.style.background = 'rgba(99, 102, 241, 0.6)';
  trail.style.borderRadius = '50%';
  trail.style.pointerEvents = 'none';
  trail.style.zIndex = '9999';
  trail.style.animation = 'fadeOut 0.5s ease-out forwards';
  
  document.body.appendChild(trail);
  
  setTimeout(() => {
    trail.remove();
  }, 500);
});

// Add fadeOut animation for mouse trail
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    to {
      opacity: 0;
      transform: scale(0);
    }
  }
`;
document.head.appendChild(style);
