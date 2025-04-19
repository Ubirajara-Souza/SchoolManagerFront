import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolDetailsDialogComponent } from './school-details-dialog.component';

describe('SchoolDetailsDialogComponent', () => {
  let component: SchoolDetailsDialogComponent;
  let fixture: ComponentFixture<SchoolDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchoolDetailsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
