import { Injectable } from '@angular/core';
import { TuiDay, TuiTime } from '@taiga-ui/cdk';

@Injectable({
  providedIn: 'root',
})
export class DateTimeService {
  constructor() {}

  convertTuiDateTime(tui_date: (TuiDay | TuiTime)[]): Date | null {
    if (tui_date[0] instanceof TuiDay && tui_date[1] instanceof TuiTime) {
      const tuiDay = tui_date[0];
      const tuiTime = tui_date[1];
      // console.log('tuiDay', tuiDay);
      // console.log('tuiTime', tuiTime);
      const date = new Date(
        tuiDay.year,
        tuiDay.month,
        tuiDay.day,
        tuiTime.hours,
        tuiTime.minutes,
      );
      // console.log('DATE', date);
      return date;
    } else {
      console.error(
        'match_date array does not contain TuiDay and TuiTime instances',
      );
      return null;
    }
  }

  convertJsDateTime(js_date: Date): (TuiDay | TuiTime)[] {
    const tuiDay = new TuiDay(
      js_date.getFullYear(),
      js_date.getMonth(),
      js_date.getDate(),
    );
    const tuiTime = new TuiTime(js_date.getHours(), js_date.getMinutes());
    // console.log('DATE TIME TUI', tuiDay, tuiTime);

    return [tuiDay, tuiTime];
  }
}
