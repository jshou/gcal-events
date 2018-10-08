import sinon from 'sinon';
import axios from 'axios';
import moment from 'moment';
import { getEvents } from './gcal-events';

const FAKE_CALENDAR_ID = 'FAKE_CALENDAR_ID';
const FAKE_SECRET_KEY = 'FAKE_SECRET_KEY';
const FAKE_START_TIME = moment('2018-09-30 13:30');
const FAKE_END_TIME = moment('2018-09-30 16:30');
const FAKE_SUMMARY = 'Everything is happening RIGHT NOW';
const FAKE_LOCATION = 'Batcave';
const SUCCESS_EVENTS = [
  {
    "id": "2gdnagg2iusg63n6vf06pbo69c_20181008T040000Z",
    "status": "tentative",
    "created": "2016-03-23T23:37:04.000Z",
    "updated": "2018-10-07T21:15:27.940Z",
    "summary": FAKE_SUMMARY,
    "description": "TBD",
    "location": FAKE_LOCATION,
    "start": {
      "dateTime": FAKE_START_TIME.toISOString(),
      "timeZone": "America/Los_Angeles"
    },
    "end": {
      "dateTime": FAKE_END_TIME.toISOString(),
      "timeZone": "America/Los_Angeles"
    },
    "originalStartTime": {
      "dateTime": "2018-10-07T21:00:00-07:00",
      "timeZone": "America/Los_Angeles"
    },
  },
]

describe('getEvents', () => {
  let sandbox;
  let events;
  let axiosStub;
  let clock;

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    const resolved = new Promise((r) => r({ data: { items: SUCCESS_EVENTS } }));
    axiosStub = sandbox.stub(axios, 'get').returns(resolved);
    clock = sinon.useFakeTimers(); // defaults ot Jan 1 1970
  });

  afterEach(() => sandbox.restore());

  describe('by default', () => {
    let params;

    beforeEach(() => {
      events = getEvents(FAKE_CALENDAR_ID, FAKE_SECRET_KEY);
      params = axiosStub.lastCall.lastArg.params;
    });

    test('gets events from correct calendar', () => {
      const calendarURL = axiosStub.lastCall.args[0];
      expect(calendarURL).toEqual('https://www.googleapis.com/calendar/v3/calendars/FAKE_CALENDAR_ID/events');
    });

    test('uses correct key', () => {
      expect(params.key).toEqual(FAKE_SECRET_KEY);
    });

    test('sets maxResults to 10', () => {
      expect(params.maxResults).toEqual(10);
    });

    test('orders by startTime', () => {
      expect(params.orderBy).toEqual('startTime');
    });

    test('only includes singleEvents', () => {
      expect(params.singleEvents).toBe(true);
    });

    test('starts yesterday', () => {
      expect(params.timeMin).toEqual(moment.utc('1969-12-31').toISOString());
    });

    describe('in the response object for each event', () => {
      test('returns date object for event start', (done) => {
        events.subscribe((e) => {
          expect(e.start.toISOString()).toEqual(FAKE_START_TIME.toISOString());
          done();
        }, (error) => {
          console.log(error);
          done();
        });
      });

      test('returns date object for event end', (done) => {
        events.subscribe((e) => {
          expect(e.end.toISOString()).toEqual(FAKE_END_TIME.toISOString());
          done();
        }, (error) => {
          console.log(error);
          done();
        });
      });

      test('returns event summary', (done) => {
        events.subscribe((e) => {
          expect(e.summary).toEqual(FAKE_SUMMARY);
          done();
        }, (error) => {
          console.log(error);
          done();
        });
      });

      test('returns location', (done) => {
        events.subscribe((e) => {
          expect(e.location).toEqual(FAKE_LOCATION);
          done();
        }, (error) => {
          console.log(error);
          done();
        });
      });
    });
  });

  describe('setting options', () => {
    let params;
    let maxResults;
    let startDay;

    beforeEach(() => {
      maxResults = 100;
      startDay = moment.utc('2008-01-01');

      events = getEvents(FAKE_CALENDAR_ID, FAKE_SECRET_KEY, {
        maxResults,
        startDay,
      });
      params = axiosStub.lastCall.lastArg.params;
    });

    test('sets maxResults to custom value', () => {
      expect(params.maxResults).toEqual(100);
    });

    test('starts on custom date', () => {
      expect(params.timeMin).toEqual(startDay);
    });
  });
});
