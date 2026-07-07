/* @ds-bundle: {"format":4,"namespace":"CellularSolutionsDesignSystem_a109cf","components":[{"name":"Badge","sourcePath":"components/data-display/Badge.jsx"},{"name":"Card","sourcePath":"components/data-display/Card.jsx"},{"name":"ProductCard","sourcePath":"components/data-display/ProductCard.jsx"},{"name":"Rating","sourcePath":"components/data-display/Rating.jsx"},{"name":"RepairCard","sourcePath":"components/data-display/RepairCard.jsx"},{"name":"StatusBadge","sourcePath":"components/data-display/StatusBadge.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Icon","sourcePath":"components/media/Icon.jsx"},{"name":"Logo","sourcePath":"components/media/Logo.jsx"}],"sourceHashes":{"components/data-display/Badge.jsx":"f8acaece1d5b","components/data-display/Card.jsx":"4e94a9446669","components/data-display/ProductCard.jsx":"f17ad23c60d6","components/data-display/Rating.jsx":"fb78c74ea06c","components/data-display/RepairCard.jsx":"06da3a90ab7b","components/data-display/StatusBadge.jsx":"4f652b23fd95","components/forms/Button.jsx":"12409fdb28b2","components/forms/Checkbox.jsx":"f2acca54dfda","components/forms/Input.jsx":"590760f67e4e","components/forms/Select.jsx":"198505ca745e","components/media/Icon.jsx":"f41e4130c717","components/media/Logo.jsx":"d03929bfaba1","ui_kits/admin/AdminChrome.jsx":"3665028714e8","ui_kits/admin/AdminOverview.jsx":"81671fd32c42","ui_kits/admin/ServiceRequests.jsx":"ce2a82842782","ui_kits/storefront/Chrome.jsx":"1507e84400d3","ui_kits/storefront/HomeScreen.jsx":"abbef2584694","ui_kits/storefront/ProductScreen.jsx":"5a2c74ec97bd","ui_kits/storefront/ServicesScreen.jsx":"efb791defeb1","ui_kits/storefront/ShopScreen.jsx":"d2e9455f8bdd"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CellularSolutionsDesignSystem_a109cf = window.CellularSolutionsDesignSystem_a109cf || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/data-display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Small pill label. Tone controls color; used for condition and category tags. */
function Badge({
  tone = 'neutral',
  children,
  style = {},
  ...rest
}) {
  const tones = {
    neutral: {
      bg: 'var(--graphite-100)',
      fg: 'var(--graphite-700)'
    },
    dark: {
      bg: 'var(--graphite-900)',
      fg: 'var(--white)'
    },
    orange: {
      bg: 'var(--orange-50)',
      fg: 'var(--orange-700)'
    },
    'new': {
      bg: 'var(--graphite-900)',
      fg: 'var(--white)'
    },
    used: {
      bg: 'var(--graphite-100)',
      fg: 'var(--graphite-600)'
    },
    outline: {
      bg: 'transparent',
      fg: 'var(--graphite-700)',
      border: 'var(--border-strong)'
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      height: '24px',
      padding: '0 10px',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--fs-xs)',
      fontWeight: 'var(--fw-semibold)',
      letterSpacing: 'var(--ls-wide)',
      textTransform: 'uppercase',
      color: t.fg,
      background: t.bg,
      border: t.border ? `1px solid ${t.border}` : '1px solid transparent',
      borderRadius: 'var(--radius-pill)',
      lineHeight: 1,
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Base surface card: white, 16px radius, thin border, soft shadow. */
function Card({
  padding = 'var(--pad-card)',
  hover = false,
  dark = false,
  onClick,
  style = {},
  children,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      background: dark ? 'var(--surface-dark)' : 'var(--surface-card)',
      color: dark ? 'var(--text-on-dark)' : 'inherit',
      border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius-card)',
      boxShadow: hover && h ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
      padding,
      transition: 'var(--transition-base)',
      transform: hover && h ? 'translateY(-2px)' : 'none',
      cursor: onClick ? 'pointer' : 'default',
      boxSizing: 'border-box',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Card.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Rating.jsx
try { (() => {
/** Star rating display. Renders 5 stars with fractional fill via clip. */
function Rating({
  value = 0,
  count,
  size = 16,
  showValue = false,
  style = {}
}) {
  const stars = [1, 2, 3, 4, 5];
  const Star = ({
    fill
  }) => /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-block',
      width: size,
      height: size,
      lineHeight: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.6 5.9 20.4l1.5-6.8L2.2 9l6.9-.7z",
    fill: "var(--graphite-200)"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      inset: 0,
      width: `${fill * 100}%`,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.6 5.9 20.4l1.5-6.8L2.2 9l6.9-.7z",
    fill: "var(--orange-500)"
  }))));
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: '2px'
    }
  }, stars.map(s => /*#__PURE__*/React.createElement(Star, {
    key: s,
    fill: Math.max(0, Math.min(1, value - (s - 1)))
  }))), showValue && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-sm)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-strong)'
    }
  }, value.toFixed(1)), count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-muted)'
    }
  }, "(", count, ")"));
}
Object.assign(__ds_scope, { Rating });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Rating.jsx", error: String((e && e.message) || e) }); }

