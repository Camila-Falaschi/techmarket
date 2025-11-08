// Remove tudo que não é dígito
export function onlyDigits(str = '') {
  return (str || '').toString().replace(/\D/g, '');
}

// Validação de CPF (11 dígitos, dígitos verificadores)
export function validateCPF(cpfRaw) {
  const cpf = onlyDigits(cpfRaw);
  if (!cpf || cpf.length !== 11) return false;
  // Rejeita sequências de dígitos iguais (ex: 111.111.111-11)
  if (/^(\d)\1+$/.test(cpf)) return false;

  const toInt = (s) => parseInt(s, 10);

  const calcCheck = (slice) => {
    let sum = 0;
    for (let i = 0; i < slice.length; i++) {
      sum += toInt(slice[i]) * (slice.length + 1 - i);
    }
    const res = (sum * 10) % 11;
    return res === 10 ? 0 : res;
  };

  const dv1 = calcCheck(cpf.slice(0, 9));
  const dv2 = calcCheck(cpf.slice(0, 9) + dv1);

  return dv1 === toInt(cpf[9]) && dv2 === toInt(cpf[10]);
}

// Validação da Data de Nascimento: aceita YYYY-MM-DD ou DD/MM/YYYY
export function validateBirthDate(dateStr) {
  if (!dateStr) return false;
  // Padrões Regex para os formatos ISO (Americano) e BR (Brasileiro)
  const isoPattern = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
  const brPattern = /^\d{2}\/\d{2}\/\d{4}$/; // DD/MM/AAAA

  let year, month, day;

  if (isoPattern.test(dateStr)) {
    [year, month, day] = dateStr.split('-').map((s) => parseInt(s, 10));
  } else if (brPattern.test(dateStr)) {
    [day, month, year] = dateStr.split('/').map((s) => parseInt(s, 10));
  } else {
    return false;
  }

  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return false;

  // Checagem extra: garante que o Date não "corrigiu" uma data inválida
  // (ex: 31/02/2000 viraria 02/03/2000. Isso impede essa "correção")
  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
    return false;
  }

  const now = new Date();
  // Não pode ser uma data no futuro
  if (date > now) return false;

  // Validação de idade razoável (entre 0 e 120 anos)
  const age = now.getFullYear() - year - ((now.getMonth() < month - 1 || (now.getMonth() === month - 1 && now.getDate() < day)) ? 1 : 0);
  if (age < 0 || age > 120) return false;

  return true;
}

// Validação de Telefone: após remover não-dígitos, deve ter 10 ou 11 dígitos (BR)
export function validatePhone(phoneRaw) {
  const phone = onlyDigits(phoneRaw);
  if (!phone) return false;
  // Aceita 10 (fixo + DDD) ou 11 (móvel com 9 + DDD)
  if (phone.length !== 10 && phone.length !== 11) return false;
  // O DDD (dois primeiros dígitos) não pode começar com 0
  const ddd = phone.slice(0, 2);
  if (/^0/.test(ddd)) return false;
  return true;
}

// Validação de Email (básica)
export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email.trim());
}

// --- Funções de Máscara (Formatação) ---
export function maskCPF(value) {
  const digits = onlyDigits(value);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

export function maskPhone(value) {
  const digits = onlyDigits(value);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export function maskDate(value) {
  const digits = onlyDigits(value);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
}

export function maskMoney(value) {
  const num = parseFloat(value) || 0;
  return num.toFixed(2).replace('.', ',');
}