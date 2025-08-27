/**
 * Componente de Input com validação, máscaras e feedback visual
 */

import React, { forwardRef } from 'react';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface ValidatedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  error?: string;
  isValid?: boolean;
  isTouched?: boolean;
  type?: 'text' | 'email' | 'phone' | 'cep' | 'document' | 'password';
  mask?: 'phone' | 'cep' | 'cpf' | 'cnpj' | 'document';
  showValidation?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
}

const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({
    label,
    error,
    isValid = true,
    isTouched = false,
    type = 'text',
    showValidation = true,
    helperText,
    leftIcon,
    rightIcon,
    variant = 'outline',
    size = 'md',
    className,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    
    // Determinar o tipo real do input
    const inputType = type === 'password' 
      ? (showPassword ? 'text' : 'password')
      : ['phone', 'cep', 'document'].includes(type) 
        ? 'text' 
        : type;

    // Classes base do input
    const baseClasses = [
      'w-full transition-all duration-200 focus:outline-none focus:ring-2',
      'disabled:opacity-50 disabled:cursor-not-allowed'
    ];

    // Classes de variante
    const variantClasses = {
      default: 'border-0 border-b-2 bg-transparent focus:border-blue-500',
      outline: 'border border-gray-300 rounded-lg bg-white focus:border-blue-500',
      filled: 'border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500'
    };

    // Classes de tamanho
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg'
    };

    // Classes de estado de validação
    const validationClasses = showValidation && isTouched
      ? error
        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
        : isValid
          ? 'border-green-500 focus:border-green-500 focus:ring-green-200'
          : ''
      : '';

    // Classes de padding para ícones
    const iconPaddingClasses = [
      leftIcon ? 'pl-12' : '',
      (rightIcon || type === 'password' || (showValidation && isTouched)) ? 'pr-12' : ''
    ].filter(Boolean).join(' ');

    const inputClasses = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      validationClasses,
      iconPaddingClasses,
      className
    );

    // Ícone de validação
    const ValidationIcon = () => {
      if (!showValidation || !isTouched) return null;
      
      if (error) {
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      } else if (isValid) {
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      }
      
      return null;
    };

    // Ícone de senha
    const PasswordIcon = () => {
      if (type !== 'password') return null;
      
      const Icon = showPassword ? EyeOff : Eye;
      return (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          tabIndex={-1}
        >
          <Icon className="h-5 w-5" />
        </button>
      );
    };

    // Placeholder baseado no tipo
    const getPlaceholder = () => {
      if (props.placeholder) return props.placeholder;
      
      switch (type) {
        case 'email':
          return 'exemplo@email.com';
        case 'phone':
          return '(11) 99999-9999';
        case 'cep':
          return '00000-000';
        case 'document':
          return 'CPF ou CNPJ';
        default:
          return undefined;
      }
    };

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label 
            htmlFor={props.id}
            className={cn(
              "block text-sm font-medium transition-colors",
              error && isTouched ? "text-red-700" : "text-gray-700"
            )}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Ícone Esquerdo */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={inputType}
            placeholder={getPlaceholder()}
            className={inputClasses}
            {...props}
          />

          {/* Ícones Direitos */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {rightIcon}
            <PasswordIcon />
            <ValidationIcon />
          </div>
        </div>

        {/* Texto de Ajuda e Erro */}
        <div className="min-h-[1.25rem]">
          {error && isTouched ? (
            <p className="text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </p>
          ) : helperText ? (
            <p className="text-sm text-gray-500">{helperText}</p>
          ) : null}
        </div>
      </div>
    );
  }
);

ValidatedInput.displayName = 'ValidatedInput';

export default ValidatedInput;