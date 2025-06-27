/**
 * REALIDADES INVISÍVEIS 
*/

class RealidadesInvisiveis {
    constructor() {
        this.estadoAtual = {
            personagem: null,
            semanaAtual: 1,
            eventoAtual: 0,
            fraseAtual: 0,
            status: {
                saude: 0,
                estresse: 0,
                esperanca: 0,
                dinheiro: 0
            },
            historiaEscolhas: [],
            jogoFinalizado: false
        };

        this.elementos = {
            telaIntro: document.getElementById('tela-introdutoria'),
            telaPersonagem: document.getElementById('tela-personagem'),
            telaJogo: document.getElementById('tela-jogo'),
            telaFinal: document.getElementById('tela-final'),
            botaoStart: document.getElementById('botao-start'),
            personagensOpcoes: document.getElementById('personagens-opcoes'),
            fraseAtual: document.getElementById('frase-atual'),
            escolhasContainer: document.getElementById('escolhas-container'),
            statusNarrativo: document.getElementById('status-narrativo'),
            indicadorProgresso: document.getElementById('indicador-progresso'),
            overlayLoading: document.getElementById('overlay-loading'),
            botaoReiniciar: document.getElementById('botao-reiniciar')
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
                <div class="historia-preview">${personagem.historia.substring(0, 120)}...</div>
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

        this.estadoAtual.status = { ...personagem.statusInicial };

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
        ], () => {
            this.iniciarSemana();
        });
    }

    iniciarSemana() {
        const semanaKey = `semana${this.estadoAtual.semanaAtual}`;
        const eventosPersonagem = eventosNarrativos[semanaKey][this.estadoAtual.personagem];

        if (!eventosPersonagem || eventosPersonagem.length === 0) {
            return;
        }

        this.estadoAtual.eventoAtual = 0;
        this.atualizarProgresso();
        this.executarEvento();
    }

    executarEvento() {
        const semanaKey = `semana${this.estadoAtual.semanaAtual}`;
        const eventosPersonagem = eventosNarrativos[semanaKey][this.estadoAtual.personagem];
        const evento = eventosPersonagem[this.estadoAtual.eventoAtual];

        if (!evento) {
            this.proximaSemana();
            return;
        }

        this.mostrarNarrativa(evento.narrativa, () => {
            this.mostrarEscolhas(evento.escolhas);
        });
    }

    mostrarNarrativa(frases, callback) {
        this.estadoAtual.fraseAtual = 0;
        this.elementos.escolhasContainer.classList.remove('mostrar');

        const mostrarProximaFrase = () => {
            if (this.estadoAtual.fraseAtual >= frases.length) {
                if (callback) callback();
                return;
            }

            const frase = frases[this.estadoAtual.fraseAtual];
            this.animarFrase(frase, () => {
                this.estadoAtual.fraseAtual++;
                this.timeouts.push(setTimeout(mostrarProximaFrase, 3000));
            });
        };

        mostrarProximaFrase();
    }

    animarFrase(texto, callback) {
        const fraseEl = this.elementos.fraseAtual;
        fraseEl.classList.remove('aparecer');
        fraseEl.classList.add('sair');

        setTimeout(() => {
            fraseEl.textContent = texto;
            fraseEl.classList.remove('sair');
            fraseEl.className = 'frase-narrativa';

            if (texto.includes('?') || texto.includes('fazer')) fraseEl.classList.add('destaque');
            if (texto.includes('você sente') || texto.includes('pensa')) fraseEl.classList.add('pensamento');
            if (texto.includes('!') && (texto.includes('dor') || texto.includes('medo') || texto.includes('desespero'))) {
                fraseEl.classList.add('impacto');
                fraseEl.classList.add('impacto-emocional');
            }

            setTimeout(() => {
                fraseEl.classList.add('aparecer');
                if (callback) setTimeout(callback, 1200);
            }, 100);
        }, 800);
    }

    mostrarEscolhas(escolhas) {
        this.elementos.escolhasContainer.innerHTML = '';

        escolhas.forEach((escolha, index) => {
            const opcao = document.createElement('div');
            opcao.className = 'opcao-escolha';
            opcao.textContent = escolha.texto;
            opcao.dataset.escolha = index;

            opcao.addEventListener('click', () => this.processarEscolha(escolha));
            this.elementos.escolhasContainer.appendChild(opcao);
        });

        setTimeout(() => {
            this.elementos.escolhasContainer.classList.add('mostrar');
        }, 500);
    }

    processarEscolha(escolha) {
        this.estadoAtual.historiaEscolhas.push({
            semana: this.estadoAtual.semanaAtual,
            evento: this.estadoAtual.eventoAtual,
            escolha: escolha.texto,
            consequencias: escolha.consequencias
        });

        this.aplicarConsequencias(escolha.consequencias);

        this.mostrarNarrativa([escolha.resultado], () => {
            this.mostrarStatusNarrativo();
            setTimeout(() => {
                this.proximoEvento();
            }, 3000);
        });
    }

    aplicarConsequencias(consequencias) {
        Object.keys(consequencias).forEach(stat => {
            let valor = consequencias[stat];
            if (typeof valor === 'function') valor = valor();

            this.estadoAtual.status[stat] = Math.max(0, this.estadoAtual.status[stat] + valor);
            if (stat !== 'dinheiro') {
                this.estadoAtual.status[stat] = Math.min(100, this.estadoAtual.status[stat]);
            }
        });

    }

    mostrarStatusNarrativo() {
        const status = this.estadoAtual.status;
        let mensagem = '';

        if (status.saude < 30) mensagem += "Você está sentindo seu corpo fraquejar. ";
        if (status.estresse > 70) mensagem += "A ansiedade está consumindo suas noites. ";
        if (status.esperanca < 20) mensagem += "É difícil ver luz no fim do túnel. ";
        if (status.dinheiro < 100) mensagem += "O dinheiro está acabando rapidamente. ";

        if (mensagem) {
            this.elementos.statusNarrativo.innerHTML = `
                <span class="status-saude">💔 Saúde: ${this.puxarStatus('saude')}</span> |
                <span class="status-estresse">😰 Estresse: ${this.puxarStatus('estresse')}</span> |
                <span class="status-esperanca">🌟 Esperança: ${this.puxarStatus('esperanca')}</span> |
                <span class="status-dinheiro">💰 R$ ${status.dinheiro}</span>
            `;
            this.elementos.statusNarrativo.classList.add('mostrar');

            setTimeout(() => {
                this.elementos.statusNarrativo.classList.remove('mostrar');
            }, 4000);
        }
    }

    puxarStatus(tipo) {
        const valor = this.estadoAtual.status[tipo];
        if (valor >= 70) return 'Boa';
        if (valor >= 40) return 'Regular';
        if (valor >= 20) return 'Baixa';
        return 'Crítica';
    }

    proximoEvento() {
        this.estadoAtual.eventoAtual++;
        this.executarEvento();
    }

    proximaSemana() {
        this.estadoAtual.semanaAtual++;
        this.estadoAtual.eventoAtual = 0;

        if (this.estadoAtual.semanaAtual > 4) {
            this.finalizarJogo();
            return;
        }

        this.mostrarNarrativa([
            `Semana ${this.estadoAtual.semanaAtual}`,
            "Os dias passam, mas os desafios continuam.",
            "Cada semana traz novas decisões."
        ], () => {
            this.iniciarSemana();
        });
    }

    finalizarJogo() {
        this.estadoAtual.jogoFinalizado = true;  
        this.elementos.telaJogo.classList.remove('ativa');     
        if (window.SequenciaFinal) {
            SequenciaFinal.iniciar(this.estadoAtual.personagem);
        } else {
            console.error('SequenciaFinal não encontrada');
        }
    }

    mostrarLoading(texto = "Carregando...") {
        this.elementos.overlayLoading.querySelector('.loading-text').textContent = texto;
        this.elementos.overlayLoading.classList.add('ativo');
    }
    
    esconderLoading() {
        this.elementos.overlayLoading.classList.remove('ativo');
    }

    atualizarProgresso() {
        this.elementos.indicadorProgresso.textContent = 
            `Semana ${this.estadoAtual.semanaAtual} de 4`;
    }

    transicaoTela(telaAtual, proximaTela) {
        telaAtual.classList.remove('ativa');
        setTimeout(() => {
            proximaTela.classList.add('ativa');
        }, 500);
    }
    
}

// inicializa o jogo
document.addEventListener('DOMContentLoaded', () => {
    window.jogo = new RealidadesInvisiveis();
});
