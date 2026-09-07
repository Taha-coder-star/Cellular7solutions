// Canonical list of the 75 non-Samsung smartphone models to import images for.
// `q` is the GSMArena search query; `verify` are lowercased tokens that MUST all
// appear in the matched device name (exact-model guard). `reject` tokens must NOT.
module.exports = [
  // ---- Apple (25) ----
  { name: 'iPhone 17 Pro Max', brand: 'Apple', q: 'iphone 17 pro max', verify: ['iphone', '17', 'pro', 'max'] },
  { name: 'iPhone 17 Pro', brand: 'Apple', q: 'iphone 17 pro', verify: ['iphone', '17', 'pro'], reject: ['max'] },
  { name: 'iPhone 17', brand: 'Apple', q: 'iphone 17', verify: ['iphone', '17'], reject: ['pro', 'plus', 'air', 'e'] },
  { name: 'iPhone 17e', brand: 'Apple', q: 'iphone 17e', verify: ['iphone', '17e'] },
  { name: 'iPhone Air', brand: 'Apple', q: 'iphone air 2025', verify: ['iphone', 'air'] },
  { name: 'iPhone 16 Pro Max', brand: 'Apple', q: 'iphone 16 pro max', verify: ['iphone', '16', 'pro', 'max'] },
  { name: 'iPhone 16 Pro', brand: 'Apple', q: 'iphone 16 pro', verify: ['iphone', '16', 'pro'], reject: ['max'] },
  { name: 'iPhone 16 Plus', brand: 'Apple', q: 'iphone 16 plus', verify: ['iphone', '16', 'plus'] },
  { name: 'iPhone 16', brand: 'Apple', q: 'iphone 16', verify: ['iphone', '16'], reject: ['pro', 'plus', 'e'] },
  { name: 'iPhone 16e', brand: 'Apple', q: 'iphone 16e', verify: ['iphone', '16e'] },
  { name: 'iPhone 15 Pro Max', brand: 'Apple', q: 'iphone 15 pro max', verify: ['iphone', '15', 'pro', 'max'] },
  { name: 'iPhone 15 Pro', brand: 'Apple', q: 'iphone 15 pro', verify: ['iphone', '15', 'pro'], reject: ['max'] },
  { name: 'iPhone 15 Plus', brand: 'Apple', q: 'iphone 15 plus', verify: ['iphone', '15', 'plus'] },
  { name: 'iPhone 15', brand: 'Apple', q: 'iphone 15', verify: ['iphone', '15'], reject: ['pro', 'plus'] },
  { name: 'iPhone 14 Pro Max', brand: 'Apple', q: 'iphone 14 pro max', verify: ['iphone', '14', 'pro', 'max'] },
  { name: 'iPhone 14 Pro', brand: 'Apple', q: 'iphone 14 pro', verify: ['iphone', '14', 'pro'], reject: ['max'] },
  { name: 'iPhone 14 Plus', brand: 'Apple', q: 'iphone 14 plus', verify: ['iphone', '14', 'plus'] },
  { name: 'iPhone 14', brand: 'Apple', q: 'iphone 14', verify: ['iphone', '14'], reject: ['pro', 'plus'] },
  { name: 'iPhone 13', brand: 'Apple', q: 'iphone 13', verify: ['iphone', '13'], reject: ['pro', 'mini', 'plus'] },
  { name: 'iPhone 13 mini', brand: 'Apple', q: 'iphone 13 mini', verify: ['iphone', '13', 'mini'] },
  { name: 'iPhone 12', brand: 'Apple', q: 'iphone 12', verify: ['iphone', '12'], reject: ['pro', 'mini', 'plus'] },
  { name: 'iPhone 12 mini', brand: 'Apple', q: 'iphone 12 mini', verify: ['iphone', '12', 'mini'] },
  { name: 'iPhone SE (3rd Generation)', brand: 'Apple', q: 'iphone se 2022', verify: ['iphone', 'se'], reject: ['2020'] },
  { name: 'iPhone 11', brand: 'Apple', q: 'iphone 11', verify: ['iphone', '11'], reject: ['pro'] },
  { name: 'iPhone XR', brand: 'Apple', q: 'iphone xr', verify: ['iphone', 'xr'] },

  // ---- Google (15) ----
  { name: 'Google Pixel 10 Pro XL', brand: 'Google', q: 'pixel 10 pro xl', verify: ['pixel', '10', 'pro', 'xl'] },
  { name: 'Google Pixel 10 Pro', brand: 'Google', q: 'pixel 10 pro', verify: ['pixel', '10', 'pro'], reject: ['xl', 'fold'] },
  { name: 'Google Pixel 10', brand: 'Google', q: 'pixel 10', verify: ['pixel', '10'], reject: ['pro', 'fold', 'a'] },
  { name: 'Google Pixel 10a', brand: 'Google', q: 'pixel 10a', verify: ['pixel', '10a'] },
  { name: 'Google Pixel 10 Pro Fold', brand: 'Google', q: 'pixel 10 pro fold', verify: ['pixel', '10', 'pro', 'fold'] },
  { name: 'Google Pixel 9 Pro XL', brand: 'Google', q: 'pixel 9 pro xl', verify: ['pixel', '9', 'pro', 'xl'] },
  { name: 'Google Pixel 9 Pro', brand: 'Google', q: 'pixel 9 pro', verify: ['pixel', '9', 'pro'], reject: ['xl', 'fold'] },
  { name: 'Google Pixel 9', brand: 'Google', q: 'pixel 9', verify: ['pixel', '9'], reject: ['pro', 'fold', 'a'] },
  { name: 'Google Pixel 9a', brand: 'Google', q: 'pixel 9a', verify: ['pixel', '9a'] },
  { name: 'Google Pixel 9 Pro Fold', brand: 'Google', q: 'pixel 9 pro fold', verify: ['pixel', '9', 'pro', 'fold'] },
  { name: 'Google Pixel 8 Pro', brand: 'Google', q: 'pixel 8 pro', verify: ['pixel', '8', 'pro'] },
  { name: 'Google Pixel 8', brand: 'Google', q: 'pixel 8', verify: ['pixel', '8'], reject: ['pro', 'a'] },
  { name: 'Google Pixel 8a', brand: 'Google', q: 'pixel 8a', verify: ['pixel', '8a'] },
  { name: 'Google Pixel 7a', brand: 'Google', q: 'pixel 7a', verify: ['pixel', '7a'] },
  { name: 'Google Pixel Fold', brand: 'Google', q: 'pixel fold', verify: ['pixel', 'fold'], reject: ['9', '10'] },

  // ---- Motorola (15) ----
  { name: 'Motorola Razr Ultra', brand: 'Motorola', q: 'motorola razr ultra 2025', verify: ['razr', 'ultra'] },
  { name: 'Motorola Razr', brand: 'Motorola', q: 'motorola razr 2025', verify: ['razr', '2025'], reject: ['ultra', 'plus', '+'] },
  { name: 'Motorola Razr Fold', brand: 'Motorola', q: 'motorola razr fold', verify: ['razr'] },
  { name: 'Motorola Edge 70 Pro', brand: 'Motorola', q: 'motorola edge 70 pro', verify: ['edge', '70', 'pro'] },
  { name: 'Motorola Edge 70', brand: 'Motorola', q: 'motorola edge 70', verify: ['edge', '70'], reject: ['pro'] },
  { name: 'Motorola Edge 60 Pro', brand: 'Motorola', q: 'motorola edge 60 pro', verify: ['edge', '60', 'pro'] },
  { name: 'Motorola Edge 60', brand: 'Motorola', q: 'motorola edge 60', verify: ['edge', '60'], reject: ['pro', 'fusion'] },
  { name: 'Motorola Moto G Power', brand: 'Motorola', q: 'moto g power 2025', verify: ['moto', 'g', 'power'], reject: ['5g'] },
  { name: 'Motorola Moto G', brand: 'Motorola', q: 'moto g 2025', verify: ['moto', 'g'], reject: ['power', 'play', 'stylus', '5g'] },
  { name: 'Motorola Moto G Play', brand: 'Motorola', q: 'moto g play 2024', verify: ['moto', 'g', 'play'] },
  { name: 'Motorola Moto G Stylus', brand: 'Motorola', q: 'moto g stylus 2024', verify: ['moto', 'g', 'stylus'], reject: ['5g'] },
  { name: 'Motorola Moto G Power 5G', brand: 'Motorola', q: 'moto g power 5g 2024', verify: ['moto', 'g', 'power', '5g'] },
  { name: 'Motorola Moto G 5G', brand: 'Motorola', q: 'moto g 5g 2024', verify: ['moto', 'g', '5g'], reject: ['power', 'stylus'] },
  { name: 'Motorola Moto G Stylus 5G', brand: 'Motorola', q: 'moto g stylus 5g 2024', verify: ['moto', 'g', 'stylus', '5g'] },
  { name: 'Motorola Edge 2025', brand: 'Motorola', q: 'motorola edge 2025', verify: ['edge', '2025'], reject: ['60', '70'] },

  // ---- OnePlus (5) ----
  { name: 'OnePlus 15', brand: 'OnePlus', q: 'oneplus 15', verify: ['oneplus', '15'], reject: ['15r', '13'] },
  { name: 'OnePlus 15R', brand: 'OnePlus', q: 'oneplus 15r', verify: ['oneplus', '15r'] },
  { name: 'OnePlus 13', brand: 'OnePlus', q: 'oneplus 13', verify: ['oneplus', '13'], reject: ['13r', '13s', '13t'] },
  { name: 'OnePlus 13R', brand: 'OnePlus', q: 'oneplus 13r', verify: ['oneplus', '13r'] },
  { name: 'OnePlus Open', brand: 'OnePlus', q: 'oneplus open', verify: ['oneplus', 'open'] },

  // ---- Nothing (3) ----
  { name: 'Nothing Phone (3)', brand: 'Nothing', q: 'nothing phone 3', verify: ['nothing', 'phone', '3'], reject: ['3a', '(1)', '(2)', '2a'] },
  { name: 'Nothing Phone (3a) Pro', brand: 'Nothing', q: 'nothing phone 3a pro', verify: ['nothing', 'phone', '3a', 'pro'] },
  { name: 'Nothing Phone (3a)', brand: 'Nothing', q: 'nothing phone 3a', verify: ['nothing', 'phone', '3a'], reject: ['pro'] },

  // ---- ASUS (2) ----
  { name: 'ASUS ROG Phone 9 Pro', brand: 'Asus', q: 'asus rog phone 9 pro', verify: ['rog', 'phone', '9', 'pro'] },
  { name: 'ASUS Zenfone 12 Ultra', brand: 'Asus', q: 'asus zenfone 12 ultra', verify: ['zenfone', '12', 'ultra'] },

  // ---- Sony (2) ----
  { name: 'Sony Xperia 1 VII', brand: 'Sony', q: 'sony xperia 1 vii', verify: ['xperia', '1', 'vii'] },
  { name: 'Sony Xperia 10 VII', brand: 'Sony', q: 'sony xperia 10 vii', verify: ['xperia', '10', 'vii'] },

  // ---- Fairphone (1) ----
  { name: 'Fairphone Gen 6+', brand: 'Fairphone', q: 'fairphone gen 6', verify: ['fairphone'] },

  // ---- TCL (2) ----
  { name: 'TCL 60 XE NxtPaper 5G', brand: 'TCL', q: 'tcl 60 xe nxtpaper 5g', verify: ['tcl', '60', 'nxtpaper'] },
  { name: 'TCL 60 5G', brand: 'TCL', q: 'tcl 60 5g', verify: ['tcl', '60', '5g'], reject: ['nxtpaper', 'xe'] },

  // ---- BLU (1) ----
  { name: 'BLU G93 Pro', brand: 'BLU', q: 'blu g93 pro', verify: ['blu', 'g93', 'pro'] },

  // ---- REDMAGIC (2) ----
  { name: 'REDMAGIC 11 Pro', brand: 'REDMAGIC', q: 'zte nubia red magic 11 pro', verify: ['red', 'magic', '11', 'pro'] },
  { name: 'REDMAGIC 11 Air', brand: 'REDMAGIC', q: 'zte nubia red magic 11 air', verify: ['red', 'magic', '11', 'air'] },

  // ---- HMD (2) ----
  { name: 'HMD Skyline', brand: 'HMD', q: 'hmd skyline', verify: ['hmd', 'skyline'] },
  { name: 'HMD Fusion', brand: 'HMD', q: 'hmd fusion', verify: ['hmd', 'fusion'] },
];
