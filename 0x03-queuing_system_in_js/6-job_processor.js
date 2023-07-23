/* worker */
import { createQueue } from 'kue';

const worker = createQueue();

function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
};

worker.process('push_notification_code', function(job, done) {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message);
  done();
})
