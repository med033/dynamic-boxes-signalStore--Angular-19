import {
  Component,
  Input,
  inject,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { SelectionService } from '../services/selection.service';
import { Font } from '../models/font.model';

@Component({
  selector: 'app-font-square',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './font-square.component.html',
  styleUrls: ['./font-square.component.css'],
  animations: [
    trigger('selectionAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.95)', opacity: 0 }),
        animate('300ms ease', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
      transition('* => *', [
        animate('300ms ease', style({ transform: 'scale(1.05)' })),
        animate('150ms ease', style({ transform: 'scale(1)' })),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FontSquareComponent implements OnDestroy {
  private selectionService = inject(SelectionService);

  @Input() font!: Font;
  selectedSlotIndex: number = -1;
  private cdr = inject(ChangeDetectorRef);

  private selectedSlotIndexSub =
    this.selectionService.selectedSlotIndex$.subscribe((index) => {
      this.selectedSlotIndex = index;
      this.cdr.markForCheck();

    });

  ngOnDestroy(): void {
    this.selectedSlotIndexSub.unsubscribe();
  }

  toggleSelection(): void {
    this.selectionService.toggleSelection(this.font.id);
  }

}
