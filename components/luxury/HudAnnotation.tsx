'use client';

import React from 'react';

// =========================================================================
// CORNER BRACKETS: Hairline architectural corners framing items
// =========================================================================
interface CornerBracketsProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function CornerBrackets({
  className = '',
  size = 12,
  strokeWidth = 1,
  color = 'rgba(15, 46, 32, 0.25)'
}: CornerBracketsProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 select-none ${className}`}
      aria-hidden="true"
    >
      {/* Top Left */}
      <span
        className="absolute top-0 left-0 border-t border-l"
        style={{
          width: size,
          height: size,
          borderColor: color,
          borderWidth: strokeWidth
        }}
      />
      {/* Top Right */}
      <span
        className="absolute top-0 right-0 border-t border-r"
        style={{
          width: size,
          height: size,
          borderColor: color,
          borderWidth: strokeWidth
        }}
      />
      {/* Bottom Left */}
      <span
        className="absolute bottom-0 left-0 border-b border-l"
        style={{
          width: size,
          height: size,
          borderColor: color,
          borderWidth: strokeWidth
        }}
      />
      {/* Bottom Right */}
      <span
        className="absolute bottom-0 right-0 border-b border-r"
        style={{
          width: size,
          height: size,
          borderColor: color,
          borderWidth: strokeWidth
        }}
      />
    </div>
  );
}

// =========================================================================
// HUD SPEC-STYLE LABEL STACK: OBJECT / MATERIAL / STATUS with real data
// =========================================================================
interface HudLabelProps {
  className?: string;
  index?: string;
  objectName: string;
  material?: string;
  status?: string;
  coordinates?: string;
  price?: number;
  theme?: 'light' | 'emerald';
  align?: 'left' | 'right';
}

export function HudLabel({
  className = '',
  index,
  objectName,
  material = 'SOLID 925 STERLING SILVER',
  status = 'HALLMARK CERTIFIED',
  coordinates,
  price,
  theme = 'light',
  align = 'left'
}: HudLabelProps) {
  const isLight = theme === 'light';

  return (
    <div
      className={`font-mono text-[10px] uppercase tracking-[0.14em] space-y-1.5 p-3.5 backdrop-blur-md rounded-[2px] ${
        isLight
          ? 'bg-white/90 border border-line text-ink shadow-[0_4px_20px_rgba(15,46,32,0.06)]'
          : 'bg-forest/85 border border-[rgba(228,231,234,0.18)] text-white shadow-[0_4px_24px_rgba(15,46,32,0.25)]'
      } ${align === 'right' ? 'text-right' : 'text-left'} ${className}`}
    >
      <div
        className={`flex items-center justify-between gap-4 border-b pb-1 ${
          isLight ? 'text-green border-line' : 'text-green-soft border-[rgba(228,231,234,0.12)]'
        }`}
      >
        {index && <span>INDEX {index}</span>}
        <span className="flex items-center space-x-1.5 ml-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
          <span className={isLight ? 'text-sage' : 'text-silver'}>{status}</span>
        </span>
      </div>

      <div className={`font-semibold tracking-[0.12em] line-clamp-1 ${isLight ? 'text-ink' : 'text-white'}`}>
        {objectName}
      </div>

      <div className={`text-[9px] tracking-[0.1em] ${isLight ? 'text-sage' : 'text-silver'}`}>
        {material}
      </div>

      {(price || coordinates) && (
        <div
          className={`flex items-center justify-between text-[9px] pt-1 border-t ${
            isLight ? 'text-sage border-line' : 'text-silver border-[rgba(228,231,234,0.08)]'
          }`}
        >
          {coordinates && <span>GEO // {coordinates}</span>}
          {price && (
            <span className={`font-bold ml-auto ${isLight ? 'text-emerald' : 'text-white'}`}>
              ₹{price.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// =========================================================================
// LEADER LINE: Hairline diagonal or elbow connecting line with dot
// =========================================================================
interface LeaderLineProps {
  className?: string;
  direction?: 'to-right' | 'to-left';
  length?: number;
  label?: string;
  theme?: 'light' | 'emerald';
}

export function LeaderLine({
  className = '',
  direction = 'to-right',
  length = 80,
  label,
  theme = 'light'
}: LeaderLineProps) {
  const isLight = theme === 'light';

  return (
    <div
      className={`pointer-events-none flex items-center select-none ${
        direction === 'to-left' ? 'flex-row-reverse' : 'flex-row'
      } ${className}`}
      aria-hidden="true"
    >
      {/* Anchor dot */}
      <span className="w-1.5 h-1.5 rounded-full bg-green ring-2 ring-green/30 flex-shrink-0" />
      {/* Hairline connector */}
      <span
        className={`h-px ${
          isLight
            ? 'bg-gradient-to-r from-green via-sage to-transparent'
            : 'bg-gradient-to-r from-green via-silver to-transparent'
        }`}
        style={{ width: length }}
      />
      {label && (
        <span
          className={`text-[9px] font-mono uppercase tracking-[0.14em] px-2 whitespace-nowrap ${
            isLight ? 'text-ink' : 'text-silver'
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
}
