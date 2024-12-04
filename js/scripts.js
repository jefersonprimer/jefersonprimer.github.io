const profissao1 = "Software Developer";
const profissao2 = "Cybersecurity Student";
let index = 0;
let currentText = profissao1;
let isErasing = false;
let cursorAnimation = null;

document.addEventListener('DOMContentLoaded', function() {
  typeProfissao();
});

function typeProfissao() {
  const profissaoElement = document.getElementById("profissao");
  if (profissaoElement) {
    if (index < currentText.length) {
      profissaoElement.innerHTML += currentText.charAt(index);
      index++;
      startCursorAnimation(); // Inicia a animação do cursor
      setTimeout(typeProfissao, 200); // Ajuste o tempo de digitação aqui (em milissegundos)
    } else {
      setTimeout(eraseProfissao, 1000); // Tempo de espera antes de iniciar o apagamento (em milissegundos)
    }
  }
}

function eraseProfissao() {
  const profissaoElement = document.getElementById("profissao");
  if (profissaoElement) {
    if (index >= 0) {
      profissaoElement.innerHTML = currentText.substring(0, index);
      index--;
      startCursorAnimation(); // Inicia a animação do cursor
      setTimeout(eraseProfissao, 100); // Ajuste o tempo de apagamento aqui (em milissegundos)
    } else {
      if (currentText === profissao1) {
        // Muda para a segunda profissão após apagar a primeira
        currentText = profissao2;
        index = 0;
        setTimeout(typeProfissao, 500); // Tempo de espera antes de iniciar a digitação novamente (em milissegundos)
      } else {
        // Se já terminou com a segunda profissão, repete o ciclo
        currentText = profissao1;
        index = 0;
        setTimeout(typeProfissao, 500); // Tempo de espera antes de iniciar a digitação novamente (em milissegundos)
      }
    }
  }
}

function startCursorAnimation() {
  const cursorElement = document.getElementById("cursor");
  if (cursorElement) {
    cursorElement.style.animation = 'blink-caret .75s step-end infinite';
    // Limpa a animação anterior se houver
    if (cursorAnimation) {
      clearTimeout(cursorAnimation);
    }
    // Define um timeout para ajustar a duração da animação conforme a escrita
    cursorAnimation = setTimeout(() => {
      cursorElement.style.animation = 'none';
      void cursorElement.offsetWidth; // Força o reflow para reiniciar a animação
      cursorElement.style.animation = 'blink-caret .75s step-end infinite';
    }, 200); // 200 é o mesmo tempo de digitação/eliminação para sincronizar
  }
}

// Scroll down indicator
// Adiciona evento de clique na seta de rolagem
document.querySelector('.scroll-down-indicator i').addEventListener('click', function() {
  var aboutSection = document.querySelector('.about');
  var capaHeight = aboutSection.offsetTop; // Obtém a posição superior da seção .about
  
  // Rola a página suavemente até a seção .about
  window.scrollTo({
    top: capaHeight,
    behavior: 'smooth'
  });
});

// Scroll up indicator
// Adiciona evento de clique na seta de rolagem
document.addEventListener('DOMContentLoaded', () => {
  const scrollUpButton = document.getElementById('scrollUpButton');
  const sectionThreshold = document.querySelector('.about').offsetTop;

  window.addEventListener('scroll', () => {
    if (window.scrollY >= sectionThreshold) {
      scrollUpButton.classList.add('show');
    } else {
      scrollUpButton.classList.remove('show');
    }
  });

  scrollUpButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});

