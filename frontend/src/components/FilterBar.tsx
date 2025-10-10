import { Button } from "@/components/ui/button";

interface FilterBarProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export const FilterBar = ({ categories, selectedCategory, onCategoryChange }: FilterBarProps) => {
  return (
    <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
      <Button
        variant={selectedCategory === null ? "secondary" : "outline"}
        onClick={() => onCategoryChange(null)}
      >
        Todas
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "secondary" : "outline"}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};