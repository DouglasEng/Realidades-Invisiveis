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
        nome: 'Maria - Mãe Solo em Desespero',
        descricao: 'Mãe de 3 filhos, ex-marido violento, trabalha como faxineira',
        statusInicial: {
            saude: 45,
            estresse: 90,
            esperanca: 30,
            dinheiro: 600
        },
        rendaSemanal: 600,
        despesasFixas: 750,
        icone: '👩‍👧‍👦',
        historia: 'Carla, 28 anos, mãe solo de 3 filhos, fugiu da violência. Luta como faxineira, mora em barraco e enfrenta a fome, o medo e perguntas sem resposta.'
    },
    'jovem-desempregado': {
        nome: 'João - Jovem Perdido',
        descricao: '18 anos, depressivo, família desestruturada',
        statusInicial: {
            saude: 60,
            estresse: 95,
            esperanca: 20,
            dinheiro: 0
        },
        rendaSemanal: 0,
        despesasFixas: 80,
        icone: '🧑',
        historia: 'João, 18 anos. Terminou o ensino médio com dificuldade, reprovou duas vezes. Vive isolado. Mãe exausta, pai alcoólatra. Sente-se inútil e preso.'
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

    'pessoa-deficiente': {
        nome: 'Ana - Pessoa com Deficiência',
        descricao: 'Cadeirante, 35 anos, luta por dignidade e sobrevivência',
        statusInicial: {
            saude: 30,
            estresse: 85,
            esperanca: 40,
            dinheiro: 700
        },
        rendaSemanal: 175, // bpc dividido por 4
        despesasFixas: 400,
        icone: '👩‍🦰',
        historia: 'Ana, 35 anos, cadeirante. Vive com R$700 para sustentar a mãe doente. Casa sem acessibilidade. Sonhos barrados. Cada dia é uma luta por dignidade.'
    }
};

// eventos narrativos por semana e personagem

