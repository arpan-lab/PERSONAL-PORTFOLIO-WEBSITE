// Function to generate a random hex color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  return '#' + Array.from({ length: 6 }, () =>
    letters[Math.floor(Math.random() * 16)]
  ).join('');
}

// Change background color every 5 seconds
setInterval(() => {
  document.body.style.backgroundColor = getRandomColor();
}, 5000);

// Smooth scroll for nav links
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll('nav ul li a');
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href')?.substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Contact form submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      alert('✅ Message sent successfully!');
      contactForm.reset();
    });
  }

  // Add current year to footer
  const footer = document.querySelector('footer p');
  if (footer) {
    const yearSpan = document.createElement('span');
    yearSpan.textContent = new Date().getFullYear();
    footer.append(` ${yearSpan.textContent}`);
  }

  // Resume button alert
  const resumeButton = document.querySelector('.resume-button');
  if (resumeButton) {
    resumeButton.addEventListener('click', () => {
      alert('📄 You are about to view or download the resume.');
    });
  }
});
