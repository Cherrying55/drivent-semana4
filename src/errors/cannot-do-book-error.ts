import { ApplicationError } from '@/protocols';

export function cannotdobookingerror(): ApplicationError {
  return {
    name: 'Cannot do booking',
    message: 'Impossivel reservar esse quarto',
  };
}