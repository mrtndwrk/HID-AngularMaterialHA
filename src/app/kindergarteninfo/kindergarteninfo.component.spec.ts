import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KindergarteninfoComponent } from './kindergarteninfo.component';

describe('KindergarteninfoComponent', () => {
  let component: KindergarteninfoComponent;
  let fixture: ComponentFixture<KindergarteninfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KindergarteninfoComponent]
    });
    fixture = TestBed.createComponent(KindergarteninfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
