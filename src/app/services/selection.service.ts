import { Injectable, inject, computed } from '@angular/core';
import { Font } from '../models/font.model';
import { FontStore } from '../store/font.store';

@Injectable({
  providedIn: 'root',
})
export class SelectionService {
  private store = inject(FontStore);
  private readonly initialFonts: Font[] = [
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
