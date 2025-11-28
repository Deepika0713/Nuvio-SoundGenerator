import './CategoryHeader.css';

interface CategoryHeaderProps {
  categoryName: string;
}

export function CategoryHeader({ categoryName }: CategoryHeaderProps) {
  return (
    <div className="category-header">
      <h2 className="category-title">{categoryName}</h2>
    </div>
  );
}