// components/data-display/StatusBadge.jsx
try { (() => {
/**
 * Status pill for orders and service requests. Maps the backend status
 * enums to semantic colors with a leading dot.
 */
function StatusBadge({
  status,
  style = {}
}) {
  const map = {
    pending: {
      fg: 'var(--warning-500)',
      bg: 'var(--warning-50)',
      label: 'Pending'
    },
    processing: {
      fg: 'var(--info-500)',
      bg: 'var(--info-50)',
      label: 'Processing'
    },
    confirmed: {
      fg: 'var(--info-500)',
      bg: 'var(--info-50)',
      label: 'Confirmed'
    },
    'in-progress': {
      fg: 'var(--orange-700)',
      bg: 'var(--orange-50)',
      label: 'In Progress'
    },
    shipped: {
      fg: 'var(--info-500)',
      bg: 'var(--info-50)',
      label: 'Shipped'
    },
    delivered: {
      fg: 'var(--success-500)',
      bg: 'var(--success-50)',
      label: 'Delivered'
    },
    completed: {
      fg: 'var(--success-500)',
      bg: 'var(--success-50)',
      label: 'Completed'
    },
    paid: {
      fg: 'var(--success-500)',
      bg: 'var(--success-50)',
      label: 'Paid'
    },
    cancelled: {
      fg: 'var(--danger-500)',
      bg: 'var(--danger-50)',
      label: 'Cancelled'
    },
    rejected: {
      fg: 'var(--danger-500)',
      bg: 'var(--danger-50)',
      label: 'Rejected'
    }
  };
  const s = map[status] || map.pending;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      height: '24px',
      padding: '0 10px',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--fs-xs)',
      fontWeight: 'var(--fw-semibold)',
      color: s.fg,
      background: s.bg,
      borderRadius: 'var(--radius-pill)',
      lineHeight: 1,
      whiteSpace: 'nowrap',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: s.fg
    }
  }), s.label);
}
Object.assign(__ds_scope, { StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Cellular Solutions primary button.
 *
 * Variant rules (from the brand spec):
 *  - "product" (graphite)  → shopping actions: Add to Cart, Buy Now, Checkout
 *  - "service" (orange)    → repair/service actions ONLY: Book Repair, Get Quote
 *  - "secondary" (outline) → low-emphasis alternates
 *  - "ghost"               → tertiary / toolbar actions
 */
function Button({
  variant = 'product',
  size = 'md',
  fullWidth = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  type = 'button',
  onClick,
  children,
  style = {},
  ...rest
}) {
  const heights = {
    sm: 'var(--control-h-sm)',
    md: 'var(--control-h)',
    lg: 'var(--control-h-lg)'
  };
  const pads = {
    sm: '0 16px',
    md: '0 22px',
    lg: '0 28px'
  };
  const fonts = {
    sm: 'var(--fs-sm)',
    md: 'var(--fs-body)',
    lg: 'var(--fs-lg)'
  };
  const variants = {
    product: {
      background: 'var(--brand-primary)',
      color: 'var(--text-on-brand)',
      border: '1px solid var(--brand-primary)'
    },
    service: {
      background: 'var(--brand-service)',
      color: 'var(--text-on-brand)',
      border: '1px solid var(--brand-service)'
    },
    secondary: {
      background: 'var(--white)',
      color: 'var(--text-strong)',
      border: '1px solid var(--border-strong)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-body)',
      border: '1px solid transparent'
    }
  };
  const [hover, setHover] = React.useState(false);
  const hoverBg = {
    product: 'var(--brand-primary-hover)',
    service: 'var(--brand-service-hover)',
    secondary: 'var(--surface-subtle)',
    ghost: 'var(--surface-subtle)'
  };
  const base = variants[variant] || variants.product;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      height: heights[size],
      padding: pads[size],
      width: fullWidth ? '100%' : 'auto',
      fontFamily: 'var(--font-sans)',
      fontSize: fonts[size],
      fontWeight: 'var(--fw-semibold)',
      lineHeight: 1,
      borderRadius: 'var(--radius-btn)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'var(--transition-base)',
      whiteSpace: 'nowrap',
      ...base,
      ...(hover && !disabled ? {
        background: hoverBg[variant],
        borderColor: hoverBg[variant] === 'var(--surface-subtle)' ? 'var(--border-strong)' : hoverBg[variant]
      } : {}),
      ...style
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/** Checkbox with label. Checked state uses graphite fill. */
function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  id,
  style = {}
}) {
  const boxId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: boxId,
    style: {
      display: 'inline-flex',
      alignItems: 'flex-start',
      gap: '10px',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-body)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      lineHeight: 'var(--lh-snug)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    id: boxId,
    type: "checkbox",
    checked: checked,
    defaultChecked: defaultChecked,
    onChange: onChange,
    disabled: disabled,
    style: {
      appearance: 'none',
      width: '20px',
      height: '20px',
      flexShrink: 0,
      marginTop: '1px',
      border: '1px solid var(--border-strong)',
      borderRadius: '6px',
      background: checked ?? defaultChecked ? 'var(--graphite-900)' : 'var(--white)',
      backgroundImage: checked ?? defaultChecked ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E\")" : 'none',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      borderColor: checked ?? defaultChecked ? 'var(--graphite-900)' : 'var(--border-strong)',
      cursor: 'inherit',
      transition: 'var(--transition-base)'
    }
  }), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Labelled text input with the brand's 12px radius and orange focus ring. */
function Input({
  label,
  hint,
  error,
  id,
  type = 'text',
  icon = null,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      fontFamily: 'var(--font-sans)'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: 'var(--fs-sm)',
      fontWeight: 'var(--fw-medium)',
      color: 'var(--text-strong)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: '14px',
      display: 'inline-flex',
      color: 'var(--text-muted)',
      pointerEvents: 'none'
    }
  }, icon), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: '100%',
      height: 'var(--control-h)',
      padding: icon ? '0 14px 0 42px' : '0 14px',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--fs-body)',
      color: 'var(--text-strong)',
      background: 'var(--white)',
      border: `1px solid ${error ? 'var(--danger-500)' : focus ? 'var(--orange-600)' : 'var(--border-strong)'}`,
      borderRadius: 'var(--radius-input)',
      outline: 'none',
      boxShadow: focus ? '0 0 0 3px rgba(234, 88, 12, 0.15)' : 'none',
      transition: 'var(--transition-base)',
      boxSizing: 'border-box',
      ...style
    }
  }, rest))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-xs)',
      color: error ? 'var(--danger-500)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Labelled select dropdown matching the Input styling. */
function Select({
  label,
  hint,
  id,
  options = [],
  style = {},
  children,
  ...rest
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      fontFamily: 'var(--font-sans)'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: selectId,
    style: {
      fontSize: 'var(--fs-sm)',
      fontWeight: 'var(--fw-medium)',
      color: 'var(--text-strong)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selectId,
    style: {
      width: '100%',
      height: 'var(--control-h)',
      padding: '0 40px 0 14px',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--fs-body)',
      color: 'var(--text-strong)',
      background: 'var(--white)',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--radius-input)',
      outline: 'none',
      appearance: 'none',
      cursor: 'pointer',
      boxSizing: 'border-box',
      ...style
    }
  }, rest), children || options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const lbl = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: val,
      value: val
    }, lbl);
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: '14px',
      pointerEvents: 'none',
      color: 'var(--text-muted)',
      fontSize: '12px'
    }
  }, "\u25BE")), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-xs)',
      color: 'var(--text-muted)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/media/Icon.jsx
