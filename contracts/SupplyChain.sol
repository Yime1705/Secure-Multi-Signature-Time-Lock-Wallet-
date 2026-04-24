// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract SupplyChain is AccessControl {
    
    // ADD THESE LINES: These define the identifiers the compiler is missing
    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    bytes32 public constant RETAILER_ROLE = keccak256("RETAILER_ROLE");


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

    mapping(uint256 => Product) public products;
    uint256 public productCount;


    event ProductCreated(uint256 indexed productId, string name, address manufacturer);
    event StateChanged(uint256 indexed productId, State state, address actor);
    event OwnershipTransferred(uint256 indexed productId, address previousOwner, address newOwner);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function createProduct(string memory name) public onlyRole(MANUFACTURER_ROLE) {
        productCount++;
        products[productCount] = Product({
            id: productCount,
            name: name,
            currentOwner: msg.sender,
            currentState: State.Produced,
            manufacturer: msg.sender,
            distributor: address(0),
            retailer: address(0)
        });

        emit ProductCreated(productCount, name, msg.sender);
    }

    function ShipByManufacturer(uint256 productId, address distributor) public onlyRole(MANUFACTURER_ROLE) {
        Product storage product = products[productId];
        require(product.currentState == State.Produced, "Ready to Ship state");
        require(product.currentOwner == msg.sender, "Only the manufactutrer can ship the product ");

        product.currentState = State.ShippedByManufacturer;
        product.distributor = distributor;
        emit StateChanged(productId, State.ShippedByManufacturer, msg.sender);
    }

    function ReceiveByDistributer(uint256 productId) public onlyRole(DISTRIBUTOR_ROLE)
    {
        Product storage product = products[productId];
        require(product.currentState == State.ShippedByManufacturer, "Ready to receive by distributor state");
        require(product.distributor == msg.sender, "Only the assigned distributor can receive the product");
        product.currentState = State.ReceivedByDistributor;
        emit StateChanged(productId, State.ReceivedByDistributor, msg.sender);
    }

    function ShipByDistributor(uint256 productId, address retailer) public onlyRole(DISTRIBUTOR_ROLE)
    {
        Product storage product = products[productId];
        require(product.currentState == State.ReceivedByDistributor, "Ready to ship by distributor state");
        require(product.distributor == msg.sender, "Only the assigned distributor can ship the product");
        product.currentState = State.ShippedByDistributor;
        product.retailer = retailer;
        emit StateChanged(productId, State.ShippedByDistributor, msg.sender);
    }

    function ReceiveByRetailer(uint256 productId) public onlyRole(RETAILER_ROLE)
    {
        Product storage product = products[productId];
        require(product.currentState == State.ShippedByDistributor, "Ready to receive by retailer state");
        require(product.retailer == msg.sender, "Only the assigned retailer can receive the product");
        product.currentState = State.ReceivedByRetailer;
        emit StateChanged(productId, State.ReceivedByRetailer, msg.sender);
    }

    function transferRetailOwnership(uint256 productId, address previousOwner, address newOwner) public onlyRole(RETAILER_ROLE)
    {
        Product storage product = products[productId];
        require(product.currentState == State.ReceivedByRetailer, "Only products in ReceivedByRetailer state can be transferred");
        require(product.retailer == previousOwner, "Only the current owner can transfer ownership");
        product.retailer = newOwner;
        emit StateChanged(productId, State.ReceivedByRetailer, msg.sender);
        emit OwnershipTransferred(productId, previousOwner, newOwner);
    }
}