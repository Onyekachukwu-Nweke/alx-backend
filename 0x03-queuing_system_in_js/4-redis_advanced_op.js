import { createClient, print } from 'redis';

const client = createClient();

client.on('error', err => console.log(`Redis Client not connnected to server: ${err}`));
client.on('connect', () =>  console.log('Redis client connected to the server'));

client.HSET('HolbertonSchools', 'Portland', 50, print);
client.HSET('HolbertonSchools', 'Seattle', 80, print);
client.HSET('HolbertonSchools', 'New York', 20, print);
client.HSET('HolbertonSchools', 'Bogota', 20, print);
client.HSET('HolbertonSchools', 'Cali', 40, print);
client.HSET('HolbertonSchools', 'Paris', 2, print);

client.hgetall('HolbertonSchools', (err, obj) => console.log(obj));
