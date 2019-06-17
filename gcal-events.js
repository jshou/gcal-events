import { from } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import axios from 'axios';

const getEvents = (calendarId, calendarSecret, options = {}) => {
  const yesterday = new Date(Date.now() - 864e5); // 864e5 == 86400000 == 24*60*60*1000
  const params = {
    key: calendarSecret,
    maxResults: options.maxResults || 10,
    orderBy: 'startTime',
    singleEvents: true,
    timeMin: options.startDay || yesterday.toISOString()
  };

  const obs = from(axios.get(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, { params }));

  return obs.pipe(
    concatMap((response) => {
      return response.data.items;
    }),
    map((event) => {
      return {
        start: event.start.dateTime,
        end: event.end.dateTime,
        location: event.location,
        summary: event.summary,
        description: event.description,
      };
    }),
  );
};

export {
  getEvents,
}
