export interface Font {
  id: number;
  name: string;
  family: string;
  selected: boolean;
  selectedSlots: number[]; // array of slot indices where this font is selected
  value: number; // random value for calculation
}