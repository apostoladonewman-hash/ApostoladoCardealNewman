/**
 * Validação de senha forte
 * Requisitos:
 * - Mínimo 8 caracteres
 * - Pelo menos uma letra maiúscula
 * - Pelo menos uma letra minúscula
 * - Pelo menos um número
 * - Pelo menos um caractere especial
 */

export interface PasswordValidationResult {
  valid: boolean;
  message?: string;
  strength?: 'weak' | 'medium' | 'strong';
}

export const validatePassword = (
  password: string,
): PasswordValidationResult => {
  if (!password || password.length < 8) {
    return {
      valid: false,
      message: 'A senha deve ter no mínimo 8 caracteres',
      strength: 'weak',
    };
  }

  let strength = 0;

  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: 'A senha deve conter pelo menos uma letra maiúscula',
      strength: 'weak',
    };
  }
  strength++;

  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: 'A senha deve conter pelo menos uma letra minúscula',
      strength: 'weak',
    };
  }
  strength++;

  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: 'A senha deve conter pelo menos um número',
      strength: 'weak',
    };
  }
  strength++;

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      valid: false,
      message:
        'A senha deve conter pelo menos um caractere especial (!@#$%^&*(),.?":{}|<>)',
      strength: 'medium',
    };
  }
  strength++;

  // Determinar força da senha
  let passwordStrength: 'weak' | 'medium' | 'strong' = 'weak';
  if (strength >= 4) {
    passwordStrength = password.length >= 12 ? 'strong' : 'medium';
  }

  return {
    valid: true,
    strength: passwordStrength,
  };
};

export const getPasswordStrengthColor = (
  strength?: 'weak' | 'medium' | 'strong',
): string => {
  switch (strength) {
    case 'weak':
      return 'text-red-500';
    case 'medium':
      return 'text-yellow-500';
    case 'strong':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
};

export const getPasswordStrengthText = (
  strength?: 'weak' | 'medium' | 'strong',
): string => {
  switch (strength) {
    case 'weak':
      return 'Fraca';
    case 'medium':
      return 'Média';
    case 'strong':
      return 'Forte';
    default:
      return '';
  }
};
