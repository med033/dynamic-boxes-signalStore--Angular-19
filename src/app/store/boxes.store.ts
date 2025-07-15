import { Injectable } from "@angular/core";
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { Box, inilializedBoxes } from "../models/box.model";
import { LocalStorageService } from "../services/local-storage.service";
import { computed, inject } from '@angular/core';

// Define the store state interface
interface BoxesState {
  boxes: Box[];
  selectedBoxIndex: number;
}

// Initial state
const initialState: BoxesState = {
  boxes: inilializedBoxes,
  selectedBoxIndex: -1,
};

// Create the signal store
export const BoxesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const localStorageService = inject(LocalStorageService);
    
    // Load boxes from localStorage on initialization
    const loadedBoxes = localStorageService.loadBoxes();
    if (loadedBoxes) {
      patchState(store, { boxes: loadedBoxes });
    }

    const saveToLocalStorage = (boxes: Box[]) => {
      localStorageService.saveBoxes(boxes);
    };

    return {
      // Select a box by index
      selectBox: (index: number) => {
        patchState(store,{ selectedBoxIndex: index });
        saveToLocalStorage(store.boxes());
      },

      // Fill the currently selected box with an option
      fillBoxWithOption: (optionId: number) => {
        const currentBoxes = store.boxes();
        const selectedIndex = store.selectedBoxIndex();
        
        const updatedBoxes = currentBoxes.map((box, index) => {
          if (selectedIndex === index) {
            return {
              ...box,
              selected: true,
              optionid: optionId,
            };
          }
          return box;
        });

        patchState(store,{ boxes: updatedBoxes });
        saveToLocalStorage(updatedBoxes);

        // Auto-select the next slot
        const nextSlotIndex = selectedIndex + 1;
        if (nextSlotIndex < 10) {
          patchState(store,{ selectedBoxIndex: nextSlotIndex });
        }
      },

      // Clear all selections
      clearAllSelections: () => {
        patchState(
          store,{ 
          boxes: inilializedBoxes,
          selectedBoxIndex: -1 
        });
        localStorage.removeItem("selectedBoxes");
      },

      // Initialize boxes from localStorage
      initializeFromStorage: () => {
        const loadedBoxes = localStorageService.loadBoxes();
        if (loadedBoxes) {
          patchState(store,{ boxes: loadedBoxes });
        }
      }
    };
  }),
);
