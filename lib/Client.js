const CryptoJS = require('crypto-js');
const axios = require('axios');
const { gatecoin } = require('./gatecoin');
let isKeysFilled = false;

class Client {
    constructor({publicKey, secretKey}) {
        this.publicKey = publicKey;
        this.secretKey = secretKey;
    }

    async getAllRates(cb) {
        const options = {
            url: `${gatecoin.urlAccess}/${gatecoin.apiPathPricing}`,
            method: 'GET'
        }
        try {
            return await axios(options).then(({ data }) => {
                if (!cb) {
                    return data;
                } else {
                    return cb(null, data);
                }
            });
        } catch (err) {
            if (!cb) {
                return gatecoin.handleError(err.message);
            } else {
                return cb(err, null);
            }
        }
    }
    
    async getRate({currency1, currency2}, cb) {
        const currencyPair = `${currency1+currency2}`;
    
        const options = {
            url: `${gatecoin.urlAccess}/${gatecoin.apiPathPricing}`,
            method: 'GET'
        }
        try {
            const rates = await axios(options);
            
            for (const rate of rates.data.tickers) {
                if (rate.currencyPair === currencyPair) {
                    if (!cb) {
                        return rate;
                    } else {
                        return cb(null, rate);
                    }
                }
            }
    
            throw new Error('no pairs found!')
        } catch (err) {
            if (!cb) {
                return gatecoin.handleError(err.message);
            } else {
                return cb(err, null);
            }
        }
    }

    getAllBalances(cb) {
        return authenticated('GET', gatecoin.apiPathBalance).then(res => {
            if(!res.success) {
                throw new Error(res.message);
            }

            if (cb != null) {
                return cb(null, res);
            }

            return res;
        }).catch(err => {
            if (!cb) {
                return gatecoin.handleError(err);
            } else {
                return cb(err, null);
            }
        });
    }
    
    getBalanceDeposits(cb) {
        return this.authenticated('GET', gatecoin.apiPathBalanceDeposits).then(res => {
            if(!res.success) {
                throw new Error(res.message);
            }

            if (cb != null) {
                return cb(null, res);
            }

            return res;
        }).catch(err => {
            if (!cb) {
                return gatecoin.handleError(err);
            } else {
                return cb(err, null);
            }
        });
    }
    
    getBalanceWithdrawals(cb) {
        return this.authenticated('GET', gatecoin.apiPathBalanceWithdrawals).then(res => {
            if(!res.success) {
                throw new Error(res.message);
            }

            if (cb != null) {
                return cb(null, res);
            }

            return res;
        }).catch(err => {
            if (!cb) {
                return gatecoin.handleError(err);
            } else {
                return cb(err, null);
            }
        });
    }
    
    getBalance({currency}, cb) {
        const apiRequestPath = gatecoin.apiPathBalance + '/' + currency;
            return this.authenticated('GET', apiRequestPath).then(res => {
                if(!res.success) {
                    throw new Error(res.message);
                }
    
                if (cb != null) {
                    return cb(null, res);
                }
    
                return res;
            }).catch(err => {
                if (!cb) {
                    return gatecoin.handleError(err);
                } else {
                    return cb(err, null);
                }
            });
    } 
    
     async sell({ currency1, currency2, amount, priceyouwant }, cb) {
        //const way = req.query.way === 'buys' ? 'Bid':'Ask'; // ask or bid
        const queryParams = {
            Code: currency1+currency2,
            Way: 'Ask',
            Amount: amount,
            Price: priceyouwant
        }
    
        const requestOrderPath = priceyouwant ? 
            `${gatecoin.apiPathOrder}?Code=${currency1+currency2}&Way=Ask&Amount=${amount}&Price=${priceyouwant}`
            :
            `${gatecoin.apiPathOrder}?Code=${currency1+currency2}&Way=Ask&Amount=${amount}`;
        
        try {
            const place_an_order = await this.authenticated('POST', requestOrderPath, queryParams);
            
            //order failed
            if (!place_an_order.success) {
                throw new Error(place_an_order.message)
            }
    
            // order succeed
            const requestOrderInfoPath = `${gatecoin.apiPathOrder}/${place_an_order.data.clOrderId}`;
            
            //get order info
            const order = await this.authenticated('GET', requestOrderInfoPath );
            
            if (!order.success) {
                throw new Error(order.message)
            }
    
            order.data.currency1 = currency2;
            order.data.currency1 = currency2;
            order.data.amount = amount;
    
            const result = {
                success: true,
                data: {
                    status: 'created',
                    info: order.data
                }
            }
    
            if (cb) {
                return cb(null, result);
            }
    
            return result;
        } catch (err) {
            if (!cb) {
                return gatecoin.handleError(err);
            } else {
                return cb(err, null);
            }
        }
    }
    
