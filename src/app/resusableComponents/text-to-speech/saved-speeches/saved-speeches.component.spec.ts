import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedSpeechesComponent } from './saved-speeches.component';

describe('SavedSpeechesComponent', () => {
  let component: SavedSpeechesComponent;
  let fixture: ComponentFixture<SavedSpeechesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedSpeechesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedSpeechesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
