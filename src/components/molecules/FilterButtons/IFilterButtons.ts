export interface FilterButtonsProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}
