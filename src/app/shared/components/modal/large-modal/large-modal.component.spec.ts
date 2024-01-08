import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeModalComponent } from './large-modal.component';

describe('LargeModalComponent', () => {
  let component: LargeModalComponent;
  let fixture: ComponentFixture<LargeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LargeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LargeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
