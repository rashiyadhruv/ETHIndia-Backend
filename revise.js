

const all = [
  {const { Revise } = require("revise-sdk");

const { key, collectionId } = require("./config.js");

console.log("Revise key", key);
const revise = new Revise({ auth: key });
    condition: "Neutral",
    image: "https://i.ibb.co/bRmpNVM/Frame-62.gif",
  },
  {
    condition: "Better",
    image: "https://i.ibb.co/p3LXdZN/Frame-100.gif",
  },
  {
    condition: "Worse",
    image: "https://i.ibb.co/hHPMMMK/Frame-61.gif",
  },
  {
    condition: "Neutral",
    image: "https://i.ibb.co/4dXWQhC/Frame-57.gif",
  },
  {
    condition: "Better",
    image: "https://i.ibb.co/pjKpGBB/Frame-99.gif",
  },
  {
    condition: "Worse",
    image: "https://i.ibb.co/2KRymZk/Frame-58.gif",
  },
  {
    condition: "Neutral",
    image: "https://i.ibb.co/2nVHNsh/Frame-97.gif",
  },
  {
    condition: "Better",
    image: "https://i.ibb.co/tZgTN0s/Frame-98.gif",
  },
  {
    condition: "Worse",
    image: "https://i.ibb.co/rm1j0FG/Frame-96.gif",
  },
];

async function API() {
  console.log("API called");
  let randomindex = Math.floor(Math.random() * 9);
  return all[randomindex];
}

async function run() {
  const collection = await revise.addCollection({
    name: "The",
    uri: "the",
  });
  console.log("Collection created", collection);
}

async function add() {

  

  const res = await revise.addNFT(
    {
      name: "qwqwqw33",
      tokenId: "4",
      description:
        "This is not just a mere NFT but is The Earth itself and it has emotions !!! Voila !!! , It will feel sad when the emissions in the linked location increase in comparison to yesterday and happy when less compared to yesterday. Try to keep it happy ALWAYS",
      image: "https://i.ibb.co/4dXWQhC/Frame-57.gif",
    },
    [{ condition: "Neutral" }, { location: "Gandhinagar" }],
    collectionId
  );

  console.log(res.id);
  const _nft = await revise.fetchNFT(res.id);

}

async function update() {
  
  const res = await revise.fetchNFT("2f04b651-8e14-467a-9806-0197fc7775e2");
  const nft = revise.nft(res);

  // nft.setName("Tommy").save()
  // console.log(res)
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

add();
