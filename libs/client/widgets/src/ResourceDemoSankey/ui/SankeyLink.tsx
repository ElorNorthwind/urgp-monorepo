import { Component, useRef, useState } from 'react';
import { Layer } from 'recharts';

const SankeyLink = ({
  sourceX,
  targetX,
  sourceY,
  targetY,
  sourceControlX,
  targetControlX,
  linkWidth,
  index,
  payload,
  config,
}: any) => {
  // const linkRef = useRef(null);
  const [mouseOn, setMouseOn] = useState(false);
  if (payload?.dource?.hidden || payload?.target?.hidden) return null;
  return (
    <Layer key={`CustomLink${index}`}>
      <defs>
        <linearGradient id={`linkGradient${index}`}>
          <stop
            offset="0%"
            stopColor={
              config?.[payload.source.name]?.color || 'rgba(0, 136, 254, 0.5)'
            }
          />
          <stop
            offset="100%"
            stopColor={
              config?.[payload.target.name]?.color || 'rgba(0, 197, 159, 0.3)'
            }
          />
        </linearGradient>
      </defs>

      <path
        d={`
          M${sourceX},${sourceY + linkWidth / 2}
          C${sourceControlX},${sourceY + linkWidth / 2}
            ${targetControlX},${targetY + linkWidth / 2}
            ${targetX},${targetY + linkWidth / 2}
          L${targetX},${targetY - linkWidth / 2}
          C${targetControlX},${targetY - linkWidth / 2}
            ${sourceControlX},${sourceY - linkWidth / 2}
            ${sourceX},${sourceY - linkWidth / 2}
          Z
        `}
        // ref={linkRef}
        fill={`url(#linkGradient${index})`}
        // stroke={`url(#linkGradient${index})`}
        fillOpacity={mouseOn ? 0.6 : 0.3}
        strokeWidth="1"
        onMouseEnter={() => {
          setMouseOn(true);
        }}
        onMouseLeave={() => {
          setMouseOn(false);
        }}
      />
    </Layer>
  );
};

export { SankeyLink };
