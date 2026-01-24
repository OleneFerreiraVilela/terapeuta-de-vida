
export const calculateAge = (birthDateString: string): number => {
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  
  // Adjust if birthday hasn't happened yet this year
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const isValidCPF = (cpf: string): boolean => {
  // Remove non-numeric chars
  const cleanCPF = cpf.replace(/[^\d]+/g, '');

  // Check length and known invalid patterns
  if (cleanCPF.length !== 11 || !!cleanCPF.match(/(\d)\1{10}/)) return false;

  const values = cleanCPF.split('').map(el => +el);
  
  // Calculate first verifier digit
  let rest = values.slice(0, 9).reduce((s, n, i) => s + n * (10 - i), 0);
  let d1 = (rest * 10) % 11;
  if (d1 === 10 || d1 === 11) d1 = 0;
  if (d1 !== values[9]) return false;

  // Calculate second verifier digit
  rest = values.slice(0, 10).reduce((s, n, i) => s + n * (11 - i), 0);
  let d2 = (rest * 10) % 11;
  if (d2 === 10 || d2 === 11) d2 = 0;
  if (d2 !== values[10]) return false;

  return true;
};
