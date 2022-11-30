const market = require('./RealEstate.json');

const MarketAddressABI = market.abi;
console.log(MarketAddressABI);
// export const MarketAddress = '0xC23f50e6bAB34f2c51A6Ef69AEbebcA61dd60945';
module.exports = {MarketAddressABI};