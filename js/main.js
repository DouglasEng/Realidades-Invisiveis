/**
 * REALIDADES INVISÍVEIS 
 */

class RealidadesInvisiveis {
    constructor() {
        this.estadoAtual = {
            personagem: null
        };

        this.elementos = {
            telaIntro: document.getElementById('tela-introdutoria'),
            telaPersonagem: document.getElementById('tela-personagem'),
            botaoStart: document.getElementById('botao-start'),
            personagensOpcoes: document.getElementById('personagens-opcoes')
        };

        this.inicializar();
    }

    inicializar() {
        this.elementos.botaoStart.addEventListener('click', () => this.mostrarSelecaoPersonagem());
        this.criarCardsPersonagens();
    }

    mostrarSelecaoPersonagem() {
        this.transicaoTela(this.elementos.telaIntro, this.elementos.telaPersonagem);
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
                <div class="historia-preview">${personagem.historia.substring(0, 120)}...</div>
            `;

            this.elementos.personagensOpcoes.appendChild(card);
        });
    }

    transicaoTela(telaAtual, proximaTela) {
        telaAtual.classList.remove('ativa');
        setTimeout(() => {
            proximaTela.classList.add('ativa');
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RealidadesInvisiveis();
});
