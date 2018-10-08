gcal-events
===========

rxjs enabled gcal events. Calling the function returns an observable of event objects.

Here is example code on how you might use it with React components:
```javascript
getEvents(CALENDAR_ID, KEY, { maxResults: 8, startDay: Date.now() }).subscribe((event) => {
  // do something with your event
});
```

Events look like this:
```javascript
{
  start: DATE_TIME,
  end: DATE_TIME,
  location: string,
  summary: string,
}
```
