import { from } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import axios from 'axios';

const getEvents = (calendarId, calendarSecret, options = {}) => {
  const yesterday = new Date(Date.now() - 864e5); // 864e5 == 86400000 == 24*60*60*1000
  const params = {
    key: calendarSecret,
    maxResults: 8,
    orderBy: 'startTime',
    singleEvents: true,
    timeMin: yesterday.toISOString()
  };

  const obs = from(axios.get(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, { params }));

  return obs.pipe(map((response) => {
    return response.data.items;
  }));
};

export {
  getEvents,
}
