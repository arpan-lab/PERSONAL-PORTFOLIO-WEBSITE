function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
setInterval(function() {
  document.body.style.backgroundColor = getRandomColor();
}, 5000); 
document.querySelectorAll('nav ul li a').forEach(link => {
link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId); 
    targetSection.scrollIntoView({ behavior: 'smooth' }); 
});
});
const contactForm = document.getElementById('contact-form');
if (contactForm) {
contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); 
    alert('Message sent successfully!');
    this.reset();
});
}
const footerYear = document.createElement('span');
footerYear.textContent = new Date().getFullYear();
const footer = document.querySelector('footer p');
if (footer) {
footer.append(` ${footerYear.textContent}`);
}
document.addEventListener("DOMContentLoaded", () => {
  const resumeButton = document.querySelector(".resume-button");
  resumeButton.addEventListener("click", () => {
      alert("You are about to view or download the resume.");
  });
});

