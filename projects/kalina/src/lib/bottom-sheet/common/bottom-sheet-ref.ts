import { OverlayRef } from "@angular/cdk/overlay";
import { Subject } from "rxjs";

import { KnBottomSheetService } from "../services/bottom-sheet.service";

export class KnBottomSheetRef {
    private afterClosedSubject = new Subject<any>();
  
    afterClosed$ = this.afterClosedSubject.asObservable();
  
    constructor(
      private overlayRef: OverlayRef,
      public id: string,
      private service: KnBottomSheetService
    ) {}
  
    close(result?: any) {
      this.overlayRef.dispose();
      this.afterClosedSubject.next(result);
      this.afterClosedSubject.complete();
      this.service['activeRefs'].delete(this.id); // внутренний доступ
    }
  }