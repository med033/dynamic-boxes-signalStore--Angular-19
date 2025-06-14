export interface Font {
  id: number;
  name: string;
  family: string;
  selected: boolean;
  selectedSlot: number | null; // slot index if selected, otherwise null
}