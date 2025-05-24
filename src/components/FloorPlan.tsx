import { useState, useEffect } from 'react';
import { Floor, Room } from '@/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from '@/lib/motion';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

interface FloorPlanProps {
  floor: Floor | null;
  selectedRoom: Room | null;
  onRoomSelect: (room: Room) => void;
}

export default function FloorPlan({ 
  floor, 
  selectedRoom, 
  onRoomSelect 
}: FloorPlanProps) {
  const [scale, setScale] = useState(0.8);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(scale + delta, 0.5), 2);
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setStartPosition({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (floor) {
      const container = document.querySelector('.floor-plan-container');
      if (container) {
        const containerRect = container.getBoundingClientRect();
        setPosition({
          x: (containerRect.width - floor.width * scale) / 2,
          y: (containerRect.height - floor.height * scale) / 2
        });
      }
    }
  }, [floor, scale]);

  // Function to generate a random performance value for each room
  const getRoomPerformance = (roomId: string) => {
    // Using roomId as seed for consistent but different values
    const hash = roomId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 30 + (hash % 70); // Generates values between 30 and 100
  };

  if (!floor) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-muted-foreground">
        Vyberte poschodie pre zobrazenie plánu
      </div>
    );
  }

  return (
    <div className="floor-plan-container relative w-full h-full overflow-hidden bg-white">
      <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm p-2 rounded-md border shadow-sm">
        <h2 className="font-medium">{floor.name}</h2>
        <p className="text-sm text-muted-foreground">Úroveň {floor.level}</p>
      </div>
      
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
          Mierka: {Math.round(scale * 100)}%
        </Badge>
        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm flex items-center gap-1">
          <Info className="h-3 w-3" />
          Ťahajte pre posun, scrollujte pre zoom
        </Badge>
      </div>
      
      <div 
        className="w-full h-full cursor-grab"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={floor.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: '0 0',
            }}
          >
            <div className="relative">
              {floor.rooms.map((room) => {
                const performance = getRoomPerformance(room.id);
                return (
                  <motion.div
                    key={room.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "absolute cursor-pointer",
                      selectedRoom?.id === room.id && "ring-2 ring-primary ring-inset"
                    )}
                    style={{
                      left: `${room.x}px`,
                      top: `${room.y}px`,
                      width: `${room.width}px`,
                      height: `${room.height}px`,
                    }}
                    onClick={() => onRoomSelect(room)}
                  >
                    <div className="absolute inset-0 border-[2px] border-black" />
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                      <div className="text-xs font-medium uppercase">{room.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {room.width}' x {room.height}'
                      </div>
                      
                      {/* Score Display */}
                      <div className={cn(
                        "mt-2 text-lg font-bold px-2 py-1 rounded",
                        performance >= 80 ? "bg-green-100 text-green-700" :
                        performance >= 60 ? "bg-blue-100 text-blue-700" :
                        performance >= 40 ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      )}>
                        {performance}/100
                      </div>
                    </div>

                    {/* Dvere */}
                    <div className="absolute bottom-0 left-4 w-6 h-6">
                      <div className="relative w-full h-full">
                        <div className="absolute bottom-0 left-0 w-6 h-[2px] bg-black" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-t-2 border-l-2 border-black rounded-tl-full" />
                      </div>
                    </div>

                    {/* Okná */}
                    {room.type !== 'Storage' && room.type !== 'Bathroom' && (
                      <>
                        <div className="absolute top-0 left-1/4 right-1/4 flex justify-center">
                          <div className="w-8 h-1 bg-white border-2 border-black" />
                        </div>
                        {room.width > 200 && (
                          <div className="absolute bottom-0 left-1/4 right-1/4 flex justify-center">
                            <div className="w-8 h-1 bg-white border-2 border-black" />
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}