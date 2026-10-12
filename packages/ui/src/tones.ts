export const tones = {
  jungle: "bg-jungle/10 text-jungle",
  pine: "bg-pine/10 text-pine",
  lime: "bg-lime/25 text-pine",
  neutral: "bg-muted text-pine",
  success: "bg-success-bg text-success-text",
  info: "bg-info-bg text-info-text",
  warning: "bg-warning-bg text-warning-text",
  danger: "bg-danger-bg text-danger-text",
  gunmetal: "bg-gunmetal text-platinum",
  platinum: "bg-platinum text-gunmetal",
} as const;

export type Tone = keyof typeof tones;
