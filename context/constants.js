const market = require('./RealEstate.json');

const RealEstateAddressABI = market.abi;
console.log(RealEstateAddressABI);
const RealEstateAddress = '0x79fC45FE353D7C239AC5934c6B5685817C877e85';
module.exports = {RealEstateAddress, RealEstateAddressABI};