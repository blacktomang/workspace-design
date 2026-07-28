export type Category = "desk" | "chair" | "accessory";

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string;
  /** Weekly rental price in USD (matches monis.rent pricing style) */
  priceWeekly: number;
  /** Max units that can be added (accessories) */
  maxQty?: number;
}

export const DESKS: Product[] = [
  {
    id: "desk-standing",
    name: "Electrical Adjustable Desk",
    category: "desk",
    description: "Sit-stand desk with memory controller. 120×60cm black top.",
    priceWeekly: 5,
  },
  {
    id: "desk-wood",
    name: "Classic Office Desk",
    category: "desk",
    description: "Warm oak top with a drawer unit for your stuff.",
    priceWeekly: 4,
  },
  {
    id: "desk-compact",
    name: "Compact Nomad Desk",
    category: "desk",
    description: "Minimal white desk that fits any villa corner.",
    priceWeekly: 3,
  },
];

export const CHAIRS: Product[] = [
  {
    id: "chair-ergo",
    name: "Ergonomic Office Chair",
    category: "chair",
    description: "Full mesh back, headrest, and lumbar support.",
    priceWeekly: 4,
  },
  {
    id: "chair-task",
    name: "Bali Breeze Task Chair",
    category: "chair",
    description: "Light, breathable, made for the island heat.",
    priceWeekly: 3,
  },
  {
    id: "chair-stool",
    name: "Studio Stool",
    category: "chair",
    description: "Simple wooden stool — easy to move around.",
    priceWeekly: 1.5,
  },
];

export const ACCESSORIES: Product[] = [
  {
    id: "acc-monitor",
    name: '27" 4K Monitor',
    category: "accessory",
    description: "Crisp 4K display with USB-C. Stack up to three.",
    priceWeekly: 10,
    maxQty: 3,
  },
  {
    id: "acc-keyboard",
    name: "Keyboard + Mouse",
    category: "accessory",
    description: "Logitech MX-style wireless combo.",
    priceWeekly: 3,
    maxQty: 1,
  },
  {
    id: "acc-lamp",
    name: "Smart LED Desk Lamp",
    category: "accessory",
    description: "Minimal bar lamp, warm to cool dimming.",
    priceWeekly: 2,
    maxQty: 1,
  },
  {
    id: "acc-plant",
    name: "Monstera Plant",
    category: "accessory",
    description: "A little jungle for your setup. We water it.",
    priceWeekly: 1.5,
    maxQty: 2,
  },
  {
    id: "acc-poster",
    name: "Custom Poster",
    category: "accessory",
    description: "Upload any image — we print and frame it.",
    priceWeekly: 1,
    maxQty: 1,
  },
];

export const CATALOG: Product[] = [...DESKS, ...CHAIRS, ...ACCESSORIES];

export function getProduct(id: string) {
  return CATALOG.find((p) => p.id === id);
}
