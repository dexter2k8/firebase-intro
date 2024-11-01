export interface IDonutData {
  name: string;
  value: number;
}

export interface IDonutOptions {
  data: IDonutData[];
  colors: string[];
}

export interface IDonutProps {
  title: string;
  data: IDonutData[];
  colors: string[];
  isLoading?: boolean;
}
