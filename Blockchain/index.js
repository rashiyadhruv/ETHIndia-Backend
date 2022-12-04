// import {react, useEffect, useState} from 'react';
const { ethers } = require("ethers");
// import { ethers } from "ethers";
const axios = require("axios");
const {
  RealEstateAddress,
  RealEstateAddressABI,
  key,
  collectionId,
} = require("./constants");

let nftt = null;

const home = [
  {
    coins: "0",
    image: "https://i.ibb.co/0DKLtm0/home0.png",
  },

  {
    coins: "1",
    image: "https://i.ibb.co/JmHs3RJ/Home1.png",
  },
  {
    coins: "2",
    image: "https://i.ibb.co/YcBDqF9/Home2.png",
  },
  {
    coins: "3",
    image: "https://i.ibb.co/Nj65rrj/Home3.png",
  },
  {
    coins: "4",
    image: "https://i.ibb.co/j5SvNtN/Home4.png",
  },
  {
    coins: "5",
    image: "https://i.ibb.co/k6RSyw0/Home5.png",
  },
  {
    coins: "6",
    image: "https://i.ibb.co/c8mXnWW/Home6.png",
  },
  {
    coins: "7",
    image: "https://i.ibb.co/G2fw5Mm/Home7.png",
  },
];

const Store = [
  {
    coins: "0",
    image: "https://i.ibb.co/6tgNr2Z/Store0.png",
  },

  {
    coins: "1",
    image: "https://i.ibb.co/h285NPZ/Store1.png",
  },
  {
    coins: "2",
    image: "https://i.ibb.co/G7Svnx0/Store2.png",
  },
  {
    coins: "3",
    image: "https://i.ibb.co/8DKqTd3/Store3.png",
  },
  {
    coins: "4",
    image: "https://i.ibb.co/Y2gBLGH/Store4.png",
  },
  {
    coins: "5",
    image: "https://i.ibb.co/MCY14Ly/Store5.png",
  },
  {
    coins: "6",
    image: "https://i.ibb.co/Yb4YHjv/Store6.png",
  },
  {
    coins: "7",
    image: "https://i.ibb.co/Bq87knf/Store7.png",
  },
];

const building = [
  {
    coins: "0",
    image: "https://i.ibb.co/vhhJp6B/building0.png",
  },

  {
    coins: "1",
    image: "https://i.ibb.co/JB43TZ4/building1.png",
  },
  {
    coins: "2",
    image: "https://i.ibb.co/BnSYt0C/building2.png",
  },
  {
    coins: "3",
    image: "https://i.ibb.co/ZTY55HX/building3.png",
  },
  {
    coins: "4",
    image: "https://i.ibb.co/QHbpWxq/building4.png",
  },
  {
    coins: "5",
    image: "https://i.ibb.co/k50fsNB/building5.png",
  },
  {
    coins: "6",
    image: "https://i.ibb.co/3yLmzFW/building6.png",
  },
  {
    coins: "7",
    image: "https://i.ibb.co/MZvW8Wh/building7.png",
  },
];

async function API() {
  let location = nftt?.nft?.metaData[1]?.location;
  let type = nftt?.nft?.metaData[1]?.type;
  let rank = nftt?.nft?.metaData[1]?.position;

  var config = {
    method: "post",
    url: `https://api.covalenthq.com/v1/pricing/historical_by_addresses_v2/80001/USD/0xAB6466fC39923254108E249ec3F7C668e8594C4a/?quote-currency=USD&format=JSON&from=2020-12-04&to=2022-12-04&prices-at-asc=false&page-number=1&page-size=10`,
    headers: {
      // "Content-Type": "application/json",
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NzAxODY5NzgsImp0aSI6IjkzZjgyYjZhLTkzNzctNGMzYi1hZDhhLTY0MTEzMzcxYzZmYSIsImlhdCI6MTY3MDEwMDU3OCwibmJmIjoxNjcwMTAwNTc4LCJzdWIiOiIzZDliZTM2OS1iZjE4LTQ4NWItYmY2Ni05Y2FiYmNhZDcwMGIiLCJzY29wZSI6ImFwaSIsImFjY291bnQiOnsidmVyaWZpZWQiOnRydWUsIm9yZ2FuaXphdGlvbiI6IjFjZDc1MzdkLWM4NzctNGFkNi1iZDg4LTcxODZhYWM3OGI3YiIsInJvbGUiOiJPV05FUiIsImVtYWlsIjoicmFodWxiYXJ1YTMxKzRAZ21haWwuY29tIn19.i1elRjQ3vxC-H6H3Dm5DEBtjp5w736DuwzhT8XaUYKA`,
    },
  };
  axios(config)
    .then(function (response) {
      console.log(response);
      let prices = response.data[0].prices;
      let currprice = prices[0].price;
      let prevprice = prices[1].price;

      if (prevprice < currprice) {
        rank--;
      } else if (prevprice > currprice) {
        rank++;
      }
      let data = {};
      if (type == "Home") {
        data = Home[rank];
      } else if (type == "Store") {
        data = Store[rank];
      } else if (type == "Building") {
        data = building[rank];
      }
    })
    .catch(function (error) {
      console.log(error);
    });


    return data;

}

const fetchNftArray = async () => {
  const alchemy = new ethers.providers.AlchemyProvider(
    "maticmum",
    "H5Lx8cPnEnjTP42MrxVuk9ZBVgsyN2YA"
  );
  const contract = new ethers.Contract(
    RealEstateAddress,
    RealEstateAddressABI,
    alchemy
  );
  const allNftIds = await contract.getAllNFTIds();
  console.log("allNftIds", allNftIds);
  return allNftIds;
};

async function update() {
  const nftArray = await fetchNftArray();

  for (let i = 0; i < nftArray.length; i++) {
    const res = await revise.fetchNFT(nftArray[i]);
    const nft = revise.nft(res);
    nftt = nft;
    revise
      .every("10s")
      .listenTo(API)
      .start(async (data) => {
        await nft
          .setProperty("condition", data.condition)
          .setImage(data.image)
          .save();

        console.log("condition", data.condition);
      });
  }
}

update();
