export interface IFilter {
  value: string;
  onSearch: (text: string) => void;
  onClose: () => void;
}
