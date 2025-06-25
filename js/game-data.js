/**
 * REALIDADES INVISÍVEIS - Simulador Interativo
 * Um jogo educativo sobre vulnerabilidade social no Brasil
 */


// estado global do jogo
let estadoDoJogo = {
    personagemAtual: null,
    semanaAtual: 1,
    totalSemanas: 4,
    eventos: [],
    jogoFinalizado: false
};

// definição dos personagens
const personagens = {
    'mae-solo': {
        nome: 'Maria - Mãe Solo',
        descricao: 'Mãe solo com 2 filhos pequenos, trabalha como diarista',
        statusInicial: {
            saude: 60,
            estresse: 70,
            esperanca: 50,
            dinheiro: 800
        },
        rendaSemanal: 800,
        despesasFixas: 650,
        icone: '👩‍👧‍👦',
        historia: 'Você é Maria, 32 anos, mãe de João (8 anos) e Ana (5 anos). Trabalha como diarista 3 vezes por semana e luta para sustentar sua família sozinha.'
    },
    'jovem-desempregado': {
        nome: 'João - Jovem Desempregado',
        descricao: '19 anos, mora com a família',
        statusInicial: {
            saude: 80,
            estresse: 85,
            esperanca: 40,
            dinheiro: 50
        },
        rendaSemanal: 0,
        despesasFixas: 50,
        icone: '🧑',
        historia: 'Você é João, 19 anos. Terminou o ensino médio mas não consegue emprego. Mora com a mãe e se sente um peso para a família.'
    },
    
    'trabalhador-informal': {
        nome: 'Carlos - Trabalhador Informal',
        descricao: '45 anos, renda instável',
        statusInicial: {
            saude: 45,
            estresse: 85,
            esperanca: 35,
            dinheiro: 200
        },
        rendaSemanal: () => Math.floor(Math.random() * 400) + 100, // 100-500
        despesasFixas: 600,
        icone: '👷',
        historia: 'Você é Carlos, 45 anos. Sobrevive vendendo doces e fazendo bicos. A esposa foi embora com os filhos, cansada da instabilidade.'
    },

    'idoso-aposentado': {
        nome: 'Dona Rosa - Idosa Aposentada',
        descricao: '67 anos, sustenta 3 netos',
        statusInicial: {
            saude: 40,
            estresse: 65,
            esperanca: 70,
            dinheiro: 1100
        },
        rendaSemanal: 275, // 1100/4
        despesasFixas: 237, // 950/4
        icone: '👴',
        historia: 'Você é Dona Rosa, 67 anos. Sua aposentadoria de um salário mínimo sustenta você e seus 3 netos, após sua filha ter falecido.'
    }
};

// eventos narrativos por semana e personagem

