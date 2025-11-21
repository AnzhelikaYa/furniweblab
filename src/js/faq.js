
import Accordion from 'accordion-js';
import 'accordion-js/dist/accordion.min.css';

new Accordion('.qa', {
  duration: 300, 
  showMultiple: false, 
  openOnInit: [], 
});

const faqButtons = document.querySelectorAll('.faq-quest');

faqButtons.forEach(button => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    
    faqButtons.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
    
    if (!expanded) {
      button.setAttribute('aria-expanded', 'true');
    }
  });
});