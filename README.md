# gatecoinjs - Gatecoin Nodejs Library

The project is designed to help you interact with Gatecoin Rest API using javascript

### Installation

```
npm install --save gatecoinjs
```

### Getting started

```javascript
const gatecoinjs = require('gatecoinjs');
gatecoinjs.connect({
    publicKey: 'API public key',
    secretKey: 'Api secret key'
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
<details>
    <summary>View Response</summary>
```javascript
   {
       responseStatus: Object {message: "OK"},
       tickers: [
           {ask: 6478.2, askQ: 3.1392, bid: 6336.1, bidQ: 3, …},
           {ask: 65994, askQ: 0.0004664, bid: 61500, bidQ: 0.1, …},
           {ask: 7584, askQ: 0.006, bid: 7567, bidQ: 0.01, …}
       ]
   } 
```
</details>

Get one rate
```javascript
gatecoinjs.getRate({
    currency1: 'BTC',
    currency2: 'USD'
}, function(err, res){
    console.log(res);
});
```

<details>
    <summary>View Response</summary>
```javascript
   {ask: 7599, askQ: 0.01, bid: 7568, bidQ: 0.01, …}
```
</details>

### Auth APIs

Get all balances

```javascript
gatecoinjs.getAllBalances(function(err, res) {
    console.log(res);
})
```

<details>
    <summary>View Response</summary>
```javascript
   {data: {
       balances: [
           {availableBalance: 17.56, balance: 17.56, currency: "USD", ...},
           {availableBalance: 7.93, balance: 7.93, currency: "EUR", …},
           ...
       ],
       responseStatus: {message: "OK"}
   }, success: true}
```
</details>

Get one balance

```javascript
gatecoinjs.getRate({
    currency1: 'BTC',
    currency2: 'USD'
}, function(err, res){
    console.log(res);
});
```

<details>
    <summary>View Response</summary>
```javascript
   {data: {
       balance: {availableBalance: 0.012, balance: 0.012, currency: "BTC", …},
       responseStatus: {message: "OK"}
   }, success: true}
```
</details>

Place an ask order

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

<details>
    <summary>View Response</summary>
```javascript
   {
       success: true,
        data: {
            status: 'created',
            info: {clOrderId: "BK11591047730", code: "BTCHKD", initialQuantity: 0.0002, ...}
        }
   }
```
</details>

Place a bid order

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

<details>
    <summary>View Response</summary>
```javascript
   {
       success: true,
        data: {
            status: 'created',
            info: {clOrderId: "BK11591047730", code: "BTCHKD", initialQuantity: 0.0002, ...}
        }
   }
```
</details>

Get an order by id

```javascript
gatecoinjs.getOrderById({orderId: 'BK11591047730'}, function (err, res) {
    console.log(res);
});
```

<details>
    <summary>View Response</summary>
```javascript
   {
       success: true,
        data: {
            order: {clOrderId: "BK11591047730", code: "BTCHKD", …},
            responseStatus: Object {message: "OK"}
        }
   }
```

</details>

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