const eventosNarrativos = {
    semana1: {
        'mae-solo': [
            {
                tipo: 'dilema_financeiro',
                narrativa: [
                    "Segunda-feira, 6h da manhã.",
                    "O despertador toca, mas você já estava acordada há uma hora.",
                    "João tem febre e Ana está tossindo.",
                    "Você precisa trabalhar hoje, mas as crianças estão doentes.",
                    "O que fazer?"
                ],
                escolhas: [
                    {
                        texto: "Levar as crianças para o posto de saúde e faltar ao trabalho",
                        consequencias: { saude: +10, estresse: +15, dinheiro: -200, esperanca: -5 },
                        resultado: "Você passou o dia no posto. As crianças melhoraram, mas perdeu um dia de trabalho."
                    },
                    {
                        texto: "Deixar as crianças com a vizinha e ir trabalhar",
                        consequencias: { saude: -5, estresse: +20, dinheiro: +200, esperanca: -10 },
                        resultado: "Você trabalhou, mas ficou preocupada o dia todo. A culpa não sai da sua cabeça."
                    },
                    {
                        texto: "Tentar levar as crianças junto para o trabalho",
                        consequencias: { saude: -10, estresse: +25, dinheiro: +100, esperanca: -15 },
                        resultado: "Foi um dia caótico. A patroa não gostou, mas você conseguiu cuidar das crianças."
                    }
                ]
            },
            {
                tipo: 'evento_aleatorio',
                narrativa: [
                    "Quarta-feira à noite.",
                    "Você está preparando o jantar quando a luz acaba.",
                    "A conta de energia está em atraso há dois meses.",
                    "As crianças começam a chorar no escuro.",
                    "Você sente o peso do mundo nos seus ombros."
                ],
                escolhas: [
                    {
                        texto: "Usar o dinheiro do aluguel para pagar a luz",
                        consequencias: { estresse: +10, dinheiro: -150, esperanca: +5 },
                        resultado: "A luz voltou, mas agora o aluguel está em risco. Um problema por vez."
                    },
                    {
                        texto: "Tentar negociar um parcelamento na companhia elétrica",
                        consequencias: { estresse: +15, esperanca: +10 },
                        resultado: "Conseguiu parcelar em 6 vezes. É apertado, mas é possível."
                    }
                ]
            }
        ],
        'jovem-desempregado': [
            {
                tipo: 'oportunidade',
                narrativa: [
                    "Você acorda às 11h da manhã.",
                    "Mais um dia sem ter para onde ir.",
                    "Sua mãe já saiu para trabalhar.",
                    "O celular vibra: uma mensagem sobre uma vaga de emprego.",
                    "Mas pede experiência que você não tem."
                ],
                escolhas: [
                    {
                        texto: "Tentar a vaga mesmo sem experiência",
                        consequencias: { esperanca: +15, estresse: +10 },
                        resultado: "Você foi rejeitado, mas pelo menos tentou. A esperança ainda existe."
                    },
                    {
                        texto: "Procurar um curso gratuito para se qualificar",
                        consequencias: { esperanca: +20, estresse: +5 },
                        resultado: "Encontrou um curso online. Vai demorar, mas é um começo."
                    },
                    {
                        texto: "Desistir e voltar para a cama",
                        consequencias: { esperanca: -20, estresse: +25, saude: -10 },
                        resultado: "Mais um dia perdido. A sensação de inutilidade cresce."
                    }
                ]
            }
        ],
        'trabalhador-informal': [
            {
                tipo: 'desespero_financeiro',
                narrativa: [
                    "Segunda-feira, 4h da manhã.",
                    "Você acorda no chão frio do seu quarto de 2x3 metros.",
                    "O colchão furou e você não tem dinheiro para consertar.",
                    "Sua caixa de doces está quase vazia - só restam 10 unidades.",
                    "O aluguel vence hoje e você só tem R$ 150.",
                    "O proprietário já ameaçou te despejar na semana passada."
                ],
                escolhas: [
                    {
                        texto: "Implorar mais prazo ao proprietário",
                        consequencias: { estresse: +25, esperanca: -15, saude: -10 },
                        resultado: "Ele te deu 3 dias. 'É a última vez', disse olhando com desprezo. Você se sentiu humilhado."
                    },
                    {
                        texto: "Vender seus últimos pertences pessoais",
                        consequencias: { dinheiro: +200, esperanca: -20, estresse: +15 },
                        resultado: "Vendeu o anel de casamento e a foto dos filhos. O dinheiro mal cobriu o aluguel. Você chorou sozinho."
                    },
                    {
                        texto: "Tentar pedir dinheiro emprestado na rua",
                        consequencias: { estresse: +30, esperanca: -25, saude: -15 },
                        resultado: "Ninguém te deu nada. Algumas pessoas te xingaram. Você nunca se sentiu tão invisível."
                    }
                ]
            },
            {
                tipo: 'humilhacao_publica',
                narrativa: [
                    "Quarta-feira, meio-dia.",
                    "Você está vendendo doces no semáforo quando reconhece um carro.",
                    "É seu ex-chefe, aquele que te demitiu 'por corte de custos'.",
                    "Ele te vê, abaixa o vidro e grita:",
                    "'Olha só quem virou mendigo! Bem feito!'",
                    "Outros motoristas riem. Você sente o mundo desabar."
                ],
                escolhas: [
                    {
                        texto: "Tentar manter a dignidade e continuar trabalhando",
                        consequencias: { esperanca: -10, estresse: +20, saude: -5 },
                        resultado: "Você fingiu não ouvir, mas as palavras ecoam na sua cabeça. Vendeu apenas 2 doces o resto do dia."
                    },
                    {
                        texto: "Sair correndo e se esconder",
                        consequencias: { esperanca: -25, estresse: +35, dinheiro: -50 },
                        resultado: "Você abandonou sua caixa de doces e correu. Quando voltou, alguém havia roubado tudo."
                    }
                ]
            }
        ],
        'idoso-aposentado': [
            {
                tipo: 'saude_familia',
                narrativa: [
                    "Seu neto mais novo, de 8 anos, precisa de óculos.",
                    "A consulta particular custa R$ 200.",
                    "Pelo SUS, a espera é de 6 meses.",
                    "Ele está com dificuldades na escola.",
                    "Sua aposentadoria já está comprometida."
                ],
                escolhas: [
                    {
                        texto: "Pagar a consulta particular",
                        consequencias: { dinheiro: -200, esperanca: +10, estresse: +10 },
                        resultado: "O menino conseguiu os óculos. Suas notas melhoraram, mas o orçamento apertou."
                    },
                    {
                        texto: "Esperar pelo SUS e ajudar com os estudos",
                        consequencias: { esperanca: +5, estresse: +15 },
                        resultado: "Você passa as tardes ajudando com a lição. É pouco, mas é o que pode fazer."
                    }
                ]
            }
        ]
    },
    
    semana2: {
        'mae-solo': [
            {
                tipo: 'oportunidade_trabalho',
                narrativa: [
                    "Uma das suas patroas oferece trabalho extra no fim de semana.",
                    "É uma festa de família, pagaria R$ 300.",
                    "Mas você não tem com quem deixar as crianças.",
                    "E já está exausta da semana."
                ],
                escolhas: [
                    {
                        texto: "Aceitar e levar as crianças junto",
                        consequencias: { dinheiro: +250, estresse: +20, saude: -10 },
                        resultado: "Foi difícil, mas conseguiu. As crianças se comportaram bem."
                    },
                    {
                        texto: "Recusar e descansar com as crianças",
                        consequencias: { saude: +10, estresse: -10, esperanca: +5 },
                        resultado: "Vocês passaram um domingo tranquilo no parque. Momentos assim são raros."
                    }
                ]
            }
        ],
        'jovem-desempregado': [
            {
                tipo: 'pressao_familiar',
                narrativa: [
                    "Sua mãe chega do trabalho visivelmente cansada.",
                    "Ela olha para você no sofá e suspira.",
                    "'Filho, você precisa ajudar em casa.'",
                    "A culpa aperta no peito.",
                    "Você sabe que ela está certa."
                ],
                escolhas: [
                    {
                        texto: "Procurar qualquer trabalho, mesmo informal",
                        consequencias: { esperanca: +10, estresse: +15, dinheiro: +200 },
                        resultado: "Conseguiu uns bicos de entrega. Não é o que sonhava, mas ajuda em casa."
                    },
                    {
                        texto: "Insistir em procurar algo na sua área",
                        consequencias: { esperanca: -5, estresse: +20 },
                        resultado: "Mais rejeições. Sua mãe está perdendo a paciência."
                    }
                ]
            }
        ],
        'trabalhador-informal': [
            {
                tipo: 'falsa_esperanca',
                narrativa: [
                    "Segunda-feira de manhã, seu celular toca.",
                    "É um número desconhecido. Do outro lado, uma voz amigável:",
                    "'Carlos? Sou da construtora Silva & Filhos.'",
                    "'Alguém te indicou. Temos uma vaga de pedreiro com carteira assinada.'",
                    "'Salário de R$ 2.500, vale-transporte, vale-refeição.'",
                    "Pela primeira vez em anos, você sente esperança."
                ],
                escolhas: [
                    {
                        texto: "Aceitar imediatamente e comemorar",
                        consequencias: { esperanca: +40, estresse: -20, saude: +10 },
                        resultado: "Você chorou de alegria. Ligou para sua ex-esposa para contar, mas ela desligou na sua cara."
                    },
                    {
                        texto: "Aceitar com cautela, sem criar expectativas",
                        consequencias: { esperanca: +20, estresse: -5 },
                        resultado: "Você tentou não se empolgar muito, mas por dentro estava radiante. Finalmente uma chance."
                    }
                ]
            },
            {
                tipo: 'reviravolta_devastadora',
                narrativa: [
                    "Quinta-feira, véspera do primeiro dia de trabalho.",
                    "Você comprou roupas novas com o último dinheiro que tinha.",
                    "Seu celular toca. É a construtora novamente.",
                    "'Carlos, tenho uma má notícia. A obra foi cancelada.'",
                    "'O cliente desistiu. Não vamos mais precisar de ninguém.'",
                    "Seu mundo desaba. Era tudo mentira, uma esperança cruel."
                ],
                escolhas: [
                    {
                        texto: "Implorar por qualquer outro trabalho na empresa",
                        consequencias: { esperanca: -30, estresse: +40, saude: -15 },
                        resultado: "'Não temos nada', disse friamente. Você implorou, chorou ao telefone. Sente-se patético."
                    },
                    {
                        texto: "Aceitar em silêncio e desligar",
                        consequencias: { esperanca: -40, estresse: +35, saude: -20 },
                        resultado: "Você não disse nada, apenas desligou. Olhou para as roupas novas e quis morrer."
                    },
                    {
                        texto: "Explodir de raiva e xingar",
                        consequencias: { esperanca: -25, estresse: +45, saude: -10 },
                        resultado: "Você gritou, xingou, quebrou o celular. Agora não tem nem como receber ligações de trabalho."
                    }
                ]
            }
        ],
        'idoso-aposentado': [
            {
                tipo: 'emergencia_familiar',
                narrativa: [
                    "Sua neta de 15 anos está grávida.",
                    "Ela chora no seu colo, com medo de contar para os irmãos.",
                    "Vocês precisam de acompanhamento médico.",
                    "E em breve, mais uma boca para alimentar.",
                    "Sua aposentadoria já mal dá para quatro pessoas."
                ],
                escolhas: [
                    {
                        texto: "Apoiar incondicionalmente e se organizar",
                        consequencias: { esperanca: +15, estresse: +20, dinheiro: -100 },
                        resultado: "Vocês vão enfrentar juntos. A família é tudo que vocês têm."
                    },
                    {
                        texto: "Tentar convencê-la a dar o bebê para adoção",
                        consequencias: { esperanca: -10, estresse: +30 },
                        resultado: "Ela ficou magoada. O clima em casa está tenso."
                    }
                ]
            }
        ]
    },

    semana3: {
        'mae-solo': [
            {
                tipo: 'crise_habitacao',
                narrativa: [
                    "O proprietário quer aumentar o aluguel em 30%.",
                    "Você já paga R$ 800 por dois cômodos.",
                    "Com o aumento, seria R$ 1.040.",
                    "Sua renda mensal é de R$ 1.200 quando consegue trabalhar todos os dias.",
                    "As crianças não podem mudar de escola novamente."
                ],
                escolhas: [
                    {
                        texto: "Aceitar o aumento e apertar ainda mais o orçamento",
                        consequencias: { estresse: +30, dinheiro: -240, esperanca: -15 },
                        resultado: "Agora sobram apenas R$ 160 para tudo: comida, transporte, remédios..."
                    },
                    {
                        texto: "Procurar outro lugar para morar",
                        consequencias: { estresse: +25, esperanca: +5 },
                        resultado: "Encontrou um lugar mais barato, mas mais longe. As crianças vão ter que mudar de escola."
                    }
                ]
            }
        ],
        'jovem-desempregado': [
            {
                tipo: 'oportunidade_estudo',
                narrativa: [
                    "Apareceu uma vaga para um curso técnico gratuito.",
                    "Seria de manhã, durante 6 meses.",
                    "Mas sua mãe quer que você trabalhe para ajudar em casa.",
                    "É sua chance de ter uma profissão.",
                    "Mas a família precisa de dinheiro agora."
                ],
                escolhas: [
                    {
                        texto: "Fazer o curso e investir no futuro",
                        consequencias: { esperanca: +25, estresse: +15 },
                        resultado: "Sua mãe não gostou, mas você está determinado. O futuro pode ser diferente."
                    },
                    {
                        texto: "Desistir do curso e procurar trabalho",
                        consequencias: { esperanca: -15, dinheiro: +300, estresse: +10 },
                        resultado: "Conseguiu um emprego temporário. Ajuda em casa, mas o sonho fica para depois."
                    }
                ]
            }
        ],
        'trabalhador-informal': [
            {
                tipo: 'desespero_total',
                narrativa: [
                    "Sem celular, sem trabalho fixo, você está invisível.",
                    "Há 3 dias você só comeu pão com água.",
                    "Seu corpo está fraco, suas mãos tremem.",
                    "No espelho do banheiro público, você não se reconhece.",
                    "Barba por fazer, roupas sujas, olhos sem vida.",
                    "Você pensa nos seus filhos e se pergunta se eles sentiriam sua falta."
                ],
                escolhas: [
                    {
                        texto: "Tentar pedir ajuda no centro de assistência social",
                        consequencias: { esperanca: -5, estresse: +30, saude: -10 },
                        resultado: "Filas enormes, burocracia, humilhação. Te deram um vale de R$ 50 que mal compra comida para 3 dias."
                    },
                    {
                        texto: "Procurar seus filhos, mesmo sabendo que a ex-esposa não quer te ver",
                        consequencias: { esperanca: -20, estresse: +40, saude: -15 },
                        resultado: "Ela chamou a polícia. Seus filhos te viram sendo levado. O olhar de medo deles te destruiu por dentro."
                    },
                    {
                        texto: "Considerar desistir de tudo",
                        consequencias: { esperanca: -35, estresse: +50, saude: -20 },
                        resultado: "Você passou a noite na ponte, olhando o rio. Só não pulou porque lembrou que nem para morrer você tem coragem."
                    }
                ]
            }
        ],
        'idoso-aposentado': [
            {
                tipo: 'problema_saude',
                narrativa: [
                    "Você está sentindo dores no peito com frequência.",
                    "O médico do posto disse que precisa de exames.",
                    "A fila para cardiologista pelo SUS é de 4 meses.",
                    "Particular custaria R$ 800.",
                    "Você tem medo, mas também tem responsabilidades."
                ],
                escolhas: [
                    {
                        texto: "Fazer os exames particulares",
                        consequencias: { saude: +20, dinheiro: -800, estresse: +15 },
                        resultado: "Era apenas ansiedade, mas agora você sabe. O alívio vale o sacrifício financeiro."
                    },
                    {
                        texto: "Esperar pelo SUS e torcer para não ser nada grave",
                        consequencias: { saude: -10, estresse: +25, esperanca: -15 },
                        resultado: "As dores continuam. Você tenta não demonstrar preocupação para os netos."
                    }
                ]
            }
        ]
    },

    semana4: {
        'mae-solo': [
            {
                tipo: 'momento_decisivo',
                narrativa: [
                    "João, seu filho de 8 anos, ganhou uma bolsa de estudos.",
                    "É em uma escola particular, mas fica longe.",
                    "O transporte custaria R$ 200 por mês.",
                    "É a chance dele ter um futuro melhor.",
                    "Mas significaria ainda menos dinheiro para vocês."
                ],
                escolhas: [
                    {
                        texto: "Aceitar a bolsa e fazer o sacrifício",
                        consequencias: { esperanca: +30, dinheiro: -200, estresse: +15 },
                        resultado: "João está radiante. Pela primeira vez, você vê um futuro diferente para ele."
                    },
                    {
                        texto: "Recusar e manter ele na escola pública",
                        consequencias: { esperanca: -20, estresse: +20 },
                        resultado: "João ficou triste, mas entendeu. Você promete que vai encontrar outra forma."
                    }
                ]
            }
        ],
        'jovem-desempregado': [
            {
                tipo: 'ponto_virada',
                narrativa: [
                    "Depois de 50 currículos entregues, finalmente uma resposta positiva.",
                    "É para trabalhar em um supermercado, meio período.",
                    "Salário mínimo, mas é um começo.",
                    "Você sente uma mistura de alívio e esperança.",
                    "Talvez as coisas estejam mudando."
                ],
                escolhas: [
                    {
                        texto: "Aceitar com gratidão e dar o seu melhor",
                        consequencias: { esperanca: +35, estresse: -20, dinheiro: +600 },
                        resultado: "Primeiro dia de trabalho. Você nunca se sentiu tão orgulhoso de usar um uniforme."
                    },
                    {
                        texto: "Aceitar, mas continuar procurando algo melhor",
                        consequencias: { esperanca: +20, estresse: +10, dinheiro: +600 },
                        resultado: "É um começo, mas você não vai se acomodar. Tem sonhos maiores."
                    }
                ]
            }
        ],
        'trabalhador-informal': [
            {
                tipo: 'golpe_final',
                narrativa: [
                    "Você está dormindo na rua há uma semana.",
                    "Foi despejado do quarto porque não conseguiu pagar o aluguel.",
                    "Suas poucas roupas estão num saco plástico.",
                    "De manhã, você vê uma notícia no jornal abandonado:",
                    "'Ex-operário Carlos Silva procurado pela família'",
                    "Sua ex-esposa está te procurando... mas não por amor."
                ],
                escolhas: [
                    {
                        texto: "Ligar para ela e descobrir o que quer",
                        consequencias: { esperanca: -30, estresse: +40, saude: -25 },
                        resultado: "'Seus filhos querem te ver uma última vez. Você está morrendo de câncer e não sabe?' Ela mentiu. Era só para humilhar você mais uma vez."
                    },
                    {
                        texto: "Ignorar e continuar invisível",
                        consequencias: { esperanca: -40, estresse: +35, saude: -30 },
                        resultado: "Você rasgou o jornal. Seus filhos crescerão pensando que o pai os abandonou. Talvez seja melhor assim."
                    },
                    {
                        texto: "Tentar uma última vez se reerguer",
                        consequencias: { esperanca: -20, estresse: +50, saude: -20 },
                        resultado: "Você tentou vender doces novamente, mas suas mãos tremem tanto que derrubou tudo. As pessoas riram. Você desistiu."
                    }
                ]
            }
        ],
        'idoso-aposentado': [
            {
                tipo: 'legado',
                narrativa: [
                    "Seu neto mais velho, de 17 anos, passou no vestibular.",
                    "É para Engenharia, numa universidade pública.",
                    "Ele precisa de R$ 300 por mês para transporte e material.",
                    "É muito dinheiro, mas é o sonho dele.",
                    "E talvez a chance da família sair da pobreza."
                ],
                escolhas: [
                    {
                        texto: "Apoiar o neto e encontrar uma forma de pagar",
                        consequencias: { esperanca: +40, dinheiro: -300, estresse: +25 },
                        resultado: "Você vai comer menos, mas ele vai estudar. É o melhor investimento da sua vida."
                    },
                    {
                        texto: "Explicar que não tem condições financeiras",
                        consequencias: { esperanca: -25, estresse: +30 },
                        resultado: "Ele entendeu, mas você vê a decepção nos olhos dele. A culpa é pesada."
                    }
                ]
            }
        ]
    }
};

