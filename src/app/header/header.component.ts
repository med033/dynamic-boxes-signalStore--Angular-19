import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { SelectionService } from '../services/selection.service';
import { Font } from '../models/font.model';
import { FontStore } from '../store/font.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('selectionAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.95)', opacity: 0 }),
        animate('300ms ease', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease', style({ transform: 'scale(0.95)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class HeaderComponent {
  private selectionService = inject(SelectionService);
  public store = inject(FontStore);

  selectedFonts = computed(() => {
    const fonts = this.store.fonts();
    const emptyFont = (index: number): Font => ({
      id: -1,
      name: '',
      family: '',
      selected: false,
      selectedSlot: null,
    });

    const slots = Array(10)
      .fill(null)
      .map((_, index) => emptyFont(index));

    fonts.forEach((font) => {
      if (font.selected && font.selectedSlot !== null && font.selectedSlot >= 0) {
        slots[font.selectedSlot] = font;
      }
    });

    return slots;
  });

  selectedCount = computed(() => 
    this.store.fonts().filter(font => font.selected).length
  );
  
  selectSlot(index: number): void {
    this.selectionService.selectSlot(index);
  }

  clearAllSelections(): void {
    this.selectionService.clearAllSelections();
  }

  trackByFontId(index: number, font: Font | null): number {
    return font?.id ?? index;
  }
}
