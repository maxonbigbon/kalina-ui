import { ChangeDetectionStrategy, Component } from "@angular/core";
import { KnBottomSheetComponent } from "kalina";

@Component({
    selector: 'kn-bottom-sheet-via-service-component',
    imports: [KnBottomSheetComponent],
    templateUrl: './bottom-sheet-via-service.component.html',
    styleUrl: './bottom-sheet-via-service.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomSheetViaServiceComponent {
}