const eventosNarrativos = {
    semana1: {
        'mae-solo': [
            {
                tipo: 'trauma_violencia',
                narrativa: [
                    "Segunda-feira, 5h da manhã.",
                    "Você acorda em pânico - sonhou que seu ex-marido tinha encontrado vocês.",
                    "Miguel, de 9 anos, está chorando no seu colo. Ele fez xixi na cama de novo.",
                    "'Mamãe, o papai vai vir nos buscar?', ele pergunta tremendo.",
                    "Você olha para o bebê Lucas, que chora de fome, e Sofia que tosse há dias.",
                    "Não tem dinheiro para médico, nem para fraldas, nem para remédio.",
                    "O que fazer primeiro?"
                ],
                escolhas: [
                    {
                        texto: "Acalmar Miguel e tentar conseguir remédio fiado na farmácia",
                        consequencias: { saude: -5, estresse: +20, esperanca: +5 },
                        resultado: "O farmacêutico teve pena e deu o xarope. Miguel parou de chorar, mas você se sentiu humilhada."
                    },
                    {
                        texto: "Sair para trabalhar e deixar as crianças sozinhas",
                        consequencias: { saude: -15, estresse: +35, dinheiro: +150, esperanca: -20 },
                        resultado: "Você trabalhou com o coração partido. Quando voltou, Sofia estava com febre alta e Miguel cuidando dos irmãos."
                    },
                    {
                        texto: "Ligar para o ex-marido pedindo ajuda financeira",
                        consequencias: { saude: -25, estresse: +50, dinheiro: +200, esperanca: -30 },
                        resultado: "'Volta pra casa que eu te perdoo', ele disse. Você desligou tremendo. O dinheiro não vale sua vida."
                    }
                ]
            },
            {
                tipo: 'desespero_maternal',
                narrativa: [
                    "Terça-feira à noite.",
                    "Lucas está chorando há 3 horas. Ele está com cólica e você não tem dinheiro para simeticona.",
                    "Sofia pergunta: 'Mamãe, por que a gente não tem comida igual os outros?'",
                    "Miguel te abraça e sussurra: 'Não chora, mamãe. Eu vou cuidar de você quando crescer.'",
                    "Você olha para o barraco de madeira, a chuva entrando pelo teto furado.",
                    "Seus filhos merecem mais que isso. Muito mais."
                ],
                escolhas: [
                    {
                        texto: "Sair na chuva para pedir ajuda aos vizinhos",
                        consequencias: { saude: -10, estresse: +15, esperanca: +10 },
                        resultado: "Dona Maria te deu um pouco de simeticona e arroz. 'Somos todas mães aqui', ela disse."
                    },
                    {
                        texto: "Tentar vender seus últimos objetos de valor",
                        consequencias: { estresse: +25, dinheiro: +100, esperanca: -15 },
                        resultado: "Vendeu a aliança de casamento por R$ 50. Era tudo que restava da sua vida anterior."
                    },
                    {
                        texto: "Chorar em silêncio e tentar aguentar até amanhã",
                        consequencias: { saude: -20, estresse: +40, esperanca: -25 },
                        resultado: "Você chorou até não ter mais lágrimas. As crianças dormiram com fome, e você com o coração partido."
                    }
                ]
            },
            {
                tipo: 'humilhacao_trabalho',
                narrativa: [
                    "Quinta-feira, na casa da patroa.",
                    "Você está limpando o banheiro quando ouve a conversa na sala:",
                    "'Essa empregada nova é meio esquisita. Acho que apanhou do marido.'",
                    "'Essas mulheres gostam de apanhar, senão não voltavam sempre.'",
                    "Elas riem. Você aperta o pano de chão com força, tentando não chorar.",
                    "Precisa desse emprego. Seus filhos precisam comer."
                ],
                escolhas: [
                    {
                        texto: "Fingir que não ouviu e continuar trabalhando",
                        consequencias: { estresse: +30, esperanca: -20, dinheiro: +150 },
                        resultado: "Você terminou o trabalho em silêncio. A humilhação dói mais que qualquer pancada."
                    },
                    {
                        texto: "Confrontar as patroas sobre o comentário",
                        consequencias: { estresse: +40, esperanca: +5, dinheiro: -150 },
                        resultado: "'Você está sendo dramática', elas disseram. Te mandaram embora. Mais um emprego perdido."
                    },
                    {
                        texto: "Sair sem falar nada e procurar outro trabalho",
                        consequencias: { estresse: +35, esperanca: -10, dinheiro: -150 },
                        resultado: "Você saiu com dignidade, mas sem dinheiro. Como vai explicar para as crianças?"
                    }
                ]
            },
            {
                tipo: 'medo_constante',
                narrativa: [
                    "Sexta-feira, 22h.",
                    "Você ouve passos do lado de fora do barraco.",
                    "Seu coração dispara. E se for ele? E se te encontrou?",
                    "Miguel acorda: 'Mamãe, tem alguém lá fora?'",
                    "Você pega uma faca da cozinha com mãos tremendo.",
                    "Era só um gato. Mas o medo não passa."
                ],
                escolhas: [
                    {
                        texto: "Tentar acalmar as crianças e voltar a dormir",
                        consequencias: { saude: -10, estresse: +25, esperanca: -5 },
                        resultado: "Vocês dormiram juntos na sua cama. Você ficou acordada a noite toda, vigiando."
                    },
                    {
                        texto: "Fazer uma barricada na porta com móveis",
                        consequencias: { estresse: +20, esperanca: +5 },
                        resultado: "A porta ficou trancada, mas você sabe que isso não vai te proteger se ele realmente vier."
                    },
                    {
                        texto: "Ligar para a polícia preventivamente",
                        consequencias: { estresse: +15, esperanca: -10 },
                        resultado: "'Não podemos fazer nada se ele não fez nada', disseram. Você se sentiu ainda mais sozinha."
                    }
                ]
            }
        ],
        'jovem-desempregado': [
            {
                tipo: 'crise_depressiva',
                narrativa: [
                    "Segunda-feira, 14h.",
                    "Você acorda no chão do quarto. Dormiu ali porque não teve forças para subir na cama.",
                    "Sua mãe deixou um bilhete: 'João, por favor, tenta sair de casa hoje. Estou preocupada.'",
                    "Você olha no espelho e vê um estranho: barba por fazer, olhos fundos, 15 quilos mais magro.",
                    "O celular tem 47 mensagens não lidas de vagas de emprego.",
                    "Você não consegue nem abrir. A ansiedade paralisa tudo."
                ],
                escolhas: [
                    {
                        texto: "Forçar-se a tomar banho e sair de casa",
                        consequencias: { saude: +5, estresse: +25, esperanca: +10 },
                        resultado: "Você conseguiu sair, mas teve uma crise de pânico na rua. Voltou correndo para casa."
                    },
                    {
                        texto: "Tentar responder pelo menos uma mensagem de emprego",
                        consequencias: { esperanca: +15, estresse: +30 },
                        resultado: "Você digitou e apagou a resposta 20 vezes. No final, não enviou nada. O medo de rejeição é maior."
                    },
                    {
                        texto: "Voltar para a cama e fingir que o mundo não existe",
                        consequencias: { saude: -15, estresse: +40, esperanca: -25 },
                        resultado: "Você passou o dia inteiro na cama, vendo vídeos no celular. A culpa e a vergonha crescem."
                    }
                ]
            },
            {
                tipo: 'confronto_familiar',
                narrativa: [
                    "Terça-feira, 20h.",
                    "Sua mãe chega do trabalho exausta e te encontra no mesmo lugar de sempre.",
                    "'João, isso não pode continuar! Você tem 18 anos, não pode ficar assim!'",
                    "Seu pai bêbado grita da sala: 'Esse moleque é um inútil mesmo! Igual a mim!'",
                    "Sua mãe começa a chorar: 'Eu trabalho 12 horas por dia e vocês dois só me dão desgosto.'",
                    "Você sente que está destruindo a família."
                ],
                escolhas: [
                    {
                        texto: "Pedir desculpas e prometer que vai mudar",
                        consequencias: { estresse: +35, esperanca: +5 },
                        resultado: "Sua mãe te abraçou chorando. 'Eu só quero te ver bem, filho.' A pressão de não decepcionar aumenta."
                    },
                    {
                        texto: "Explodir e gritar que ninguém te entende",
                        consequencias: { estresse: +50, esperanca: -20, saude: -10 },
                        resultado: "Você gritou até ficar rouco. Sua mãe saiu chorando. Seu pai riu: 'Agora você está parecendo comigo.'"
                    },
                    {
                        texto: "Sair de casa sem falar nada",
                        consequencias: { estresse: +40, esperanca: -15, saude: -5 },
                        resultado: "Você andou pelas ruas até de madrugada. Quando voltou, sua mãe estava acordada, esperando."
                    }
                ]
            },
            {
                tipo: 'pensamentos_suicidas',
                narrativa: [
                    "Quarta-feira, 3h da madrugada.",
                    "Você está na laje do prédio, olhando para baixo.",
                    "Não é a primeira vez que vem aqui. Nem a segunda.",
                    "'Seria mais fácil para todo mundo', você pensa.",
                    "Sua mãe não precisaria mais se preocupar. Seu pai teria uma desculpa a menos para beber.",
                    "Você pega o celular para escrever uma última mensagem."
                ],
                escolhas: [
                    {
                        texto: "Ligar para o CVV (Centro de Valorização da Vida)",
                        consequencias: { saude: +10, estresse: -20, esperanca: +20 },
                        resultado: "A voz do outro lado foi gentil: 'Você não está sozinho.' Você chorou por uma hora, mas desceu da laje."
                    },
                    {
                        texto: "Mandar uma mensagem para sua mãe dizendo que a ama",
                        consequencias: { estresse: +30, esperanca: +15 },
                        resultado: "Ela respondeu na hora: 'Eu também te amo, filho. Vamos conversar amanhã.' Você guardou o celular e desceu."
                    },
                    {
                        texto: "Ficar ali até o sol nascer, pensando",
                        consequencias: { saude: -10, estresse: +45, esperanca: -10 },
                        resultado: "Você ficou até as 6h. Quando desceu, sua mãe estava te esperando. Ela sabia onde você estava."
                    }
                ]
            },
            {
                tipo: 'humilhacao_publica',
                narrativa: [
                    "Quinta-feira, no supermercado.",
                    "Você finalmente saiu para comprar pão e encontra seus ex-colegas de escola.",
                    "'E aí, João! Como está a faculdade?' pergunta um deles.",
                    "Todos estão bem vestidos, falando sobre estágio, namoradas, planos.",
                    "Você está de chinelo, bermuda velha, sem ter o que falar.",
                    "'Ah, eu... estou... procurando ainda', você gagueja."
                ],
                escolhas: [
                    {
                        texto: "Inventar uma mentira sobre estar trabalhando",
                        consequencias: { estresse: +35, esperanca: -15 },
                        resultado: "Você mentiu sobre ter um emprego. Eles ficaram felizes por você, mas a mentira pesa na consciência."
                    },
                    {
                        texto: "Ser honesto sobre sua situação",
                        consequencias: { estresse: +40, esperanca: +10, saude: -5 },
                        resultado: "Você contou a verdade. Eles ficaram sem graça. Um deles ofereceu ajuda, mas você se sentiu humilhado."
                    },
                    {
                        texto: "Inventar uma desculpa e sair correndo",
                        consequencias: { estresse: +50, esperanca: -25, saude: -10 },
                        resultado: "Você saiu correndo. Ouviu eles comentando: 'O João não está bem.' A vergonha é insuportável."
                    }
                ]
            },
            {
                tipo: 'ultima_chance',
                narrativa: [
                    "Sexta-feira, 16h.",
                    "Sua mãe chega em casa mais cedo com uma proposta:",
                    "'Meu patrão precisa de alguém para limpar o escritório à noite. R$ 400 por mês.'",
                    "'Não é muito, mas é um começo. Você aceita?'",
                    "Você sabe que é trabalho pesado, mal pago, mas é uma oportunidade.",
                    "Talvez a única que vai aparecer."
                ],
                escolhas: [
                    {
                        texto: "Aceitar com gratidão e determinação",
                        consequencias: { esperanca: +30, estresse: +15, dinheiro: +400 },
                        resultado: "Sua mãe sorriu pela primeira vez em meses. 'Eu sabia que você ia conseguir, filho.'"
                    },
                    {
                        texto: "Aceitar, mas reclamar que é pouco dinheiro",
                        consequencias: { esperanca: +10, estresse: +25, dinheiro: +400 },
                        resultado: "Sua mãe suspirou: 'Pelo menos é um começo, João.' Você viu a decepção nos olhos dela."
                    },
                    {
                        texto: "Recusar porque se sente humilhado",
                        consequencias: { esperanca: -30, estresse: +45, saude: -15 },
                        resultado: "Sua mãe não disse nada, mas você viu ela chorar no quarto. Você perdeu a chance."
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
        'pessoa-deficiente': [
            {
                tipo: 'barreira_arquitetonica',
                narrativa: [
                    "Segunda-feira, 8h da manhã.",
                    "Você precisa ir ao banco receber seu BPC, mas sua cadeira de rodas quebrou ontem.",
                    "A roda traseira está solta e você não consegue se locomover sozinha.",
                    "Sua mãe, de 70 anos, não tem força para te carregar.",
                    "O conserto custa R$ 150, mas você só tem R$ 80.",
                    "Sem a cadeira, você está literalmente presa em casa."
                ],
                escolhas: [
                    {
                        texto: "Pedir ajuda aos vizinhos para te carregarem até o banco",
                        consequencias: { estresse: +35, esperanca: -15, saude: -10 },
                        resultado: "Dois vizinhos te carregaram. Você se sentiu humilhada, mas conseguiu o dinheiro. A dignidade tem um preço."
                    },
                    {
                        texto: "Tentar consertar a cadeira com arame e fita isolante",
                        consequencias: { estresse: +25, esperanca: +5 },
                        resultado: "O 'conserto' durou 2 horas. A cadeira está instável, mas pelo menos você pode sair de casa."
                    },
                    {
                        texto: "Ficar em casa e tentar resolver tudo por telefone",
                        consequencias: { estresse: +40, esperanca: -20, dinheiro: -100 },
                        resultado: "Ninguém atende. Você perdeu o prazo e terá que esperar mais um mês pelo benefício."
                    }
                ]
            },
            {
                tipo: 'preconceito_social',
                narrativa: [
                    "Terça-feira, na fila do supermercado.",
                    "Uma senhora na sua frente reclama alto: 'Essas pessoas deficientes só atrapalham!'",
                    "O caixa te olha com pena: 'Coitadinha, deve ser difícil viver assim.'",
                    "Uma criança aponta: 'Mamãe, por que ela não consegue andar?'",
                    "A mãe puxa a criança: 'Não olha, filha. É feio.'",
                    "Você sente todos os olhares em cima de você."
                ],
                escolhas: [
                    {
                        texto: "Confrontar as pessoas sobre o preconceito",
                        consequencias: { estresse: +30, esperanca: +10, saude: -5 },
                        resultado: "Você falou sobre inclusão e respeito. Algumas pessoas ouviram, outras te ignoraram. Pelo menos tentou."
                    },
                    {
                        texto: "Fingir que não ouviu e continuar suas compras",
                        consequencias: { estresse: +45, esperanca: -25, saude: -10 },
                        resultado: "Você engoliu a humilhação. Chegou em casa chorando. Sua mãe te abraçou sem falar nada."
                    },
                    {
                        texto: "Sair do supermercado sem comprar nada",
                        consequencias: { estresse: +40, esperanca: -20, dinheiro: -50 },
                        resultado: "Você saiu correndo. Teve que pedir delivery, que custou mais caro. O preconceito custa dinheiro também."
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
        'pessoa-deficiente': [
            {
                tipo: 'sonhos_perdidos',
                narrativa: [
                    "Quarta-feira à noite.",
                    "Você encontra seus antigos livros de pedagogia no armário.",
                    "Antes do acidente, você estava no 3º período da faculdade.",
                    "Sonhava em ser professora, em fazer a diferença na vida das crianças.",
                    "Agora, 15 anos depois, você se pergunta: 'E se eu tentasse voltar?'",
                    "Mas as escolas não têm acessibilidade. E quem contrataria uma professora cadeirante?"
                ],
                escolhas: [
                    {
                        texto: "Pesquisar sobre ensino à distância e acessibilidade",
                        consequencias: { esperanca: +25, estresse: +15 },
                        resultado: "Você encontrou algumas oportunidades. É difícil, mas não impossível. O sonho ainda existe."
                    },
                    {
                        texto: "Ligar para sua antiga faculdade para saber sobre retorno",
                        consequencias: { esperanca: +20, estresse: +20 },
                        resultado: "A coordenadora foi gentil: 'Claro que você pode voltar!' Mas a faculdade ainda não tem elevador."
                    },
                    {
                        texto: "Guardar os livros de volta - alguns sonhos não se realizam",
                        consequencias: { esperanca: -30, estresse: +35, saude: -15 },
                        resultado: "Você chorou sobre os livros. Sua mãe te encontrou assim: 'Filha, nunca é tarde para recomeçar.'"
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
        'pessoa-deficiente': [
            {
                tipo: 'cuidadora_sobrecarregada',
                narrativa: [
                    "Quinta-feira, madrugada.",
                    "Sua mãe, de 70 anos, caiu no banheiro tentando te ajudar.",
                    "Ela está no chão, chorando de dor. Você não consegue levantá-la.",
                    "'Desculpa, filha. Eu não aguento mais', ela sussurra.",
                    "Você percebe que ela está no limite. Quem cuida de quem cuida de você?",
                    "Vocês duas estão sozinhas no mundo."
                ],
                escolhas: [
                    {
                        texto: "Chamar o SAMU e tentar conseguir ajuda profissional",
                        consequencias: { estresse: +25, esperanca: +15, dinheiro: -200 },
                        resultado: "O SAMU veio. Sua mãe não quebrou nada, mas vocês descobriram sobre cuidadores do SUS."
                    },
                    {
                        texto: "Tentar cuidar da sua mãe sozinha",
                        consequencias: { saude: -20, estresse: +40, esperanca: -10 },
                        resultado: "Vocês se ajudaram como puderam. Duas mulheres feridas cuidando uma da outra."
                    },
                    {
                        texto: "Ligar para assistência social pedindo ajuda",
                        consequencias: { estresse: +30, esperanca: +10 },
                        resultado: "Te colocaram numa lista de espera. 'São muitos casos', disseram. Vocês continuam esperando."
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
        'pessoa-deficiente': [
            {
                tipo: 'luta_por_direitos',
                narrativa: [
                    "Sexta-feira, na prefeitura.",
                    "Você veio cobrar a rampa de acesso que prometeram há 2 anos.",
                    "O funcionário te olha irritado: 'Você de novo? Já falei que não tem verba!'",
                    "'Mas é meu direito!', você responde.",
                    "'Direito? Você já ganha dinheiro sem trabalhar. Quer mais o quê?'",
                    "Outras pessoas na fila concordam com ele. Você está sozinha na luta."
                ],
                escolhas: [
                    {
                        texto: "Insistir e ameaçar processar a prefeitura",
                        consequencias: { esperanca: +20, estresse: +35 },
                        resultado: "Você falou sobre seus direitos constitucionais. Eles te ouviram, mas nada mudou. A luta continua."
                    },
                    {
                        texto: "Aceitar a situação e ir embora",
                        consequencias: { esperanca: -25, estresse: +30, saude: -10 },
                        resultado: "Você saiu derrotada. Mais um dia, mais uma porta fechada. Quando a sociedade vai te enxergar?"
                    },
                    {
                        texto: "Procurar organizações de defesa dos direitos das pessoas com deficiência",
                        consequencias: { esperanca: +30, estresse: +20 },
                        resultado: "Você encontrou outras pessoas na mesma luta. Sozinha você é fraca, mas juntas vocês são fortes."
                    }
                ]
            }
        ]
    }
};

// finais da simulação

window.finaisPossiveis = {
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
    'pessoa-deficiente': {
        positivo: {
            titulo: "A Força da Resistência",
            narrativa: "Você descobriu que sua deficiência não define seus limites - a sociedade que tenta defini-los. Conseguiu voltar a estudar através do ensino à distância e agora dá aulas online. Sua mãe se orgulha ao te ver ensinando crianças pelo computador. Você provou que sonhos não têm barreiras físicas, apenas barreiras mentais que podem ser quebradas.",
            condicoes: { esperanca: 60, dinheiro: 300 }
        },
        neutro: {
            titulo: "Dignidade em Construção",
            narrativa: "Cada dia é uma luta, mas você não desiste. Sua cadeira de rodas ainda está quebrada, mas você encontrou formas de se locomover. Sua mãe está mais frágil, mas vocês se cuidam mutuamente. A sociedade ainda te olha com preconceito, mas você aprendeu a olhar de volta com dignidade. Você existe, resiste e insiste.",
            condicoes: { esperanca: 35, saude: 25 }
        },
        negativo: {
            titulo: "Invisível aos Olhos do Mundo",
            narrativa: "Você se tornou prisioneira da própria casa. Sua cadeira quebrou definitivamente e não há dinheiro para consertar. Sua mãe adoeceu e não pode mais te ajudar. O BPC mal paga as contas básicas. Você passa os dias olhando pela janela, vendo um mundo que não foi feito para você. A sociedade te esqueceu, mas você ainda luta para não esquecer de si mesma.",
            condicoes: { saude: 10, estresse: 90, esperanca: 5 }
        }
    }
};
