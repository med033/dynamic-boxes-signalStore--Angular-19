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
              if (savedFont && Array.isArray(savedFont.selectedSlots)) {
                return {
                  ...font,
                  selected: savedFont.selectedSlots.length > 0,
                  selectedSlots: savedFont.selectedSlots,
                };
              }
              return { ...font, selected: false, selectedSlots: [] };
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
      const totalSlotsFilled = new Set(currentFonts.flatMap(f => f.selectedSlots)).size;

      // If no slot is selected, select the next available slot if possible
      if (currentSlotIndex === -1) {
        if (totalSlotsFilled >= 9) {
          return; // Maximum selections reached
        }
        this.selectSlot(totalSlotsFilled);
      }

      // Get the font being toggled
      const targetFont = currentFonts.find(font => font.id === id);
      if (!targetFont) {
        return; // Font not found
      }

      let updatedFonts = currentFonts.map(font => {
        if (font.id === id) {
          // Handle the target font
          const slots = new Set(font.selectedSlots);
          if (slots.has(currentSlotIndex)) {
            // If font is already in this slot, remove it
            slots.delete(currentSlotIndex);
          } else {
            // Add font to this slot
            slots.add(currentSlotIndex);
          }
          return {
            ...font,
            selected: slots.size > 0,
            selectedSlots: Array.from(slots).sort((a, b) => a - b)
          };
        }
        // Remove current slot from other fonts if it exists
        if (font.selectedSlots.includes(currentSlotIndex)) {
          const slots = font.selectedSlots.filter(slot => slot !== currentSlotIndex);
          return {
            ...font,
            selected: slots.length > 0,
            selectedSlots: slots
          };
        }
        return font;
      });

      patchState(store, { fonts: updatedFonts });
      this.saveToLocalStorage();

      // Move to next slot if available
      const nextSlotIndex = store.selectedSlotIndex() + 1;
      if (nextSlotIndex < 10) {
        this.selectSlot(nextSlotIndex);
      }
    },

    clearAllSelections() {
      const updatedFonts = store.fonts().map((font) => ({
        ...font,
        selected: false,
        selectedSlots: [],
      }));
      patchState(store, { fonts: updatedFonts });
      localStorage.removeItem('selectedFonts');
    },

    setInitialFonts(fonts: Font[]) {
      const fontsWithEmptySlots = fonts.map(font => ({
        ...font,
        selectedSlots: [],
        selected: false,
      }));
      patchState(store, { fonts: fontsWithEmptySlots });
      this.loadFromLocalStorage();
    }
  })),
  withComputed((store) => ({
    selectedFonts: computed(() => 
      store.fonts()
        .filter((font) => font.selected)
        .sort((a, b) => ((a.selectedSlots[0] ?? 0) - (b.selectedSlots[0] ?? 0)))
    ),
    selectedCount: computed(() => 
      store.fonts()
        .filter((font) => font.selected)
        .reduce((sum, font) => sum + font.value, 0)
    )
  }))
);
