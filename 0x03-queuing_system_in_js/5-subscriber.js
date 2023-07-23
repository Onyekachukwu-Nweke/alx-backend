import { createClient, print } from 'redis';


const client = createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', error => {
  console.log(`Redis client not connected to the server: ${error}`)
});

client.subscribe('holberton school channel', (err, count) => {
});

client.on('message', (channel, msg) => {
  if (channel === 'holberton school channel') console.log(msg);
  if (msg === 'KILL_SERVER') {
    client.unsubscribe();
    client.quit();
  }
});
