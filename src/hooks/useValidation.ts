/**
 * Hook customizado para gerenciar inputs com validação e máscaras
 */

import { useState, useCallback } from 'react';
import {
  ValidationResult,
  FormValidationErrors,
  sanitizeString,
  maskPhone,
  maskCEP,
  maskCPFOrCNPJ,
  validateEmail,
  validatePhone,
  validateCEP,
  validateCPFOrCNPJ
} from '@/utils/validation';

export interface InputState {
  value: string;
  error?: string;
  isValid: boolean;
  isTouched: boolean;
}

export interface UseValidatedInputProps {
  initialValue?: string;
  type?: 'text' | 'email' | 'phone' | 'cep' | 'document';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  customValidator?: (value: string) => ValidationResult;
}

/**
 * Hook para um input individual com validação
 */
export function useValidatedInput({
  initialValue = '',
  type = 'text',
  required = false,
  minLength,
  maxLength,
  customValidator
}: UseValidatedInputProps) {
  const [state, setState] = useState<InputState>({
    value: initialValue,
    isValid: !required || initialValue.length > 0,
    isTouched: false
  });

  const validate = useCallback((value: string): ValidationResult => {
    // Sanitizar primeiro
    const sanitizedValue = sanitizeString(value);
    
    // Verificar se é obrigatório
    if (required && !sanitizedValue.trim()) {
      return { isValid: false, message: 'Este campo é obrigatório' };
    }
    
    // Se não é obrigatório e está vazio, é válido
    if (!required && !sanitizedValue.trim()) {
      return { isValid: true };
    }
    
    // Verificar tamanho mínimo
    if (minLength && sanitizedValue.length < minLength) {
      return { isValid: false, message: `Mínimo de ${minLength} caracteres` };
    }
    
    // Verificar tamanho máximo
    if (maxLength && sanitizedValue.length > maxLength) {
      return { isValid: false, message: `Máximo de ${maxLength} caracteres` };
    }
    
    // Validações específicas por tipo
    switch (type) {
      case 'email':
        return validateEmail(sanitizedValue);
      case 'phone':
        return validatePhone(sanitizedValue);
      case 'cep':
        return validateCEP(sanitizedValue);
      case 'document':
        return validateCPFOrCNPJ(sanitizedValue);
      default:
        break;
    }
    
    // Validador customizado
    if (customValidator) {
      return customValidator(sanitizedValue);
    }
    
    return { isValid: true };
  }, [type, required, minLength, maxLength, customValidator]);

  const applyMask = useCallback((value: string): string => {
    switch (type) {
      case 'phone':
        return maskPhone(value);
      case 'cep':
        return maskCEP(value);
      case 'document':
        return maskCPFOrCNPJ(value);
      default:
        return value;
    }
  }, [type]);

  const setValue = useCallback((newValue: string) => {
    // Aplicar máscara se necessário
    const maskedValue = applyMask(newValue);
    
    // Sanitizar
    const sanitizedValue = sanitizeString(maskedValue);
    
    // Validar
    const validation = validate(sanitizedValue);
    
    setState({
      value: sanitizedValue,
      error: validation.isValid ? undefined : validation.message,
      isValid: validation.isValid,
      isTouched: true
    });
  }, [applyMask, validate]);

  const setTouched = useCallback(() => {
    setState(prev => ({ ...prev, isTouched: true }));
  }, []);

  const reset = useCallback(() => {
    setState({
      value: initialValue,
      isValid: !required || initialValue.length > 0,
      isTouched: false
    });
  }, [initialValue, required]);

  return {
    ...state,
    setValue,
    setTouched,
    reset,
    displayError: state.isTouched && state.error
  };
}

/**
 * Hook para gerenciar um formulário completo com validações
 */
export interface UseValidatedFormProps<T> {
  initialValues: T;
  validationRules?: Partial<Record<keyof T, UseValidatedInputProps>>;
  onSubmit?: (values: T) => void | Promise<void>;
}

