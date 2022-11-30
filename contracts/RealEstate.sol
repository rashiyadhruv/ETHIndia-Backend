// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RealEstate is ERC1155, Ownable {
    address public admin;
    uint256 public constant MIN_FEE = 1 ether;

    fallback() external payable {}
    receive() external payable {}

    using Counters for Counters.Counter;
    Counters.Counter private tokenId;
    Counters.Counter private offerId;

    function currTokenId() private view returns(uint256) {
        return tokenId.current();
    }

    function incTokenId() private {
        tokenId.increment();
    }

    function decTokenId() private {
        tokenId.decrement();
    }

    function currOfferId() private view returns(uint256) {
        return offerId.current();
    }

    function incOfferId() private {
        offerId.increment();
    }

    function decOfferId() private {
        offerId.decrement();
    }

    constructor() ERC1155("") {
        admin = msg.sender;
        incTokenId();
        incOfferId();
    }

    event NewTokenCreated(uint256 indexed tokenId, address owner, uint256 maxSupply, uint256 price, string landDetails);
    event OfferCreated(uint256 indexed offerId, uint256 tokenId, address creator, uint256 quantity, address[] buyers , uint256[] areas , uint256[] prices);
    event TokenTransferred(address indexed from, address indexed to, uint256 tokenId, uint256 quantity);
    event OfferCanceled( address indexed seller , uint256 offerId);

    struct Account {
        address walletAddress;
        string aadharCard;
        string cardNo;
        uint256 cvv;
        string name;
        string expiry;
        string avatar;
    }
    Account[] public accounts;

    mapping(address => Token[]) public properties;

    mapping(address => mapping(uint256 => OfferBuy)) private buyOffers;
    mapping(address => mapping(uint256 => Offer)) private sellOffers;

    // give id, get all sellOffers and buyOffers
    mapping(address => OfferBuy[]) private buyOffersArr;
    mapping(address => Offer[]) private sellOffersArr;

    struct Offer {
        uint256 offerId;
        address owner;
        uint256 quantity;
        uint256 tokenId;
        Status status;
        address[] buyers;
        uint256[] areas;
        uint256[] prices;
    }
    Offer[] private offers;

    struct OfferBuy {
        uint256 offerId;
        address owner;
        uint256 quantity;
        uint256 tokenId;
        Status status;
        address buyers;
        uint256 areas;
        uint256 prices;
    }
    OfferBuy[] private offersBuy;

    struct Token {
        uint256 tokenId;
        string metaData;
        uint256 maxDivisions;
        uint256 price;
    }
    Token[] private tokens;

    // 1
    mapping (uint256 => Token) private tokenInfo;
    // 2
    mapping (address => Account) private accDetails;
    // 3
    mapping (address => bool) private accountExists;
    // 4
    mapping (address => Token[]) private ownerTokenDetails;
    // 5
    mapping (address => mapping(uint256 => uint256)) private accTokenBalance;

    function createAccount(address _wallet, string memory _aadharCard, string memory _cardNo, uint256 _cvv, string memory _name, string memory _expiry, string memory _avatar) public {
        
        accountExists[msg.sender] = true;
        
        Account memory newAccount = Account(_wallet, _aadharCard, _cardNo, _cvv, _name, _expiry, _avatar);
        // 2
        accDetails[msg.sender] = newAccount;
        accounts.push(newAccount);
    }

    function createToken(uint256 _maxSupply, uint256 _price, string memory _landDetails) public payable {
        require(msg.value == MIN_FEE, "No transaction fee");
        require(accountExists[msg.sender] == true, "Create an account");
        
        uint256 currId = currTokenId();

        Token memory newToken = Token(currId, _landDetails, _maxSupply, _price);
        // added to array
        tokens.push(newToken);
        // added to mapping, 1
        tokenInfo[currId] = newToken;
        // 4
        ownerTokenDetails[msg.sender].push(newToken);
        
        _mint(msg.sender, currId, _maxSupply, "");

        // event NewTokenCreated(uint256 indexed tokenId, address owner, uint256 maxSupply, uint256 price, string landDetails);
        emit NewTokenCreated(currId, msg.sender, _maxSupply, _price, _landDetails);

        incTokenId();
    }

    function transfer(address _from, address _to, uint256 _tokenId, uint256 _amount) private {
        _safeTransferFrom(_from, _to, _tokenId, _amount, "");
    }

    enum Status { Started, Completed, Canceled}
    Status private status;

    mapping(uint256 => mapping(address => bool)) private offerAuth;

    function offer(uint256 _tokenId, address[] memory _buyers, uint256 _quantity,uint256[] memory _areas, uint256[] memory _prices) public {
        require(balanceOf(msg.sender, _tokenId) >= _quantity, "You do not own this asset");

        uint256 currOffer = currOfferId();

        Offer memory newOffer = Offer(currOffer, msg.sender, _quantity, _tokenId, Status.Started, _buyers, _areas , _prices);
        
        sellOffers[msg.sender][currOffer] = newOffer;
        
        // adding to userSellOffers
        sellOffersArr[msg.sender].push(newOffer);

        offers.push(newOffer);
        emit OfferCreated(currOffer, _tokenId, msg.sender, _quantity, _buyers , _areas , _prices);

        for (uint256 i = 0; i < _buyers.length ; i++) {
            // created newOffer
            OfferBuy memory newOffer2 = OfferBuy(currOffer, msg.sender, _quantity, _tokenId, Status.Started, _buyers[i], _areas[i] , _prices[i]);

            //   buyOffers[msg.sender] = newOffer;
            buyOffers[_buyers[i]][currOffer] = newOffer2;

            // adding to userSellOffers
            buyOffersArr[_buyers[i]].push(newOffer2);

            // added to offers array
            offersBuy.push(newOffer2);

            // authorize addresses in array
            offerAuth[currOffer][_buyers[i]] = true;

        }
        // OfferCreated(uint256 indexed offerId, address creator, uint256 quantity);

        incOfferId();
    }

    // give the money in escrow, then dispatch tokens to the address
    function offerCancel( uint256 _offerId) public payable {
        require(msg.value == MIN_FEE, "Please enter the required fee");

        // change state to cancelled
        // offersMap[_offerId].status = Status.Canceled; 
        sellOffers[msg.sender][_offerId].status = Status.Canceled;

        // OfferCanceled(uint256 offerId);
        emit OfferCanceled(sellOffers[msg.sender][_offerId].owner, _offerId);
    }

    function withdraw() payable public onlyOwner {
        require(address(this).balance >= 0, "Balance is 0");

        (bool sent,  ) = payable(admin).call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    
    function buyToken(uint256 _offerId) public payable {
        OfferBuy memory currOffer = buyOffers[msg.sender][_offerId];
        uint256 token = currOffer.tokenId;
        Token memory currToken = tokenInfo[token];
        /*
        struct OfferBuy {
            uint256 offerId;
            address owner;
            uint256 quantity;
            uint256 tokenId;
            Status status;
            address buyers;
            uint256 areas;
            uint256 prices;
        }
        */
        // check authorization
        require(offerAuth[_offerId][msg.sender] == true, "Not authorized");

        // can buy only when status of offer is started
        require(currOffer.status == Status.Started, "The offer has been accepted or rejected");
        
        // tokenId <= tokens.length else tokenId doest exist
        require(currOffer.tokenId <= tokens.length, "Token doesn't exist");
       
        (bool sent, ) = payable(currOffer.owner).call{value: currOffer.prices}("");
        require(sent, "Failed to send Ether");

        transfer(currOffer.owner, msg.sender , currOffer.tokenId, currOffer.areas);

        /*
        struct Token {
            uint256 tokenId;
            string metaData;
            uint256 maxDivisions;
            uint256 price;
        }
        */
        
        ownerTokenDetails[msg.sender].push(Token(currOffer.tokenId, currToken.metaData, currOffer.areas, currOffer.prices));

        // TokenTransferred(address indexed from, address indexed to, uint256 tokenId, uint256 quantity);
        emit TokenTransferred(currOffer.owner,msg.sender, currOffer.tokenId, currOffer.areas);

        // state changed to "Completed"
        currOffer.status = Status.Completed;

    }

    function getBuyOffers(address _user) public view returns(OfferBuy[] memory){
        return buyOffersArr[_user];
    }

    function getSellOffers(address _user) public view returns(Offer[] memory){
        return sellOffersArr[_user];
    }

    function getTokens() public view returns(Token[] memory) {
        return tokens;
    }

    function getUserTokens(address _user) public view returns(Token[] memory) {
        return ownerTokenDetails[_user];
    }

    function getUserInfo(address _user) public view returns(Account memory) {
        return accDetails[_user];
    }

    // returns the balance of the smart contract
    function balance() public view returns(uint256) {
        return address(this).balance;
    }
}