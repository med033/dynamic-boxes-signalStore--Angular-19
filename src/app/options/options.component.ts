import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { trigger, transition, style, animate } from "@angular/animations";
import { BoxComponent } from "./box-option/box-option.component";
import { Box } from "../models/box.model";
import { Option } from "../models/option.model";
import { OptionsStore } from "../store/option.store";
import { BoxesStore } from "../store/boxes.store";

@Component({
  selector: "app-options",
  standalone: true,
  imports: [CommonModule, BoxComponent],
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.css"],
  animations: [
    trigger("gridAnimation", [
      transition(":enter", [
        style({ transform: "translateY(20px)", opacity: 0 }),
        animate(
          "300ms ease",
          style({ transform: "translateY(0)", opacity: 1 })
        ),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsComponent {
  // Inject the signal stores
  optionsStore = inject(OptionsStore);
  boxesStore = inject(BoxesStore);

  ngOnInit(): void {
    // Initialize options from localStorage
    this.optionsStore.initializeFromStorage();
  }

  // Helper for template
  trackByBoxId(index: number, box: Box): number {
    return box.id;
  }

  trackByColumn(column: Box[]): number {
    return column[0].id;
  }

  // Helper for columns in template
  distributeIntoColumns(options: Option[]): Option[][] {
    const columns: Option[][] = [[], [], []];
    options.forEach((option, index) => {
      const columnIndex = index % 3;
      columns[columnIndex].push(option);
    });
    return columns;
  }
}