export function useValidatedForm<T extends Record<string, unknown>>({
  initialValues,
  validationRules = {},
  onSubmit
}: UseValidatedFormProps<T>) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const validateField = useCallback((fieldName: keyof T, value: string): ValidationResult => {
    const rules = validationRules[fieldName];
    if (!rules) return { isValid: true };

    // Sanitizar
    const sanitizedValue = sanitizeString(value);

    // Verificar se é obrigatório
    if (rules.required && !sanitizedValue.trim()) {
      return { isValid: false, message: 'Este campo é obrigatório' };
    }

    // Se não é obrigatório e está vazio, é válido
    if (!rules.required && !sanitizedValue.trim()) {
      return { isValid: true };
    }

    // Verificar tamanho
    if (rules.minLength && sanitizedValue.length < rules.minLength) {
      return { isValid: false, message: `Mínimo de ${rules.minLength} caracteres` };
    }

    if (rules.maxLength && sanitizedValue.length > rules.maxLength) {
      return { isValid: false, message: `Máximo de ${rules.maxLength} caracteres` };
    }

    // Validações por tipo
    switch (rules.type) {
      case 'email':
        return validateEmail(sanitizedValue);
      case 'phone':
        return validatePhone(sanitizedValue);
      case 'cep':
        return validateCEP(sanitizedValue);
      case 'document':
        return validateCPFOrCNPJ(sanitizedValue);
      default:
        break;
    }

    // Validador customizado
    if (rules.customValidator) {
      return rules.customValidator(sanitizedValue);
    }

    return { isValid: true };
  }, [validationRules]);

  const updateField = useCallback((fieldName: keyof T, value: string) => {
    // Aplicar máscara se necessário
    const rules = validationRules[fieldName];
    let processedValue = value;

    if (rules?.type) {
      switch (rules.type) {
        case 'phone':
          processedValue = maskPhone(value);
          break;
        case 'cep':
          processedValue = maskCEP(value);
          break;
        case 'document':
          processedValue = maskCPFOrCNPJ(value);
          break;
      }
    }

    // Sanitizar
    const sanitizedValue = sanitizeString(processedValue);

    // Atualizar dados do formulário
    setFormData(prev => ({
      ...prev,
      [fieldName]: sanitizedValue
    } as T));

    // Validar campo se já foi tocado
    if (touchedFields.has(String(fieldName))) {
      const validation = validateField(fieldName, sanitizedValue);
      setErrors(prev => {
        const newErrors = { ...prev };
        if (validation.isValid) {
          delete newErrors[String(fieldName)];
        } else {
          newErrors[String(fieldName)] = validation.message;
        }
        return newErrors;
      });
    }
  }, [validationRules, touchedFields, validateField]);

  const touchField = useCallback((fieldName: keyof T) => {
    setTouchedFields(prev => new Set(prev).add(String(fieldName)));
    
    // Validar campo quando for tocado
    const value = String(formData[fieldName] || '');
    const validation = validateField(fieldName, value);
    setErrors(prev => {
      const newErrors = { ...prev };
      if (validation.isValid) {
        delete newErrors[String(fieldName)];
      } else {
        newErrors[String(fieldName)] = validation.message;
      }
      return newErrors;
    });
  }, [formData, validateField]);

  const validateAllFields = useCallback((): boolean => {
    const newErrors: FormValidationErrors = {};
    let isValid = true;

    // Marcar todos os campos como tocados
    const allFieldNames = Object.keys(formData);
    setTouchedFields(new Set(allFieldNames));

    // Validar cada campo
    for (const fieldName of allFieldNames) {
      const value = String(formData[fieldName] || '');
      const validation = validateField(fieldName as keyof T, value);
      
      if (!validation.isValid) {
        newErrors[fieldName] = validation.message!;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [formData, validateField]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Validar todos os campos
      const isValid = validateAllFields();
      
      if (isValid && onSubmit) {
        // Sanitizar dados completos antes do envio
        const sanitizedData = Object.keys(formData).reduce((acc, key) => {
          const value = formData[key as keyof T];
          (acc as Record<string, unknown>)[key] = typeof value === 'string' ? sanitizeString(value) : value;
          return acc;
        }, {} as T);
        
        await onSubmit(sanitizedData);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateAllFields, onSubmit, isSubmitting]);

  const reset = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
    setTouchedFields(new Set());
    setIsSubmitting(false);
  }, [initialValues]);

  const isFieldValid = useCallback((fieldName: keyof T): boolean => {
    return !errors[String(fieldName)];
  }, [errors]);

  const getFieldError = useCallback((fieldName: keyof T): string | undefined => {
    const fieldKey = String(fieldName);
    return touchedFields.has(fieldKey) ? errors[fieldKey] : undefined;
  }, [errors, touchedFields]);

  const isFormValid = useCallback((): boolean => {
    return Object.keys(errors).length === 0 && touchedFields.size > 0;
  }, [errors, touchedFields]);

  return {
    formData,
    errors,
    isSubmitting,
    touchedFields,
    updateField,
    touchField,
    handleSubmit,
    reset,
    isFieldValid,
    getFieldError,
    isFormValid,
    validateAllFields
  };
}