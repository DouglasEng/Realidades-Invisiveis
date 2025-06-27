class SequenciaFinal {
    constructor() {
        this.personagemAtual = null;
        this.timeouts = [];
        this.frasesNarrativa = [];
        this.fraseAtualIndex = 0;
        this.elementos = {
            telaFinal: document.getElementById('tela-final'),
            finalVerdadeiro: document.getElementById('final-verdadeiro'),
            tituloFinal: document.getElementById('titulo-final'),
            fraseAtual: document.getElementById('frase-final'),
            finalContent: null,

            efeitoDramatico: document.getElementById('efeito-dramatico'),
            desfechoNarrativo: document.getElementById('desfecho-narrativo'),
            fraseDesfecho: document.getElementById('frase-desfecho'),
            imagensContainer: document.getElementById('imagens-container'),
            imagemCentral: document.getElementById('imagem-central'),
            colagemImagens: document.getElementById('colagem-imagens'),
            imagemFinalCentral: document.getElementById('imagem-final-central'),
            reflexaoFinal: document.getElementById('reflexao-final'),
            botaoReiniciar: document.getElementById('botao-reiniciar')
        };

        this.imagensPersonagens = {
            'mae-solo': {
                central: 'images/mae-solo/frase1.png',
                colagem: [
                    'images/mae-solo/imagem1.png',
                    'images/mae-solo/imagem2.png',
                    'images/mae-solo/argumento1.png',
                    'images/mae-solo/argumento2.png',
                    'images/mae-solo/estatistica1.png',
                    'images/mae-solo/jornal1.png',
                    'images/mae-solo/jornal2.png'
                ],
                final: 'images/mae-solo/desenho.jpeg'
            },
            'jovem-desempregado': {
                central: 'images/jovem-desempregado/frase1.png',
                colagem: [
                    'images/jovem-desempregado/imagem1.png',
                    'images/jovem-desempregado/argumento1.png',
                    'images/jovem-desempregado/argumento2.png',
                    'images/jovem-desempregado/argumento3.png',
                    'images/jovem-desempregado/estatistica1.png',
                    'images/jovem-desempregado/jornal1.png',
                    'images/jovem-desempregado/jornal3.jpg'
                ],
                final: 'images/jovem-desempregado/manifestacao.jpg'
            },
            'trabalhador-informal': {
                central: 'images/trabalhador-informal/imagem1.png',
                colagem: [
                    'images/trabalhador-informal/imagem2.png',
                    'images/trabalhador-informal/imagem3.png',
                    'images/trabalhador-informal/imagem4.png',
                    'images/trabalhador-informal/estatistica1.png',
                    'images/trabalhador-informal/jornal1.png',
                    'images/trabalhador-informal/argumento1.png',
                    'images/trabalhador-informal/argumento2.png'
                ],
                final: 'images/trabalhador-informal/foto.png'
            },
            'deficiencia': {
                central: 'images/deficiência/frase1.png',
                colagem: [
                    'images/deficiência/imagem1.png',
                    'images/deficiência/imagem2.png',
                    'images/deficiência/imagem3.png',
                    'images/deficiência/argumento1.png',
                    'images/deficiência/jornal1.png',
                    'images/deficiência/estatistica1.jpg',
                    'images/deficiência/estatistica2.png'
                ],
                final: 'images/deficiência/foto1.png'
            }
        };

        this.desfechosNarrativos = {
            'mae-solo': [
                "Mais um dia termina, e você ainda está de pé.",
                "Seus filhos dormem seguros, e isso é tudo que importa.",
                "Amanhã será outro dia de luta, mas você não desiste.",
                "Você é mais forte do que imagina.",
                "Sua história é de resistência e amor incondicional."
            ],
            'jovem-desempregado': [
                "Cada 'não' te aproxima do 'sim' que mudará tudo.",
                "Sua determinação é maior que qualquer obstáculo.",
                "O futuro ainda está sendo escrito por suas mãos.",
                "Você não é apenas uma estatística.",
                "Sua voz e seus sonhos importam."
            ],
            'trabalhador-informal': [
                "Cada dia de trabalho é um ato de coragem.",
                "Você constrói o país com suas próprias mãos.",
                "Sua dignidade não depende de um papel assinado.",
                "Você é o motor que move a economia real.",
                "Sua luta merece reconhecimento e respeito."
            ],
            'deficiencia': [
                "Suas limitações não definem suas possibilidades.",
                "Você quebra barreiras todos os dias.",
                "Sua existência é uma forma de resistência.",
                "O mundo precisa se adaptar a você, não o contrário.",
                "Você é protagonista da sua própria história."
            ]
        };

        this.inicializar();
    }

    inicializar() {
        if (this.elementos.botaoReiniciar) {
            this.elementos.botaoReiniciar.addEventListener('click', () => this.reiniciarJogo());
        }
    }
    mostrarFinalVerdadeiro() {
        const personagem = this.personagemAtual;
        const status = window.jogo?.estadoAtual?.status;

        if (!personagem || !status) {
            console.error('Personagem ou status não encontrado:', { personagem, status });
            return;
        }

        const finais = window.finaisPossiveis?.[personagem];
        if (!finais) {
            console.error('Finais não encontrados para personagem:', personagem);
            return;
        }

        const atende = (condicoes) => Object.keys(condicoes).every(
            chave => status[chave] >= condicoes[chave]
        );

        let finalEscolhido = finais.negativo;
        if (atende(finais.positivo.condicoes)) {
            finalEscolhido = finais.positivo;
        } else if (atende(finais.neutro.condicoes)) {
            finalEscolhido = finais.neutro;
        }

        console.log('Final escolhido:', finalEscolhido);

        this.prepararNarrativa(finalEscolhido.narrativa);
        this.elementos.tituloFinal.textContent = finalEscolhido.titulo;

        this.elementos.finalContent = this.elementos.finalVerdadeiro.querySelector('.final-content');

        this.elementos.finalVerdadeiro.style.display = 'block';
        this.elementos.finalVerdadeiro.style.opacity = '0';
        this.elementos.finalVerdadeiro.classList.remove('oculto');
        
        setTimeout(() => {
            this.elementos.finalVerdadeiro.style.opacity = '1';
            this.elementos.finalVerdadeiro.classList.add('mostrar');
            
            setTimeout(() => {
                this.iniciarSequenciaFrases();
            }, 800);
        }, 100);
    }

    prepararNarrativa(narrativa) {
        this.frasesNarrativa = narrativa.split(/(?<=[.!?])\s+/).filter(frase => frase.trim().length > 0).map(frase => frase.trim());
        this.fraseAtualIndex = 0;
        console.log('Frases preparadas:', this.frasesNarrativa);
    }

    iniciarSequenciaFrases() {
        if (this.fraseAtualIndex < this.frasesNarrativa.length) {
            this.mostrarProximaFrase();
        } else {
            this.iniciarSaidaFinal();
        }
    }

    mostrarProximaFrase() {
        const frase = this.frasesNarrativa[this.fraseAtualIndex];
        
        this.elementos.fraseAtual.classList.remove('mostrar', 'sair');
        this.elementos.fraseAtual.textContent = frase;
        
        setTimeout(() => {
            this.elementos.fraseAtual.classList.add('mostrar');
        }, 100);
        const tempoExibicao = Math.max(3000, frase.length * 50);
        this.timeouts.push(setTimeout(() => {
            this.elementos.fraseAtual.classList.remove('mostrar');
            this.elementos.fraseAtual.classList.add('sair');
            
            setTimeout(() => {
                this.fraseAtualIndex++;
                this.iniciarSequenciaFrases();
            }, 800);
            
        }, tempoExibicao));
    }

    iniciarSaidaFinal() {
        if (this.elementos.finalContent) {
            this.elementos.finalContent.classList.add('sair-final');
        }
        
        this.timeouts.push(setTimeout(() => {
            this.elementos.finalVerdadeiro.style.opacity = '0';
            
            setTimeout(() => {
                this.elementos.finalVerdadeiro.classList.add('oculto');
                this.elementos.finalVerdadeiro.style.display = 'none';
                
                this.iniciarDesfechoNarrativo();
            }, 800);
            
        }, 1500));
    }

    iniciarSequenciaFinal(personagem) {
        console.log('Iniciando sequência final para:', personagem);
        
        this.personagemAtual = personagem;
        this.limparTimeouts();
        
        this.resetarElementos();
        
        this.elementos.telaFinal.classList.add('ativa');
        this.elementos.telaFinal.style.display = 'block';
        
        if (!window.jogo || !window.jogo.estadoAtual) {
            console.error('Estado do jogo não encontrado');
            return;
        }
        
        if (!window.finaisPossiveis) {
            console.error('Finais possíveis não encontrados');
            return;
        }
        
        setTimeout(() => {
            this.aplicarEfeitoDramatico();
            this.timeouts.push(setTimeout(() => {
                this.mostrarFinalVerdadeiro();
            }, 3000));
        }, 500);
    }

    aplicarEfeitoDramatico() {
        this.elementos.efeitoDramatico.style.display = 'block';
        this.elementos.efeitoDramatico.classList.add('ativo');
        
        this.timeouts.push(setTimeout(() => {
            this.elementos.efeitoDramatico.classList.remove('ativo');
            this.elementos.efeitoDramatico.style.display = 'none';
        }, 3000));
    }

    inicializar() {
        if (this.elementos.botaoReiniciar) {
            this.elementos.botaoReiniciar.addEventListener('click', () => this.reiniciarJogo());
        }
    }
    iniciarDesfechoNarrativo() {
        const frases = this.desfechosNarrativos[this.personagemAtual];
        let fraseAtual = 0;

        this.elementos.desfechoNarrativo.classList.remove('oculto');
        this.elementos.desfechoNarrativo.classList.add('mostrar');

        const mostrarProximaFrase = () => {
            if (fraseAtual >= frases.length) {
                this.timeouts.push(setTimeout(() => {
                    this.elementos.desfechoNarrativo.classList.add('oculto');
                    this.iniciarSequenciaImagens();
                }, 2000));
                return;
            }

            const frase = frases[fraseAtual];
            this.animarFraseDesfecho(frase, () => {
                fraseAtual++;
                this.timeouts.push(setTimeout(mostrarProximaFrase, 3500));
            });
        };

        mostrarProximaFrase();
    }

    animarFraseDesfecho(texto, callback) {
        this.elementos.fraseDesfecho.style.opacity = '0';
        this.elementos.fraseDesfecho.style.transform = 'translateY(30px)';
        
        this.timeouts.push(setTimeout(() => {
            this.elementos.fraseDesfecho.textContent = texto;
            this.elementos.fraseDesfecho.style.opacity = '1';
            this.elementos.fraseDesfecho.style.transform = 'translateY(0)';
            
            if (callback) {
                this.timeouts.push(setTimeout(callback, 2500));
            }
        }, 500));
    }

    iniciarSequenciaImagens() {
        this.elementos.imagensContainer.classList.remove('oculto');
        this.elementos.imagensContainer.classList.add('mostrar');
        this.mostrarImagemCentral();
        this.timeouts.push(setTimeout(() => {
            this.iniciarColagemCrescente();
        }, 3000));
    }

    mostrarImagemCentral() {
        const imagemSrc = this.imagensPersonagens[this.personagemAtual].central;
        
        this.elementos.imagemCentral.innerHTML = `<img src="${imagemSrc}" alt="Imagem central">`;
        this.elementos.imagemCentral.style.opacity = '1';
        this.elementos.imagemCentral.style.transform = 'translate(-50%, -50%) scale(1)';
    }

    iniciarColagemCrescente() {
        const imagens = this.imagensPersonagens[this.personagemAtual].colagem;
        let imagemAtual = 0;
        let velocidadeBase = 2000; 

        const adicionarProximaImagem = () => {
            if (imagemAtual >= imagens.length) {
                this.timeouts.push(setTimeout(() => {
                    this.mostrarImagemFinalCentral();
                }, 1000));
                return;
            }

            this.adicionarImagemColagem(imagens[imagemAtual], imagemAtual);
            imagemAtual++;

            let proximaVelocidade = imagemAtual >= 4 ? 200 : velocidadeBase - (imagemAtual * 300);
            proximaVelocidade = Math.max(proximaVelocidade, 200);

            this.timeouts.push(setTimeout(adicionarProximaImagem, proximaVelocidade));
        };

        adicionarProximaImagem();
    }

    adicionarImagemColagem(imagemSrc, index) {
        const imagemDiv = document.createElement('div');
        imagemDiv.className = 'imagem-colagem';
        
        const top = Math.random() * 70 + 10; 
        const left = Math.random() * 70 + 10; 
        const rotacao = (Math.random() - 0.5) * 30; 
        const tamanho = Math.random() * 100 + 80; 

        imagemDiv.style.top = `${top}%`;
        imagemDiv.style.left = `${left}%`;
        imagemDiv.style.width = `${tamanho}px`;
        imagemDiv.style.height = `${tamanho * 0.7}px`;
        imagemDiv.style.setProperty('--rotacao', `${rotacao}deg`);
        
        imagemDiv.innerHTML = `<img src="${imagemSrc}" alt="Imagem ${index + 1}">`;
        
        this.elementos.colagemImagens.appendChild(imagemDiv);
        this.timeouts.push(setTimeout(() => {
            imagemDiv.classList.add('aparecer');
        }, 50));
    }

    mostrarImagemFinalCentral() {
        const imagemSrc = this.imagensPersonagens[this.personagemAtual].final;
        
        this.elementos.imagemCentral.style.opacity = '0';
        
        this.elementos.imagemFinalCentral.innerHTML = `<img src="${imagemSrc}" alt="Imagem final">`;
        this.elementos.imagemFinalCentral.style.opacity = '1';
        this.elementos.imagemFinalCentral.style.transform = 'translate(-50%, -50%) scale(1)';

        this.timeouts.push(setTimeout(() => {
            this.iniciarTransicaoReflexao();
        }, 4000));
    }

    resetarElementos() {
        this.elementos.efeitoDramatico.classList.remove('ativo');
        this.elementos.efeitoDramatico.style.display = 'none';
        
        this.elementos.desfechoNarrativo.classList.add('oculto');
        this.elementos.desfechoNarrativo.classList.remove('mostrar');
        this.elementos.fraseDesfecho.textContent = '';
        
        this.elementos.imagensContainer.classList.add('oculto');
        this.elementos.imagensContainer.classList.remove('mostrar');
        this.elementos.imagensContainer.style.opacity = '1';
        this.elementos.imagensContainer.style.transition = '';
        
        this.elementos.imagemCentral.innerHTML = '';
        this.elementos.imagemCentral.style.opacity = '0';
        this.elementos.colagemImagens.innerHTML = '';
        this.elementos.imagemFinalCentral.innerHTML = '';
        this.elementos.imagemFinalCentral.style.opacity = '0';
        
        if (this.elementos.finalVerdadeiro) {
            this.elementos.finalVerdadeiro.classList.remove('mostrar', 'oculto');
            this.elementos.finalVerdadeiro.style.opacity = '';
            this.elementos.finalVerdadeiro.style.display = '';
        }
        
        if (this.elementos.fraseAtual) {
            this.elementos.fraseAtual.textContent = '';
            this.elementos.fraseAtual.classList.remove('mostrar', 'sair');
        }
        
        if (this.elementos.finalContent) {
            this.elementos.finalContent.classList.remove('sair-final');
        }
        
        this.frasesNarrativa = [];
        this.fraseAtualIndex = 0;
    }

    limparTimeouts() {
        this.timeouts.forEach(timeout => clearTimeout(timeout));
        this.timeouts = [];
    }

    static iniciar(personagem) {
        if (!window.sequenciaFinal) {
            window.sequenciaFinal = new SequenciaFinal();
        }
        window.sequenciaFinal.iniciarSequenciaFinal(personagem);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.sequenciaFinal = new SequenciaFinal();
});

window.SequenciaFinal = SequenciaFinal;
