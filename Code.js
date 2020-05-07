function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function populateCalendar() {
  
  Logger.log("Starting populateCalendar...");
  
  const START_TIME = new Date('2020-01-01');
  const END_TIME = new Date('2021-01-01');
  
  const KEY = '__UQ_GCAL__';
  
  const CALENDAR_NAME = 'UQ Academic Calendar';
  
  const cal = CalendarApp.getCalendarsByName(CALENDAR_NAME)[0];
  
  if (!cal) {
    Logger.log("Calendar not found: " + CALENDAR_NAME);
    return;
  }
  
  const old = cal.getEvents(START_TIME, END_TIME, { search: KEY });
  Logger.log("Deleting " + old.length + " existing events.");
  old.forEach(e => e.deleteEvent());
  
  const SEM = 'Semester 1, 2020\n';
  
  function makeEventDates(name, start, end, description, colour) {
    Logger.log('Creating event ' + name);
    Utilities.sleep(100);
    description = description || '';
    description = description + '\n' + SEM + KEY; 
    const ev = cal.createAllDayEvent(
      name, start, addDays(end, 1),
      { description: description.trim() });
    if (colour)
      ev.setColor(colour);
    return ev;
  }
  
  function makeEvent(name, start, days, description, colour) {
    return makeEventDates(name, start, addDays(start, days-1), description, colour);
  }
  
  const startWeek1 = new Date('2020-02-24');
  for (let w = 1; w <= 13; w++) {
    let shift = w-1;
    if (w >= 4) shift++;
    if (w >= 7) shift++;
    const start = addDays(startWeek1, 7*shift);
    makeEvent('Week ' + w, start, 5, '', CalendarApp.EventColor.MAUVE);
  }
  
  /*
  sem.append(Week(f'Mid-sem Break', '', d('2020-04-13')))
  sem.append(Week(f'ATW 1', '', d('2020-06-08')))
  sem.append(Week(f'ATW 2', '', d('2020-06-15')))
  sem.append(Week(f'ATW 3 / Revision', '', d('2020-06-22')))
  sem.append(Until('Examinations', '', d('2020-06-27'), d('2020-07-11')))
  */
  
  
  makeEvent('Pause Week', new Date('2020-03-16'), 5, '', CalendarApp.EventColor.PALE_GREEN);
  makeEvent('Mid-sem Break', new Date('2020-04-13'), 5, '', CalendarApp.EventColor.PALE_GREEN);
  makeEvent('Additional Teaching Week 1', new Date('2020-06-08'), 5, '', CalendarApp.EventColor.CYAN);
  makeEvent('Additional Teaching Week 2', new Date('2020-06-15'), 5, '', CalendarApp.EventColor.CYAN);
  makeEvent('Additional Teaching Week 3 / Revision', new Date('2020-06-22'), 5, '', CalendarApp.EventColor.CYAN);
  makeEventDates('Examinations', new Date('2020-06-27'), new Date('2020-07-11'), '', CalendarApp.EventColor.ORANGE);
}