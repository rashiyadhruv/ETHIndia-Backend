const market = require('./RealEstate.json');

const RealEstateAddressABI = market.abi;
console.log(RealEstateAddressABI);
const RealEstateAddress = '0x9daEA9aBb8F1DA1bf7C780aa6f6236d35AF0A541';
module.exports = {RealEstateAddress, RealEstateAddressABI};