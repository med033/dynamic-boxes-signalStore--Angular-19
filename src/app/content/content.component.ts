import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { SelectionService } from '../services/selection.service';
import { FontSquareComponent } from '../font-square/font-square.component';
import { Font } from '../models/font.model';
import { FontStore } from '../store/font.store';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, FontSquareComponent],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  animations: [
    trigger('gridAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate(
          '300ms ease',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent {
  private selectionService = inject(SelectionService);
  public  store = inject(FontStore);
  
  showContent = computed(() => {
    const selectedFonts = this.store.selectedFonts();
    return this.store.selectedSlotIndex() > -1;
  });
  constructor() {}

  ngOnDestroy(): void {}

  // Helper for template
  trackByFontId(index: number, font: Font): number {
    return font.id;
  }

  // Helper for columns in template
  distributeIntoColumns(fonts: Font[]): Font[][] {
    const columns: Font[][] = [[], [], []];
    fonts.forEach((font, index) => {
      const columnIndex = index % 3;
      columns[columnIndex].push(font);
    });
    return columns;
  }

  getSelectedFonts(fonts: Font[]): (Font | null)[] {
    const slots: (Font | null)[] = Array(10).fill(null);
    fonts.forEach((font) => {
      if (
        font.selected &&
        font.selectedSlot !== undefined &&
        font.selectedSlot !== null
      ) {
        slots[font.selectedSlot] = font;
      }
    });
    return slots;
  }
}
