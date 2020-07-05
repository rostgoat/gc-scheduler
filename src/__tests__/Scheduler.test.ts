import { Scheduler } from '../index';

const PROJECT_ID = 'nicejobs-task-scheduler';
const QUEUE_ID = 'testq';
const NICEJOBS_URL = 'https://api.nicejob.co/v2/process';
const CUSTOM_DATE = new Date('2020-08-01T12:00:00');

describe('schedule', () => {
  test('should be able to schedule a task with custom headers and body and default HTTP method', async () => {
    const date = CUSTOM_DATE;
    const request = {
      url: NICEJOBS_URL,
      headers: {
        Authorization: 'Bearer faketoken',
      },
      body: {
        id: 123,
        metadata: { foo: 'bar' },
      },
    };
    const scheduler = new Scheduler(PROJECT_ID, QUEUE_ID);
    const task = await scheduler.schedule({ request, date });
    const responseHeaders = Object.values(task.httpRequest.headers);

    expect(task).toBeTruthy();
    expect(task.httpRequest.httpMethod).toEqual('POST');
    responseHeaders.forEach((header) => expect(header).not.toEqual('application-json'));
  });

  test('should be able to schedule a task with just a URL and use default values', async () => {
    const date = CUSTOM_DATE;
    const request = {
      url: NICEJOBS_URL,
    };
    const scheduler = new Scheduler(PROJECT_ID, QUEUE_ID);
    const task = await scheduler.schedule({ request, date });
    const responseHeaders = Object.values(task.httpRequest.headers);

    expect(task).toBeTruthy();
    expect(task.httpRequest.httpMethod).toEqual('POST');
    expect(responseHeaders.includes('application-json')).toBeTruthy();
  });
});

describe('delete', () => {
  test('should be able to schedule a task and then delete it', async () => {
    const date = CUSTOM_DATE;
    const request = {
      url: NICEJOBS_URL,
      headers: {
        Authorization: 'Bearer faketoken',
      },
      body: {
        id: 123,
        metadata: { foo: 'bar' },
      },
    };
    const scheduler = new Scheduler(PROJECT_ID, QUEUE_ID);
    const task = await scheduler.schedule({ request, date });
    await scheduler.delete(task.name);

    try {
      await scheduler.getTask(task);
    } catch (err) {
      expect(err).toEqual(
        new Error(
          '5 NOT_FOUND: The task no longer exists, though a task with this name existed recently. The task either successfully completed or was deleted.',
        ),
      );
    }
  });
});
