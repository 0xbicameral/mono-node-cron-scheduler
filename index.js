require('dotenv').config();
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const winston = require('winston');
const express = require('express');
const { format } = require('date-fns');
const fetch = require('node-fetch');
const _ = require('lodash');

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'node-cron-scheduler' },
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

// Email setup (using environment variables for sensitive information)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Jobs registry
const jobs = [];

// Function to schedule new jobs
function scheduleJob(name, schedule, task) {
  if (!cron.validate(schedule)) {
    logger.error(`Invalid cron schedule: ${schedule}`);
    return;
  }

  const job = cron.schedule(schedule, async () => {
    logger.info(`Running job: ${name} at ${format(new Date(), 'PPpp')}`);
    try {
      await task();
    } catch (error) {
      logger.error(`Job ${name} failed: ${error.message}`);
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ALERT_EMAIL,
        subject: `Job ${name} Failed`,
        text: `Job ${name} failed with error: ${error.message}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          logger.error(`Error sending failure email for job ${name}: ${error.message}`);
        } else {
          logger.info(`Sent failure email for job ${name}: ${info.response}`);
        }
      });
    }
  });

  jobs.push({ name, job });
  logger.info(`Scheduled job: ${name} with schedule: ${schedule}`);
}

module.exports = {
  scheduleJob
};
