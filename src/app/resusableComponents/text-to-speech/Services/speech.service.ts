import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import Speech from 'speak-tts';
import { speechModel } from '../viewModels/speech-model';
import { voice } from '../viewModels/voice';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  availableVoices:Array<voice>
  speech: Speech;

  savedSpeechesSubject: BehaviorSubject<Array<speechModel>>
  savedSpeechesObservble$: Observable<Array<speechModel>>

  availableVoicesSubject: BehaviorSubject<Array<voice>>
  availableVoicesObservble$: Observable<Array<voice>>

  highlightedSpeechSubject: BehaviorSubject<number>
  highlightedSpeechObservble$: Observable<number>
  constructor() { 
    this.speech = new Speech();

    this.savedSpeechesSubject= new BehaviorSubject(this.getSpeechesFromLocalStorage());
    this.savedSpeechesObservble$=this.savedSpeechesSubject.asObservable()

    this.availableVoicesSubject= new BehaviorSubject(null);
    this.availableVoicesObservble$=this.availableVoicesSubject.asObservable()
    this.updateAvailableVoices()

    this.highlightedSpeechSubject= new BehaviorSubject(null);
    this.highlightedSpeechObservble$=this.highlightedSpeechSubject.asObservable()
  }

   availableVoices$():Observable<Array<voice>> {
    return this.availableVoicesObservble$
  } 
   savedSpeeches$():Observable<Array<speechModel>> {
    return this.savedSpeechesObservble$
  } 
   highlightedSpeech$():Observable<number> {
    return this.highlightedSpeechObservble$
  } 

  updateAvailableVoices(){
    this.speech.init().then((data) => {      
      let availableVoices=data.voices.map((voice) => {
        return {
          name: voice.name,
          language: voice.lang,
        }})
         this.availableVoicesSubject.next(availableVoices);
         this.availableVoices=availableVoices
       })            
  } 

  getSpeechesFromLocalStorage():Array<speechModel> {
    return JSON.parse(
      localStorage.getItem('savedSpeeches') || '[]'
    );
  }
  updateSpeechesInLocalStorage(currentSavedSpeech){
    if (!localStorage.getItem('savedSpeeches'))
    localStorage.setItem('savedSpeeches', JSON.stringify(currentSavedSpeech));
  else {
    let speeches = this.getSpeechesFromLocalStorage();
    let newSpeeches = [...speeches, ...currentSavedSpeech];
    localStorage.removeItem('savedSpeeches');
    localStorage.setItem('savedSpeeches', JSON.stringify(newSpeeches));
  }
  }

  updateSavedSpeeches(){
    this.savedSpeechesSubject.next(this.getSpeechesFromLocalStorage())
  }
  speak(textToSpeech?:FormGroup,speech?:speechModel) {
    let passedText: string;
    if (!speech && textToSpeech) {
      this.speech.voice = textToSpeech.controls.voice.value;
      this.speech.lang = this.availableVoices.find((e) => e.name == this.speech.voice).language;
      passedText = textToSpeech.controls.text.value;
    }  else if (speech && !textToSpeech) {
      this.speech.voice = speech.voice.name;
      this.speech.lang = speech.voice.language;
      passedText = speech.text;
    } 
    
    this.speech.speak({ text: passedText,queue: false })
      .then(() => {
        console.log('Success !');
      })
      .catch((e) => {
        console.error('An error occurred :', e);
      });
      console.log(this.speech);
      
  }
  resume(){
    this.speech.resume()
  }
  pause(){
    this.speech.pause()
  }
  emptySavedSpeeches() {
    localStorage.removeItem('savedSpeeches');
    this.savedSpeechesSubject.next([])
  }
  remove(newArr,index){
    console.log(index);
    if(index===0)
    localStorage.removeItem('savedSpeeches');

    this.savedSpeechesSubject.next(newArr)
    localStorage.removeItem('savedSpeeches');
    localStorage.setItem('savedSpeeches',JSON.stringify(newArr))
  }
  highlightExists(i){
    this.highlightedSpeechSubject.next(i)
  }
}
