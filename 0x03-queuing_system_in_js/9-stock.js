import { createClient, print } from 'redis';
import { createQueue } from 'kue';
import { promisify } from 'util';
import express from 'express';

/* utils */
const listProducts = [
  {'Id': 1, 'name': 'Suitcase 250', 'price': 50, 'stock': 4},
  {'Id': 2, 'name': 'Suitcase 450', 'price': 100, 'stock': 10},
  {'Id': 3, 'name': 'Suitcase 650', 'price': 350, 'stock': 2},
  {'Id': 4, 'name': 'Suitcase 1050', 'price': 550, 'stock': 5}
]

function getItemById(id) {
  for (let item of listProducts) {
    if (item.Id === id) return item;
  }
}


/* redis client */
const redisClient = createClient();

redisClient.on('error', err => console.log('Redis client not connected to server'));
redisClient.on('connect', () => console.log('Redis Client connect to server'));

function reserveStockById(itemId, stock) {
  for (let item of stock) {
    if (item.Id === itemId) {
      redisClient.set(itemId, item);
      print('Value is set');
    }
  }
}

async function getCurrentReservedStockById(itemId) {
  const getItem = promisify(redisClient.get).bind(redisClient);
  try {
    const item = await getItem(itemId);
    return item;
  } catch (err) {
    console.log(`${err}`);
  }
}


/* app server */
const port = 1245;
const app = express();

app.get('/list_products', (req, res) => {
  const products = JSON.stringify(listProducts, null, 2);
  res.send(products);
});

app.get('/list_products/:itemId', async (req, res) => {
  let id = null;
  for (let item of listProducts) {
    if (item.Id === parseInt(req.params.itemId, 10)) id = parseInt(req.params.itemId, 10);
  }
  if (id) res.json(getItemById(id));
  else res.json({"status":"Product not found"});
});

app.get('/reserve_product/:itemId', async (req, res) => {
  let id = null;
  for (let item of listProducts) {
    if (item.Id === parseInt(req.params.itemId, 10)) {
      id = parseInt(req.params.itemId, 10);
    }
  }

    if (id === null) res.json({"status":"Product not found"});
    else {
      const reserve = await getCurrentReservedStockById(id);
      if (reserve) res.json({"status":"Reservation confirmed","itemId":id});
      else {
        reserveStockById(id, listProducts);
        res.json({"status":"Not enough stock available","itemId":1});
      }
    }
});

app.listen(port, () => {
  console.log(`listening to host on port: ${port}`);
});
