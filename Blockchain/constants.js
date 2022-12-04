const market = require("./RealEstate.json");

const RealEstateAddressABI = market.abi;
const RealEstateAddress = "0xAB6466fC39923254108E249ec3F7C668e8594C4a";
const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI3N2Y1OWMxLTVhMWItNGYzZi04NDY2LTJlOTIyYTI4MzJhNCIsImtleSI6ImxzZnpybnpyIiwiaWF0IjoxNjcwMDc5MDk5fQ.4WeklORGciWdq-TKiaR3wvXJMfmjSgH1L7r_plbgGvg";
const collectionId = "c8785e0d-8a79-4b26-988b-a2e43569601b";
module.exports = { RealEstateAddress, RealEstateAddressABI, key, collectionId };
