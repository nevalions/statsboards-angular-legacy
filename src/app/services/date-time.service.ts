import { Injectable } from '@angular/core';
import { TuiDay, TuiTime } from '@taiga-ui/cdk';

@Injectable({
  providedIn: 'root',
})
export class DateTimeService {
  constructor() {}

  // Convert Tui date and time to JavaScript Date object
  convertTuiDateTime(tui_date: (TuiDay | TuiTime)[]): Date | null {
    if (tui_date[0] instanceof TuiDay && tui_date[1] instanceof TuiTime) {
      const tuiDay = tui_date[0];
      const tuiTime = tui_date[1];

      return new Date(
        tuiDay.year,
        tuiDay.month - 1, // JavaScript counts months from 0 to 11
        tuiDay.day,
        tuiTime.hours,
        tuiTime.minutes,
      );
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
      js_date.getMonth() + 1,
      js_date.getDate(),
    );
    const tuiTime = new TuiTime(js_date.getHours(), js_date.getMinutes());

    return [tuiDay, tuiTime];
  }
}
