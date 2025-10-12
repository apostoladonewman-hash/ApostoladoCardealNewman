import { useMemo } from 'react';
import { validatePassword, type PasswordValidationResult } from '@/utils/password-validation';

interface PasswordStrengthMeterProps {
  password: string;
  showRequirements?: boolean;
}

export const PasswordStrengthMeter = ({
  password,
  showRequirements = true
}: PasswordStrengthMeterProps) => {
  const validation: PasswordValidationResult = useMemo(
    () => validatePassword(password),
    [password]
  );

  if (!password) return null;

  const getStrengthColor = () => {
    switch (validation.strength) {
      case 'strong':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'weak':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStrengthWidth = () => {
    switch (validation.strength) {
      case 'strong':
        return 'w-full';
      case 'medium':
        return 'w-2/3';
      case 'weak':
        return 'w-1/3';
      default:
        return 'w-0';
    }
  };

  const getStrengthText = () => {
    switch (validation.strength) {
      case 'strong':
        return 'Forte';
      case 'medium':
        return 'Média';
      case 'weak':
        return 'Fraca';
      default:
        return '';
    }
  };

  const requirements = [
    { text: 'Mínimo 8 caracteres', met: password.length >= 8 },
    { text: 'Uma letra maiúscula', met: /[A-Z]/.test(password) },
    { text: 'Uma letra minúscula', met: /[a-z]/.test(password) },
    { text: 'Um número', met: /[0-9]/.test(password) },
    { text: 'Um caractere especial (!@#$%...)', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  return (
    <div className="space-y-2 mt-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Força da senha:</span>
          <span className={`font-medium ${
            validation.strength === 'strong' ? 'text-green-600' :
            validation.strength === 'medium' ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {getStrengthText()}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor()} ${getStrengthWidth()}`}
          />
        </div>
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <div className="space-y-1 text-sm">
          {requirements.map((req, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 ${req.met ? 'text-green-600' : 'text-gray-500'}`}
            >
              <span className="text-lg leading-none">
                {req.met ? '✓' : '○'}
              </span>
              <span>{req.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {!validation.valid && validation.message && (
        <p className="text-sm text-red-600 mt-1">
          {validation.message}
        </p>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
