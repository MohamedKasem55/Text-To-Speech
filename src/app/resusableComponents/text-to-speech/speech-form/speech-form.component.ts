import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SpeechService } from '../Services/speech.service';
import { speechModel } from '../viewModels/speech-model';
import { voice } from '../viewModels/voice';

@Component({
  selector: 'app-speech-form',
  templateUrl: './speech-form.component.html',
  styleUrls: ['./speech-form.component.css']
})
export class SpeechFormComponent implements OnInit {
  maxlengthErr:boolean
  textToSpeech: FormGroup;
  availableVoices: Array<voice>;
  savedSpeeches: Array<speechModel>
  subscriptions:Array<Subscription>
  constructor(private speechService:SpeechService,private formBuilder:FormBuilder) {
    this.maxlengthErr = false
    this.textToSpeech = this.formBuilder.group({
      text: [null,[Validators.required,Validators.maxLength(50)]],
      voice: [null,[Validators.required]],
    });
    this.subscriptions=[]
   }

  ngOnInit(): void {    
    this.subscriptions.push(this.speechService.savedSpeeches$().subscribe((speeches)=>{
      this.savedSpeeches=speeches
    }))
    this.subscriptions.push(this.speechService.availableVoices$().
    subscribe(voices=>this.availableVoices=voices)
)
  }
  inputUpdate(){
    this.maxlengthErr=this.textToSpeech.controls['text'].errors?this.textToSpeech.controls['text'].errors.maxlength:false
  }
  saveSpeech() {
    let voice = this.textToSpeech.controls.voice.value;
    let currentText = this.textToSpeech.controls.text.value
    let currentSpeech = [{
      text:currentText,
      voice: {
          name: voice,
          language: this.availableVoices.find((e) => e.name == voice).language,
        }
      }];

      let highlighted=null;
       this.savedSpeeches.forEach((speech,i)=>{
          if (JSON.stringify(speech)===JSON.stringify(currentSpeech[0]))
          highlighted=i
      })
      console.log(highlighted);
      
      if (highlighted===null)
    {
    this.speechService.updateSpeechesInLocalStorage(currentSpeech)
    this.speechService.updateSavedSpeeches()
    }
  this.speechService.highlightExists(highlighted)

  }
  speak(){
    this.speechService.speak(this.textToSpeech)
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub)=>sub.unsubscribe())
    
  }
  resume(){
    this.speechService.resume()

  }
  pause(){
    this.speechService.pause()

  }
}
