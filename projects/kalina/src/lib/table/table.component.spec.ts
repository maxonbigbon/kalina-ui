import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnTableComponent } from './table.component';

describe('KnTableComponent', () => {
  let component: KnTableComponent;
  let fixture: ComponentFixture<KnTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KnTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KnTableComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
