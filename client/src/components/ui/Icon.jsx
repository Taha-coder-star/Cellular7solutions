import * as Icons from 'lucide-react';

function toPascal(s) {
  return String(s).replace(/(^\w|[-_\s]\w)/g, (m) => m.replace(/[-_\s]/, '').toUpperCase());
}

export function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 2, style = {}, ...rest }) {
  const IconComponent = Icons[toPascal(name)];
  const baseStyle = { display: 'inline-block', flexShrink: 0, verticalAlign: 'middle', ...style };

  if (!IconComponent) {
    return <svg width={size} height={size} style={baseStyle} />;
  }

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      style={baseStyle}
      {...rest}
    />
  );
}
