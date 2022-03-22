import { Layer } from "@/pages/analysis/metrics/ModuleCouplingTree/report";

export type LayerKeys = keyof typeof Layer;
export type Quota = {
  [key in LayerKeys]: string[];
};

export interface ProfileConfig {
  layer: LayerKeys;
  quota: string;
  operator: "BIGGER" | "LESS" | "EQUAL";
  value: number;
}

export interface Profile {
  id?: number;
  name: string;
  config: ProfileConfig[];
}