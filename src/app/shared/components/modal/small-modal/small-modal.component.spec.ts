import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallModalComponent } from './small-modal.component';

describe('SmallModalComponent', () => {
  let component: SmallModalComponent;
  let fixture: ComponentFixture<SmallModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmallModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmallModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
