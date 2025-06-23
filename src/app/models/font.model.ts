export interface Font {
  id: number;
  selected: boolean;
  selectedSlots: number[]; // array of slot indices where this font is selected
  value: number; // random value for calculation
}