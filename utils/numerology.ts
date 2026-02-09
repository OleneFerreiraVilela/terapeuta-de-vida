import { PYTHAGOREAN_TABLE, TAROT_CARDS } from "../constants";
import { MapResult, TarotCard } from "../types";

// Reducao Teosófica padrão: soma os dígitos até chegar a um único dígito (1-9)
// Ex: 798 -> 7+9+8=24 -> 2+4=6
const reduceToSingleDigit = (num: number): number => {
  let current = num;
  while (current > 9) {
    const digits = current.toString().split('').map(Number);
    current = digits.reduce((a, b) => a + b, 0);
  }
  return current;
};

// Reducao Teosófica adaptada ao Tarot: reduz somente a partir de 23
// Números de 1 a 22 permanecem (pois correspondem aos 22 arcanos maiores)
// Ex: 193 -> 1+9+3=13 (Morte) -> permanece 13
// Ex: 50 -> 5+0=5 -> permanece 5
// Ex: 25 -> 2+5=7 -> permanece 7
const reduceToTarot = (num: number): number => {
  let current = num;
  while (current > 22) {
    const digits = current.toString().split('').map(Number);
    current = digits.reduce((a, b) => a + b, 0);
  }
  return current;
};

export const calculateMap = (fullName: string, birthDateStr: string): MapResult => {
  // Normaliza o nome: maiúsculas, sem acentos, apenas letras A-Z
  const cleanName = fullName.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z]/g, "");
  
  // ========================================================
  // 1º ARCANO - A BAGAGEM (Soma do Nome Completo)
  // ========================================================
  // Cada letra do nome recebe um valor da Roda de Pitágoras.
  // Soma-se todos os valores e aplica-se a redução teosófica adaptada ao Tarot.
  let sumName = 0;
  for (const char of cleanName) {
    if (PYTHAGOREAN_TABLE[char]) {
      sumName += PYTHAGOREAN_TABLE[char];
    }
  }
  const arcano1 = reduceToTarot(sumName);

  // ========================================================
  // Parse da data de nascimento
  // ========================================================
  const [yearStr, monthStr, dayStr] = birthDateStr.split('-');
  const year = parseInt(yearStr);
  const month = parseInt(monthStr);
  const day = parseInt(dayStr);

  // ========================================================
  // 2º ARCANO - O AMBIENTE / A VIRADA (Soma dos dígitos do Ano)
  // ========================================================
  // Soma os dígitos do ano de nascimento.
  // Se a soma > 22: reduz teosoficamente (dígito único) => esse é o 2º arcano
  // Se a soma está entre 10 e 22: esse valor é o 2º arcano diretamente
  // Se a soma < 10: esse valor é o 2º arcano diretamente
  const sumYearDigits = year.toString().split('').map(Number).reduce((a, b) => a + b, 0);
  
  let arcano2 = 0;
  let arcano3 = 0;
  let caseType = ''; // 'A' (>22), 'B' (10-22), 'C' (<10)

  if (sumYearDigits > 22) {
    // CASO A: Soma dos dígitos do ano > 22
    // 2º arcano = redução teosófica da soma (até ficar <=22 para Tarot)
    // 3º arcano = 2º arcano + mês de nascimento (reduzido ao Tarot se necessário)
    caseType = 'A';
    arcano2 = reduceToTarot(sumYearDigits);
    const rawArc3 = arcano2 + month;
    arcano3 = reduceToTarot(rawArc3);
  } else if (sumYearDigits > 9) {
    // CASO B: Soma dos dígitos do ano entre 10 e 22
    // 2º arcano = soma direta (já é um arcano válido)
    // 3º arcano = redução teosófica do 2º arcano (a dígito único)
    caseType = 'B';
    arcano2 = sumYearDigits;
    arcano3 = reduceToSingleDigit(sumYearDigits);
  } else {
    // CASO C: Soma dos dígitos do ano é dígito único (1-9)
    // 2º arcano = soma direta
    // 3º arcano = igual ao 2º arcano (já é dígito único)
    caseType = 'C';
    arcano2 = sumYearDigits;
    arcano3 = sumYearDigits;
  }

  // ========================================================
  // 4º ARCANO - A MATURIDADE
  // ========================================================
  // Quando houve soma do mês para encontrar o 3º arcano (Caso A):
  //   4º arcano = 1º arcano + 2º arcano
  // Nos outros casos (B e C):
  //   4º arcano = 1º arcano + 3º arcano
  // Sempre reduzido ao Tarot.
  let arcano4 = 0;
  if (caseType === 'A') {
    arcano4 = reduceToTarot(arcano1 + arcano2);
  } else {
    arcano4 = reduceToTarot(arcano1 + arcano3);
  }

  // ========================================================
  // 5º ARCANO - O PROPÓSITO DE VIDA
  // ========================================================
  // Soma dos arcanos 1 + 2 + 3 + 4.
  // REGRA ESPECIAL: O Louco (arcano 22) vale 0 (zero) na soma final.
  // "Se o 2º arcano for 22, o 3º será 4, mas na soma final será considerado 0."
  const val1 = arcano1 === 22 ? 0 : arcano1;
  const val2 = arcano2 === 22 ? 0 : arcano2;
  const val3 = arcano3 === 22 ? 0 : arcano3;
  const val4 = arcano4 === 22 ? 0 : arcano4;

  const rawArc5 = val1 + val2 + val3 + val4;
  const arcano5 = reduceToTarot(rawArc5);

  // ========================================================
  // ANSEIO DA ALMA (Soma da Data de Nascimento completa)
  // ========================================================
  // Soma: Dia + Mês + Ano (valores inteiros, não dígito a dígito)
  // Depois reduz teosoficamente ao Tarot.
  const sumFullDate = day + month + year;
  const soulArcane = reduceToTarot(sumFullDate);

  // O arcano 22 (O Louco) é representado internamente como 22.
  // No display, mapeamos para o índice 0 do array de cartas.
  return {
    arcano1,
    arcano2,
    arcano3,
    arcano4,
    arcano5,
    soulArcane
  };
};

export const getCardData = (number: number): TarotCard => {
  // O Louco: arcano 22 mapeia para o índice 0 no array de cartas
  const index = number === 22 ? 0 : number;
  const baseData = TAROT_CARDS[index] || TAROT_CARDS[0];
  
  return {
    ...baseData,
    number: number, // Preserva o número original (22 para O Louco, não 0)
    meaningInMap: "Interpretação personalizada..." 
  };
};
