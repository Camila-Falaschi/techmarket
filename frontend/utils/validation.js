// Remove tudo que não é dígito
export function onlyDigits(str = '') {
  return (str || '').toString().replace(/\D/g, '');
}

// CPF validation (11 digits, check digits)
export function validateCPF(cpfRaw) {
  const cpf = onlyDigits(cpfRaw);
  if (!cpf || cpf.length !== 11) return false;
  // rejects same digit sequences
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

// Date of birth validation: accepts YYYY-MM-DD or DD/MM/YYYY
export function validateBirthDate(dateStr) {
  if (!dateStr) return false;
  // normalize separators
  const isoPattern = /^\d{4}-\d{2}-\d{2}$/;
  const brPattern = /^\d{2}\/\d{2}\/\d{4}$/;

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

  // Check constructed date matches components (avoid 31/02 -> rolls over)
  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
    return false;
  }

  const now = new Date();
  // Not in the future
  if (date > now) return false;

  // Reasonable age: 0 < age <= 120
  const age = now.getFullYear() - year - ((now.getMonth() < month - 1 || (now.getMonth() === month - 1 && now.getDate() < day)) ? 1 : 0);
  if (age < 0 || age > 120) return false;

  return true;
}

// Phone validation: after removing non-digits, must be 10 or 11 digits (BR)
export function validatePhone(phoneRaw) {
  const phone = onlyDigits(phoneRaw);
  if (!phone) return false;
  // Accept 10 (landline + DDD) or 11 (mobile with 9)
  if (phone.length !== 10 && phone.length !== 11) return false;
  // DDD cannot start with 0
  const ddd = phone.slice(0, 2);
  if (/^0/.test(ddd)) return false;
  return true;
}