
import { PYTHAGOREAN_TABLE, TAROT_CARDS } from "../constants";
import { MapResult, TarotCard } from "../types";

// Helper: Standard Theosophic Reduction for Tarot (reduce until <= 22)
// Example: 25 -> 2+5=7. 
// Example: 50 -> 5+0=5.
const reduceToTarot = (num: number): number => {
  let current = num;
  while (current > 22) {
    const digits = current.toString().split('').map(Number);
    current = digits.reduce((a, b) => a + b, 0);
  }
  return current;
};

export const calculateMap = (fullName: string, birthDateStr: string): MapResult => {
  // Normalize name
  const cleanName = fullName.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z]/g, "");
  
  // 1. Arcano 1 (Soma do Nome Completo)
  let sumName = 0;
  for (const char of cleanName) {
    if (PYTHAGOREAN_TABLE[char]) {
      sumName += PYTHAGOREAN_TABLE[char];
    }
  }
  const arcano1 = reduceToTarot(sumName);

  // Parse Date
  const [yearStr, monthStr, dayStr] = birthDateStr.split('-');
  const year = parseInt(yearStr);
  const month = parseInt(monthStr);
  const day = parseInt(dayStr);

  // 2. Arcano 2 (Soma do Ano) & 3. Arcano 3 (Personalidade)
  const sumYearDigits = year.toString().split('').map(Number).reduce((a, b) => a + b, 0);
  
  let arcano2 = 0;
  let arcano3 = 0;
  let caseType = ''; // 'A' (>22), 'B' (10-22), 'C' (<10)

  // LOGIC BRANCHES from User Manual
  if (sumYearDigits > 22) {
    // CASE A: Soma > 22
    // 2nd = Reduced
    // 3rd = 2nd + Month
    caseType = 'A';
    arcano2 = reduceToTarot(sumYearDigits);
    const rawArc3 = arcano2 + month;
    arcano3 = reduceToTarot(rawArc3);
  } else {
    // Soma <= 22
    arcano2 = sumYearDigits;

    if (sumYearDigits > 9) {
      // CASE B: 10 to 22
      // 3rd = Reduced 2nd
      caseType = 'B';
      arcano3 = reduceToTarot(sumYearDigits); 
    } else {
      // CASE C: Single Digit (e.g., 2003 -> 5)
      // 3rd = Same as 2nd
      caseType = 'C';
      arcano3 = sumYearDigits;
    }
  }

  // 4. Arcano 4 (Maturidade)
  // RULE from prompt: "Quando houver a soma do mês para encontrar o 3º arcano (Case A), calculamos o 4º somando o 1º e 2º arcanos."
  // OTHERWISE (Cases B & C): Standard rule (1st + 3rd).
  let arcano4 = 0;
  if (caseType === 'A') {
    // Special Rule for reduced years
    arcano4 = reduceToTarot(arcano1 + arcano2);
  } else {
    // Standard Rule (Maria Example)
    arcano4 = reduceToTarot(arcano1 + arcano3);
  }

  // 5. Arcano 5 (Propósito)
  // Rule: Sum 1+2+3+4.
  // Rule from Prompt: "Se o 2º arcano for 22, o 3º será 4, mas na soma final (para encontrar o 5º arcano), será considerado 0 (zero)."
  // Also: "O LOUCO ... será sempre 0 (zero) na soma final."
  // Implementation: Treat any arcano that equals 22 as 0 for this summation.
  const val1 = arcano1 === 22 ? 0 : arcano1;
  const val2 = arcano2 === 22 ? 0 : arcano2;
  const val3 = arcano3 === 22 ? 0 : arcano3;
  const val4 = arcano4 === 22 ? 0 : arcano4;

  const rawArc5 = val1 + val2 + val3 + val4;
  const arcano5 = reduceToTarot(rawArc5);

  // 6. Soul Arcane (Anseio da Alma)
  // Rule: Sum Day + Month + Year. Then reduce.
  const sumFullDate = day + month + year;
  const soulArcane = reduceToTarot(sumFullDate);

  // Normalize final results (If 0 or 22, ensure we use 22 for display if needed, or consistent usage)
  // In Tarot arrays usually 0 is Fool. Our array has 0..21. 
  // If result is 22, it maps to Fool (0) in logic provided: "O LOUCO é incorporado... soma 22".
  const normalize = (n: number) => (n === 22 ? 0 : n);

  return {
    arcano1: normalize(arcano1),
    arcano2: normalize(arcano2),
    arcano3: normalize(arcano3),
    arcano4: normalize(arcano4),
    arcano5: normalize(arcano5),
    soulArcane: normalize(soulArcane)
  };
};

export const getCardData = (number: number): TarotCard => {
  const index = number === 22 ? 0 : number;
  const baseData = TAROT_CARDS[index] || TAROT_CARDS[0];
  
  return {
    ...baseData,
    meaningInMap: "Interpretação personalizada..." 
  };
};
