import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Hľadať miestnosti (napr. 'Zasadacia miestnosť 1')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 pr-12"
        />
        <Button 
          type="submit" 
          variant="ghost" 
          size="sm" 
          className="absolute right-1 top-1/2 -translate-y-1/2"
        >
          Hľadať
        </Button>
      </div>
    </form>
  );
}