import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Kalina } from './kalina';

describe('Kalina', () => {
  let component: Kalina;
  let fixture: ComponentFixture<Kalina>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Kalina],
    }).compileComponents();

    fixture = TestBed.createComponent(Kalina);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
