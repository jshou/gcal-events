import sinon from 'sinon';
import axios from 'axios';
import moment from 'moment';
import { getEvents } from './gcal-events';

const FAKE_CALENDAR_ID = 'FAKE_CALENDAR_ID';
const FAKE_SECRET_KEY = 'FAKE_SECRET_KEY';
const SUCCESS_EVENTS = [
  { event: 'yeah' },
  { event: 'neah' },
];

describe('getEvents', () => {
  let sandbox;
  let events;
  let axiosStub;
  let clock;

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    const resolved = new Promise((r) => r({ data: {items: SUCCESS_EVENTS} }));
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

    test('returns observables of calendar events', (done) => {
      events.subscribe((e) => {
        expect(e).toEqual(SUCCESS_EVENTS);
        done();
      });
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
  });
});
