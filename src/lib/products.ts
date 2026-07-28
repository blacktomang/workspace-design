export type Category = "desk" | "chair" | "accessory";

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string;
  /** Monthly rental price in IDR */
  priceMonthly: number;
  /** Max units that can be added (accessories) */
  maxQty?: number;
}

export const DESKS: Product[] = [
  {
    id: "desk-sunset",
    name: "Sunset Oak Desk",
    category: "desk",
    description: "Warm oak top, 140cm — roomy enough for dual monitors.",
    priceMonthly: 350_000,
  },
  {
    id: "desk-bamboo",
    name: "Bamboo Standing Desk",
    category: "desk",
    description: "Sit-stand bamboo desk for tropical workdays.",
    priceMonthly: 450_000,
  },
  {
    id: "desk-compact",
    name: "Compact Nomad Desk",
    category: "desk",
    description: "100cm minimalist desk that fits any villa corner.",
    priceMonthly: 250_000,
  },
];

export const CHAIRS: Product[] = [
  {
    id: "chair-ergo",
    name: "Ergo Flow Chair",
    category: "chair",
    description: "Full lumbar support for long deep-work sessions.",
    priceMonthly: 280_000,
  },
  {
    id: "chair-breeze",
    name: "Bali Breeze Mesh",
    category: "chair",
    description: "Breathable mesh back, made for the island heat.",
    priceMonthly: 200_000,
  },
  {
    id: "chair-studio",
    name: "Studio Stool",
    category: "chair",
    description: "Light, simple, and easy to move around.",
    priceMonthly: 120_000,
  },
];

export const ACCESSORIES: Product[] = [
  {
    id: "acc-monitor",
    name: '27" Monitor',
    category: "accessory",
    description: "Crisp 1440p display, HDMI/USB-C included.",
    priceMonthly: 150_000,
  },
  {
    id: "acc-lamp",
    name: "Desk Lamp",
    category: "accessory",
    description: "Warm dimmable light for late-night sprints.",
    priceMonthly: 75_000,
  },
  {
    id: "acc-plant",
    name: "Monstera Plant",
    category: "accessory",
    description: "A little jungle for your desk. We water it.",
    priceMonthly: 50_000,
  },
  {
    id: "acc-keyboard",
    name: "Keyboard + Mouse",
    category: "accessory",
    description: "Silent wireless combo, island-ready.",
    priceMonthly: 90_000,
  },
];

export const CATALOG: Product[] = [...DESKS, ...CHAIRS, ...ACCESSORIES];

export function getProduct(id: string) {
  return CATALOG.find((p) => p.id === id);
}
