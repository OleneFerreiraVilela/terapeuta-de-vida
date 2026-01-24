
import { TarotCard } from "./types";

// Roda de Pitágoras Custom Table
export const PYTHAGOREAN_TABLE: Record<string, number> = {
  A: 1, J: 15, S: 20,
  B: 2, K: 8,  T: 6,
  C: 4, L: 21, U: 9,
  D: 5, M: 19, V: 9,
  E: 3, N: 26, W: 9,
  F: 8, O: 8,  X: 13,
  G: 10, P: 77, Y: 50,
  H: 28, Q: 27, Z: 70
};

// Utilizando proxy de imagem (wsrv.nl) para garantir carregamento e contornar limites do Google Drive
// Certifique-se que os arquivos no Drive estão como "Público / Qualquer pessoa com o link"
export const TAROT_CARDS: Record<number, Omit<TarotCard, 'meaningInMap'>> = {
  0: {
    number: 0,
    name: "O Louco",
    image: "https://wsrv.nl/?url=https://drive.google.com/uc?id=1lgRVYTBhxvUd50TF7LU4r0IjRl4mGBbv",
    keywords: ["Experiência", "Liberdade", "Impulso"],
    quote: "Quero ser feliz e livre! Minha palavra-chave é: ganhar experiência.",
    archetypeDefinition: "O Louco, o herói da história, é o impulso misterioso dentro de cada um de nós. Ele segue o curso do Sol, a fim de realizar a grande obra. Nosso herói (Energia Espírito) tem uma importante missão, que é resgatar a autenticidade e sua integridade."
  },
  1: {
    number: 1,
    name: "O Mago",
    image: "https://wsrv.nl/?url=https://drive.google.com/uc?id=1dLLz_zcSGUk2DUbBHShPlXvomhFKp2gY",
    keywords: ["Vontade", "Sonho", "Inteligência"],
    quote: "Sou eu quem define o que te fará feliz e tenho os recursos para alcançar o que deseja, mas a minha maior ferramenta é o sonho que motiva e o impulso é a Vontade.",
    archetypeDefinition: "Princípio Ativo, criador, inícios. Consciência solar, inteligência, habilidade. O Mago é insuflado pela energia dO Louco (Espírito) e a personifica na Terra. Sua meta é unir esses dois mundos."
  },
  2: {
    number: 2,
    name: "A Papisa",
    image: "https://wsrv.nl/?url=https://drive.google.com/uc?id=1_GVcPGbvXviLXQavSKJMj0SRoUXL-s-L",
    keywords: ["Ler", "Intuição", "Reflexão"],
    quote: "Sou a intuição que te faz refletir antes de agir. Te conduzo pelos caminhos da sabedoria e sem mim, você pode até desanimar. Minha palavra-chave é: Ler.",
    archetypeDefinition: "A Senhora de todos os segredos, mistério, inteligência, força arquetípica feminina, o inconsciente. As duas colunas do templo."
  },
  3: {
    number: 3,
    name: "A Imperatriz",
    image: "https://wsrv.nl/?url=https://drive.google.com/uc?id=1n28PRMXKdpQweBeqQ31UjH_Yab_jto-E",
    keywords: ["Seduzir", "Feminino Fértil", "Nutrição"],
    quote: "Sou seu feminino fértil e inspirador e trago soluções em meu útero sagrado. Incentivo e alimento-o como uma mãe protetora. Conheço o tempo de gestação dos seus sonhos. Minha palavra-chave é: Seduzir.",
    archetypeDefinition: "Princípio primordial (feminino) no âmbito concreto. A Mãe terrena."
  },
  4: {
    number: 4,
    name: "O Imperador",
    image: "https://wsrv.nl/?url=https://drive.google.com/uc?id=1riFkTU_aZs8NSNNy5AOldyzvyZvoj8tX",
    keywords: ["Comandar", "Realização", "Liderança"],
    quote: "Se conecte com minha energia realizadora e de liderança. Mas primeiro lidere-se a si mesmo. Ação correta é fazer o que tem que ser feito. Minha palavra-chave é: Comandar.",
    archetypeDefinition: "O pai terreno. Energia yang. O Imperador é a força que transforma as ideias, os desejos e os objetivos em realidade."
  },
  5: {
    number: 5,
    name: "O Papa",
    image: "https://wsrv.nl/?url=https://drive.google.com/uc?id=1xlUD--t_ZzvAh16NuzXumamMqmBBhnVT",
    keywords: ["Ensinar", "Espiritualidade", "Conexão"],
    quote: "Sou seu mestre interno, seu lado espiritual. Deveis saber que és guiado por algo maior. Sem essa conexão, todas as conquistas materiais não terão sentido. Minha palavra-chave é: Ensinar.",
    archetypeDefinition: "O Papa é aquele que possui as chaves do reino dos céus, que ensina as coisas sagradas. É o sumo sacerdote, o professor, o líder espiritual."
  },
  6: {
    number: 6,
    name: "Os Enamorados",
    image: "https://wsrv.nl/?url=https://drive.google.com/uc?id=1A-9W3a0E2ie9dREOpRS6F7c0xYccv9-D",
    keywords: ["Escolha", "Ego", "União"],
    quote: "Sou o símbolo do seu ego. Se suas escolhas forem equivocadas, terá que renunciá-las e recomeçar. Apenas enfrentando os conflitos chegarás ao mais profundo do seu ser. Minha palavra-chave é: Escolha.",
    archetypeDefinition: "O Arcanjo Enamorado representa o amor puro antes do pecado original. O herói recebe um estímulo para tomar a decisão de abandonar a casa dos pais em direção aos próprios caminhos."
  },
  7: {
    number: 7,
    name: "O Carro",
    image: "https://wsrv.nl/?url=https://drive.google.com/uc?id=16ZAtpNJuY6lr05G2KxXGWiMjWwyzy1ZJ",
    keywords: ["Conquistar", "Movimento", "Destino"],
    quote: "Sou a chave da criação que abre caminhos. Administre suas emoções, exercite a razão e o perdão, e siga rumo ao destino escolhido. Minha palavra-chave é: Conquistar.",
    archetypeDefinition: "Energia masculina, positiva. Representa a partida do herói, o momento de decisão de sair para experimentar o mundo e se tornar senhor do seu destino."
  },
  8: {
    number: 8,
    name: "A Justiça",
    image: "https://wsrv.nl/?url=https://drive.google.com/uc?id=13s4gfqZe8qVQ0eB52k0W65MIgZ4aug6K",
    keywords: ["Equilibrar", "Lei", "Reação"],
    quote: "Sou o número da reação equilibrante, a lei do mundo. Suas ações sempre produzirão uma reação. Conheça as Leis e evite dores maiores. Minha palavra-chave é: Equilibrar.",
    archetypeDefinition: "A Justiça representa as primeiras experiências do herói ao sair para o mundo, aprendendo que receberá da vida conforme semear suas ações."
  },
  9: {
    number: 9,
    name: "O Eremita",
    image: "https://wsrv.nl/?url=https://drive.google.com/uc?id=1pyM9GSud10cgK8MAaOuUrGV3YLHEJNSg",
    keywords: ["Iluminar", "Sabedoria", "Autoconhecimento"],
    quote: "Sou seu velho amigo e sábio conselheiro. Peço pra você se conhecer para acreditar em si mesmo. Aprenda com as experiências do passado. Minha palavra-chave é: Iluminar.",
    archetypeDefinition: "Representa um passo de conscientização aberto a todo ser humano que se retira para o silêncio, a fim de encontrar-se através do autoconhecimento."
  },
  10: {
    number: 10,
    name: "A Roda da Fortuna",
    image: "https://wsrv.nl/?url=https://drive.google.com/uc?id=17NsdHw-ECXJPBTrjR9s3Qj5xPDS_3zYh",
    keywords: ["Mudar", "Ciclos", "Oportunidades"],
    quote: "Sou a existência dos ciclos infinitos e sou regida por influência divina. Represento a cura alquímica. O universo te oferece muitas oportunidades de reciclagem. Minha palavra-chave é: Mudar.",
    archetypeDefinition: "Quando nosso herói chega no Arcano 10, já percorreu a primeira metade da Jornada, e sente-se maduro para entender qual sua tarefa."
  },
  11: {
    number: 11,
    name: "A Força",
    image: "https://wsrv.nl/?url=https://drive.google.com/uc?id=1VSrXhTHtNjLf5uiAA_IwfVLfQAfCZ1G5",
    keywords: ["Dominar", "Coragem", "Impulsos"],
    quote: "Simbolizo as duas colunas do Templo. É preciso ter muita coragem e força para vencer os desafios pessoais, internos. Exijo humildade para conquistar a verdadeira liberdade. Minha palavra-chave é: Dominar.",
    archetypeDefinition: "Representa o encontro com nossa natureza instintiva e abre a segunda metade da Jornada, que nos levam aos segredos das profundezas."
  },
  12: {
    number: 12,
    name: "O Pendurado",
    image: "https://wsrv.nl/?url=https://drive.google.com/uc?id=1dEhczXO1ED8ekoc4ff0EdNZTbIopYMk5",
    keywords: ["Sacrificar", "Renúncia", "Nova Visão"],
    quote: "Represento a renúncia, o auto-sacrifício para livrar-se das ilusões. Às vezes, precisará ver a vida de ponta cabeça para enxergar por ângulos diferentes. Minha palavra-chave é: Sacrificar.",
    archetypeDefinition: "Simboliza todas as crises impossíveis de evitar que nos atingem e nos obrigam a uma mudança de vida e direção."
  },
  13: {
    number: 13,
    name: "A Morte",
    image: "https://wsrv.nl/?url=https://drive.google.com/uc?id=1diQHfTUo7pGxXD8Ot_B_7TZNmrezTJRM",
    keywords: ["Eliminar", "Desapego", "Novo Ciclo"],
    quote: "Levo tudo que é inútil e ilusório. Você precisará me encarar de frente. Não resista. Desapegue-se e abra espaço para que o novo nasça. Minha palavra-chave é: Eliminar.",
    archetypeDefinition: "Simboliza transitoriedade, desapego e consciência. Uma força que se esgotou e precisa se regenerar. Uma fase que chega ao fim."
  },
  14: {
    number: 14,
    name: "A Temperança",
    image: "https://wsrv.nl/?url=https://drive.google.com/uc?id=1HtPLf8MJq6CGojdgId1UVQwz9x2ZrEwI",
    keywords: ["Acalmar", "Reciclagem", "Equilíbrio"],
    quote: "É hora de reciclar-se! Transmute seu chumbo em ouro, se fortaleça interiormente. Equilibre mente e coração e siga com o fluxo das águas. Minha palavra-chave é: Acalmar.",
    archetypeDefinition: "A tarefa é misturar os fluidos (energia Yin/yang) a fim de encontrar a união bem-sucedida e o tempero certo entre renúncia e cobiça."
  },
  15: {
    number: 15,
    name: "O Diabo",
    image: "https://wsrv.nl/?url=https://drive.google.com/uc?id=1s5YThwWrTTFXc3CpdMCf8j9h-eOsLs-S",
    keywords: ["Tentar", "Sedução", "Sombra"],
    quote: "Sou a tentação dos caminhos fáceis e a arrogância que te separa do outro. Te faço acreditar que só com ganhos infinitos se sentirás importante. Minha palavra-chave é: Tentar.",
    archetypeDefinition: "O herói chegou ao local mais escuro da jornada. Representa o labirinto do inferno, onde o herói necessita encontrar e experienciar seu lado sombrio."
  },
  16: {
    number: 16,
    name: "A Torre",
    image: "https://wsrv.nl/?url=https://drive.google.com/uc?id=1-exEaVzxtgYTWBaf3GzxRxD6sEfWhM5j",
    keywords: ["Festejar", "Renovação", "Verdade"],
    quote: "Represento seus castelos de segurança e a sua autoimagem construída para esconder suas fraquezas. Sou a intervenção do divino na matéria para a renovação. Minha palavra-chave é: Festejar.",
    archetypeDefinition: "Depois que o herói entra no inferno, ele deve vencer o guarda, destruir a prisão e libertar a alma aprisionada."
  },
  17: {
    number: 17,
    name: "A Estrela",
    image: "https://wsrv.nl/?url=https://drive.google.com/uc?id=1ccEO0-n42YD6lE91R3QZhlGyuSrlcQIY",
    keywords: ["Dar", "Fé", "Esperança"],
    quote: "Derrubei finalmente os muros do medo. Sou a sua fé renovada, a autoconfiança conquistada e a esperança renascida. Minha palavra-chave é: Dar.",
    archetypeDefinition: "A Estrela é a possibilidade da libertação dos muros e prisões limitantes que nos restringem."
  },
  18: {
    number: 18,
    name: "A Lua",
    image: "https://wsrv.nl/?url=https://drive.google.com/uc?id=1iaOWQxsP8w6-UnrsO-q1Cc0D9duw0sz_",
    keywords: ["Imaginar", "Intuição", "Superação"],
    quote: "Represento seus traumas e feridas psíquicas ainda não curadas. Sou a luz da intuição que brota da escuridão e ilumina seus medos mais profundos. Minha palavra-chave é: Imaginar.",
    archetypeDefinition: "Representa o difícil regresso do herói ao mundo superior, após ter bebido da poção do esquecimento e se perder no labirinto."
  },
  19: {
    number: 19,
    name: "O Sol",
    image: "https://wsrv.nl/?url=https://drive.google.com/uc?id=1wsLyvdvAgRmVCsdtkX5ygdQQQhT4PnlQ",
    keywords: ["Criar", "Self", "Abundância"],
    quote: "Sou seu Self clarividente. És herdeiro da abundância do universo. Aceite sua Luz. Minha palavra-chave é: Criar.",
    archetypeDefinition: "Após uma longa e trabalhosa peregrinação noturna, depois de perder todas as coisas transitórias, nosso herói reencontra o Sol."
  },
  20: {
    number: 20,
    name: "O Julgamento",
    image: "https://wsrv.nl/?url=https://drive.google.com/uc?id=1cY7rSE4gHkkJoZ2OVE9Q_-C_P1nEhwjw",
    keywords: ["Reviver", "Renascimento", "Consciência"],
    quote: "Sou energia de criação sem destruição. Sou seu renascimento; a reconciliação das diferentes partes de você mesmo. Minha palavra-chave é: Reviver.",
    archetypeDefinition: "O Julgamento é um renascimento no sentido da vitória sobre o sono que nos impede de associar memória e consciência."
  },
  21: {
    number: 21,
    name: "O Mundo",
    image: "https://wsrv.nl/?url=https://drive.google.com/uc?id=1oNRINziGZEATQOb3qvP57itIC6zYsayw",
    keywords: ["Triunfar", "Plenitude", "Paraíso"],
    quote: "Sou a possibilidade de você reinventar o Mundo; reconhecê-lo como um paraíso. Sua alma anseia integrar-se ao cosmo. Minha palavra-chave é: Triunfar.",
    archetypeDefinition: "Simboliza a chegada do herói ao objetivo, ao paraíso perdido. A volta do herói ao lar, ao Éden."
  }
};

// Map stages definitions
export const MAP_STAGES = [
  {
    id: 1,
    title: "A Bagagem",
    period: "0 a 13 anos",
    description: "O que você traz de outras vidas e seu caráter inato. A base da sua personalidade."
  },
  {
    id: 2,
    title: "A Virada / O Ambiente",
    period: "13 a 25 anos",
    description: "As experiências da juventude e o ambiente onde você floresceu. Suas vantagens e desafios iniciais."
  },
  {
    id: 3,
    title: "A Personalidade / Escolha",
    period: "25 a 35 anos",
    description: "O desenvolvimento da sua identidade adulta e a escolha do próprio caminho."
  },
  {
    id: 4,
    title: "A Maturidade",
    period: "35 a 45 anos",
    description: "A fase de colheita, reflexão e consolidação da sua sabedoria."
  },
  {
    id: 5,
    title: "O Propósito de Vida",
    period: "45 anos em diante",
    description: "A missão maior da sua existência. O legado que você veio deixar."
  },
  {
    id: 6,
    title: "Anseio da Alma",
    period: "Eterno",
    description: "A energia que acompanha seu espírito através das existências. O desejo profundo do seu ser."
  }
];
