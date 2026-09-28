'use client';

import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';

interface FilterState {
  priceRange: number[];
  ratings: number[];
  options: string[];
}

interface FilterSidebarProps {
  category: string;
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}

export default function FilterSidebar({ category, onFilterChange, className = '' }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([1000, 50000]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  
  // The `FilterSidebar` is remounted via `key={category}` when the category changes
  // so a dedicated reset effect is not required and avoids calling setState inside an effect.

  // Notify parent of changes
  useEffect(() => {
    onFilterChange({
      priceRange,
      ratings: selectedRatings,
      options: selectedOptions
    });
  }, [priceRange, selectedRatings, selectedOptions, onFilterChange]);

  const handleRatingChange = (rating: number) => {
    setSelectedRatings(prev => 
      prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]
    );
  };

  const handleOptionChange = (option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const getFilterOptions = () => {
    switch (category) {
      case 'flights':
        return {
          title: 'Airlines & Stops',
          items: ['Non-stop', '1 Stop', 'Indigo', 'Vistara', 'Air India']
        };
      case 'hotels':
        return {
          title: 'Amenities',
          items: ['Breakfast Included', 'Free WiFi', 'Pool', 'Spa', 'Gym']
        };
      case 'trains':
        return {
          title: 'Class & Type',
          items: ['AC Chair Car', 'Sleeper', '1A', '2A', '3A']
        };
      case 'buses':
        return {
          title: 'Bus Type',
          items: ['AC', 'Non-AC', 'Sleeper', 'Seater', 'Volvo']
        };
      case 'cabs':
        return {
          title: 'Car Type',
          items: ['Sedan', 'SUV', 'Hatchback', 'Luxury']
        };
      default:
        return { title: 'Options', items: [] };
    }
  };

  const options = getFilterOptions();

  return (
    <div className={`bg-white p-6 rounded-xl border border-border shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg">Filters</h3>
      </div>
      
      <div className="space-y-8">
        {/* Price Range */}
        <div>
          <label className="text-sm font-bold mb-4 block">Price Range</label>
          <input 
            type="range" 
            min="1000" 
            max="50000" 
            step="1000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer" 
          />
          <div className="flex justify-between text-sm font-medium text-muted-foreground mt-2">
            <span>₹{priceRange[0]}</span>
            <span className="text-primary">₹{priceRange[1]}</span>
          </div>
        </div>
        
        {/* Rating Filter (except for flights/trains maybe, but keeping consistent for now) */}
        <div className="border-t border-border pt-6">
          <label className="text-sm font-bold mb-4 block">Rating</label>
          <div className="space-y-3">
            {[4, 3, 2].map((rating) => (
              <label key={rating} className="flex items-center gap-3 text-sm cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedRatings.includes(rating) ? 'bg-primary border-primary' : 'border-gray-300 group-hover:border-primary'}`}>
                  {selectedRatings.includes(rating) && <CheckIcon className="w-3 h-3 text-white" />}
                </div>
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={selectedRatings.includes(rating)}
                  onChange={() => handleRatingChange(rating)}
                />
                <span className="flex items-center gap-1 group-hover:text-primary transition-colors">
                  {rating}+ Stars
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Dynamic Category Options */}
        <div className="border-t border-border pt-6">
          <label className="text-sm font-bold mb-4 block">{options.title}</label>
          <div className="space-y-3">
            {options.items.map((item) => (
              <label key={item} className="flex items-center gap-3 text-sm cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedOptions.includes(item) ? 'bg-primary border-primary' : 'border-gray-300 group-hover:border-primary'}`}>
                  {selectedOptions.includes(item) && <CheckIcon className="w-3 h-3 text-white" />}
                </div>
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={selectedOptions.includes(item)}
                  onChange={() => handleOptionChange(item)}
                />
                <span className="group-hover:text-primary transition-colors">{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
