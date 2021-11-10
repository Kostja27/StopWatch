
import React, {useCallback,useEffect,useState,useMemo,} from 'react';
import { Observable, Subject } from 'rxjs'
import s from './stopwatch.module.css';
import {map,buffer,debounceTime,filter,takeUntil,} from 'rxjs/operators';

let  StopWatch =()=> {
    const [state, setState] = useState('stop');
    const [time, setTime] = useState(0);

    const stop$ = useMemo(() => new Subject(), []);
    const click$ = useMemo(() => new Subject(), []);

    const start = () => {
    setState('start');
    };

    const stop = useCallback(() => {
        setTime(0);
        setState('stop');
    }, []);

    const reset = useCallback(() => {
        setTime(0);
    },[]);

    const wait = useCallback(() => {
        click$.next();
        setState('wait');
        click$.next();
    }, []);

  useEffect(() => {
      const doubleClick$ = click$.pipe(
      buffer(click$.pipe(debounceTime(300))),
      map((list) => list.length),
      filter((value) => value >= 2),
    );
    const timer$ = new Observable((observer) => {
      let count = 0;
      const intervalId = setInterval(() => {
      observer.next(count += 1);
      console.log(count);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    });

    const subscribtion$ = timer$
      .pipe(takeUntil(doubleClick$))
      .pipe(takeUntil(stop$))
      .subscribe({
        next: () => {
          if (state === 'start') {
            setTime((prev) => prev + 1);
          }
        },
      });

    return (() => {
      subscribtion$.unsubscribe();
    });
    }, [state]);

    let Time=(props)=>{
    let seconds = (props % 60);
    let minutes = Math.floor(props / 60);
    let hours = Math.floor(props / 3600);
    let hoursFormat = (hours < 1 || hours > 23)? '00': (hours >= 1 && hours <= 9) ? `0${hours}` : `${hours}`;
    let minutesFormat = (minutes < 10)? ((minutes === 0) ? '00' : `0${minutes}`):((minutes>60)?((minutes%60>=10)?`${minutes%60}`:`0${minutes%60}`):`${minutes}`) ;
      let secondsFormant = (seconds < 10) ? `0${seconds}` : `${seconds}`
    return `${hoursFormat}:${minutesFormat}:${secondsFormant}`
    }  
        return (<div>
            <div  className={s.StopWatch}>
            {Time(time)}
            </div>
            <button onClick={start}>Start</button>
            <button onClick={stop}>stop</button>
            <button onClick={wait}>Wait</button>
            <button onClick={reset}>Reset</button>
            </div>
        );
    
}
export default StopWatch;