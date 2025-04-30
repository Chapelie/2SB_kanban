import React from 'react';
interface ToggleSwitchProps {
  isOn: boolean;
  onChange: () => void;
  leftLabel?: string;
  rightLabel?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  isOn, 
  onChange, 
  leftLabel,
  rightLabel
}) => {

  return (
    <div className="flex items-center">
      {leftLabel && <span className="text-sm text-[var(--text-secondary)] mr-2">{leftLabel}</span>}
      <button 
        className={`relative inline-flex h-6 w-11 items-center rounded-full ${isOn ? 'bg-[var(--accent-color)]' : 'bg-[var(--border-color)]'}`}
        onClick={onChange}
        type="button"
        aria-pressed={isOn}
      >
        <span 
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isOn ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
      {rightLabel && <span className="text-sm text-[var(--text-secondary)] ml-2">{rightLabel}</span>}
    </div>
  );
};

export default ToggleSwitch;