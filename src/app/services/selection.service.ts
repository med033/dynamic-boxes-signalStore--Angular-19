import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Font } from '../models/font.model';

@Injectable({
  providedIn: 'root',
})
export class SelectionService {
  private fonts: Font[] = [
    // Initialize all fonts with empty selectedSlots array
    ...Array(30).fill(null).map((_, index) => ({
      id: index + 1,
      name: [
        'Google', 'Apple', 'Microsoft', 'Amazon', 'Meta', 'Twitter', 'Netflix',
        'Spotify', 'Adobe', 'Intel', 'IBM', 'Samsung', 'Oracle', 'Nvidia',
        'PayPal', 'Dropbox', 'Slack', 'Uber', 'Airbnb', 'Pinterest', 'Reddit',
        'LinkedIn', 'YouTube', 'WhatsApp', 'TikTok', 'Snapchat', 'GitHub',
        'Zoom', 'Twitch', 'Discord'
      ][index],
      family: [
        'Roboto, sans-serif', 'SF Pro Display, sans-serif', 'Segoe UI, sans-serif',
        'Amazon Ember, sans-serif', 'Helvetica Neue, sans-serif', 'Chirp, sans-serif',
        'Netflix Sans, sans-serif', 'Circular, sans-serif', 'Adobe Clean, sans-serif',
        'Intel One, sans-serif', 'IBM Plex Sans, sans-serif', 'SamsungOne, sans-serif',
        'Oracle Sans, sans-serif', 'NVIDIA Sans, sans-serif', 'PayPal Sans, sans-serif',
        'Sharp Grotesk, sans-serif', 'Lato, sans-serif', 'Uber Move, sans-serif',
        'Cereal, sans-serif', 'Helvetica Neue, sans-serif', 'Noto Sans, sans-serif',
        'Source Sans Pro, sans-serif', 'Roboto, sans-serif', 'San Francisco, sans-serif',
        'Proxima Nova, sans-serif', 'Avenir Next, sans-serif', 'Inter, sans-serif',
        'Lato, sans-serif', 'Roobert, sans-serif', 'Uni Sans, sans-serif'
      ][index],
      selected: false,
      selectedSlots: [],
      value: Math.floor(Math.random() * 100) + 1,
    }))
  ];

  private selectedSlotIndex = -1;
  private selectedSlotIndexSubject = new BehaviorSubject<number>(-1);
  selectedSlotIndex$ = this.selectedSlotIndexSubject.asObservable();

  private fontsSubject = new BehaviorSubject<Font[]>(this.fonts);
  fonts$ = this.fontsSubject.asObservable();

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    try {
      const savedFonts = localStorage.getItem('selectedFonts');

      if (savedFonts) {
        const parsedFonts = JSON.parse(savedFonts);
        if (Array.isArray(parsedFonts)) {
          // Restore the selected fonts with their slots
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
      const selectedFonts = this.fonts.filter((f) => f.selected);
      localStorage.setItem('selectedFonts', JSON.stringify(selectedFonts));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  selectSlot(index: number): void {
    this.selectedSlotIndex = index;
    this.selectedSlotIndexSubject.next(index);
    this.saveToLocalStorage();
  }

  toggleSelection(id: number): void {
    // Only allow selection if a slot is selected
    if (this.selectedSlotIndex === -1) {
      // Auto-select the first available slot if none is selected
      const occupiedSlots = new Set(this.fonts.flatMap(f => f.selectedSlots));
      const availableSlot = Array.from({ length: 10 }, (_, i) => i)
        .find(i => !occupiedSlots.has(i));
      
      if (availableSlot !== undefined) {
        this.selectSlot(availableSlot);
      } else {
        return; // No slots available
      }
    }

    // Find the font to toggle
    const fontToToggle = this.fonts.find(f => f.id === id);
    if (!fontToToggle) return;

    // If the font is already in this slot, remove it from this slot
    if (fontToToggle.selectedSlots.includes(this.selectedSlotIndex)) {
      const updatedFonts = this.fonts.map(font => {
        if (font.id === id) {
          const newSelectedSlots = font.selectedSlots.filter(slot => slot !== this.selectedSlotIndex);
          return {
            ...font,
            selectedSlots: newSelectedSlots,
            selected: newSelectedSlots.length > 0
          };
        }
        return font;
      });
      this.fonts = updatedFonts;
    } else {
      // Remove any other font from this slot
      const updatedFonts = this.fonts.map(font => {
        if (font.selectedSlots.includes(this.selectedSlotIndex)) {
          const newSelectedSlots = font.selectedSlots.filter(slot => slot !== this.selectedSlotIndex);
          return {
            ...font,
            selectedSlots: newSelectedSlots,
            selected: newSelectedSlots.length > 0
          };
        }
        return font;
      });

      // Add this font to the selected slot
      this.fonts = updatedFonts.map(font => {
        if (font.id === id) {
          const newSelectedSlots = [...font.selectedSlots, this.selectedSlotIndex];
          return {
            ...font,
            selectedSlots: newSelectedSlots,
            selected: true
          };
        }
        return font;
      });
    }

    this.fontsSubject.next(this.fonts);
    this.saveToLocalStorage();

    // Auto-select the next available slot
    const nextSlotIndex = this.selectedSlotIndex + 1;
    if (nextSlotIndex < 10) {
      this.selectSlot(nextSlotIndex);
    }
  }

  clearAllSelections(): void {
    const updatedFonts = this.fonts.map((font) => ({
      ...font,
      selected: false,
      selectedSlots: []
    }));
    this.fonts = updatedFonts;
    this.fontsSubject.next(this.fonts);
    localStorage.removeItem('selectedFonts');
  }

  getSelectedFonts(): Font[] {
    // Return fonts that have any slots selected
    return this.fonts
      .filter((font) => font.selectedSlots.length > 0)
      .sort((a, b) => Math.min(...a.selectedSlots) - Math.min(...b.selectedSlots));
  }
}
