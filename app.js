/**
 * REALIDADES INVISÍVEIS - Simulador Interativo
 * Um jogo educativo sobre vulnerabilidade social no Brasil
 */


// estado global do jogo
let estadoDoJogo = {
    personagemAtual: null,
    semanaAtual: 1,
    totalSemanas: 4,
    dinheiro: 0,
    saude: 100,
    estresse: 0,
    esperanca: 100,
    eventos: [],
    jogoFinalizado: false
};

// definição dos personagens
const personagens = {
    'mae-solo': {
        nome: 'Maria - Mãe Solo',
        descricao: '32 anos, 2 filhos pequenos',
        dinheiroInicial: 800,
        rendaSemanal: 800,
        despesasFixas: 650,
        icone: '👩‍👧‍👦',
        historia: 'Maria trabalha como diarista e cria sozinha dois filhos pequenos. Cada real conta para manter a família.'
    },
    'jovem-desempregado': {
        nome: 'João - Jovem Desempregado',
        descricao: '19 anos, mora com a família',
        dinheiroInicial: 50,
        rendaSemanal: 0,
        despesasFixas: 50,
        icone: '🧑',
        historia: 'João perdeu o emprego há 3 meses e depende da família. Busca oportunidades enquanto a pressão aumenta.'
    },
    'trabalhador-informal': {
        nome: 'Carlos - Trabalhador Informal',
        descricao: '28 anos, renda instável',
        dinheiroInicial: 400,
        rendaSemanal: () => Math.floor(Math.random() * 500) + 100, // 100-600
        despesasFixas: 500,
        icone: '👷',
        historia: 'Carlos trabalha como vendedor ambulante. Sua renda varia conforme o movimento das ruas.'
    },
    'idoso-aposentado': {
        nome: 'Dona Rosa - Idosa Aposentada',
        descricao: '67 anos, sustenta 2 netos',
        dinheiroInicial: 1100,
        rendaSemanal: 275, // 1100/4
        despesasFixas: 237, // 950/4
        icone: '👴',
        historia: 'Dona Rosa cuida de dois netos com sua aposentadoria. O dinheiro mal dá para as necessidades básicas.'
    }
};
