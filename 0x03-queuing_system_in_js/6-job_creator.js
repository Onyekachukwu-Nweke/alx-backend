import { createQueue } from 'kue';

const que = createQueue();

const data = { phoneNumber: '+2348160969769', message: 'doHardThings'};

const notification = que.create('push_notification_code', data)
  .save(function(err) {
  if(!err) console.log('Notification job created:', notification.id);
  });

notification.on('complete', (message) => {
  console.log('Notification job completed', message);
});

notification.on('failed', (message) => {
  console.log('Notification job failed', message);
});
