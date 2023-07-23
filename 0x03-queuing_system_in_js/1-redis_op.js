import { createClient, print } from 'redis';

const client = createClient();

client.on('error', err => console.log(`Redis client not connected to the server: ${err}`));
console.log('Redis client connected to the server');

function setNewSchool(schoolName, value) {
  client.set(schoolName, value);
  print("Value is set");
}

function displaySchoolValue(schoolName) {
  client.get(schoolName, (err, val) => {
    console.log(`Value for ${schoolName}: ${val}`)
  });
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
