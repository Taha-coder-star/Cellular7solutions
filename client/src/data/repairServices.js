// Repair catalogue: category pages at /repair/:category, one page per repair at /repair/:category/:repair.
// `device` matches DEVICE_TYPES below. `image` is a file in /public/assets/repair/stock: photos are bench shots
// or close-ups of the device/fault the page describes (sources in stock/SOURCES.md). Summaries and symptoms are drafts: have the shop confirm them.
// `warranty` is shown only when set; fill in the shop's real terms before relying on it.
export const REPAIR_CATEGORIES = [
  {
    slug: 'phone',
    device: 'Phone',
    title: 'Phone Repair',
    heading: 'iPhone & Samsung repair',
    image: 'phone-teardown',
    warranty: null,
    repairs: [
      { slug: 'cracked-screen', name: 'Cracked Screen', image: 'phone-screen',
        summary: 'Shattered glass, lines across the display or a touchscreen that stops responding. We replace the screen assembly so it looks and works like it should.',
        symptoms: ['Cracked or shattered glass', 'Black spots, lines or flickering', 'Touch not responding in places', 'Display stays black but the phone rings'] },
      { slug: 'battery', name: 'Battery', image: 'phone-battery-open',
        summary: 'A worn battery drains fast and can shut the phone off without warning. A new battery brings back a full day of use.',
        symptoms: ['Battery drains quickly', 'Phone shuts off above 0%', 'Battery health warning', 'Swollen battery lifting the screen'] },
      { slug: 'camera', name: 'Camera', image: 'phone-parts',
        summary: 'Blurry shots, a cracked lens or a camera app that shows black. We repair or replace front and rear camera modules and lens glass.',
        symptoms: ['Blurry or shaky photos', 'Cracked camera lens', 'Black screen in the camera app', 'Camera will not focus'] },
      { slug: 'water-damage', name: 'Water Damage', image: 'phone-water-open',
        summary: 'Dropped it in water? Switch it off and bring it in quickly. We clean corrosion from the board and test every component.',
        symptoms: ['Phone will not turn on after getting wet', 'Muffled speaker or microphone', 'Fog under the screen or camera', 'Random restarts or ghost touches'] },
      { slug: 'charge-port', name: 'Charge Port', image: 'phone-charge-port',
        summary: 'A loose or dirty port stops the phone from charging. We clean or replace the charging port and check the cable connection.',
        symptoms: ['Only charges at a certain angle', 'Cable feels loose', 'Not charging at all', 'Will not connect to a computer'] },
      { slug: 'other-brands', name: 'Other Brands', image: 'phone-board-repair',
        summary: 'Google Pixel, OnePlus, Xiaomi, Oppo, Huawei and more. Tell us the model and the fault and we will tell you what we can do.',
        symptoms: ['Screen and battery faults', 'Charging problems', 'Software and boot issues', 'Board-level faults'] },
    ],
  },
  {
    slug: 'tablet',
    device: 'Tablet',
    title: 'Tablet Repair',
    heading: 'iPad & tablet repair',
    image: 'tablet-recovery',
    warranty: null,
    repairs: [
      { slug: 'cracked-screen', name: 'Cracked Screen', image: 'tablet-cracked',
        summary: 'Cracked glass or an unresponsive touchscreen on your iPad or Android tablet. We replace the glass or the full display assembly.',
        symptoms: ['Cracked or shattered glass', 'Touch not responding', 'Lines or dead pixels', 'Pencil not registering'] },
      { slug: 'battery', name: 'Battery', image: 'tablet-teardown',
        summary: 'Tablet not lasting the day or shutting down early? We fit a new battery and test charging.',
        symptoms: ['Drains quickly', 'Shuts off unexpectedly', 'Charges very slowly', 'Swollen battery'] },
      { slug: 'camera', name: 'Camera', image: 'tablet-camera',
        summary: 'Blurry or black camera on your tablet. We replace front or rear camera modules.',
        symptoms: ['Blurry photos or video calls', 'Black camera screen', 'Cracked lens'] },
      { slug: 'water-damage', name: 'Water Damage', image: 'tablet-water',
        summary: 'Liquid spill on your tablet? Switch it off and bring it in. We clean and test the board and components.',
        symptoms: ['Will not turn on', 'Display marks or fog', 'Speaker or charging faults'] },
      { slug: 'charge-port', name: 'Charge Port', image: 'usbc-cable',
        summary: 'Tablet not charging or only charging at an angle. We clean or replace the port.',
        symptoms: ['Loose cable', 'Intermittent charging', 'Not charging at all'] },
      { slug: 'other-brands', name: 'Other Brands', image: 'tablet-dark',
        summary: 'Samsung Galaxy Tab, Lenovo, Huawei, Amazon Fire and more. Send us the model and the problem.',
        symptoms: ['Screen and battery faults', 'Charging problems', 'Software issues'] },
    ],
  },
  {
    slug: 'computer',
    device: 'Laptop',
    title: 'Computer & Laptop Repair',
    heading: 'Computer repair',
    image: 'laptop-bench',
    warranty: null,
    repairs: [
      { slug: 'cracked-screen', name: 'Cracked Screen', image: 'laptop-cracked',
        summary: 'Cracked panel, lines across the display or a backlight that has gone dark. We source and fit the right screen for your model.',
        symptoms: ['Cracked or bleeding display', 'Lines or flickering', 'Dim or no backlight', 'Works only on an external monitor'] },
      { slug: 'battery', name: 'Battery', image: 'laptop-battery',
        summary: 'A laptop that only works plugged in needs a new battery. We replace it and check the charging circuit.',
        symptoms: ['Only runs when plugged in', 'Drains fast', 'Not charging', 'Swollen battery lifting the trackpad'] },
      { slug: 'virus-removal', name: 'Virus Removal', image: 'laptop-malware',
        summary: 'Pop-ups, slowdowns or unknown programs. We remove malware, secure the system and keep your files where possible.',
        symptoms: ['Constant pop-ups', 'Browser homepage changed', 'Very slow performance', 'Unknown programs starting up'] },
      { slug: 'water-damage', name: 'Water Damage', image: 'laptop-internals',
        summary: 'Spilled a drink on your laptop? Unplug it, switch it off and bring it in. We clean the board and replace damaged parts.',
        symptoms: ['Will not power on after a spill', 'Sticky or dead keys', 'Random shutdowns'] },
      { slug: 'software', name: 'Software', image: 'laptop-windows',
        summary: 'Windows reinstalls, updates that will not finish, startup errors and slow systems. We get your laptop running smoothly again.',
        symptoms: ['Stuck on boot or blue screen', 'Failed updates', 'Very slow startup', 'Needs a fresh install'] },
      { slug: 'hard-drive', name: 'Hard Drive', image: 'laptop-ssd',
        summary: 'Failing or slow drives replaced, SSD upgrades fitted, and data recovery attempted where possible.',
        symptoms: ['Clicking or grinding noises', 'Drive not detected', 'Very slow to open files', 'Upgrade to a faster SSD'] },
    ],
  },
  {
    slug: 'game-console',
    device: 'Game Console',
    title: 'Game Console Repair',
    heading: 'PlayStation, Xbox & more',
    image: 'console-open',
    warranty: null,
    repairs: [
      { slug: 'hard-drive', name: 'Hard Drive', image: 'console-ssd',
        summary: 'Console stuck on loading, storage errors or a failed drive. We replace or upgrade the internal drive.',
        symptoms: ['Storage or corruption errors', 'Stuck on boot screen', 'Very slow loading', 'Upgrade storage'] },
      { slug: 'hdmi-port', name: 'HDMI Port', image: 'hdmi-port',
        summary: 'No picture on the TV, or a bent and loose HDMI port. We replace the port on the board.',
        symptoms: ['No signal on the TV', 'Picture cuts in and out', 'Bent or loose port', 'Cable will not seat'] },
      { slug: 'power-supply', name: 'Power Supply', image: 'console-power',
        summary: 'Console will not turn on, or turns off by itself. We diagnose and replace the power supply.',
        symptoms: ['Will not power on', 'Turns off during play', 'Clicks but no start-up', 'Burning smell'] },
    ],
  },
  {
    slug: 'hdmi',
    device: 'Game Console',
    title: 'HDMI Repair',
    heading: 'HDMI port repairs',
    image: 'hdmi-port-solder',
    warranty: null,
    repairs: [
      { slug: 'xbox', name: 'Xbox HDMI Repair', image: 'xbox-hdmi',
        summary: 'Xbox One, Series S and Series X HDMI ports replaced when the TV shows no signal or the port is damaged.',
        symptoms: ['No signal on the TV', 'Bent or broken pins', 'Picture flickers'] },
      { slug: 'playstation', name: 'PlayStation HDMI Repair', image: 'ps5-hdmi',
        summary: 'PS4 and PS5 HDMI ports replaced, plus checks on the HDMI encoder chip when there is no picture.',
        symptoms: ['No signal on the TV', 'Loose or bent port', 'Sound but no picture'] },
      { slug: 'switch', name: 'Switch HDMI Repair', image: 'switch-hdmi',
        summary: 'Switch not showing on the TV when docked? We repair the dock HDMI port and USB-C connection.',
        symptoms: ['No picture when docked', 'Dock light on but no signal', 'Loose USB-C port'] },
    ],
  },
];

