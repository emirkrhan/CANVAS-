import React from 'react';

interface WireframeIconProps {
  id: string;
  isActive: boolean;
}

interface ContainerProps {
  children?: React.ReactNode;
  strokeColor: string;
  fillColor: string;
}

const Container: React.FC<ContainerProps> = ({ children, strokeColor, fillColor }) => (
  <svg viewBox="0 0 200 130" className="w-full h-full drop-shadow-sm transition-all duration-300">
    <rect x="2" y="2" width="196" height="126" rx="6" fill="#fff" stroke={strokeColor} strokeWidth="2" />
    <line x1="2" y1="20" x2="198" y2="20" stroke={strokeColor} strokeWidth="2" />
    <circle cx="12" cy="11" r="2" fill={fillColor} />
    <circle cx="20" cy="11" r="2" fill={fillColor} />
    <circle cx="28" cy="11" r="2" fill={fillColor} />
    {children}
  </svg>
);

export const WireframeIcon: React.FC<WireframeIconProps> = ({ id, isActive }) => {
  const strokeColor = isActive ? "#5247e6" : "#cbd5e1"; // Primary vs Neutral-300
  const fillColor = isActive ? "#5247e6" : "#94a3b8"; // Primary vs Neutral-400
  
  switch (id) {
    case 'clinical-trial':
      return (
        <Container strokeColor={strokeColor} fillColor={fillColor}>
          <rect x="12" y="30" width="38" height="90" rx="2" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          <rect x="58" y="30" width="38" height="90" rx="2" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          <rect x="104" y="30" width="38" height="90" rx="2" fill={isActive ? `${fillColor}30` : "none"} stroke={strokeColor} strokeWidth="1.5" />
          <rect x="150" y="30" width="38" height="90" rx="2" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          <line x1="12" y1="50" x2="50" y2="50" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 2" />
          <line x1="58" y1="50" x2="96" y2="50" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 2" />
          {/* Active indicator */}
          <rect x="108" y="60" width="30" height="2" rx="1" fill={fillColor} />
        </Container>
      );
    case 'meta-analysis':
      return (
        <Container strokeColor={strokeColor} fillColor={fillColor}>
           {/* Columns */}
           <rect x="12" y="30" width="54" height="90" rx="2" fill="none" stroke={strokeColor} strokeWidth="1.5" />
           <rect x="73" y="30" width="54" height="90" rx="2" fill={isActive ? `${fillColor}30` : "none"} stroke={strokeColor} strokeWidth="1.5" />
           <rect x="134" y="30" width="54" height="90" rx="2" fill="none" stroke={strokeColor} strokeWidth="1.5" />
           {/* Forest Plot Representation */}
           <line x1="100" y1="40" x2="100" y2="110" stroke={strokeColor} strokeWidth="1" />
           <rect x="95" y="50" width="10" height="6" rx="1" fill={fillColor} />
           <rect x="92" y="70" width="16" height="6" rx="1" fill={fillColor} />
           <rect x="97" y="90" width="6" height="6" rx="1" fill={fillColor} />
        </Container>
      );
    case 'longitudinal-study':
      return (
        <Container strokeColor={strokeColor} fillColor={fillColor}>
          <line x1="20" y1="75" x2="180" y2="75" stroke={strokeColor} strokeWidth="2" />
          <circle cx="40" cy="75" r="8" fill="white" stroke={strokeColor} strokeWidth="2" />
          <circle cx="80" cy="75" r="8" fill="white" stroke={strokeColor} strokeWidth="2" />
          <circle cx="120" cy="75" r="8" fill="white" stroke={strokeColor} strokeWidth="2" />
          <circle cx="160" cy="75" r="8" fill={isActive ? fillColor : "white"} stroke={strokeColor} strokeWidth="2" />
          
          <rect x="30" y="45" width="20" height="4" rx="2" fill={strokeColor} opacity="0.3" />
          <rect x="70" y="45" width="20" height="4" rx="2" fill={strokeColor} opacity="0.3" />
          <rect x="110" y="45" width="20" height="4" rx="2" fill={strokeColor} opacity="0.3" />
          <rect x="150" y="45" width="20" height="4" rx="2" fill={fillColor} />
        </Container>
      );
    case 'comparative-study':
      return (
        <Container strokeColor={strokeColor} fillColor={fillColor}>
          <line x1="100" y1="30" x2="100" y2="120" stroke={strokeColor} strokeWidth="2" />
          <line x1="20" y1="75" x2="180" y2="75" stroke={strokeColor} strokeWidth="2" />
          
          {/* Quadrants */}
          <rect x="30" y="40" width="20" height="20" rx="4" fill={strokeColor} opacity="0.1" />
          <rect x="150" y="40" width="20" height="20" rx="4" fill={strokeColor} opacity="0.1" />
          
          {/* Charts */}
          <rect x="30" y="90" width="6" height="15" fill={fillColor} />
          <rect x="38" y="85" width="6" height="20" fill={fillColor} opacity="0.6" />
          <rect x="46" y="95" width="6" height="10" fill={fillColor} opacity="0.3" />

          <rect x="140" y="90" width="6" height="15" fill={fillColor} />
          <rect x="148" y="85" width="6" height="20" fill={fillColor} opacity="0.6" />
        </Container>
      );
    case 'cycle-process':
      return (
        <Container strokeColor={strokeColor} fillColor={fillColor}>
           {/* Circular arrows flow */}
           <path 
             d="M 100 40 A 35 35 0 0 1 135 75" 
             fill="none" stroke={strokeColor} strokeWidth="2" strokeDasharray="4 2"
           />
           <path 
             d="M 135 75 A 35 35 0 0 1 100 110" 
             fill="none" stroke={strokeColor} strokeWidth="2" strokeDasharray="4 2"
           />
           <path 
             d="M 100 110 A 35 35 0 0 1 65 75" 
             fill="none" stroke={strokeColor} strokeWidth="2" strokeDasharray="4 2"
           />
           <path 
             d="M 65 75 A 35 35 0 0 1 100 40" 
             fill="none" stroke={strokeColor} strokeWidth="2" strokeDasharray="4 2"
           />
           {/* Center Element */}
           <circle cx="100" cy="75" r="15" fill={isActive ? `${fillColor}30` : "none"} stroke={fillColor} strokeWidth="2" />
           {/* Nodes */}
           <circle cx="100" cy="40" r="4" fill={fillColor} />
           <circle cx="135" cy="75" r="4" fill={fillColor} />
           <circle cx="100" cy="110" r="4" fill={fillColor} />
           <circle cx="65" cy="75" r="4" fill={fillColor} />
        </Container>
      );
    case 'blank-canvas':
    default:
      return (
        <Container strokeColor={strokeColor} fillColor={fillColor}>
          <line x1="100" y1="50" x2="100" y2="100" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
          <line x1="50" y1="75" x2="150" y2="75" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
          <circle cx="100" cy="75" r="6" fill="none" stroke={fillColor} strokeWidth="1.5" />
          <line x1="100" y1="71" x2="100" y2="79" stroke={fillColor} strokeWidth="1.5" />
          <line x1="96" y1="75" x2="104" y2="75" stroke={fillColor} strokeWidth="1.5" />
        </Container>
      );
  }
};