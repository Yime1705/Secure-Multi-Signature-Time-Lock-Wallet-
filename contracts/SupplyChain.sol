// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";


contract SupplyChain {

    enum State { 
        Produced, 
        ShippedByManufacturer, 
        ReceivedByDistributor, 
        ShippedByDistributor, 
        ReceivedByRetailer 
    }

    struct Product {
        uint256 id;
        string name;
        address currentOwner;
        State currentState;
        address manufacturer;
        address distributor;
        address retailer;
    }


    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    bytes32 public constant RETAILER_ROLE = keccak256("RETAILER_ROLE");

    mapping(uint256 => Product) public products;
    uint256 public productCount;

    event ProductCreated(uint256 indexed productId, string name, address manufacturer);
    event StateChanged(uint256 indexed productId, State state, address actor);
    event OwnershipTransferred(uint256 indexed productId, address previousOwner, address newOwner);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

  
    function produceProduct(string memory _name) public onlyRole(MANUFACTURER_ROLE) {
        productCount++;
        products[productCount] = Product({
            id: productCount,
            name: _name,
            currentOwner: msg.sender,
            currentState: State.Produced,
            manufacturer: msg.sender,
            distributor: address(0),
            retailer: address(0)
        });

        emit ProductCreated(productCount, _name, msg.sender);
        emit StateChanged(productCount, State.Produced, msg.sender);
    }


    function shipToDistributor(uint256 _productId) public onlyRole(MANUFACTURER_ROLE) {
        Product storage product = products[_productId];
        require(product.currentState == State.Produced, "Product must be in Produced state");
        
        product.currentState = State.ShippedByManufacturer;
        emit StateChanged(_productId, State.ShippedByManufacturer, msg.sender);
    }


    function receiveByDistributor(uint256 _productId) public onlyRole(DISTRIBUTOR_ROLE) {
        Product storage product = products[_productId];
        require(product.currentState == State.ShippedByManufacturer, "Product must be shipped by manufacturer");
        
        address oldOwner = product.currentOwner;
        product.currentOwner = msg.sender;
        product.distributor = msg.sender;
        product.currentState = State.ReceivedByDistributor;

        emit OwnershipTransferred(_productId, oldOwner, msg.sender);
        emit StateChanged(_productId, State.ReceivedByDistributor, msg.sender);
    }


    function shipToRetailer(uint256 _productId) public onlyRole(DISTRIBUTOR_ROLE) {
        Product storage product = products[_productId];
        require(product.currentState == State.ReceivedByDistributor, "Product must be at Distributor");
        
        product.currentState = State.ShippedByDistributor;
        emit StateChanged(_productId, State.ShippedByDistributor, msg.sender);
    }


    function receiveByRetailer(uint256 _productId) public onlyRole(RETAILER_ROLE) {
        Product storage product = products[_productId];
        require(product.currentState == State.ShippedByDistributor, "Product must be shipped by distributor");
        
        address oldOwner = product.currentOwner;
        product.currentOwner = msg.sender;
        product.retailer = msg.sender;
        product.currentState = State.ReceivedByRetailer;

        emit OwnershipTransferred(_productId, oldOwner, msg.sender);
        emit StateChanged(_productId, State.ReceivedByRetailer, msg.sender);
    }


    function getProduct(uint256 _productId) public view returns (Product memory) {
        return products[_productId];
    }
}