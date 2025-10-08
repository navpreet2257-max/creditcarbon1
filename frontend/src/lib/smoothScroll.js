/**
 * Smooth scroll utility functions
 */

// Scroll to element with ID
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// Scroll to section with class
export const scrollToSection = (sectionClass, offset = 0) => {
  const section = document.querySelector(sectionClass);
  if (section) {
    const sectionPosition = section.getBoundingClientRect().top;
    const offsetPosition = sectionPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// Scroll to top of page
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};