// Repair form device options; `label` is also what the WhatsApp draft says.
export const DEVICE_TYPES = [
  { value: 'Phone', label: 'Phone' },
  { value: 'Tablet', label: 'Tablet' },
  { value: 'Laptop', label: 'Laptop' },
  { value: 'Game Console', label: 'Gaming console' },
  { value: 'Other', label: 'Other electronics' },
];

// Shown on every repair page. Keep these to claims the shop actually stands behind.
export const PROMISES = [
  { icon: 'calendar-check', title: 'Estimate before any work', text: 'You hear what is wrong and what it will cost before we start.' },
  { icon: 'message-square', title: 'Talk to a person on WhatsApp', text: 'Send photos, ask questions and agree next steps in one chat.' },
  { icon: 'wrench', title: 'Phones to consoles', text: 'Screens, batteries, ports, boards and software under one roof.' },
  { icon: 'shield-check', title: 'Ask about warranty', text: 'Cover for your repair is confirmed along with your estimate.' },
];

export const repairImage = (name) => `/assets/repair/stock/${name}.webp`;

export function findRepair(categorySlug, repairSlug) {
  const category = REPAIR_CATEGORIES.find((c) => c.slug === categorySlug);
  return { category, repair: category?.repairs.find((r) => r.slug === repairSlug) };
}

export function repairRequestPath(device, service) {
  return `/repair?${new URLSearchParams({ device, service })}`;
}
