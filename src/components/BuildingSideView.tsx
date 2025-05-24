import { Building, Floor } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from '@/lib/motion';
import { Plus, Minus, ChevronUp, ChevronDown, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BuildingSideViewProps {
  building: Building;
  selectedFloor: Floor | null;
  onFloorSelect: (floor: Floor) => void;
}

export default function BuildingSideView({ 
  building, 
  selectedFloor, 
  onFloorSelect 
}: BuildingSideViewProps) {
  // Sort floors in descending order (top floor first)
  const sortedFloors = [...building.floors].sort((a, b) => b.level - a.level);
  
  return (
    <div className="w-64 border-r flex flex-col bg-card">
      <div className="p-4 border-b bg-background">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-medium text-lg">{building.name}</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{building.address}</p>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 border-b bg-background/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Poschodia</h3>
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-6 w-6">
                    <Plus className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Pridať poschodie</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-6 w-6">
                    <Minus className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Odstrániť poschodie</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {sortedFloors.map((floor, index) => (
              <motion.div
                key={floor.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative cursor-pointer border rounded-md transition-colors bg-card",
                  selectedFloor?.id === floor.id
                    ? "border-primary bg-primary/10"
                    : "hover:bg-accent"
                )}
                style={{ 
                  height: `${Math.max(60, floor.height / 10)}px`,
                  minHeight: '60px',
                }}
                onClick={() => onFloorSelect(floor)}
              >
                <div className="absolute inset-0 flex items-center p-2">
                  <div className="w-full">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {floor.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          Úroveň {floor.level}
                        </span>
                        <div className="flex flex-col">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4"
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4"
                            disabled={index === sortedFloors.length - 1}
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-xs text-muted-foreground">
                        {floor.rooms.length} miestnost{floor.rooms.length === 1 ? '' : floor.rooms.length > 4 ? 'í' : 'i'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {floor.width}' × {floor.height}'
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}