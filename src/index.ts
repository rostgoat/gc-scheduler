const { v2beta3 } = require("@google-cloud/tasks");

// Instantiates a client.
const client = new v2beta3.CloudTasksClient();

export class Scheduler {
  private project_id: string;
  private queue_id: string;
  private location: string;

  /**
   * Creates a new Cloud Task Scheduler.
   * @param {string} project_id
   * @param {string} queue_id
   */
  constructor(project_id: string, queue_id: string) {
    this.project_id = project_id;
    this.queue_id = queue_id;
    this.location = 'us-west2';
  }

  /**
   *
   * @param {object} request - The request object containing url, method, header and body.
   * @param {date} date - The date to schedule the task.
   *
   * @returns {string} A string returning the new Cloud Task ID from the Cloud Tasks client library.
   */
  async schedule({ request, date }: { request: Partial<RequestObject>; date?: Date }) {
    // destructure request arguments
    const { url, method, headers, body } = request;

    // Construct the fully qualified queue name.
    const parent = client.queuePath(this.project_id, this.location, this.queue_id);

    // task object which requires only URL by default
    const task: Partial<any> = {
      httpRequest: {
        url,
      },
    };

    // specify task start time or start immediately
    task.httpRequest.date = date ? date : new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

    // append headers to task object or set Content-Type to 'application-json' per default.
    task.httpRequest = { ...task.httpRequest, headers: headers || { 'Content-Type': 'application-json' } };

    // append method to task object or POST by value
    task.httpRequest.method = method ? method : 'POST';

    // append body to task object if method is either POST, PUT or PATCH
    if (
      task.httpRequest.method === 'POST' ||
      task.httpRequest.method === 'PUT' ||
      task.httpRequest.method === 'PATCH'
    ) {
      task.httpRequest.body = body;
    }

    // Send create task request.
    const req = { parent, task };
    const [response] = await client.createTask(req);
    return response;
  }

  /**
   * Removes an existing Cloud Task from its Queue
   * @param {string} task_id
   */
  async delete(task_id: string) {
    return client.deleteTask({ name: task_id });
  }

  /**
   * Return task from active tasks list.
   * @param {object} task
   */
  async getTask(task: object) {
    return client.getTask(task);
  }
}
