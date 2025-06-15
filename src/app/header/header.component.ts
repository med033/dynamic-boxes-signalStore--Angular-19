import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { SelectionService } from '../services/selection.service';
import { Font } from '../models/font.model';
import { Observable, map } from 'rxjs';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
 
})
export class HeaderComponent {
  private selectionService = inject(SelectionService);

  selectedSlotIndex$ = this.selectionService.selectedSlotIndex$;
  // Create an array of 10 slots with empty or selected fonts
  selectedFonts$ = this.selectionService.fonts$.pipe(
    map((fonts) => {
      const emptyFont = (index: number): Font => ({
        id: -1,
        name: '',
        family: '',
        selected: false,
        selectedSlots: [],
        value: 0,
      });

      const slots = Array(10)
        .fill(null)
        .map((_, index) => emptyFont(index));

      fonts.forEach((font) => {
        if (font.selected) {
          font.selectedSlots.forEach(slotIndex => {
            if (slotIndex >= 0 && slotIndex < 10) {
              slots[slotIndex] = font;
            }
          });
        }
      });

      return slots;
    })
  );
  // Calculate selected count using font values
  selectedCount$ = this.selectedFonts$.pipe(
    map(fonts => fonts
      .filter(font => font.id !== -1)
      .reduce((sum, font) => sum + (font.value || 0), 0)
    )
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
