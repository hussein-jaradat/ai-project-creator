import obrainLogo from '@/assets/obrain-logo.png';

interface OBrainLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

export function OBrainLogo({ size = 'md', className = '' }: OBrainLogoProps) {
  return (
    <img 
      src={obrainLogo} 
      alt="OBrain Logo" 
      className={`${sizes[size]} object-contain ${className}`}
    />
  );
}
