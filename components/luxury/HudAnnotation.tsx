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
  color = 'rgba(242, 242, 242, 0.22)'
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
  index?: string; // e.g. "01 / 08"
  objectName: string;
  material?: string;
  status?: string;
  coordinates?: string;
  price?: number;
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
  align = 'left'
}: HudLabelProps) {
  return (
    <div
      className={`font-mono text-[10px] uppercase tracking-[0.14em] space-y-1.5 p-3.5 bg-[#0A0F0C]/85 border border-[rgba(242,242,242,0.10)] backdrop-blur-md rounded-[2px] ${
        align === 'right' ? 'text-right' : 'text-left'
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-4 text-[#6C8F72] border-b border-[rgba(242,242,242,0.08)] pb-1">
        {index && <span>INDEX {index}</span>}
        <span className="flex items-center space-x-1.5 ml-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6C8F72] animate-pulse" />
          <span className="text-[#9AA39D]">{status}</span>
        </span>
      </div>

      <div className="text-[#F2F2F2] font-semibold tracking-[0.12em] line-clamp-1">
        {objectName}
      </div>

      <div className="text-[#9AA39D] text-[9px] tracking-[0.1em]">
        {material}
      </div>

      {(price || coordinates) && (
        <div className="flex items-center justify-between text-[9px] pt-1 text-[#9AA39D] border-t border-[rgba(242,242,242,0.06)]">
          {coordinates && <span>GEO // {coordinates}</span>}
          {price && (
            <span className="text-[#F2F2F2] font-bold ml-auto">
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
}

export function LeaderLine({
  className = '',
  direction = 'to-right',
  length = 80,
  label
}: LeaderLineProps) {
  return (
    <div
      className={`pointer-events-none flex items-center select-none ${
        direction === 'to-left' ? 'flex-row-reverse' : 'flex-row'
      } ${className}`}
      aria-hidden="true"
    >
      {/* Anchor dot */}
      <span className="w-1.5 h-1.5 rounded-full bg-[#6C8F72] ring-2 ring-[#6C8F72]/30 flex-shrink-0" />
      {/* Hairline connector */}
      <span
        className="h-px bg-gradient-to-r from-[#6C8F72] via-[rgba(242,242,242,0.25)] to-transparent"
        style={{ width: length }}
      />
      {label && (
        <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-[#9AA39D] px-2 whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  );
}
