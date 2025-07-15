import {
  Component,
  Input,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { trigger, transition, style, animate } from "@angular/animations";
import { Option } from "../../models/option.model";
import { OptionsStore } from "../../store/option.store";
import { BoxesStore } from "../../store/boxes.store";

@Component({
  selector: "app-box-option",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./box-option.component.html",
  styleUrls: ["./box-option.component.css"],
  animations: [
    trigger("selectionAnimation", [
      transition(":enter", [
        style({ transform: "scale(0.95)", opacity: 0 }),
        animate("300ms ease", style({ transform: "scale(1)", opacity: 1 })),
      ]),
      transition("* => *", [
        animate("300ms ease", style({ transform: "scale(1.05)" })),
        animate("150ms ease", style({ transform: "scale(1)" })),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxComponent {
  @Input() option!: Option;
  
  // Inject the signal stores
  optionsStore = inject(OptionsStore);
  boxesStore = inject(BoxesStore);

  selectOption(): void {
    this.boxesStore.fillBoxWithOption(this.option.id);
  }
}