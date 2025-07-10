import React from 'react';
import './FilterButtons.css';
import { FilterButtonsProps } from './IFilterButtons';

export const FilterButtons: React.FC<FilterButtonsProps> = ({
  filters,
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="filter-group">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`filter-button ${activeFilter === filter ? 'active' : ''}`}
          onClick={() => onFilterChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};
