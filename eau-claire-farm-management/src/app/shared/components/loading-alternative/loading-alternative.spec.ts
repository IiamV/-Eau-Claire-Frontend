import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplashAnimationComponent } from './loading-alternative';

describe('SplashAnimationComponent', () => {
  let component: SplashAnimationComponent;
  let fixture: ComponentFixture<SplashAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SplashAnimationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SplashAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
