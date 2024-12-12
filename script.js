/// Quiz

const jogo = document.querySelector("#jogo");
const elementos = document.querySelectorAll("[data-etapa]");
const forms = document.querySelectorAll("form");
const ranges = document.querySelectorAll('input[type="range"]');
const emojiButtons = document.querySelectorAll(".emoji-btn");
const primeiraMensagem = document.getElementById("primeira-mensagem");
const segundaMensagem = document.getElementById("segunda-mensagem");

if (!jogo) {
  console.error("Elemento com ID 'jogo' não encontrado no DOM.");
}

let etapa = 0;
let intervalId; // Variável para controlar o intervalo de queda dos emojis

document.getElementById("jogar")?.addEventListener("click", function (event) {
  event.preventDefault();
  jogo.style.display = "block";
  this.style.display = "none";
  document.getElementById("seta").style.display = "none";
});

document.getElementById("seta")?.addEventListener("click", function (event) {
  event.preventDefault();
  jogo.style.display = "block";
  this.style.display = "none";
  document.getElementById("jogar").style.display = "none";
});

forms.forEach((form) => {
  form.onsubmit = (event) => {
    event.preventDefault();
    checar(form, event.submitter);
  };
});

function checar(form, button) {
  if (!form.dataset.resposta) {
    console.error("Atributo data-resposta não encontrado no formulário.");
    return;
  }

  const formData = button ? new FormData(form, button) : new FormData(form);
  const formProps = Object.fromEntries(formData);
  const resposta = formProps.resposta;
  const correta = resposta === form.dataset.resposta;

  if (correta) {
    alert("Acertou!");
    etapa++;
    mostrarEtapa();

    // Verifica se todas as perguntas foram respondidas
    if (etapa >= elementos.length) {
      mostrarMensagemPorTempo(); // Exibe a mensagem e os emojis por um tempo determinado
    }
  } else {
    alert("Ops! Tente novamente");
  }
}

function mostrarValores() {
  ranges.forEach((range) => {
    const p = range.nextElementSibling;

    if (!p) {
      console.error("Elemento próximo ao input range não encontrado.");
      return;
    }

    range.oninput = () => {
      p.textContent = range.value + "h";
    };
  });
}

mostrarValores();

function mostrarEtapa() {
  elementos.forEach((elemento, indice) => {
    elemento.hidden = indice === etapa ? false : true;
  });
}

mostrarEtapa();

// Matter

// Extrai módulos
const {
  Engine,
  Render,
  Runner,
  Bodies,
  MouseConstraint,
  Mouse,
  Events,
  World,
  Composite,
} = Matter;

// Cria engine
const engine = Engine.create();

// Cria renderer
const render = Render.create({
  element: jogo,
  engine: engine,
  options: {
    height: 640,
    width: 1280,
    background: "transparent",
    wireframes: false,
  },
});

// Inicia renderer
Render.run(render);

// Cria runner
const runner = Runner.create();

// Inicia runner
Runner.run(runner, engine);

// Cria chão
const chao = Bodies.rectangle(640, 640 + 64, 1280, 128, { isStatic: true });

// Adiciona chão ao mundo
Composite.add(engine.world, [chao]);

// Adiciona controles de mouse
const mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

Composite.add(engine.world, mouseConstraint);

// Sincroniza mouse com rendering
render.mouse = mouse;

// Define emojis possíveis
const emojis = ["🧹", "🧦", "🍕", "📗", "🛴", "🩳", "🧸", "🩴", "🪣", "🎒"];

// Retorna textura de emoji aleatório
function emojiAleatorio() {
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  return `https://emojicdn.elk.sh/${emoji}?style=google`;
}

// Faz um único emoji cair
function cairEmoji() {
  const raio = 80 * 0.75;
  const x = Math.random() * 1280;
  const y = raio * -1;
  const angulo = Math.random() * 2 * Math.PI;

  const circulo = Bodies.circle(x, y, raio, {
    angle: angulo,
    render: {
      sprite: {
        xScale: 1,
        yScale: 1,
        texture: emojiAleatorio(),
      },
    },
  });

  // Adiciona emoji ao mundo
  Composite.add(engine.world, [circulo]);
}

// Cria um emoji a cada 1 segundo
intervalId = setInterval(() => {
  cairEmoji();

  if (Composite.allBodies(engine.world).length > 50) {
    pararEmojis();
    console.log("Número máximo de emojis atingido.");
  }
}, 1000);

// Função para parar de cair emojis
function pararEmojis() {
  clearInterval(intervalId);
  console.log("Os emojis pararam de cair.");
}

// Quando clica no mundo
Events.on(mouseConstraint, "mousedown", () => {
  // Remove o corpo clicado
  if (mouseConstraint.body) {
    World.remove(engine.world, mouseConstraint.body);
  }
});

// Adiciona eventos de clique aos botões de emoji
emojiButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Exibe a primeira mensagem
    primeiraMensagem.style.display = "block";

    // Esconde a primeira mensagem após 7 segundos e exibe a segunda
    setTimeout(() => {
      primeiraMensagem.style.display = "none";
      segundaMensagem.style.display = "block";
    }, 7000);
  });
});
