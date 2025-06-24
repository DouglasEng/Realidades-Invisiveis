/**
 * REALIDADES INVISÍVEIS 
*/

class RealidadesInvisiveis {
    constructor() {
        this.estadoAtual = {
            personagem: null,
        };

        this.elementos = {
            telaIntro: document.getElementById('tela-introdutoria'),
            telaPersonagem: document.getElementById('tela-personagem'),
            telaJogo: document.getElementById('tela-jogo'),
            botaoStart: document.getElementById('botao-start'),
            personagensOpcoes: document.getElementById('personagens-opcoes'),
            fraseAtual: document.getElementById('frase-atual'),
            overlayLoading: document.getElementById('overlay-loading')
        };

        this.timeouts = [];
        this.inicializar();
    }

    inicializar() {
        this.elementos.botaoStart.addEventListener('click', () => this.mostrarSelecaoPersonagem());
        this.criarCardsPersonagens();
    }

    criarCardsPersonagens() {
        this.elementos.personagensOpcoes.innerHTML = '';

        Object.keys(personagens).forEach(id => {
            const personagem = personagens[id];
            const card = document.createElement('div');
            card.className = 'card-personagem';
            card.dataset.personagem = id;

            card.innerHTML = `
                <div class="icone">${personagem.icone}</div>
                <div class="nome">${personagem.nome}</div>
                <div class="descricao">${personagem.descricao}</div>
                <div class="historia-preview">${personagem.historia.substring(0, 150)}...</div>
            `;

            card.addEventListener('click', () => this.selecionarPersonagem(id));
            this.elementos.personagensOpcoes.appendChild(card);
        });
    }

    mostrarSelecaoPersonagem() {
        this.transicaoTela(this.elementos.telaIntro, this.elementos.telaPersonagem);
    }

    selecionarPersonagem(id) {
        this.estadoAtual.personagem = id;
        const personagem = personagens[id];

        this.mostrarLoading("Preparando sua jornada...");

        setTimeout(() => {
            this.esconderLoading();
            this.iniciarJogo();
        }, 2000);
    }

    iniciarJogo() {
        this.transicaoTela(this.elementos.telaPersonagem, this.elementos.telaJogo);

        const personagem = personagens[this.estadoAtual.personagem];
        this.mostrarNarrativa([
            `Você é ${personagem.nome.split(' - ')[0]}.`,
            personagem.historia,
            "Sua jornada de 30 dias começa agora.",
            "Cada escolha importa.",
            "Cada decisão tem consequências."
        ]);
    }

    mostrarNarrativa(frases) {
        let index = 0;
        const mostrarProxima = () => {
            if (index >= frases.length) return;
            const texto = frases[index];
            this.animarFrase(texto, () => {
                index++;
                this.timeouts.push(setTimeout(mostrarProxima, 3000));
            });
        };
        mostrarProxima();
    }

    animarFrase(texto, callback) {
        const fraseEl = this.elementos.fraseAtual;
        fraseEl.classList.remove('aparecer');
        fraseEl.classList.add('sair');

        setTimeout(() => {
            fraseEl.textContent = texto;
            fraseEl.className = 'frase-narrativa';
            setTimeout(() => {
                fraseEl.classList.add('aparecer');
                if (callback) setTimeout(callback, 1200);
            }, 100);
        }, 800);
    }

    transicaoTela(telaAtual, proximaTela) {
        telaAtual.classList.remove('ativa');
        setTimeout(() => {
            proximaTela.classList.add('ativa');
        }, 500);
    }

    mostrarLoading(texto = "Carregando...") {
        this.elementos.overlayLoading.querySelector('.loading-text').textContent = texto;
        this.elementos.overlayLoading.classList.add('ativo');
    }

    esconderLoading() {
        this.elementos.overlayLoading.classList.remove('ativo');
    }
}

// inicializa o jogo
document.addEventListener('DOMContentLoaded', () => {
    new RealidadesInvisiveis();
});
