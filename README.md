# gatecoinjs - Gatecoin Nodejs Library

The project is designed to help you interact with Gatecoin Rest API using javascript

### Installation

```
npm install --save gatecoinjs
```

### Getting started
#### From version 1.0.6 classes support so you can have as many gatecoin accounts in your projects as you want. If you use older versions (the connect function still works) and you update to the lastest version, your gatecoin functions will not work so modify just api settings as bellow

```javascript

const gatecoinNodeJS = require('gatecoinjs');
const gatecoinjs = new gatecoinNodeJS({
    publicKey: 'API public key',
    secretKey: 'Api secret key'
});

// if you have another gatecoin account
const gatecoinjs_2 = new gatecoinNodeJS({
    publicKey: 'API public key 2',
    secretKey: 'Api secret key 2'
});
```

### Usage

using callback
```javascript
gatecoinjs.getAllRates(function(err, res){
    if (err) {
        console.log(err);
    } else {
        console.log(res);
    }
});
```

using promise

```javascript
gatecoinjs.getAllRates()
    .then(res => console.log(res))
    .catch(err => console.log(err));
```

using async/await feature
```javascript
async () => {
    try {
        const res = await gatecoinjs.getAllRates();
    } catch (err) {
        console.log(err);
    }
}
```

### Public API

Get all rates
```javascript
gatecoinjs.getAllRates(function(err, res){
    console.log(res);
});
```

Get one rate
```javascript
gatecoinjs.getRate({
    currency1: 'BTC',
    currency2: 'USD'
}, function(err, res){
    console.log(res);
});
```

### Auth APIs

Get all balances

```javascript
gatecoinjs.getAllBalances(function(err, res) {
    console.log(res);
})
```

Get one balance

```javascript
gatecoinjs.getRate({
    currency1: 'BTC',
    currency2: 'USD'
}, function(err, res){
    console.log(res);
});
```

Place a limit ask order

```javascript
// sell 0.0002 btc in 1btc = 10000usd rate
gatecoinjs.sell({
    currency1: 'BTC',
    currency2: 'USD',
    amount: 0.0002,
    //optional if you want your rate to be traded, if not completed, it will go into open orders
    priceyouwant: 10000
}, function(err, res) {
    console.log(res)
});
```

Place a limit bid order

```javascript
// buy 0.0002 btc in 1btc = 10000usd rate
gatecoinjs.buy({
    currency1: 'BTC',
    currency2: 'USD',
    amount: 0.0002,
    //optional if you want your rate to be traded, if not completed, it will go into open orders
    priceyouwant: 10000
}, function(err, res) {
    console.log(res)
});
```

Place a market ask order
```javascript
gatecoinjs.sell({
    currency1: 'BTC',
    currency2: 'USD',
    amount: 0.0002
}, function(err, res) {
    console.log(res)
});
```

Place a market bid order

```javascript
gatecoinjs.buy({
    currency1: 'BTC',
    currency2: 'USD',
    amount: 0.0002
}, function(err, res) {
    console.log(res)
});
```

Get an order by id
```javascript
gatecoinjs.getOrderById({orderId: 'BK11591047730'}, function (err, res) {
    console.log(res);
});
```

Get all open orders
```javascript
gatecoinjs.getOpenOrders(function(err, res) {
    console.log(res);
});
```

Get all open orders by currency pair
```javascript
gatecoinjs.getOpenOrders({currencyPair: 'BTCUSD'}, function(err, res) {
    console.log(res);
});
```

Get all transactions
```javascript
gatecoinjs.getAllTransactions(function(err, res) {
    console.log(res);
});
```

Cancel an open order by order id
```javascript
gatecoinjs.cancelOpenOrders({orderId: 'BK11591047730'}, function (err, res) {
    console.log(res);
});
```

Cancel all open orders
```javascript
gatecoinjs.cancelOpenOrders(function(err, res) {
    console.log(res);
});
```