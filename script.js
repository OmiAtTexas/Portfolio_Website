// Scroll animation
const sections = document.querySelectorAll('.section');
window.addEventListener('scroll', () => {
  sections.forEach(section => {
    const top = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if (top < windowHeight - 100) {
      section.classList.add('visible');
    }
  });
});

// Typewriter effect
const typewriterText = ["CS Student", " Aspiring AI Engineer", "Web Developer", "UI/UX Designer"];
let count = 0, index = 0, currentText = "", letter = "";
(function type() {
  if (count === typewriterText.length) count = 0;
  currentText = typewriterText[count];
  letter = currentText.slice(0, ++index);

  document.querySelector(".typewriter").textContent = letter;
  if (letter.length === currentText.length) {
    count++;
    index = 0;
    setTimeout(type, 1500);
  } else {
    setTimeout(type, 100);
  }
})();

// Theme toggle
document.querySelector('.toggle-theme').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});
