import React from 'react';

const toPascal = (s) =>
  String(s)
    .replace(/(^\w|[-_\s]\w)/g, (m) => m.replace(/[-_\s]/, '').toUpperCase());

/**
 * Lucide icon wrapper (the brand's specified icon system).
 * Requires the Lucide UMD script to be loaded on the page:
 *   <script src="https://unpkg.com/lucide@latest"></script>
 * Renders inline <svg> from lucide.icons so it survives re-renders.
 */
export function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 2, style = {}, ...rest }) {
  const lib = (typeof window !== 'undefined' && window.lucide && window.lucide.icons) || {};
  const node = lib[toPascal(name)];

  const svgProps = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    style: { display: 'inline-block', flexShrink: 0, verticalAlign: 'middle', ...style },
    ...rest,
  };

  if (!node) return React.createElement('svg', svgProps);

  const children = node.map(([tag, attrs], i) => React.createElement(tag, { key: i, ...attrs }));
  return React.createElement('svg', svgProps, children);
}
