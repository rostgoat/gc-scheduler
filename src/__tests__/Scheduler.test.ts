import { Scheduler } from "../index";

const PROJECT_ID = "nicejobs-task-scheduler";
const QUEUE_ID = "testq";

describe('schedule', () => {
    
    test("should be able to send request with custom header and body but no method", async () => {
      const date = new Date("2020-08-01T12:00:00");
      const request = {
        url: "https://api.nicejob.co/v2/process",
        headers: {
          Authorization: "Bearer faketoken",
        },
        body: {
          id: 123,
          metadata: { foo: "bar" },
        },
      };
      const scheduler = new Scheduler(PROJECT_ID, QUEUE_ID);
      const task = await scheduler.schedule({ request, date });
      const responseHeaders = Object.values(task.httpRequest.headers);
      
      expect(task).toBeTruthy();
      expect(task.httpRequest.httpMethod).toEqual('POST');
      responseHeaders.forEach(header => expect(header).not.toEqual('application-json'))
    });

    test("should be able to send request with just a URL", async () => {
        const date = new Date("2020-08-01T12:00:00");
        const request = {
          url: "https://api.nicejob.co/v2/process",
        };
        const scheduler = new Scheduler(PROJECT_ID, QUEUE_ID);
        const task = await scheduler.schedule({ request, date });
        const responseHeaders = Object.values(task.httpRequest.headers);
        
        expect(task).toBeTruthy();
        expect(task.httpRequest.httpMethod).toEqual('POST');
        expect(responseHeaders.includes('application-json')).toBeTruthy();
      });
})
