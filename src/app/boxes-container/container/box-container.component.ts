import { ChangeDetectionStrategy, Component, inject, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { trigger, transition, style, animate } from "@angular/animations";
import { Box } from "../../models/box.model";
import { BoxComponent } from "../box-component/box-component.component";
import { getOptionValue } from "../../helpers/calculValueOfSelectBox";
import { BoxesStore } from "../../store/boxes.store";
import { OptionsStore } from "../../store/option.store";

@Component({
  selector: "app-box-container",
  standalone: true,
  imports: [CommonModule, BoxComponent],
  templateUrl: "./box-container.component.html",
  styleUrls: ["./box-container.component.css"],
  animations: [
    trigger("selectionAnimation", [
      transition(":enter", [
        style({ transform: "scale(0.95)", opacity: 0 }),
        animate("300ms ease", style({ transform: "scale(1)", opacity: 1 })),
      ]),
      transition(":leave", [
        animate("300ms ease", style({ transform: "scale(0.95)", opacity: 0 })),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxContainerComponent {
  // Inject the signal stores
  boxesStore = inject(BoxesStore);
  optionsStore = inject(OptionsStore);

  /**
   * Computed signal that calculates the total sum of selected boxes' option values.
   * 
   * This computed signal automatically recalculates whenever the boxes or options change,
   * filters for boxes that are selected, retrieves the value for each selected box using 
   * `getOptionValue`, and accumulates the sum of these values.
   */
  selectedCount = computed(() => {
    const boxes = this.boxesStore.boxes();
    const options = this.optionsStore.options();
    
    return boxes
      .filter((box) => box.selected)
      .reduce(
        (sum, box) =>
          sum + (getOptionValue(box.optionid, options) || 0),
        0
      )
      .toFixed(2);
  });

  /**
   * Clears all current selections in the box container.
   * 
   * Invokes the `clearAllSelections` method on the `boxesStore` to remove all box selections,
   * and calls `clearOptionSelection` on the `optionsStore` to reset any selected options.
   */
  clearAllSelections(): void {
    this.boxesStore.clearAllSelections();
    this.optionsStore.clearOptionSelection();
  }

  /**
   * trackBy function for Angular's @for to optimize rendering of box items.
   * Returns a unique identifier for each box, using the box's `id` property if available,
   * or the current index as a fallback.
   *
   * @param index - The index of the current item in the iteration.
   * @param box - The current `Box` object or `null`.
   * @returns The unique identifier for the box, either its `id` or the index.
   */
  trackByBoxId(index: number, box: Box | null): number {
    return box?.id ?? index;
  }
}