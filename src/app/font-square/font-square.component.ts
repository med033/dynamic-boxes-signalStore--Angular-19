import {
  Component,
  Input,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { SelectionService } from '../services/selection.service';
import { Font } from '../models/font.model';
import { FontStore } from '../store/font.store';

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
export class FontSquareComponent {
  private selectionService = inject(SelectionService);
  public store = inject(FontStore);
  private logos: { [key: string]: string } = {
    Google: 'G',
    Apple: '',
    Microsoft: '',
    Amazon: 'a',
    Meta: 'M',
    Twitter: '',
    Netflix: 'N',
    Spotify: '',
    Adobe: 'A',
    Intel: '',
    IBM: 'IBM',
    Samsung: 'S',
    Oracle: 'O',
    Nvidia: 'N',
    PayPal: 'P',
  };

  @Input() font!: Font;

  toggleSelection(): void {
    this.selectionService.toggleSelection(this.font.id);
  }

  getLogo(): string {
    return this.logos[this.font.name] || this.font.name[0];
  }
}
