function novoObjeto(tag, classe) {
  const obj = document.createElement(tag);
  obj.className = classe;
  return obj;
}

function obstaculo() {
  this.elemento = novoObjeto("div", "obstaculo");
  const corpo = novoObjeto("div", "corpo");
  this.elemento.appendChild(corpo);
  this.setTamanho = (tamanho) => (corpo.style.width = `${tamanho}px`);
}

function parDeObstaculo(tamanho, abertura, y) {
  this.elemento = novoObjeto("div", "par-de-obstaculo");

  this.cantoEsquerdo = new obstaculo();
  this.cantoDireito = new obstaculo();

  this.elemento.appendChild(this.cantoEsquerdo.elemento);
  this.elemento.appendChild(this.cantoDireito.elemento);

  this.sortearAbertura = () => {
    const tamanhoEsquerdo = Math.random() * (tamanho - abertura);
    const tamanhoDireito = tamanho - abertura - tamanhoEsquerdo;
    this.cantoEsquerdo.setTamanho(tamanhoEsquerdo);
    this.cantoDireito.setTamanho(tamanhoDireito);
  };

  this.getY = () => parseInt(this.elemento.style.bottom.split("px")[0]);
  this.setY = (y) => (this.elemento.style.bottom = `${y}px`);
  this.getAltura = () => this.elemento.clientHeight;

  this.sortearAbertura();
  this.setY(y);
}

function conjuntoObstaculos(
  tamanho,
  altura,
  abertura,
  distancia,
  notificarPonto
) {
  this.conjunto = [
    new parDeObstaculo(tamanho, abertura, altura + distancia),
    new parDeObstaculo(tamanho, abertura, altura + distancia * 2),
    new parDeObstaculo(tamanho, abertura, altura + distancia * 3),
  ];

  const descolamento = 3;

  this.animar = () => {
    this.conjunto.forEach((conj) => {
      conj.setY(conj.getY() - descolamento);
      if (conj.getY() < -conj.getAltura()) {
        conj.setY(conj.getY() + distancia * this.conjunto.length);
        conj.sortearAbertura();
      }

      const linha = (altura / 10) * 4 - 30;
      const cruzouALinha =
        conj.getY() + descolamento >= linha && conj.getY() < linha;
      if (cruzouALinha) {
        notificarPonto();
      }
    });
  };
}

function Progresso() {
  this.elemento = novoObjeto("span", "progresso");
  this.atualizarPontos = (pontos) => {
    this.elemento.innerHTML = pontos;
  };
  this.atualizarPontos(0);
}

function Passaro(larguraJogo) {
  let voarDireita = false;
  let voarEsquerda = false;

  this.elemento = novoObjeto("img", "passaro");
  this.elemento.src = "imagens/bird.gif";

  const descolamento = 10;

  this.getX = () => this.elemento.style.left.split("px")[0];
  this.setX = (x) => (this.elemento.style.left = `${x}px`);

  window.onkeydown = (e) => {
    if (e.key == "ArrowRight") {
      voarDireita = true;
    } else if (e.key == "ArrowLeft") {
      voarEsquerda = true;
    }
    window.onkeyup = (e) => {
      voarDireita = false;
      voarEsquerda = false;
    };
  };
  this.animar = () => {
    if (voarDireita == true) {
      this.setX(parseInt(this.getX()) + descolamento);
    } else if (voarEsquerda == true) {
      this.setX(this.getX() - descolamento);
    }
    const larguraMaxima = larguraJogo - this.elemento.clientWidth;

    if (this.getX() <= 0) {
      this.setX(0);
    }

    if (this.getX() >= larguraMaxima) {
      this.setX(larguraMaxima);
    }
  };
}

function estaoSobrepostos(elementoA, elementoB) {
  const a = elementoA.getBoundingClientRect();
  const b = elementoB.getBoundingClientRect();

  const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left;
  const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top;
  return horizontal && vertical;
}

function Colisao(passaro, conjuntoObstaculos) {
  let colidiu = false;
  conjuntoObstaculos.conjunto.forEach((parDeObstaculo) => {
    if (!colidiu) {
      const cantoDireito = parDeObstaculo.cantoDireito.elemento;
      const cantoEsquerdo = parDeObstaculo.cantoEsquerdo.elemento;
      colidiu =
        estaoSobrepostos(passaro.elemento, cantoDireito) ||
        estaoSobrepostos(passaro.elemento, cantoEsquerdo);
    }
  });
  return colidiu;
}

function buttaoRecomecar(){
  this.elemento = novoObjeto('button','reiniciar')
  this.elemento.innerHTML = 'Tentar Novamente'
}

function recomecar(butao){
  butao.elemento.style.display = 'block';
  butao.elemento.addEventListener("click",jogo1.reset)
}

function jogo() {
  let pontos = 0;   

  const areaDoJogo = document.querySelector("[area-jogo]");
  const largura = areaDoJogo.clientWidth;
  const altura = areaDoJogo.clientHeight;
  const passaro = new Passaro(largura);
  const butao = new buttaoRecomecar
  
  const progresso = new Progresso();
  const obstaculos = new conjuntoObstaculos(largura, altura, 100, 500, () =>
  progresso.atualizarPontos(++pontos)
  );

  areaDoJogo.appendChild(progresso.elemento);
  areaDoJogo.appendChild(passaro.elemento);
  obstaculos.conjunto.forEach((conj) => areaDoJogo.appendChild(conj.elemento));
  document.querySelector('body').appendChild(butao.elemento)

  this.reset = () => {
    location.reload()
  }
  
  this.start = () => {
    const temporizador = setInterval(() => {
      obstaculos.animar();
      passaro.animar();

      if (Colisao(passaro, obstaculos)) {
        clearInterval(temporizador);
        recomecar(butao)
      }
    }, 20);
  };
}

const jogo1 = new jogo();
jogo1.start();
