import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpeechService } from '../Services/speech.service';
import { speechModel } from '../viewModels/speech-model';

@Component({
  selector: 'app-saved-speeches',
  templateUrl: './saved-speeches.component.html',
  styleUrls: ['./saved-speeches.component.css']
})
export class SavedSpeechesComponent implements OnInit ,OnDestroy{
  savedSpeeches:Array<speechModel>
  subscriptions:Array<Subscription>
  highlightedSpeech:number
  constructor(private speechService:SpeechService) {
    this.subscriptions=[]
   }


  ngOnInit(): void {
    this.subscriptions.push(
      this.speechService.savedSpeeches$().subscribe(speeches=>this.savedSpeeches=speeches))

    this.subscriptions.push(
      this.speechService.highlightedSpeech$().subscribe(
        index=>{
          this.highlightedSpeech=index;
        }
        
        ))
      
  }
  emptySavedSpeeches() {
    this.speechService.emptySavedSpeeches();
  }

  pause(){
    this.speechService.pause()
  }
  resume(){
    this.speechService.resume()
  }
  speak(speech){
    this.speechService.speak(null,speech)
  }
  remove(index){
    let newArr=this.savedSpeeches.filter((e,i)=>i != index)
    this.speechService.remove(newArr,index)
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub)=>sub.unsubscribe())
    
  }
}
