import { InjectionToken } from '@angular/core';

import type { KnBottomSheetConfig } from './bottom-sheet.types';

export type KnBottomSheetDefaultConfig = Omit<KnBottomSheetConfig, 'id'>;

export const KN_BOTTOM_SHEET_DEFAULT_CONFIG = new InjectionToken<Partial<KnBottomSheetDefaultConfig>>('KN_BOTTOM_SHEET_DEFAULT_CONFIG');
export const KN_BOTTOM_SHEET_OUTSIDE_CONTEXT = new InjectionToken<KnBottomSheetConfig & {isOutsideCreation: boolean}>('KN_BOTTOM_SHEET_OUTSIDE_CONTEXT');