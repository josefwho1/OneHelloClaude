import type { RemiExpression } from '../../types';

interface RemiProps {
  expression: RemiExpression;
  size?: number;
  className?: string;
}

export function Remi({ expression, size = 120, className = '' }: RemiProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body */}
        <ellipse cx="100" cy="130" rx="55" ry="50" fill="#8B7355" />
        <ellipse cx="100" cy="130" rx="40" ry="38" fill="#D4C4A8" />

        {/* Head */}
        <circle cx="100" cy="80" r="45" fill="#8B7355" />

        {/* Face mask */}
        <ellipse cx="100" cy="88" rx="32" ry="28" fill="#D4C4A8" />

        {/* Eye masks (raccoon markings) */}
        <ellipse cx="82" cy="75" rx="14" ry="10" fill="#4A3728" />
        <ellipse cx="118" cy="75" rx="14" ry="10" fill="#4A3728" />

        {/* Eyes */}
        {expression === 'celebrating' ? (
          <>
            <path d="M76 75 Q82 69 88 75" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M112 75 Q118 69 124 75" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="82" cy="75" r="5" fill="white" />
            <circle cx="118" cy="75" r="5" fill="white" />
            <circle
              cx={expression === 'curious' ? 84 : 82}
              cy={expression === 'curious' ? 74 : 75}
              r="2.5"
              fill="#333"
            />
            <circle
              cx={expression === 'curious' ? 120 : 118}
              cy={expression === 'curious' ? 74 : 75}
              r="2.5"
              fill="#333"
            />
            {/* Eye shine */}
            <circle cx="80" cy="73" r="1.5" fill="white" opacity="0.8" />
            <circle cx="116" cy="73" r="1.5" fill="white" opacity="0.8" />
          </>
        )}

        {/* Nose */}
        <ellipse cx="100" cy="88" rx="5" ry="3.5" fill="#333" />

        {/* Mouth */}
        {expression === 'celebrating' ? (
          <path d="M90 95 Q100 105 110 95" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : expression === 'curious' ? (
          <circle cx="100" cy="97" r="4" fill="#333" opacity="0.6" />
        ) : expression === 'understanding' ? (
          <path d="M92 96 Q100 100 108 96" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M92 95 Q100 102 108 95" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {/* Ears */}
        <ellipse cx="68" cy="48" rx="14" ry="16" fill="#8B7355" />
        <ellipse cx="132" cy="48" rx="14" ry="16" fill="#8B7355" />
        <ellipse cx="68" cy="48" rx="9" ry="10" fill="#D4C4A8" />
        <ellipse cx="132" cy="48" rx="9" ry="10" fill="#D4C4A8" />

        {/* Tail */}
        <path
          d="M145 140 Q170 120 165 100 Q160 80 175 70"
          stroke="#8B7355"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M145 140 Q170 120 165 100 Q160 80 175 70"
          stroke="#4A3728"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="12 12"
        />

        {/* Arms/Paws based on expression */}
        {expression === 'waving' ? (
          <>
            {/* Left arm resting */}
            <path d="M55 120 Q40 130 42 145" stroke="#8B7355" strokeWidth="10" fill="none" strokeLinecap="round" />
            {/* Right arm waving */}
            <path d="M145 110 Q160 95 155 75" stroke="#8B7355" strokeWidth="10" fill="none" strokeLinecap="round">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="-5 145 110"
                to="5 145 110"
                dur="0.5s"
                repeatCount="indefinite"
                values="-5 145 110; 5 145 110; -5 145 110"
                keyTimes="0; 0.5; 1"
              />
            </path>
            {/* Waving paw */}
            <circle cx="155" cy="75" r="7" fill="#D4C4A8">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="-5 145 110"
                to="5 145 110"
                dur="0.5s"
                repeatCount="indefinite"
                values="-5 145 110; 5 145 110; -5 145 110"
                keyTimes="0; 0.5; 1"
              />
            </circle>
          </>
        ) : expression === 'celebrating' ? (
          <>
            {/* Both arms up */}
            <path d="M55 115 Q35 90 45 70" stroke="#8B7355" strokeWidth="10" fill="none" strokeLinecap="round" />
            <circle cx="45" cy="70" r="7" fill="#D4C4A8" />
            <path d="M145 115 Q165 90 155 70" stroke="#8B7355" strokeWidth="10" fill="none" strokeLinecap="round" />
            <circle cx="155" cy="70" r="7" fill="#D4C4A8" />
          </>
        ) : expression === 'logging' ? (
          <>
            {/* Arms holding something */}
            <path d="M55 120 Q45 130 55 140" stroke="#8B7355" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M145 120 Q155 130 145 140" stroke="#8B7355" strokeWidth="10" fill="none" strokeLinecap="round" />
            {/* Notepad */}
            <rect x="75" y="125" width="50" height="35" rx="3" fill="white" stroke="#ccc" strokeWidth="1" />
            <line x1="82" y1="133" x2="118" y2="133" stroke="#ddd" strokeWidth="1" />
            <line x1="82" y1="140" x2="118" y2="140" stroke="#ddd" strokeWidth="1" />
            <line x1="82" y1="147" x2="105" y2="147" stroke="#ddd" strokeWidth="1" />
          </>
        ) : expression === 'shaking' ? (
          <>
            {/* Right arm extended for handshake */}
            <path d="M145 120 Q165 115 170 105" stroke="#8B7355" strokeWidth="10" fill="none" strokeLinecap="round" />
            <circle cx="170" cy="105" r="7" fill="#D4C4A8" />
            <path d="M55 120 Q40 130 42 145" stroke="#8B7355" strokeWidth="10" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            {/* Resting arms */}
            <path d="M55 120 Q40 130 42 145" stroke="#8B7355" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M145 120 Q160 130 158 145" stroke="#8B7355" strokeWidth="10" fill="none" strokeLinecap="round" />
          </>
        )}

        {/* Feet */}
        <ellipse cx="80" cy="172" rx="14" ry="8" fill="#4A3728" />
        <ellipse cx="120" cy="172" rx="14" ry="8" fill="#4A3728" />

        {/* Blush for celebrating/waving */}
        {(expression === 'celebrating' || expression === 'waving') && (
          <>
            <circle cx="72" cy="90" r="6" fill="#FFB5A0" opacity="0.4" />
            <circle cx="128" cy="90" r="6" fill="#FFB5A0" opacity="0.4" />
          </>
        )}
      </svg>
    </div>
  );
}
