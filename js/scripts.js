const profissoes = [
  "Software Developer",
  "Machine Learning Engineer",
  "Cybersecurity Student"
];

let index = 0;
let profissaoIndex = 0;
let isErasing = false;
let cursorAnimation = null;

document.addEventListener("DOMContentLoaded", function () {
  typeProfissao();
});

function typeProfissao() {
  const profissaoElement = document.getElementById("profissao");
  if (!profissaoElement) return;

  if (!isErasing && index < profissoes[profissaoIndex].length) {
    profissaoElement.innerHTML += profissoes[profissaoIndex].charAt(index);
    index++;
    startCursorAnimation();
    setTimeout(typeProfissao, 200);
  } else if (!isErasing) {
    isErasing = true;
    setTimeout(eraseProfissao, 1000);
  }
}

function eraseProfissao() {
  const profissaoElement = document.getElementById("profissao");
  if (!profissaoElement) return;

  if (isErasing && index > 0) {
    profissaoElement.innerHTML = profissoes[profissaoIndex].substring(0, index - 1);
    index--;
    startCursorAnimation();
    setTimeout(eraseProfissao, 100);
  } else if (isErasing) {
    isErasing = false;
    profissaoIndex = (profissaoIndex + 1) % profissoes.length; // Muda para a próxima profissão no ciclo
    setTimeout(typeProfissao, 500);
  }
}

function startCursorAnimation() {
  const cursorElement = document.getElementById("cursor");
  if (!cursorElement) return;

  cursorElement.style.animation = "blink-caret .75s step-end infinite";

  if (cursorAnimation) {
    clearTimeout(cursorAnimation);
  }

  cursorAnimation = setTimeout(() => {
    cursorElement.style.animation = "none";
    void cursorElement.offsetWidth; // Força o reflow para reiniciar a animação
    cursorElement.style.animation = "blink-caret .75s step-end infinite";
  }, 200);
}

// Scroll down indicator
document.addEventListener("DOMContentLoaded", () => {
  const scrollIndicator = document.querySelector(".scroll-down-indicator i");
  if (scrollIndicator) {
    scrollIndicator.addEventListener("click", function () {
      const aboutSection = document.querySelector(".about");
      if (aboutSection) {
        window.scrollTo({
          top: aboutSection.offsetTop,
          behavior: "smooth",
        });
      }
    });
  }
});

// Scroll up indicator
document.addEventListener("DOMContentLoaded", () => {
  const scrollUpButton = document.getElementById("scrollUpButton");
  if (!scrollUpButton) return;

  const aboutSection = document.querySelector(".about");
  if (!aboutSection) return;

  const sectionThreshold = aboutSection.offsetTop;

  window.addEventListener("scroll", () => {
    if (window.scrollY >= sectionThreshold) {
      scrollUpButton.classList.add("show");
    } else {
      scrollUpButton.classList.remove("show");
    }
  });

  scrollUpButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});
