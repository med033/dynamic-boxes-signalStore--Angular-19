import { Injectable } from "@angular/core";
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { Option, inilializedOptions } from "../models/option.model";
import { LocalStorageService } from "../services/local-storage.service";
import { inject } from '@angular/core';

// Define the store state interface
interface OptionsState {
  options: Option[];
  selectedOptionId: number | null;
}

// Initial state
const initialState: OptionsState = {
  options: inilializedOptions,
  selectedOptionId: -1,
};

// Create the signal store
export const OptionsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const localStorage = inject(LocalStorageService);
    
    // Load options from localStorage on initialization
    const loadedOptions = localStorage.loadOptions();
    if (loadedOptions) {
      patchState(store,{ options: loadedOptions });
    } else {
      // Save initial options to localStorage if none exist
      localStorage.saveOptions(store.options());
    }

    return {
      // Set the selected option ID (equivalent to saveSelectedOptionId)
      saveSelectedOptionId: (optionId: number | null) => {
        patchState(store,{ selectedOptionId: optionId });
      },

      // Clear the currently selected option ID
      clearOptionSelection: () => {
        patchState(store,{ selectedOptionId: -1 });
      },

      // Initialize options from localStorage (called in component ngOnInit)
      initializeFromStorage: () => {
        const loadedOptions = localStorage.loadOptions();
        if (loadedOptions) {
          patchState(store,{ options: loadedOptions });
        } else {
          localStorage.saveOptions(store.options());
        }
      }
    };
  })
);