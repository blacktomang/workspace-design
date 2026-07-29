import {
  ImagePlus,
  Keyboard,
  Lamp,
  Leaf,
  Monitor,
  type LucideIcon,
} from "lucide-react";

/** accessoryId -> icon, shared by the catalog cards. */
export const ACCESSORY_ICONS: Record<string, LucideIcon> = {
  "acc-monitor-27": Monitor,
  "acc-monitor-49-gaming": Monitor,
  "acc-lamp": Lamp,
  "acc-plant": Leaf,
  "acc-keyboard": Keyboard,
  "acc-poster": ImagePlus,
  "acc-laptop-stand": Monitor,
};