try { (() => {
const toPascal = s => String(s).replace(/(^\w|[-_\s]\w)/g, m => m.replace(/[-_\s]/, '').toUpperCase());

/**
 * Lucide icon wrapper (the brand's specified icon system).
 * Requires the Lucide UMD script to be loaded on the page:
 *   <script src="https://unpkg.com/lucide@latest"></script>
 * Renders inline <svg> from lucide.icons so it survives re-renders.
 */
function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  style = {},
  ...rest
}) {
  const lib = typeof window !== 'undefined' && window.lucide && window.lucide.icons || {};
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
    style: {
      display: 'inline-block',
      flexShrink: 0,
      verticalAlign: 'middle',
      ...style
    },
    ...rest
  };
  if (!node) return React.createElement('svg', svgProps);
  const children = node.map(([tag, attrs], i) => React.createElement(tag, {
    key: i,
    ...attrs
  }));
  return React.createElement('svg', svgProps, children);
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/Icon.jsx", error: String((e && e.message) || e) }); }

// components/data-display/ProductCard.jsx
try { (() => {
const usd = n => '$' + Number(n).toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

/**
 * Product card: image, condition badge, brand, name, rating, price, Add to Cart.
 * Falls back to a Lucide device glyph when no image is supplied.
 * Uses the graphite ("product") button — never orange.
 */
function ProductCard({
  product = {},
  onAdd,
  style = {}
}) {
  const {
    name = 'Product',
    brand = '',
    price = 0,
    image,
    condition = 'new',
    rating,
    reviews,
    stock,
    icon = 'smartphone'
  } = product;
  const [h, setH] = React.useState(false);
  const outOfStock = stock === 0;
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-card)',
      boxShadow: h ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
      transform: h ? 'translateY(-2px)' : 'none',
      transition: 'var(--transition-base)',
      overflow: 'hidden',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '1 / 1',
      background: 'var(--graphite-50)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'var(--transition-base)',
      transform: h ? 'scale(1.03)' : 'none'
    }
  }) : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 72,
    strokeWidth: 1.25,
    color: "var(--graphite-300)",
    style: {
      transition: 'var(--transition-base)',
      transform: h ? 'scale(1.05)' : 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: '12px',
      left: '12px'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: condition === 'used' ? 'used' : 'new'
  }, condition))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: 'var(--pad-card)'
    }
  }, brand && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-xs)',
      fontWeight: 'var(--fw-semibold)',
      letterSpacing: 'var(--ls-wide)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, brand), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-lg)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-strong)',
      lineHeight: 'var(--lh-snug)'
    }
  }, name), rating != null && /*#__PURE__*/React.createElement(__ds_scope.Rating, {
    value: rating,
    count: reviews,
    size: 14
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-h4)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-strong)'
    }
  }, usd(price))), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "product",
    fullWidth: true,
    disabled: outOfStock,
    onClick: onAdd,
    style: {
      marginTop: '8px'
    }
  }, outOfStock ? 'Out of Stock' : 'Add to Cart')));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/data-display/RepairCard.jsx
