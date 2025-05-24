// src/components/SearchBar.tsx
import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Building, X, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Room, Floor, Building as BuildingType } from "@/types";

interface SearchResult {
  room: Room;
  floor: Floor;
  building: BuildingType;
}

interface SearchBarProps {
  building: BuildingType;
  onSearch: (query: string) => void;
  onResultSelect: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  building,
  onSearch,
  onResultSelect,
  placeholder = "Hľadať miestnosti (napr. 'Zasadacia miestnosť 1')",
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Search function
  const performSearch = (searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    building.floors.forEach((floor) => {
      floor.rooms.forEach((room) => {
        const matchesName = room.name.toLowerCase().includes(query);
        const matchesType = room.type.toLowerCase().includes(query);
        const matchesFloor = floor.name.toLowerCase().includes(query);
        const matchesFacilities = room.facilities.some((facility) =>
          facility.toLowerCase().includes(query)
        );

        if (matchesName || matchesType || matchesFloor || matchesFacilities) {
          results.push({ room, floor, building });
        }
      });
    });

    // Sort by relevance (exact name matches first)
    return results.sort((a, b) => {
      const aExactName = a.room.name.toLowerCase() === query;
      const bExactName = b.room.name.toLowerCase() === query;
      if (aExactName && !bExactName) return -1;
      if (!aExactName && bExactName) return 1;
      return a.room.name.localeCompare(b.room.name);
    });
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim()) {
      const results = performSearch(value);
      setSearchResults(results);
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setSearchResults([]);
      setIsOpen(false);
    }
  };

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);

    if (searchResults.length > 0) {
      const result =
        selectedIndex >= 0 ? searchResults[selectedIndex] : searchResults[0];
      onResultSelect(result);
      setQuery(result.room.name);
      setIsOpen(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || searchResults.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          Math.min(prev + 1, searchResults.length - 1)
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          const result = searchResults[selectedIndex];
          onResultSelect(result);
          setQuery(result.room.name);
          setIsOpen(false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle result selection
  const handleResultClick = (result: SearchResult) => {
    onResultSelect(result);
    setQuery(result.room.name);
    setIsOpen(false);
  };

  // Clear search
  const clearSearch = () => {
    setQuery("");
    setSearchResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="pl-9 pr-20"
            autoComplete="off"
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="h-7 w-7 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="h-7 px-2"
            >
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && searchResults.length > 0 && (
        <Card className="absolute top-full mt-1 w-full z-50 shadow-lg">
          <CardContent className="p-0">
            <div className="max-h-64 overflow-y-auto">
              {searchResults.map((result, index) => (
                <div
                  key={`${result.floor.id}-${result.room.id}`}
                  className={cn(
                    "flex items-center justify-between p-3 cursor-pointer transition-colors border-b last:border-b-0",
                    index === selectedIndex ? "bg-accent" : "hover:bg-accent/50"
                  )}
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {result.room.name}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="h-3 w-3" />
                        <span>{result.floor.name}</span>
                        <span>•</span>
                        <span>{result.room.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline" className="text-xs">
                      {result.room.currentOccupancy}/{result.room.capacity}
                    </Badge>
                    <Badge
                      variant={
                        result.room.activity === "High"
                          ? "destructive"
                          : result.room.activity === "Medium"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {result.room.activity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            {searchResults.length > 5 && (
              <div className="p-2 text-xs text-muted-foreground text-center border-t">
                {searchResults.length} výsledkov nájdených
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* No Results Message */}
      {isOpen && query.trim() && searchResults.length === 0 && (
        <Card className="absolute top-full mt-1 w-full z-50 shadow-lg">
          <CardContent className="p-4 text-center text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Žiadne výsledky pre "{query}"</p>
            <p className="text-xs mt-1">
              Skúste hľadať podľa názvu miestnosti alebo typu
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
