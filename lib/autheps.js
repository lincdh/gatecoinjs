const CryptoJS = require('crypto-js');
const axios = require('axios');
const { gatecoin } = require('./gatecoin');
let isKeysFilled = false;

exports.getAllBalances = function(cb) {
    try {
        return authenticated('GET', gatecoin.apiPathBalance).then(res => {

            if (!isKeysFilled) {
                throw new Error('Have you forgotten to invoke the "connect(yourPublicKey, yourSecretKey)" function');
            }

            if(!res.success) {
                throw new Error(res.message);
            }

            if (cb != null) {
                return cb(null, res);
            }

            return res;
        });
    } catch (err) {
        if (!cb) {
            return gatecoin.handleError(err);
        } else {
            return cb(err, null);
        }
    }
}

exports.getBalanceDeposits = function(cb) {
    try {
        return authenticated('GET', gatecoin.apiPathBalanceDeposits).then(res => {
            if (!isKeysFilled) {
                throw new Error('Have you forgotten to invoke the "connect(yourPublicKey, yourSecretKey)" function');
            }

            if(!res.success) {
                throw new Error(res.message);
            }

            if (cb != null) {
                return cb(null, res);
            }

            return res;
        });
    } catch (err) {
        if (!cb) {
            return gatecoin.handleError(err);
        } else {
            return cb(err, null);
        }
    }
}

exports.getBalanceWithdrawals = function(cb) {
    try {
        return authenticated('GET', gatecoin.apiPathBalanceWithdrawals).then(res => {
            if (!isKeysFilled) {
                throw new Error('Have you forgotten to invoke the "connect(yourPublicKey, yourSecretKey)" function');
            }

            if(!res.success) {
                throw new Error(res.message);
            }

            if (cb != null) {
                return cb(null, res);
            }

            return res;
        });
    } catch (err) {
        if (!cb) {
            return gatecoin.handleError(err);
        } else {
            return cb(err, null);
        }
    }
}

exports.getBalance = function({currency}, cb) {
    const apiRequestPath = gatecoin.apiPathBalance + '/' + currency;
    try {
        return authenticated('GET', apiRequestPath).then(res => {
            if (!isKeysFilled) {
                throw new Error('Have you forgotten to invoke the "connect(yourPublicKey, yourSecretKey)" function');
            }

            if(!res.success) {
                throw new Error(res.message);
            }

            if (cb != null) {
                return cb(null, res);
            }

            return res;
        });
    } catch (err) {
        if (!cb) {
            return gatecoin.handleError(err);
        } else {
            return cb(err, null);
        }
    }
}

exports.connect = function({publicKey, secretKey}) {
    if (publicKey === undefined) {
        throw new Error('please check "publicKey" field');
    }

    if (secretKey === undefined) {
        throw new Error('please check "secretKey" field');
    }

    gatecoin.publicKey = publicKey;
    gatecoin.secretKey = secretKey;
    isKeysFilled = true;
}

exports.sell = async function ({ currency1, currency2, amount, priceyouwant }, cb) {
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
        if (!isKeysFilled) {
            throw new Error('Have you forgotten to invoke the "connect(yourPublicKey, yourSecretKey)" function');
        }

        const place_an_order = await authenticated('POST', requestOrderPath, queryParams);
        
        //order failed
        if (!place_an_order.success) {
            throw new Error(place_an_order.message)
        }

        // order succeed
        const requestOrderInfoPath = `${gatecoin.apiPathOrder}/${place_an_order.data.clOrderId}`;
        
        //get order info
        const order = await authenticated('GET', requestOrderInfoPath );
        
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

exports.buy = async function ({ currency1, currency2, amount, priceyouwant }, cb) {
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
        if (!isKeysFilled) {
            throw new Error('Have you forgotten to invoke the "connect(yourPublicKey, yourSecretKey)" function');
        }

        const place_an_order = await authenticated('POST', requestOrderPath, queryParams);
        
        if (!place_an_order.success) {
            throw new Error(place_an_order.message)
        }

        const requestOrderInfoPath = `${gatecoin.apiPathOrder}/${place_an_order.data.clOrderId}`;
        
        const order = await authenticated('GET', requestOrderInfoPath );
        
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

exports.cancelOpenOrders = async function({orderId} ,cb) {
    try {
        const apiRequestPath = orderId ? gatecoin.apiPathTradeOrders + '/' + orderId
                                        :
                                        gatecoin.apiPathTradeOrders;
        return authenticated('DELETE', apiRequestPath).then(res => {
            if (!isKeysFilled) {
                throw new Error('Have you forgotten to invoke the "connect(yourPublicKey, yourSecretKey)" function');
            }

            if(!res.success) {
                throw new Error(res.message);
            }

            if (cb != null) {
                return cb(null, res);
            }

            return res;
        });
    } catch (err) {
        if (!cb) {
            return gatecoin.handleError(err);
        } else {
            return cb(err, null);
        }
    }
}

exports.getOpenOrders = function({currencyPair} ,cb) {
    try {
        const apiRequestPath = currencyPair ? gatecoin.apiPathTradeOrders + '?CurrencyPair=' + currencyPair
                                            :
                                              gatecoin.apiPathTradeOrders;
        return authenticated('GET', apiRequestPath).then(res => {
            if (!isKeysFilled) {
                throw new Error('Have you forgotten to invoke the "connect(yourPublicKey, yourSecretKey)" function');
            }

            if(!res.success) {
                throw new Error(res.message);
            }

            if (cb != null) {
                return cb(null, res);
            }

            return res;
        });
    } catch (err) {
        if (!cb) {
            return gatecoin.handleError(err);
        } else {
            return cb(err, null);
        }
    }
}

exports.getOrderById = function({orderId} ,cb) {
    try {
        const apiRequestPath = gatecoin.apiPathTradeOrders + '/' + orderId;
        return authenticated('GET', apiRequestPath).then(res => {
            if (!isKeysFilled) {
                throw new Error('Have you forgotten to invoke the "connect(yourPublicKey, yourSecretKey)" function');
            }

            if(!res.success) {
                throw new Error(res.message);
            }

            if (cb != null) {
                return cb(null, res);
            }

            return res;
        });
    } catch (err) {
        if (!cb) {
            return gatecoin.handleError(err);
        } else {
            return cb(err, null);
        }
    }
}

exports.getAllTransactions = function(cb) {
    try {
        const apiRequestPath = gatecoin.apiPathTransactions;
        return authenticated('GET', apiRequestPath).then(res => {
            if (!isKeysFilled) {
                throw new Error('Have you forgotten to invoke the "connect(yourPublicKey, yourSecretKey)" function');
            }

            if(!res.success) {
                throw new Error(res.message);
            }

            if (cb != null) {
                return cb(null, res);
            }

            return res;
        });
    } catch (err) {
        if (!cb) {
            return gatecoin.handleError(err);
        } else {
            return cb(err, null);
        }
    }
}

async function authenticated(requestMethod, apiRequestPath, queryParams) {
    try {
        const time = new Date().getTime() / 1000;
        const publicKey = gatecoin.publicKey;
        const secretKey = gatecoin.secretKey;
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