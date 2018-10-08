import sinon from 'sinon';
import axios from 'axios';
import { getEvents } from './gcal-events';

const FAKE_CALENDAR_ID = 'FAKE_CALENDAR_ID';
const FAKE_SECRET_KEY = 'FAKE_SECRET_KEY';
const SUCCESS_EVENTS = [
  { event: 'yeah' },
  { event: 'neah' },
];

describe('getEvents', () => {
  let sandbox;
  beforeEach(() => sandbox = sinon.createSandbox());
  afterEach(() => sandbox.restore());

  test('returns observables of calendar events', (done) => {
    const resolved = new Promise((r) => r({ data: {items: SUCCESS_EVENTS} }));
    sandbox.stub(axios, 'get').returns(resolved);

    const events = getEvents(FAKE_CALENDAR_ID, FAKE_SECRET_KEY);
    events.subscribe((e) => {
      expect(e).toEqual(SUCCESS_EVENTS);
      done();
    });
  });
});
