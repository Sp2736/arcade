import { ElementType } from "react";

export type ModuleData = {
  id: number;
  title: string;
  description: string;
  outputs: string[]; // These will display your "Features"
  icon: ElementType;
  time: string; // Used for Phase/Stage labeling
};