import { createQueue } from 'kue';

const worker = createQueue();

const blocked = ['4153518780', '4153518781']

function sendNotification(phoneNumber, message, notification, done){
  notification.progress(0);

  if (blocked.includes(phoneNumber)) {
    notification.failed();
    done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  }
  else {
    notification.progress(50);
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
    done()
  }
}

worker.process('push_notification_code_3', 2, (notification, done) => {
  sendNotification(notification.data.phoneNumber, notification.data.message, notification, done);
});