try { (() => {
const usd = n => '$' + Number(n).toLocaleString('en-US', {
  minimumFractionDigits: 0
});

/**
 * Repair service card: device type, repair type, estimated time, starting
 * price, and a "Book Repair" button. This is a SERVICE surface, so it uses
 * the orange button and an orange accent.
 */
function RepairCard({
  repair = {},
  onBook,
  style = {}
}) {
  const {
    deviceType = 'Device',
    repairType = 'Repair',
    time = '',
    startingPrice = 0,
    icon = 'wrench'
  } = repair;
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-card)',
      boxShadow: h ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
      transform: h ? 'translateY(-2px)' : 'none',
      transition: 'var(--transition-base)',
      padding: 'var(--pad-card)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '48px',
      height: '48px',
      borderRadius: 'var(--radius-btn)',
      background: 'var(--orange-50)',
      color: 'var(--orange-600)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 24,
    color: "var(--orange-600)"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-xs)',
      fontWeight: 'var(--fw-semibold)',
      letterSpacing: 'var(--ls-wide)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, deviceType)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-h4)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-strong)'
    }
  }, repairType), time && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "clock",
    size: 15
  }), " ", time)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-muted)'
    }
  }, "from"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-h3)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-strong)'
    }
  }, usd(startingPrice))), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "service",
    fullWidth: true,
    onClick: onBook,
    iconLeft: /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "calendar-check",
      size: 18
    })
  }, "Book Repair"));
}
Object.assign(__ds_scope, { RepairCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/RepairCard.jsx", error: String((e && e.message) || e) }); }

// components/media/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Cellular Solutions logo. Resolves asset paths relative to the project root
 * via `basePath` (default "assets"). Use `tone="dark"` on dark backgrounds.
 */
function Logo({
  variant = 'full',
  tone = 'light',
  height,
  basePath = 'assets',
  style = {},
  ...rest
}) {
  const files = {
    full: {
      light: 'cs-logo-full.svg',
      dark: 'cs-logo-full-dark.svg'
    },
    icon: {
      light: 'cs-icon.svg',
      dark: 'cs-icon-white.svg'
    }
  };
  const file = (files[variant] || files.full)[tone] || files.full.light;
  const h = height || (variant === 'icon' ? 40 : 44);
  return /*#__PURE__*/React.createElement("img", _extends({
    src: `${basePath}/${file}`,
    alt: "Cellular Solutions",
    style: {
      height: h,
      width: 'auto',
      display: 'block',
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/Logo.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/AdminChrome.jsx
try { (() => {
const {
  useState
} = React;
const {
  Logo,
  Icon,
  Badge,
  StatusBadge,
  Button,
  Card
} = window.CellularSolutionsDesignSystem_a109cf;
const MENU = [['overview', 'layout-dashboard', 'Overview'], ['orders', 'shopping-bag', 'Orders'], ['products', 'package', 'Products'], ['requests', 'wrench', 'Service Requests'], ['customers', 'users', 'Customers']];
function Sidebar({
  route,
  onNav
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 248,
      flexShrink: 0,
      background: 'var(--graphite-900)',
      color: 'var(--graphite-300)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 20px',
      borderBottom: '1px solid var(--graphite-700)'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "full",
    tone: "dark",
    basePath: "../../assets",
    height: 32
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      padding: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      flex: 1
    }
  }, MENU.map(([k, ic, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => onNav(k),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '11px 14px',
      borderRadius: 'var(--radius-btn)',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--fs-sm)',
      fontWeight: 600,
      color: route === k ? 'var(--white)' : 'var(--graphite-400)',
      background: route === k ? 'var(--graphite-800)' : 'transparent'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 18,
    color: route === k ? 'var(--orange-500)' : 'var(--graphite-500)'
  }), " ", l))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      borderTop: '1px solid var(--graphite-700)',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--graphite-700)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: 13,
      fontWeight: 700
    }
  }, "TA"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#fff',
      fontWeight: 600
    }
  }, "Taha A."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--graphite-500)'
    }
  }, "Store Admin"))));
}
function Topbar({
  title
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 68,
      borderBottom: '1px solid var(--border-subtle)',
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      padding: '0 28px',
      gap: 16,
      position: 'sticky',
      top: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--fs-h3)',
      fontWeight: 700,
      letterSpacing: 'var(--ls-tight)',
      color: 'var(--text-strong)',
      margin: 0,
      flex: 1
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      width: 240,
      height: 40,
      background: 'var(--graphite-100)',
      borderRadius: 'var(--radius-pill)',
      padding: '0 14px',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 16
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-sm)'
    }
  }, "Search\u2026")), /*#__PURE__*/React.createElement("button", {
    style: {
      background: 'none',
      border: '1px solid var(--border-subtle)',
      width: 40,
      height: 40,
      borderRadius: 'var(--radius-btn)',
      cursor: 'pointer',
      color: 'var(--text-body)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 18
  })));
}
Object.assign(window, {
  Sidebar,
  Topbar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/AdminChrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/AdminOverview.jsx
try { (() => {
const {
  useState
} = React;
const {
  Icon,
  Badge,
  StatusBadge,
  Button,
  Card
} = window.CellularSolutionsDesignSystem_a109cf;
const STATS = [['Revenue (30d)', '$48,230', '+12.4%', 'up', 'dollar-sign', 'var(--graphite-900)'], ['Orders', '312', '+8.1%', 'up', 'shopping-bag', 'var(--graphite-900)'], ['Open Repairs', '27', '+5', 'up', 'wrench', 'var(--orange-600)'], ['Low Stock', '6', '−2', 'down', 'alert-triangle', 'var(--warning-500)']];
const ORDERS = [['#CS-1042', 'Jordan Rivera', 'iPhone 15 Pro', '$999.00', 'processing'], ['#CS-1041', 'Amara Okafor', 'AirPods Pro 2', '$249.00', 'shipped'], ['#CS-1040', 'Liam Chen', 'MacBook Air M3', '$1,099.00', 'delivered'], ['#CS-1039', 'Sofia Martins', 'Galaxy S24 Ultra', '$1,199.00', 'pending'], ['#CS-1038', 'Noah Patel', 'iPad Air', '$599.00', 'cancelled']];
const REQS = [['iPhone 14', 'Screen Replacement', 'in-progress'], ['Pixel 8', 'Battery', 'pending'], ['Xbox Series X', 'HDMI Port', 'completed']];
function StatCard({
  label,
  value,
  delta,
  dir,
  icon,
  tint
}) {
  return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-muted)',
      fontWeight: 500
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-btn)',
      background: 'var(--graphite-100)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 18,
    color: tint
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-h2)',
      fontWeight: 800,
      letterSpacing: 'var(--ls-tight)',
      color: 'var(--text-strong)',
      margin: '14px 0 6px'
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 'var(--fs-sm)',
      fontWeight: 600,
      color: dir === 'up' ? 'var(--success-500)' : 'var(--warning-500)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: dir === 'up' ? 'trending-up' : 'trending-down',
    size: 14
  }), " ", delta));
}
function AdminOverview() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 28,
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 'var(--gap-grid)'
    }
  }, STATS.map(s => /*#__PURE__*/React.createElement(StatCard, {
    key: s[0],
    label: s[0],
    value: s[1],
    delta: s[2],
    dir: s[3],
    icon: s[4],
    tint: s[5]
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.7fr 1fr',
      gap: 'var(--gap-grid)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "0"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 22px',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-h4)',
      fontWeight: 700,
      color: 'var(--text-strong)'
    }
  }, "Recent Orders"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 14
    })
  }, "View all")), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ['Order', 'Customer', 'Item', 'Total', 'Status'].map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      textAlign: h === 'Total' ? 'right' : 'left',
      padding: '12px 22px',
      fontSize: 'var(--fs-xs)',
      fontWeight: 600,
      letterSpacing: 'var(--ls-wide)',
      textTransform: 'uppercase',
      color: 'var(--text-faint)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, ORDERS.map(o => /*#__PURE__*/React.createElement("tr", {
    key: o[0]
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 22px',
      fontSize: 'var(--fs-sm)',
      fontWeight: 600,
      color: 'var(--text-strong)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, o[0]), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 22px',
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-body)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, o[1]), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 22px',
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-body)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, o[2]), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 22px',
      fontSize: 'var(--fs-sm)',
      fontWeight: 600,
      color: 'var(--text-strong)',
      textAlign: 'right',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, o[3]), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 22px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: o[4]
  }))))))), /*#__PURE__*/React.createElement(Card, {
    padding: "0"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 22px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-h4)',
      fontWeight: 700,
      color: 'var(--text-strong)'
    }
  }, "Open Repairs")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      display: 'flex',
      flexDirection: 'column'
    }
  }, REQS.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 10px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 'var(--radius-btn)',
      background: 'var(--orange-50)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wrench",
    size: 18,
    color: "var(--orange-600)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-sm)',
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, r[0]), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-xs)',
      color: 'var(--text-muted)'
    }
  }, r[1])), /*#__PURE__*/React.createElement(StatusBadge, {
    status: r[2]
  })))))));
}
Object.assign(window, {
  AdminOverview
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/AdminOverview.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/ServiceRequests.jsx
try { (() => {
const {
  useState
} = React;
const {
  Icon,
  Badge,
  StatusBadge,
  Button,
  Card,
  Select
} = window.CellularSolutionsDesignSystem_a109cf;
const ALL = [['#RQ-308', 'Jordan Rivera', 'iPhone 14', 'Screen Replacement', 'repair', '$89', 'in-progress'], ['#RQ-307', 'Amara Okafor', 'Pixel 8', 'Battery Replacement', 'repair', '$49', 'pending'], ['#RQ-306', 'Liam Chen', 'AT&T iPhone 13', 'Carrier Unlock', 'unlock', '$25', 'confirmed'], ['#RQ-305', 'Sofia Martins', 'Xbox Series X', 'HDMI Port Repair', 'repair', '$69', 'completed'], ['#RQ-304', 'Noah Patel', 'MacBook Pro', 'Keyboard Repair', 'repair', '$99', 'rejected'], ['#RQ-303', 'Mia Rossi', 'Galaxy S22', 'Sell Device', 'buysell', '$220', 'confirmed']];
const TABS = [['all', 'All'], ['repair', 'Repairs'], ['unlock', 'Unlocks'], ['buysell', 'Buy / Sell']];
function TypeTag({
  t
}) {
  const map = {
    repair: ['orange', 'Repair'],
    unlock: ['dark', 'Unlock'],
    buysell: ['neutral', 'Buy/Sell']
  };
  const [tone, label] = map[t] || map.repair;
  return /*#__PURE__*/React.createElement(Badge, {
    tone: tone
  }, label);
}
function ServiceRequests() {
  const [tab, setTab] = useState('all');
  const rows = ALL.filter(r => tab === 'all' || r[4] === tab);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      background: 'var(--graphite-100)',
      padding: 4,
      borderRadius: 'var(--radius-btn)'
    }
  }, TABS.map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => setTab(k),
    style: {
      border: 'none',
      cursor: 'pointer',
      padding: '8px 16px',
      borderRadius: 'var(--radius-sm)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--fs-sm)',
      fontWeight: 600,
      color: tab === k ? 'var(--text-strong)' : 'var(--text-muted)',
      background: tab === k ? '#fff' : 'transparent',
      boxShadow: tab === k ? 'var(--shadow-sm)' : 'none'
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 180
    }
  }, /*#__PURE__*/React.createElement(Select, {
    options: ['All statuses', 'Pending', 'In Progress', 'Completed']
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "service",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 16
    })
  }, "New Request")), /*#__PURE__*/React.createElement(Card, {
    padding: "0"
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ['Request', 'Customer', 'Device', 'Service', 'Type', 'Est.', 'Status', ''].map((h, i) => /*#__PURE__*/React.createElement("th", {
    key: i,
    style: {
      textAlign: i === 5 ? 'right' : 'left',
      padding: '13px 20px',
      fontSize: 'var(--fs-xs)',
      fontWeight: 600,
      letterSpacing: 'var(--ls-wide)',
      textTransform: 'uppercase',
      color: 'var(--text-faint)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, rows.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r[0]
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '15px 20px',
      fontSize: 'var(--fs-sm)',
      fontWeight: 600,
      color: 'var(--text-strong)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, r[0]), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '15px 20px',
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-body)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, r[1]), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '15px 20px',
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-body)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, r[2]), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '15px 20px',
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-body)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, r[3]), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '15px 20px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(TypeTag, {
    t: r[4]
  })), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '15px 20px',
      fontSize: 'var(--fs-sm)',
      fontWeight: 600,
      color: 'var(--text-strong)',
      textAlign: 'right',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, r[5]), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '15px 20px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: r[6]
  })), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '15px 20px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--text-faint)',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "more-horizontal",
    size: 18
  })))))))));
}
Object.assign(window, {
  ServiceRequests
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/ServiceRequests.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Chrome.jsx
try { (() => {
const {
  useState
} = React;
const {
  Logo,
  Icon,
  Button
} = window.CellularSolutionsDesignSystem_a109cf;
const NAV = [{
  key: 'home',
  label: 'Home'
}, {
  key: 'shop',
  label: 'Shop'
}, {
  key: 'services',
  label: 'Repair & Services'
}, {
  key: 'product',
  label: 'Sell / Unlock'
}];
function Header({
  route,
  onNav,
  cartCount = 0
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 20,
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      height: 72,
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('home'),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "full",
    basePath: "../../assets",
    height: 38
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 4,
      marginLeft: 8
    }
  }, NAV.map(n => /*#__PURE__*/React.createElement("button", {
    key: n.key,
    onClick: () => onNav(n.key),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px 14px',
      borderRadius: 'var(--radius-btn)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--fs-sm)',
      fontWeight: 600,
      color: route === n.key ? 'var(--text-strong)' : 'var(--text-muted)',
      background: route === n.key ? 'var(--graphite-100)' : 'transparent'
    }
  }, n.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: 220,
      height: 40,
      background: 'var(--graphite-100)',
      borderRadius: 'var(--radius-pill)',
      padding: '0 14px',
      gap: 8,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 16
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-sm)'
    }
  }, "Search devices\u2026")), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('shop'),
    style: {
      position: 'relative',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--text-strong)',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shopping-cart",
    size: 22
  }), cartCount > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -6,
      right: -8,
      minWidth: 18,
      height: 18,
      padding: '0 5px',
      background: 'var(--orange-600)',
      color: '#fff',
      borderRadius: 'var(--radius-pill)',
      fontSize: 11,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, cartCount)), /*#__PURE__*/React.createElement("button", {
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--text-strong)',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 22
  }))));
}
function Footer() {
  const cols = [{
    h: 'Shop',
    items: ['Phones', 'Laptops', 'Consoles', 'Accessories']
  }, {
    h: 'Services',
    items: ['Book Repair', 'Device Unlock', 'Sell Your Device', 'Track Repair']
  }, {
    h: 'Company',
    items: ['About Us', 'Store Locations', 'Warranty', 'Contact']
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--graphite-900)',
      color: 'var(--graphite-300)',
      marginTop: 64
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '56px 24px 40px',
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Logo, {
    variant: "full",
    tone: "dark",
    basePath: "../../assets",
    height: 36
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--fs-sm)',
      lineHeight: 'var(--lh-relaxed)',
      marginTop: 16,
      maxWidth: 260
    }
  }, "Premium devices and expert repair. You break it, we fix it \u2014 with genuine parts and a workmanship guarantee.")), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-xs)',
      fontWeight: 700,
      letterSpacing: 'var(--ls-wide)',
      textTransform: 'uppercase',
      color: 'var(--white)',
      marginBottom: 14
    }
  }, c.h), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, c.items.map(i => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      fontSize: 'var(--fs-sm)',
      cursor: 'pointer'
    }
  }, i)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--graphite-700)',
      padding: '20px 24px',
      maxWidth: 1200,
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 'var(--fs-xs)',
      color: 'var(--graphite-500)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Cellular Solutions. All rights reserved."), /*#__PURE__*/React.createElement("span", {
    style: {
      letterSpacing: 'var(--ls-wider)',
      textTransform: 'uppercase'
    }
  }, "You Break It \xB7 We Fix It")));
}
Object.assign(window, {
  Header,
  Footer,
  NAV
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/HomeScreen.jsx
try { (() => {
const {
  Icon,
  Button,
  ProductCard,
  RepairCard,
  Badge
} = window.CellularSolutionsDesignSystem_a109cf;
const FEATURED = [{
  id: 1,
  name: 'iPhone 15 Pro',
  brand: 'Apple',
  price: 999,
  condition: 'new',
  rating: 4.8,
  reviews: 214,
  stock: 8,
  icon: 'smartphone'
}, {
  id: 2,
  name: 'Galaxy S24 Ultra',
  brand: 'Samsung',
  price: 1199,
  condition: 'new',
  rating: 4.7,
  reviews: 168,
  stock: 5,
  icon: 'smartphone'
}, {
  id: 3,
  name: 'MacBook Air M3',
  brand: 'Apple',
  price: 1099,
  condition: 'new',
  rating: 4.9,
  reviews: 92,
  stock: 4,
  icon: 'laptop'
}, {
  id: 4,
  name: 'iPhone 13',
  brand: 'Apple',
  price: 549,
  condition: 'used',
  rating: 4.5,
  reviews: 340,
  stock: 12,
  icon: 'smartphone'
}];
const SERVICES = [{
  deviceType: 'iPhone',
  repairType: 'Screen Replacement',
  time: '45 min',
  startingPrice: 89,
  icon: 'smartphone'
}, {
  deviceType: 'Any Device',
  repairType: 'Battery Replacement',
  time: '30 min',
  startingPrice: 49,
  icon: 'battery-charging'
}, {
  deviceType: 'Carrier',
  repairType: 'Device Unlock',
  time: '1–2 days',
  startingPrice: 25,
  icon: 'unlock'
}];
function Hero({
  onNav
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--graphite-900)',
      color: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '80px 24px',
      display: 'grid',
      gridTemplateColumns: '1.1fr 0.9fr',
      gap: 48,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 'var(--fs-xs)',
      fontWeight: 700,
      letterSpacing: 'var(--ls-wider)',
      textTransform: 'uppercase',
      color: 'var(--orange-500)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "zap",
    size: 14,
    color: "var(--orange-500)"
  }), " You Break It \xB7 We Fix It"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--fs-display)',
      fontWeight: 800,
      letterSpacing: 'var(--ls-tight)',
      lineHeight: 1.05,
      margin: '18px 0 0'
    }
  }, "Premium devices.", /*#__PURE__*/React.createElement("br", null), "Expert repair."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--fs-lg)',
      color: 'var(--graphite-300)',
      lineHeight: 'var(--lh-relaxed)',
      margin: '20px 0 32px',
      maxWidth: 460
    }
  }, "Shop the latest phones, laptops and consoles \u2014 or book a same-day repair with genuine parts and a workmanship guarantee."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => onNav('shop'),
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "shopping-cart",
      size: 18
    })
  }, "Shop Devices"), /*#__PURE__*/React.createElement(Button, {
    variant: "service",
    onClick: () => onNav('services'),
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "wrench",
      size: 18
    })
  }, "Book a Repair")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 28,
      marginTop: 40
    }
  }, [['shield-check', 'Genuine parts'], ['clock', 'Same-day service'], ['truck', 'Free shipping $99+']].map(([ic, t]) => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 'var(--fs-sm)',
      color: 'var(--graphite-300)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 18,
    color: "var(--orange-500)"
  }), " ", t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 300,
      height: 300,
      borderRadius: 'var(--radius-modal)',
      background: 'linear-gradient(160deg, var(--graphite-800), var(--graphite-900))',
      border: '1px solid var(--graphite-700)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "smartphone",
    size: 140,
    strokeWidth: 1,
    color: "var(--orange-500)"
  })))));
}
function SectionHead({
  eyebrow,
  title,
  action,
  onAction
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("div", null, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-xs)',
      fontWeight: 700,
      letterSpacing: 'var(--ls-wide)',
      textTransform: 'uppercase',
      color: 'var(--orange-600)',
      marginBottom: 8
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--fs-h2)',
      fontWeight: 700,
      letterSpacing: 'var(--ls-tight)',
      color: 'var(--text-strong)',
      margin: 0
    }
  }, title)), action && /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: onAction,
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 16
    })
  }, action));
}
function HomeScreen({
  onNav,
  onAdd,
  onOpenProduct
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Hero, {
    onNav: onNav
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '72px 24px 0'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Shop",
    title: "Featured devices",
    action: "View all",
    onAction: () => onNav('shop')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 'var(--gap-grid)'
    }
  }, FEATURED.map(p => /*#__PURE__*/React.createElement(ProductCard, {
    key: p.id,
    product: p,
    onAdd: () => onAdd(p)
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '72px 24px 0'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Repair & Services",
    title: "Book a repair",
    action: "All services",
    onAction: () => onNav('services')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--gap-grid)'
    }
  }, SERVICES.map((s, i) => /*#__PURE__*/React.createElement(RepairCard, {
    key: i,
    repair: s,
    onBook: () => onNav('services')
  })))));
}
Object.assign(window, {
  HomeScreen,
  FEATURED,
  SERVICES,
  SectionHead
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/ProductScreen.jsx
try { (() => {
const {
  useState
} = React;
const {
  Icon,
  Button,
  Badge,
  Rating
} = window.CellularSolutionsDesignSystem_a109cf;
const usd = n => '$' + Number(n).toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
function ProductScreen({
  product,
  onAdd,
  onNav
}) {
  const p = product || {
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    price: 999,
    condition: 'new',
    rating: 4.8,
    reviews: 214,
    stock: 8,
    icon: 'smartphone'
  };
  const [qty, setQty] = useState(1);
  const specs = [['Display', '6.1" Super Retina XDR'], ['Chip', 'A17 Pro'], ['Storage', '256 GB'], ['Camera', '48MP Main · 3× Tele'], ['Battery', 'Up to 23h video'], ['Warranty', '12-month store warranty']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '32px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-muted)',
      marginBottom: 24,
      cursor: 'pointer'
    },
    onClick: () => onNav('shop')
  }, "\u2190 Shop / ", p.brand, " / ", p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 56,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '1/1',
      background: 'var(--graphite-50)',
      borderRadius: 'var(--radius-card)',
      border: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 16,
      left: 16
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: p.condition === 'used' ? 'used' : 'new'
  }, p.condition)), /*#__PURE__*/React.createElement(Icon, {
    name: p.icon || 'smartphone',
    size: 180,
    strokeWidth: 1,
    color: "var(--graphite-300)"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-xs)',
      fontWeight: 700,
      letterSpacing: 'var(--ls-wide)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, p.brand), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--fs-h1)',
      fontWeight: 700,
      letterSpacing: 'var(--ls-tight)',
      margin: '8px 0 12px',
      color: 'var(--text-strong)'
    }
  }, p.name), /*#__PURE__*/React.createElement(Rating, {
    value: p.rating || 4.8,
    count: p.reviews
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-display)',
      fontWeight: 800,
      letterSpacing: 'var(--ls-tight)',
      color: 'var(--text-strong)',
      margin: '20px 0 4px'
    }
  }, usd(p.price)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 'var(--fs-sm)',
      color: p.stock ? 'var(--success-500)' : 'var(--danger-500)',
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: p.stock ? 'check-circle' : 'x-circle',
    size: 16
  }), " ", p.stock ? `In stock · ${p.stock} available` : 'Out of stock'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--radius-btn)',
      height: 48
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(Math.max(1, qty - 1)),
    style: {
      width: 44,
      height: 46,
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      fontSize: 18,
      color: 'var(--text-body)'
    }
  }, "\u2212"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      textAlign: 'center',
      fontWeight: 600
    }
  }, qty), /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(qty + 1),
    style: {
      width: 44,
      height: 46,
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      fontSize: 18,
      color: 'var(--text-body)'
    }
  }, "+")), /*#__PURE__*/React.createElement(Button, {
    variant: "product",
    fullWidth: true,
    disabled: !p.stock,
    onClick: () => onAdd(p, qty),
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "shopping-cart",
      size: 18
    }),
    style: {
      flex: 1
    }
  }, "Add to Cart")), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "heart",
      size: 18
    })
  }, "Add to Wishlist"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      borderTop: '1px solid var(--border-subtle)',
      paddingTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-h4)',
      fontWeight: 700,
      color: 'var(--text-strong)',
      marginBottom: 16
    }
  }, "Specifications"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px 32px'
    }
  }, specs.map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 'var(--fs-sm)',
      borderBottom: '1px solid var(--border-subtle)',
      paddingBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-strong)',
      fontWeight: 500
    }
  }, v))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      display: 'flex',
      gap: 16,
      padding: '16px 18px',
      background: 'var(--orange-50)',
      border: '1px solid var(--orange-100)',
      borderRadius: 'var(--radius-card)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wrench",
    size: 22,
    color: "var(--orange-600)"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-sm)',
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, "Cracked screen or battery issue?"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-body)'
    }
  }, "We repair this model in-store. ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('services');
    },
    style: {
      color: 'var(--orange-700)',
      fontWeight: 600
    }
  }, "Book a repair \u2192")))))));
}
Object.assign(window, {
  ProductScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/ProductScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/ServicesScreen.jsx
try { (() => {
const {
  useState
} = React;
const {
  Icon,
  Button,
  RepairCard,
  Input,
  Select,
  Checkbox,
  Card
} = window.CellularSolutionsDesignSystem_a109cf;
const REPAIRS = [{
  deviceType: 'iPhone',
  repairType: 'Screen Replacement',
  time: '45 min',
  startingPrice: 89,
  icon: 'smartphone'
}, {
  deviceType: 'Any Device',
  repairType: 'Battery Replacement',
  time: '30 min',
  startingPrice: 49,
  icon: 'battery-charging'
}, {
  deviceType: 'Any Device',
  repairType: 'Water Damage',
  time: '1–2 days',
  startingPrice: 79,
  icon: 'droplets'
}, {
  deviceType: 'Laptop',
  repairType: 'Keyboard Repair',
  time: '2–3 hrs',
  startingPrice: 99,
  icon: 'laptop'
}, {
  deviceType: 'Carrier',
  repairType: 'Device Unlock',
  time: '1–2 days',
  startingPrice: 25,
  icon: 'unlock'
}, {
  deviceType: 'Console',
  repairType: 'HDMI Port Repair',
  time: '1 day',
  startingPrice: 69,
  icon: 'gamepad-2'
}];
const STEPS = [['calendar-check', 'Book online', 'Pick a service and time — or walk in.'], ['search', 'Free diagnosis', 'We inspect and quote before any work.'], ['wrench', 'Expert repair', 'Genuine parts, done by certified techs.'], ['shield-check', 'Guaranteed', 'Backed by our workmanship warranty.']];
function ServicesScreen() {
  const [sent, setSent] = useState(false);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--graphite-900)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '64px 24px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 'var(--fs-xs)',
      fontWeight: 700,
      letterSpacing: 'var(--ls-wider)',
      textTransform: 'uppercase',
      color: 'var(--orange-500)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wrench",
    size: 14,
    color: "var(--orange-500)"
  }), " Repair & Services"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--fs-h1)',
      fontWeight: 800,
      letterSpacing: 'var(--ls-tight)',
      margin: '16px 0 12px',
      maxWidth: 640
    }
  }, "Fast, reliable repairs with a workmanship guarantee."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--fs-lg)',
      color: 'var(--graphite-300)',
      maxWidth: 560,
      lineHeight: 'var(--lh-relaxed)'
    }
  }, "Free diagnostics \xB7 Same-day turnaround on most repairs \xB7 Genuine parts."))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '56px 24px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 'var(--gap-grid)'
    }
  }, STEPS.map(([ic, t, d], i) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 'var(--radius-btn)',
      background: 'var(--orange-50)',
      color: 'var(--orange-600)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 22,
    color: "var(--orange-600)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-lg)',
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, i + 1, ". ", t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--lh-relaxed)'
    }
  }, d))))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '64px 24px 0'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--fs-h2)',
      fontWeight: 700,
      letterSpacing: 'var(--ls-tight)',
      margin: '0 0 28px',
      color: 'var(--text-strong)'
    }
  }, "Popular repairs"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 'var(--gap-grid)'
    }
  }, REPAIRS.map((r, i) => /*#__PURE__*/React.createElement(RepairCard, {
    key: i,
    repair: r,
    onBook: () => document.getElementById('booking').scrollTo?.(0, 0)
  })))), /*#__PURE__*/React.createElement("section", {
    id: "booking",
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '64px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-xs)',
      fontWeight: 700,
      letterSpacing: 'var(--ls-wide)',
      textTransform: 'uppercase',
      color: 'var(--orange-600)',
      marginBottom: 10
    }
  }, "Get a free quote"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--fs-h2)',
      fontWeight: 700,
      letterSpacing: 'var(--ls-tight)',
      margin: '0 0 14px',
      color: 'var(--text-strong)'
    }
  }, "Book your repair"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--fs-body)',
      color: 'var(--text-body)',
      lineHeight: 'var(--lh-relaxed)',
      maxWidth: 420
    }
  }, "Tell us about your device and we'll confirm a time and an up-front quote \u2014 usually within an hour.")), /*#__PURE__*/React.createElement(Card, {
    padding: "var(--space-8)"
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '24px 0'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check-circle",
    size: 44,
    color: "var(--success-500)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-h4)',
      fontWeight: 700,
      color: 'var(--text-strong)',
      margin: '12px 0 6px'
    }
  }, "Request received"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-muted)',
      marginBottom: 20
    }
  }, "We'll text you a confirmation and quote shortly."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => setSent(false)
  }, "Book another")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Device",
    options: ['iPhone', 'Android Phone', 'Laptop', 'Tablet', 'Console']
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Repair type",
    options: ['Screen', 'Battery', 'Water damage', 'Unlock', 'Other']
  })), /*#__PURE__*/React.createElement(Input, {
    label: "Your name",
    placeholder: "Jordan Rivera",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Phone number",
    type: "tel",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "phone",
      size: 16
    }),
    placeholder: "+1 555 0100",
    required: true
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "I agree the device may be taken to the store if it can't be fixed on-site."
  }), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    variant: "service",
    fullWidth: true,
    size: "lg",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "calendar-check",
      size: 18
    })
  }, "Get Free Quote"))))));
}
Object.assign(window, {
  ServicesScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/ServicesScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/ShopScreen.jsx
try { (() => {
const {
  useState
} = React;
const {
  Icon,
  Button,
  Badge,
  Checkbox,
  Select,
  ProductCard
} = window.CellularSolutionsDesignSystem_a109cf;
const CATALOG = [{
  id: 1,
  name: 'iPhone 15 Pro',
  brand: 'Apple',
  price: 999,
  condition: 'new',
  rating: 4.8,
  reviews: 214,
  stock: 8,
  icon: 'smartphone',
  cat: 'Phones'
}, {
  id: 2,
  name: 'Galaxy S24 Ultra',
  brand: 'Samsung',
  price: 1199,
  condition: 'new',
  rating: 4.7,
  reviews: 168,
  stock: 5,
  icon: 'smartphone',
  cat: 'Phones'
}, {
  id: 3,
  name: 'MacBook Air M3',
  brand: 'Apple',
  price: 1099,
  condition: 'new',
  rating: 4.9,
  reviews: 92,
  stock: 4,
  icon: 'laptop',
  cat: 'Laptops'
}, {
  id: 4,
  name: 'iPhone 13',
  brand: 'Apple',
  price: 549,
  condition: 'used',
  rating: 4.5,
  reviews: 340,
  stock: 12,
  icon: 'smartphone',
  cat: 'Phones'
}, {
  id: 5,
  name: 'PlayStation 5',
  brand: 'Sony',
  price: 499,
  condition: 'new',
  rating: 4.8,
  reviews: 501,
  stock: 0,
  icon: 'gamepad-2',
  cat: 'Consoles'
}, {
  id: 6,
  name: 'AirPods Pro 2',
  brand: 'Apple',
  price: 249,
  condition: 'new',
  rating: 4.6,
  reviews: 720,
  stock: 40,
  icon: 'headphones',
  cat: 'Accessories'
}, {
  id: 7,
  name: 'Pixel 8 Pro',
  brand: 'Google',
  price: 799,
  condition: 'used',
  rating: 4.4,
  reviews: 88,
  stock: 6,
  icon: 'smartphone',
  cat: 'Phones'
}, {
  id: 8,
  name: 'iPad Air',
  brand: 'Apple',
  price: 599,
  condition: 'new',
  rating: 4.7,
  reviews: 133,
  stock: 9,
  icon: 'tablet',
  cat: 'Tablets'
}];
const CATEGORIES = ['Phones', 'Laptops', 'Tablets', 'Consoles', 'Accessories'];
function FilterGroup({
  title,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 20,
      marginBottom: 20,
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-xs)',
      fontWeight: 700,
      letterSpacing: 'var(--ls-wide)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 14
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, children));
}
function ShopScreen({
  onAdd
}) {
  const [cats, setCats] = useState([]);
  const [conds, setConds] = useState([]);
  const toggle = (arr, set, v) => set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
  let items = CATALOG.filter(p => (cats.length === 0 || cats.includes(p.cat)) && (conds.length === 0 || conds.includes(p.condition)));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '40px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-muted)',
      marginBottom: 6
    }
  }, "Shop / All Devices"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--fs-h1)',
      fontWeight: 700,
      letterSpacing: 'var(--ls-tight)',
      margin: 0,
      color: 'var(--text-strong)'
    }
  }, "All Devices")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '240px 1fr',
      gap: 40,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("aside", null, /*#__PURE__*/React.createElement(FilterGroup, {
    title: "Category"
  }, CATEGORIES.map(c => /*#__PURE__*/React.createElement(Checkbox, {
    key: c,
    label: c,
    checked: cats.includes(c),
    onChange: () => toggle(cats, setCats, c)
  }))), /*#__PURE__*/React.createElement(FilterGroup, {
    title: "Condition"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "New",
    checked: conds.includes('new'),
    onChange: () => toggle(conds, setConds, 'new')
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Used",
    checked: conds.includes('used'),
    onChange: () => toggle(conds, setConds, 'used')
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: () => {
      setCats([]);
      setConds([]);
    },
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "x",
      size: 14
    })
  }, "Clear filters")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-muted)'
    }
  }, items.length, " products"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 200
    }
  }, /*#__PURE__*/React.createElement(Select, {
    options: ['Sort: Featured', 'Price: Low to High', 'Price: High to Low', 'Top Rated']
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--gap-grid)'
    }
  }, items.map(p => /*#__PURE__*/React.createElement(ProductCard, {
    key: p.id,
    product: p,
    onAdd: () => onAdd(p)
  }))))));
}
Object.assign(window, {
  ShopScreen,
  CATALOG
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/ShopScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.Rating = __ds_scope.Rating;

__ds_ns.RepairCard = __ds_scope.RepairCard;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Logo = __ds_scope.Logo;

})();
