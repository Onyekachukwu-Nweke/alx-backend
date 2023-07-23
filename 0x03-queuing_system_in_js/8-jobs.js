
export default function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) throw new Error('Jobs is not an array');
  for (let job of jobs) {
    const notification = queue.create('push_notification_code_3', job)
      .save((err) => {
        if (!err) console.log(`Notification job created: ${notification.id}`);
      });

    notification.on('completed', (result) => {
      console.log(`Notification job ${notification.id} completed`);
    });

    notification.on('failed', (err) => {
      console.log(`Notification job ${notification.id} failed: ${err}`);
    });

    notification.on('progress', (progress, data) => {
      console.log(`Notification job ${notification.id} ${progress}% complete`);
    });
  }
}
