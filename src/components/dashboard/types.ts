import { ElementType } from "react";

export type ModuleData = {
  id: number;
  title: string;
  description: string;
  outputs: string[];
  icon: ElementType;
  time: string;
};