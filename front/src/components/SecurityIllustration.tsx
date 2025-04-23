import React from 'react';

const SecurityIllustration: React.FC = () => {
  return (
    <div className="text-white w-full">
      <svg 
        className="w-full h-auto max-w-md mx-auto" 
        viewBox="0 0 800 600" 
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(400, 300)">
          <path d="M-180,-80 L0,-180 L180,-80 L180,80 L0,180 L-180,80 Z" fill="rgba(255, 255, 255, 0.2)"/>
          <circle cx="0" cy="0" r="120" fill="rgba(255, 255, 255, 0.3)"/>
          <path d="M-40,-100 L40,-100 L40,100 L-40,100 Z" fill="rgba(255, 255, 255, 0.4)"/>
          <path d="M-90,-30 L-30,-90 L90,30 L30,90 Z" fill="rgba(255, 255, 255, 0.2)"/>
          <circle cx="0" cy="0" r="60" fill="rgba(255, 255, 255, 0.5)"/>
        </g>
        <text x="400" y="500" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">
          Secure Login Portal
        </text>
      </svg>
      <div className="mt-4 text-center">
        <h3 className="text-xl lg:text-2xl font-bold">Secure Login</h3>
        <p className="mt-2 text-sm lg:text-base opacity-80 max-w-xs mx-auto">
          Your data is protected with enterprise-grade security.
        </p>
      </div>
    </div>
  );
};

export default SecurityIllustration;