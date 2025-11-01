import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import { ArrowLeft, X } from 'lucide-react';

interface BackButtonProps {
  to?: string | number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  className?: string;
  onClick?: () => void;
  kind?: 'back' | 'close';
  iconOnly?: boolean;
}

export default function BackButton({
  to,
  label,
  size = 'sm',
  variant = 'ghost',
  className = '',
  onClick,
  kind = 'back',
  iconOnly,
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    onClick?.();

    const resolvedTo =
      kind === 'back'
        ? (to ?? '/')
        : (to ?? null);

    if (typeof resolvedTo === 'number') {
      navigate(resolvedTo);
    } else if (typeof resolvedTo === 'string') {
      navigate(resolvedTo);
    }
  };

  const isIconOnly = iconOnly ?? (kind === 'close');
  const displayLabel = label ?? (kind === 'back' ? 'Voltar' : 'Fechar');

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      icon={kind === 'close' ? X : ArrowLeft}
      onClick={handleClick}
      className={className}
    >
      {isIconOnly ? (
        <span className="sr-only">{displayLabel}</span>
      ) : (
        displayLabel
      )}
    </Button>
  );
}
