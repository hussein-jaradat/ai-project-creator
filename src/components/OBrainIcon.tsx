import obrainLogo from '@/assets/obrain-logo.png';

interface OBrainIconProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export function OBrainIcon({ size = 'md', className = '' }: OBrainIconProps) {
  return (
    <div 
      className={`${sizes[size]} rounded-full overflow-hidden bg-background/50 flex items-center justify-center ${className}`}
    >
      <img 
        src={obrainLogo} 
        alt="OBrain" 
        className="h-[140%] w-auto object-cover object-left scale-110"
        style={{ marginLeft: '-5%' }}
      />
    </div>
  );
}
