import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Font } from '../models/font.model';

@Injectable({
  providedIn: 'root',
})
export class SelectionService {
  private fonts: Font[] = [
    {
      id: 1,
      name: 'Google',
      family: 'Roboto, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 2,
      name: 'Apple',
      family: 'SF Pro Display, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 3,
      name: 'Microsoft',
      family: 'Segoe UI, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 4,
      name: 'Amazon',
      family: 'Amazon Ember, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 5,
      name: 'Meta',
      family: 'Helvetica Neue, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 6,
      name: 'Twitter',
      family: 'Chirp, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 7,
      name: 'Netflix',
      family: 'Netflix Sans, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 8,
      name: 'Spotify',
      family: 'Circular, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 9,
      name: 'Adobe',
      family: 'Adobe Clean, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 10,
      name: 'Intel',
      family: 'Intel One, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 11,
      name: 'IBM',
      family: 'IBM Plex Sans, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 12,
      name: 'Samsung',
      family: 'SamsungOne, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 13,
      name: 'Oracle',
      family: 'Oracle Sans, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 14,
      name: 'Nvidia',
      family: 'NVIDIA Sans, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 15,
      name: 'PayPal',
      family: 'PayPal Sans, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 16,
      name: 'Dropbox',
      family: 'Sharp Grotesk, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 17,
      name: 'Slack',
      family: 'Lato, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 18,
      name: 'Uber',
      family: 'Uber Move, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 19,
      name: 'Airbnb',
      family: 'Cereal, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 20,
      name: 'Pinterest',
      family: 'Helvetica Neue, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 21,
      name: 'Reddit',
      family: 'Noto Sans, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 22,
      name: 'LinkedIn',
      family: 'Source Sans Pro, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 23,
      name: 'YouTube',
      family: 'Roboto, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 24,
      name: 'WhatsApp',
      family: 'San Francisco, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 25,
      name: 'TikTok',
      family: 'Proxima Nova, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 26,
      name: 'Snapchat',
      family: 'Avenir Next, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 27,
      name: 'GitHub',
      family: 'Inter, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 28,
      name: 'Zoom',
      family: 'Lato, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 29,
      name: 'Twitch',
      family: 'Roobert, sans-serif',
      selected: false,
      selectedSlot: null,
    },
    {
      id: 30,
      name: 'Discord',
      family: 'Uni Sans, sans-serif',
      selected: false,
      selectedSlot: null,
    },
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
      // const savedSlotIndex = localStorage.getItem('selectedSlotIndex');

      if (savedFonts) {
        const parsedFonts = JSON.parse(savedFonts);
        if (Array.isArray(parsedFonts)) {
          // Restore the selected fonts with their slots
          this.fonts = this.fonts.map((font) => {
            const savedFont = parsedFonts.find((f: any) => f.id === font.id);
            if (savedFont && typeof savedFont.selectedSlot === 'number') {
              return {
                ...font,
                selected: true,
                selectedSlot: savedFont.selectedSlot,
              };
            }
            return { ...font, selected: false, selectedSlot: null };
          });

          this.fontsSubject.next(this.fonts);
        }
      }

    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      // If there's an error, clear the corrupted data
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
      const selectedCount = this.fonts.filter((f) => f.selected).length;
      if (selectedCount < 9) {
        this.selectSlot(selectedCount);
      } else {
        return; // No slots available
      }
    }

    // Remove any font currently in the selected slot
    let updatedFonts = this.fonts.map((font) => {
      if (font.selectedSlot === this.selectedSlotIndex) {
        return { ...font, selected: false, selectedSlot: null };
      }
      return font;
    });

    // Remove this font from any other slot it might be in
    updatedFonts = updatedFonts.map((font) => {
      if (font.id === id && font.selected) {
        return { ...font, selected: false, selectedSlot: null };
      }
      return font;
    });

    // Add this font to the selected slot
    updatedFonts = updatedFonts.map((font) => {
      if (font.id === id) {
        return {
          ...font,
          selected: true,
          selectedSlot: this.selectedSlotIndex,
        };
      }
      return font;
    });

    this.fonts = updatedFonts;
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
      selectedSlot: null,
    }));
    this.fonts = updatedFonts;
    this.fontsSubject.next(this.fonts);
    // this.selectedSlotIndex = -1;
    // this.selectedSlotIndexSubject.next(-1);

    // Clear localStorage
    localStorage.removeItem('selectedFonts');
    // localStorage.removeItem('selectedSlotIndex');
  }

  getSelectedFonts(): Font[] {
    // Return fonts sorted by selectedSlot
    return this.fonts
      .filter((font) => font.selected)
      .sort((a, b) => (a.selectedSlot ?? 0) - (b.selectedSlot ?? 0));
  }
}
