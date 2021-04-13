import React, { Component } from 'react';
import {Observable} from "rxjs" 
 import s from './stopwatch.module.css';

class StopWatch extends Component {
    constructor(){
        super();
        this.state = {clicks:0,
            timer:false,
            hours:'00',
        minutes:'00',
        seconds:'00',}
        this.StartStop = this.startTimer.bind(this);
        this.Reset = this.Resets.bind(this);
        this.Wait = this.Waits.bind(this);
        this.waits= new Observable(
            observer=>{
                observer.next(this.setState({timer:false}))
                observer.next(this.stopTimer())
               
            })}
     
     startTimer() {if(this.state.timer==false)
       {this.setState({timer:true})
       this.timerID = setInterval(() => {
        let NewTime=+this.state.seconds+1;
           this.setState({ seconds: NewTime});
           if(this.state.seconds==60){let NewMinutes=+this.state.minutes+1
            this.setState({seconds:0,minutes:NewMinutes})};
         if(this.state.minutes==60){let NewHours=+this.state.hours+1
             this.setState({minutes:0,hours:NewHours})};
       }, 1);}else{this.stopTimer();
        this.setState({timer:false,
            hours:'00',
           minutes:'00',
           seconds:'00',})
     }}
     stopTimer() {
        clearInterval(this.timerID);
     }
     Resets(){if(this.state.timer==true){ 
         this.setState({
        hours:'00',
       minutes:'00',
       seconds:'00',});}
       else(this.startTimer())
     }
     Waits(){
        this.state.clicks++;
        setTimeout(() => {
            this.state.clicks=0
        }, 300);
        if (this.state.clicks == 2){ 
        setTimeout( this.waits.subscribe(), 300);}
     }

    render() {
        return (<div>
            <div  className={s.StopWatch}>
            {this.state.hours}:{this.state.minutes}:{this.state.seconds}
            </div>
            <button onClick={this.StartStop}>Start/Stop</button>
            <button onClick={this.Wait}>Wait</button>
            <button onClick={this.Reset}>Reset</button>
            </div>
        );
    }
}


export default StopWatch;