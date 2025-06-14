import { computed } from '@angular/core';
import { signalStore, withComputed, withMethods, withState, patchState } from '@ngrx/signals';
import { Font } from '../models/font.model';

export type FontState = {
  fonts: Font[];
  selectedSlotIndex: number;
};

const initialState: FontState = {
  fonts: [],
  selectedSlotIndex: -1
};

export const FontStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    loadFromLocalStorage() {
      try {
        const savedFonts = localStorage.getItem('selectedFonts');
        if (savedFonts) {
          const parsedFonts = JSON.parse(savedFonts);
          if (Array.isArray(parsedFonts)) {
            const updatedFonts = store.fonts().map((font) => {
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
            patchState(store, { fonts: updatedFonts });
          }
        }
      } catch (error) {
        console.warn('Failed to load from localStorage:', error);
        localStorage.removeItem('selectedFonts');
      }
    },

    saveToLocalStorage() {
      try {
        const selectedFonts = store.fonts().filter((f) => f.selected);
        localStorage.setItem('selectedFonts', JSON.stringify(selectedFonts));
      } catch (error) {
        console.warn('Failed to save to localStorage:', error);
      }
    },
    selectSlot(index: number) {
      patchState(store, { selectedSlotIndex: index });
      this.saveToLocalStorage();
    },
    toggleSelection(id: number) {
      const currentFonts = store.fonts();
      const currentSlotIndex = store.selectedSlotIndex();
      const selectedCount = currentFonts.filter((f) => f.selected).length;

      // If no slot is selected, select the next available slot if possible
      if (currentSlotIndex === -1) {
        if (selectedCount >= 9) {
          return; // Maximum selections reached
        }
        this.selectSlot(selectedCount);
      }

      // Get the font being toggled
      const targetFont = currentFonts.find(font => font.id === id);
      if (!targetFont) {
        return; // Font not found
      }

      // If the font is already selected in a different slot, unselect it first
      let updatedFonts = currentFonts.map(font => {
        if (font.id === id && font.selected) {
          return { ...font, selected: false, selectedSlot: null };
        }
        return font;
      });

      // Unselect any font in the current slot
      updatedFonts = updatedFonts.map(font => {
        if (font.selectedSlot === store.selectedSlotIndex()) {
          return { ...font, selected: false, selectedSlot: null };
        }
        return font;
      });

      // Select the target font in the current slot
      updatedFonts = updatedFonts.map(font => {
        if (font.id === id) {
          return {
            ...font,
            selected: true,
            selectedSlot: store.selectedSlotIndex(),
          };
        }
        return font;
      });
      patchState(store, { fonts: updatedFonts });
      this.saveToLocalStorage();

      // Move to next slot if available
      const nextSlotIndex = store.selectedSlotIndex() + 1;
      if (nextSlotIndex < 9) { // Changed from 10 to 9 to match max slot count
        this.selectSlot(nextSlotIndex);
      }
    },

    clearAllSelections() {
      const updatedFonts = store.fonts().map((font) => ({
        ...font,
        selected: false,
        selectedSlot: null,
      }));
      patchState(store, { fonts: updatedFonts });
      localStorage.removeItem('selectedFonts');
    },

    setInitialFonts(fonts: Font[]) {
      patchState(store, { fonts });
      this.loadFromLocalStorage();
    }
  })),
  withComputed((store) => ({
    selectedFonts: computed(() => 
      store.fonts()
        .filter((font) => font.selected)
        .sort((a, b) => (a.selectedSlot ?? 0) - (b.selectedSlot ?? 0))
    )
  }))
);
