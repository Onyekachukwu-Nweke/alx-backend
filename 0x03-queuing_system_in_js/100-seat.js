import { createClient, print } from 'redis';
import { promisify } from 'util';
import { createQueue } from 'kue';
import express from 'express';

/* redis client */
const client = createClient();

client.on('error', err => console.log('Redis client not connected to server'));
const getKey = promisify(client.get).bind(client)

function reserveSeat(number, available_seats) {
  client.set(available_seats, number);
}

async function getCurrentAvailableSeats(available_seats) {
  try {
    const number = getKey(available_seats);
    return number;
  } catch (err) {
    console.error(err.message);
  }
}

client.on('connect', () => {
  // const reservationEnabled = true;
  print('client is connected');
});

let reservationEnabled = true;

/* queue */

const queue = createQueue();


/* server */

const app = express();

app.get('/available_seats', async (req, res) => {
  const noOfSeats = await getCurrentAvailableSeats('available_seats');
  res.status(200).json({"numberOfAvailableSeats": `${noOfSeats}`});
});


app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) res.status(404).json({ "status": "Reservation are blocked" });
  else {
    const job = queue.create('reserve_seat')
      .save((err) => {
        if (err) res.json({ "status": "Reservation failed" });
        else res.json({ "status": "Reservation in process" });
      });
 
    job.on('complete', (result) => console.log(`Seat reservation job ${job.id} completed`));
    job.on('failed', (err) => console.log(`Seat reservation job ${job.id} failed ${err}`));
  }
});

app.get('/process', (req, res) => {
  const worker = createQueue()
  res.status(200).json({ "status": "Queue processing" });
  
  worker.process('reserve_seat', async (job, done) => {
    const noOfSeats = await getCurrentAvailableSeats('available_seats');
    // console.log(noOfSeats)
    const remainingSeats = parseInt(noOfSeats);
    if (remainingSeats >= 0) reserveSeat(remainingSeats - 1, 'available_seats');
    
    if (remainingSeats === 0) reservationEnabled = false;
    if (remainingSeats > 0) done();
    else {
      // job.failed('Not enough seats available');
      done(new Error('Not enough seats available'));
    }
  });
});

app.listen(1245, () => {
  reserveSeat(50, 'available_seats');
});
