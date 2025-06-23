import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Font } from '../models/font.model';

@Injectable({
  providedIn: 'root',
})
export class SelectionService {
  // All fonts, each with an array of selected slot indices
  private fonts: Font[] = Array.from({ length: 30 }, (_, index) => ({
    id: index + 1,
    selected: false,
    selectedSlots: [],
    value: Math.floor(Math.random() * 100) + 1,
  }));

  private selectedSlotIndex = -1;
  private selectedSlotIndexSubject = new BehaviorSubject<number>(-1);
  selectedSlotIndex$ = this.selectedSlotIndexSubject.asObservable();

  private fontsSubject = new BehaviorSubject<Font[]>(this.fonts);
  fonts$ = this.fontsSubject.asObservable();

  constructor() {
    this.loadFromLocalStorage();
  }

  // --- Persistence ---
  private loadFromLocalStorage(): void {
    try {
      const savedFonts = localStorage.getItem('selectedFonts');
      if (savedFonts) {
        const parsedFonts = JSON.parse(savedFonts);
        if (Array.isArray(parsedFonts)) {
          this.fonts = this.fonts.map((font) => {
            const savedFont = parsedFonts.find((f: any) => f.id === font.id);
            if (savedFont && Array.isArray(savedFont.selectedSlots)) {
              return {
                ...font,
                selected: savedFont.selectedSlots.length > 0,
                selectedSlots: savedFont.selectedSlots,
              };
            }
            return { ...font, selected: false, selectedSlots: [] };
          });
          this.fontsSubject.next(this.fonts);
        }
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      localStorage.removeItem('selectedFonts');
    }
  }

  private saveToLocalStorage(): void {
    try {
      const selectedFonts = this.fonts.filter((f) => f.selectedSlots.length > 0);
      localStorage.setItem('selectedFonts', JSON.stringify(selectedFonts));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  // --- Slot selection ---
  selectSlot(index: number): void {
    this.selectedSlotIndex = index;
    this.selectedSlotIndexSubject.next(index);
    this.saveToLocalStorage();
  }

  // Toggle a font in the currently selected slot
  toggleSelection(fontId: number): void {
    if (this.selectedSlotIndex === -1) {
      // Auto-select the first available slot
      const occupiedSlots = new Set(this.fonts.flatMap((f) => f.selectedSlots));
      const availableSlot = Array.from({ length: 10 }, (_, i) => i).find(
        (i) => !occupiedSlots.has(i)
      );
      if (availableSlot !== undefined) {
        this.selectSlot(availableSlot);
      } else {
        return; // No slots available
      }
    }

    // Remove this slot from any font that currently occupies it
    this.fonts = this.fonts.map((font) => {
      if (font.selectedSlots.includes(this.selectedSlotIndex)) {
        const newSlots = font.selectedSlots.filter(
          (slot) => slot !== this.selectedSlotIndex
        );
        return {
          ...font,
          selected: newSlots.length > 0,
          selectedSlots: newSlots,
        };
      }
      return font;
    });

    // Toggle the font in this slot
    this.fonts = this.fonts.map((font) => {
      if (font.id === fontId) {
        const alreadySelected = font.selectedSlots.includes(this.selectedSlotIndex);
        const newSlots = alreadySelected
          ? font.selectedSlots.filter((slot) => slot !== this.selectedSlotIndex)
          : [...font.selectedSlots, this.selectedSlotIndex];
        return {
          ...font,
          selected: newSlots.length > 0,
          selectedSlots: newSlots,
        };
      }
      return font;
    });

    this.fontsSubject.next(this.fonts);
    this.saveToLocalStorage();

    // Auto-select the next slot
    const nextSlotIndex = this.selectedSlotIndex + 1;
    if (nextSlotIndex < 10) {
      this.selectSlot(nextSlotIndex);
    }
  }

  // Clear all selections
  clearAllSelections(): void {
    this.fonts = this.fonts.map((font) => ({
      ...font,
      selected: false,
      selectedSlots: [],
    }));
    this.fontsSubject.next(this.fonts);
    localStorage.removeItem('selectedFonts');
  }

  // Get all fonts that are selected in any slot
  getSelectedFonts(): Font[] {
    return this.fonts.filter((font) => font.selectedSlots.length > 0);
  }
}
