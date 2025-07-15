import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Box } from "../../models/box.model";
import { getOptionValue } from "../../helpers/calculValueOfSelectBox";
import { BoxesStore } from "../../store/boxes.store";
import { OptionsStore } from "../../store/option.store";

@Component({
  selector: "app-box-component",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./box-component.component.html",
  styleUrls: ["./box-component.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxComponent {
  // Inject the signal stores
  boxesStore = inject(BoxesStore);
  optionsStore = inject(OptionsStore);

  // The box to display (passed from parent)
  @Input() box!: Box;
  // The index of this box in the list (passed from parent)
  @Input() index: number = 0;

  // Utility function to get the value of an option
  getOptionValue = getOptionValue;

  // Called when a box is selected in the UI
  selectBox = (index: number): void => {
    this.boxesStore.selectBox(index);
    this.optionsStore.saveSelectedOptionId(this.box.optionid);
  };
}