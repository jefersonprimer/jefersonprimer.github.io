// script.js
// Dados dos textos em diferentes idiomas
const texts = {
    pt: {
      "page-title": "Jeferson Primer",
      "about-title": "Olá! Eu sou o  Jeferson",
      "about-text": `Apaixonado pelo desenvolvimento web desde os 18 anos, brasileiro e nascido em 2003. Sou estudante de engenharia de software na estacio e Engenheiro de Software freelance. Sou uma pessoa que adora desafios, assim como todo desenvolvedor, mas em especial aqueles que me tiram da minha zona de conforto, pois as minhas maiores evoluções e aprendizados vieram de momentos em que me vi obrigado a sair dela e enfrentar a vida. Estudante assíduo, que aprecia tomar café e nas horas vagas compartilha conhecimento nas redes sociais. Assisto animes e séries investigativas e também adoro ir na academia `,
      "experience-title": "Minha Experiência",
      "cargo": "Engenheiro de Software",
      "data": "Julho 2022 - Presente",
      "experience-text": `Engenheiro de Software
      Julho 2023 - Hoje
      Como Engenheiro de Software, sou responsável por desenvolver novas funcionalidades, realizar code reviews, escrever testes unitários, resolver chamados e bugs, além de monitorar e realizar o deploy de aplicações. Utilizo tecnologias como TypeScript, JavaScript, Angular, Micro Frontends, Micro Serviços, Git, AWS e Google Analytics.
  
      Como freelancer Full-Stack, trabalho com Java, Spring Boot e Spring Cloud para criar e gerenciar microserviços, e uso Angular e TypeScript para construir interfaces dinâmicas. Minha experiência com AWS inclui serviços como ECS, EC2, RDS, S3, Lambda, SQS e SNS, permitindo-me desenvolver soluções escaláveis e resilientes. Tenho também conhecimentos em bancos de dados SQL Server e MySQL, otimizando esquemas e consultas.
  
      Atualmente, estou no segundo semestre de Engenharia de Software, aprofundando conhecimentos teóricos e acadêmicos para complementar minha prática. Essa formação está aprimorando minha capacidade de enfrentar desafios complexos e fornecer soluções inovadoras e eficientes.`,
      "projects-title": "Projetos",
      "leitura-rapida-title": "Leitura rápida"
    },
    en: {
      "page-title": "Jeferson Primer",
      "about-title": "Hi There! I'm Jeferson",
      "about-text": `Passionate about web development since I was 18 years old, Brazilian and born in 2001. I'm a Computer Science student at the Federal University of Pelotas and a Software Engineer at the largest bank in Latin America. I'm someone who loves challenges, just like any developer, but especially those that push me out of my comfort zone, as my greatest evolutions and learnings have come from times when I had to leave it and face life. An avid student who enjoys drinking coffee and, in my spare time, shares knowledge on social media. I watch romances and investigative series and also love going to the gym `,
      "experience-title": "My Experience",
      "cargo": "Junior Software Engineer",
      "data": "July 2022 - Present",
      "experience-text": `Software Engineer at Itaú Unibanco
      July 2022 - Present
      As a Software Engineer, I am responsible for developing new features, carrying out code reviews, writing unit tests, resolving tickets and bugs, in addition to monitoring and deploying applications. I use technologies such as TypeScript, JavaScript, Angular, Micro Frontends, Micro Services, Git, AWS and Google Analytics.
  
      As a Full-Stack freelancer, I work with Java, Spring Boot and Spring Cloud to create and manage microservices, and use Angular and TypeScript to build dynamic interfaces. My experience with AWS includes services such as ECS, EC2, RDS, S3, Lambda, SQS and SNS, allowing me to develop scalable and resilient solutions. I also have knowledge in SQL Server and MySQL databases, optimizing schemas and queries.
  
      Currently, I am in the second semester of Software Engineering, deepening theoretical and academic knowledge to complement my practice. This training is enhancing my ability to face complex challenges and provide innovative and efficient solutions.
      Technologies: Typescript, Javascript, Angular, Micro Frontends, Microservices, Angular, Git, AWS Services, Google Analytics.`,
      "projects-title": "Projects",
      "leitura-rapida-title": "Quick Reads"
    }
  };
  
  // Função para atualizar o texto da página
  function updateText(language) {
    const textElements = document.querySelectorAll('[id]');
    textElements.forEach(element => {
      const key = element.id;
      if (texts[language][key]) {
        element.textContent = texts[language][key];
      }
    });
  }
  
  // Manipulação do evento de troca de idioma
  document.getElementById('lang-toggle').addEventListener('change', function() {
    const language = this.checked ? 'en' : 'pt';
    updateText(language);
  });
  
  // Definir o idioma inicial
  const initialLanguage = document.getElementById('lang-toggle').checked ? 'en' : 'pt';
  updateText(initialLanguage);
  