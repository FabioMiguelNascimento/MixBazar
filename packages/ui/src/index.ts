export { cn } from "cn";
export {
  Button,
  buttonStyles,
  type ButtonProps,
  type ButtonSize,
  type ButtonVariant,
  type IconButtonSize,
  type IconButtonTone,
} from "./button.js";

export const colors = {
  jungle: "oklch(0.6324 0.1518 142.15)",
  platinum: "oklch(0.9551 0 89.88)",
  gunmetal: "oklch(0.376 0.0034 286.24)",
  pine: "oklch(0.48 0.149 142.26)",
  lime: "oklch(0.7933 0.1786 124.45)",
} as const;

export type BrandColor = keyof typeof colors;
