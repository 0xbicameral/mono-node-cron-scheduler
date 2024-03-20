# Node Cron Scheduler

A lightweight cron job scheduler for Node.js, designed to simplify the scheduling and management of periodic tasks.

## Features

- Easy scheduling of periodic tasks using cron syntax.
- Built-in logging and error handling, including email notifications for task failures.
- Optional web server for job management.
- Utilizes popular Node.js libraries for enhanced functionality.

## Installation

To install the library, run:

```bash
npm install node-cron-scheduler
```

## Usage

First, ensure you have created a `.env` file at the root of your project with the necessary configurations:

```
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
ALERT_EMAIL=alert_recipient_email@gmail.com
```

### Scheduling a Job

To schedule a job, import `node-cron-scheduler` and use the `scheduleJob` function:

```javascript
const { scheduleJob } = require('node-cron-scheduler');

// Define a task to be executed
const myTask = async () => {
  console.log("Task executed");
};

// Schedule the task to run every minute
scheduleJob('My First Job', '* * * * *', myTask);
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for discussion.