    async buy({ currency1, currency2, amount, priceyouwant }, cb) {
        //const way = req.query.way === 'buys' ? 'Bid':'Ask'; // ask or bid
        const queryParams = {
            Code: currency1+currency2,
            Way: 'Bid',
            Amount: amount,
            Price: priceyouwant
        }
    
        const requestOrderPath = priceyouwant ? 
            `${gatecoin.apiPathOrder}?Code=${currency1+currency2}&Way=Bid&Amount=${amount}&Price=${priceyouwant}`
            :
            `${gatecoin.apiPathOrder}?Code=${currency1+currency2}&Way=Bid&Amount=${amount}`;
        
        try {
            const place_an_order = await this.authenticated('POST', requestOrderPath, queryParams);
            
            if (!place_an_order.success) {
                throw new Error(place_an_order.message)
            }
    
            const requestOrderInfoPath = `${gatecoin.apiPathOrder}/${place_an_order.data.clOrderId}`;
            
            const order = await this.authenticated('GET', requestOrderInfoPath );
            
            if (!order.success) {
                throw new Error(order.message)
            }
    
            order.data.currency1 = currency2;
            order.data.currency1 = currency2;
            order.data.amount = amount;
    
            const result = {
                success: true,
                data: {
                    status: 'created',
                    info: order.data
                }
            }
    
            if (cb) {
                return cb(null, result);
            }
    
            return result;
        } catch (err) {
            if (!cb) {
                return gatecoin.handleError(err);
            } else {
                return cb(err, null);
            }
        }
    }
    
    cancelOpenOrders({orderId} ,cb) {
        const apiRequestPath = orderId ? gatecoin.apiPathTradeOrders + '/' + orderId
                                        :
                                        gatecoin.apiPathTradeOrders;
        return this.authenticated('DELETE', apiRequestPath).then(res => {
            if(!res.success) {
                throw new Error(res.message);
            }

            if (cb != null) {
                return cb(null, res);
            }

            return res;
        }).catch(err => {
            if (!cb) {
                return gatecoin.handleError(err);
            } else {
                return cb(err, null);
            }
        });
    }
    
    getOpenOrders({currencyPair} ,cb) {
        const apiRequestPath = currencyPair ? gatecoin.apiPathTradeOrders + '?CurrencyPair=' + currencyPair
                                            :
                                                gatecoin.apiPathTradeOrders;
        return this.authenticated('GET', apiRequestPath).then(res => {

            if(!res.success) {
                throw new Error(res.message);
            }

            if (cb != null) {
                return cb(null, res);
            }

            return res;
        }).catch(err => {
            if (!cb) {
                return gatecoin.handleError(err);
            } else {
                return cb(err, null);
            }
        });
    }
    
    getOrderById({orderId} ,cb) {
        const apiRequestPath = gatecoin.apiPathTradeOrders + '/' + orderId;
        return this.authenticated('GET', apiRequestPath).then(res => {
            if(!res.success) {
                throw new Error(res.message);
            }

            if (cb != null) {
                return cb(null, res);
            }

            return res;
        }).catch(err => {
            if (!cb) {
                return gatecoin.handleError(err);
            } else {
                return cb(err, null);
            }
        });
    }
    
    getAllTransactions(cb) {
        const apiRequestPath = gatecoin.apiPathTransactions;
        return this.authenticated('GET', apiRequestPath).then(res => {
            if(!res.success) {
                throw new Error(res.message);
            }

            if (cb != null) {
                return cb(null, res);
            }

            return res;
        }).catch(err => {
            if (!cb) {
                return gatecoin.handleError(err);
            } else {
                return cb(err, null);
            }
        });
    }

    async authenticated(requestMethod, apiRequestPath, queryParams) {
        try {
            console.log('public key is: ' + this.publicKey);
            console.log('private key is: ' + this.secretKey);
            const time = new Date().getTime() / 1000;
            const publicKey = this.publicKey;
            const secretKey = this.secretKey;
            const baseAddress = gatecoin.urlAccess;
            const content_type = requestMethod === 'GET' ? '' : 'application/json' 
            const message = `${requestMethod + baseAddress}/${apiRequestPath + content_type}${time}`;
            const hash = CryptoJS.HmacSHA256(message.toLowerCase(), secretKey);
            const signature = CryptoJS.enc.Base64.stringify(hash);
            
            const options = {
                url: `${baseAddress}/${apiRequestPath}`,
                method: requestMethod,
                data: queryParams ? queryParams: {},
                headers : {
                    'API_PUBLIC_KEY': publicKey,
                    'API_REQUEST_SIGNATURE': signature,
                    'API_REQUEST_DATE': time,
                    'Content-Type': 'application/json'
                }
            }   
            const result = await axios(options);
            
            if (result.data.responseStatus.errors) {
                return {
                    success: false,
                    message: result.data.responseStatus.errors[0].message
                }
            } else if (result.data.responseStatus.message !== 'OK') {
                return {
                    success: false,
                    message: result.data.responseStatus.message
                }
            }
    
            return {
                success: true,
                data: result.data
            }
        } catch (err) {
            if (err.response.status !== 500) {
                return {
                    success: false,
                    message: err.response.data.responseStatus.message
                }
            }
    
            return {
                success: false,
                message: err.message + '. Something wrong with your input parameters'
            }
        }
    }
}

module.exports = Client;