import { Injectable, inject } from '@angular/core';
import { Font } from '../models/font.model';
import { FontStore } from '../store/font.store';

@Injectable({
  providedIn: 'root',
})
export class SelectionService {
  private store = inject(FontStore);
  private readonly initialFonts: Font[] = [
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

  constructor() {
    this.store.setInitialFonts(this.initialFonts);
  }

  selectSlot(index: number): void {
    this.store.selectSlot(index);
  }

  toggleSelection(id: number): void {
    this.store.toggleSelection(id);
  }

  clearAllSelections(): void {
    this.store.clearAllSelections();
  }

  getSelectedFonts(): Font[] {
    return this.store.selectedFonts();
  }
}
