import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechFormComponent } from './speech-form.component';

describe('SpeechFormComponent', () => {
  let component: SpeechFormComponent;
  let fixture: ComponentFixture<SpeechFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeechFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeechFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
