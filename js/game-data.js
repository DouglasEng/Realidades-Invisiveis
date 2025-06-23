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
        descricao: '28 anos, renda instável',
        statusInicial: {
            saude: 55,
            estresse: 75,
            esperanca: 55,
            dinheiro: 400
        },
        rendaSemanal: () => Math.floor(Math.random() * 500) + 200, // 100-700
        despesasFixas: 500,
        icone: '👷',
        historia: 'Você é Carlos, 45 anos. Trabalha como vendedor ambulante e faz bicos de pedreiro. Sua renda varia muito de mês para mês.'
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