// finais da simulação

const finaisPossiveis = {
    'mae-solo': {
        positivo: {
            titulo: "Força que Transforma",
            narrativa: "Apesar de todas as dificuldades, você conseguiu manter sua família unida. Suas escolhas, mesmo as mais difíceis, foram feitas com amor. João e Ana cresceram vendo sua força e determinação. Eles sabem que, não importa o que aconteça, sempre terão você.",
            condicoes: { esperanca: 40, saude: 30 }
        },
        neutro: {
            titulo: "Resistência Diária",
            narrativa: "Cada dia é uma batalha, mas você continua lutando. Há momentos de desespero, mas também pequenas vitórias. Você aprendeu que sobreviver já é uma forma de resistência. Suas crianças podem não ter tudo, mas têm o mais importante: uma mãe que nunca desiste.",
            condicoes: { esperanca: 20, saude: 15 }
        },
        negativo: {
            titulo: "O Peso da Sobrevivência",
            narrativa: "O cansaço tomou conta. Você deu tudo de si, mas às vezes não foi suficiente. As crianças sentem sua exaustão, e isso dói mais que a própria fome. Você precisa de ajuda, mas não sabe onde encontrar. Mesmo assim, amanhã você vai levantar de novo.",
            condicoes: { esperanca: 0, saude: 0 }
        }
    },
    'jovem-desempregado': {
        positivo: {
            titulo: "O Primeiro Passo",
            narrativa: "Você descobriu que o primeiro emprego não é só sobre dinheiro - é sobre dignidade. Cada 'não' que recebeu te fortaleceu para o 'sim' que mudou tudo. Agora você tem perspectiva, tem futuro. Sua mãe sorri quando te vê de uniforme.",
            condicoes: { esperanca: 50, dinheiro: 400 }
        },
        neutro: {
            titulo: "Entre a Esperança e o Desespero",
            narrativa: "Alguns dias você acredita que vai conseguir, outros quer desistir de tudo. A pressão da família pesa, mas você entende que eles também estão sofrendo. Você ainda procura seu lugar no mundo, e isso não é fácil aos 19 anos.",
            condicoes: { esperanca: 25 }
        },
        negativo: {
            titulo: "Perdido na Própria Vida",
            narrativa: "A sensação de inutilidade tomou conta. Você se sente um peso para todos ao redor. A depressão bate na porta todos os dias, e você não sabe como pedir ajuda. Sua juventude está sendo consumida pela desesperança.",
            condicoes: { esperanca: 10, estresse: 80 }
        }
    },
    'trabalhador-informal': {
        positivo: {
            titulo: "Sobrevivência Amarga",
            narrativa: "Você ainda está vivo, e isso já é uma vitória amarga. Conseguiu um cantinho para dormir e come uma vez por dia. Seus filhos não sabem onde você está, e talvez seja melhor assim. Você aprendeu que às vezes sobreviver é tudo que se pode fazer. A dignidade é um luxo que você não pode mais pagar.",
            condicoes: { dinheiro: 100, esperanca: 15 }
        },
        neutro: {
            titulo: "Fantasma de Si Mesmo",
            narrativa: "Você se tornou invisível para o mundo. Caminha pelas ruas como um fantasma, vendendo o que pode, dormindo onde consegue. Sua família te esqueceu, a sociedade te descartou. Você existe, mas não vive. Cada dia é uma luta para não desaparecer completamente.",
            condicoes: { dinheiro: 50, esperanca: 5 }
        },
        negativo: {
            titulo: "O Fim da Linha",
            narrativa: "Você perdeu tudo: família, dignidade, esperança, saúde. Vive nas ruas, dependendo da caridade alheia. Seus filhos crescerão sem saber que tiveram um pai que um dia sonhou em ser alguém. Você se tornou estatística, mais um número na multidão de esquecidos. A vida te venceu completamente.",
            condicoes: { saude: 5, estresse: 100, esperanca: 0 }
        }
    },
    'idoso-aposentado': {
        positivo: {
            titulo: "O Legado de uma Vida",
            narrativa: "Você conseguiu dar aos seus netos o que não pôde dar à sua filha: esperança. Mesmo com pouco dinheiro, você investiu no futuro deles. Ver seu neto na universidade vale todos os sacrifícios. Você sabe que sua missão está sendo cumprida.",
            condicoes: { esperanca: 70, dinheiro: 200 }
        },
        neutro: {
            titulo: "Guardiã de Sonhos",
            narrativa: "Você faz o que pode com o que tem. Nem sempre é suficiente, mas seus netos sabem que são amados. Você ensina pelo exemplo que a vida é difícil, mas vale a pena ser vivida. Cada dia é uma pequena vitória.",
            condicoes: { esperanca: 40 }
        },
        negativo: {
            titulo: "O Peso dos Anos",
            narrativa: "Sua saúde está frágil, mas você não pode parar. Os netos dependem de você, e isso é ao mesmo tempo sua força e seu fardo. Você tem medo do que vai acontecer com eles quando você não estiver mais aqui. A preocupação consome suas noites.",
            condicoes: { saude: 15, estresse: 80 }
        }
    }
};