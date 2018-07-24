exports.gatecoin = {
    exchangeDescription: "Gatecoin",
    urlAccess: "https://api.gatecoin.com",
    apiPathPricing: "Public/LiveTickers",
    apiPathOrderList: "Trade/Orders",
    apiPathBalance: "Balance/Balances",
    apiPathBalanceDeposits: "Balance/Deposits",
    apiPathBalanceWithdrawals: "Balance/Withdrawals",
    apiPathTradeOrders: "Trade/Orders",
    apiPathTransactions: "Trade/Trades",
    apiPathOrder: "Trade/Orders",
    handleError: function (err) {
        throw new Error(err.message);
    }
}