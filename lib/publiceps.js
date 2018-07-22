const {gatecoin} = require('./gatecoin');
const axios = require('axios');

exports.getAllRates = async function(cb) {
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

exports.getRate = async function({currency1, currency2}, cb) {
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