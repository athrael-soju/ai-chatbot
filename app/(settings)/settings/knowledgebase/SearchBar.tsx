import { Input } from '@/components/ui/input';

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export function SearchBar({ searchTerm, onSearchTermChange }: SearchBarProps) {
  return (
    <Input
      type="text"
      placeholder="Search files..."
      value={searchTerm}
      onChange={(e) => onSearchTermChange(e.target.value)}
    />
  );
}
