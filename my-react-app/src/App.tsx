import { useState } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import './App.css';

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

const CONTRACT_ABI = [
  "function createProduct(string name) public",
  "function ShipByManufacturer(uint256 productId, address distributor) public",
  "function ReceiveByDistributer(uint256 productId) public",
  "function ShipByDistributor(uint256 productId, address retailer) public",
  "function ReceiveByRetailer(uint256 productId) public",
  "function transferRetailOwnership(uint256 productId, address previousOwner, address newOwner) public",
  "function products(uint256) public view returns (uint256 id, string name, address currentOwner, uint8 currentState, address manufacturer, address distributor, address retailer)",
  "function productCount() public view returns (uint256)"
];

const STATE_MAPPING = [
  "Produced",
  "Shipped By Manufacturer",
  "Received By Distributor",
  "Shipped By Distributor",
  "Received By Retailer"
];

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);

  // Form States
  const [productName, setProductName] = useState("");
  const [shipManProductId, setShipManProductId] = useState("");
  const [distributorAddress, setDistributorAddress] = useState("");
  const [recDistProductId, setRecDistProductId] = useState("");
  const [shipDistProductId, setShipDistProductId] = useState("");
  const [retailerAddress, setRetailerAddress] = useState("");
  const [recRetProductId, setRecRetProductId] = useState("");
  const [searchProductId, setSearchProductId] = useState("");
  const [productDetails, setProductDetails] = useState<any>(null);

  // Connect Wallet
  const connectWallet = async () => {
    if ((window as any).ethereum) {
      try {
        const provider = new BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const supplyChainContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(supplyChainContract);
      } catch (error) {
        console.error("Connection error:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Manufacturer Actions
  const handleCreateProduct = async () => {
    if (!contract) return;
    try {
      const tx = await contract.createProduct(productName);
      await tx.wait();
      alert("Product created successfully!");
    } catch (error) {
      console.error(error);
      alert("Error creating product. Check console.");
    }
  };

  const handleShipByManufacturer = async () => {
    if (!contract) return;
    try {
      const tx = await contract.ShipByManufacturer(shipManProductId, distributorAddress);
      await tx.wait();
      alert("Shipped by Manufacturer!");
    } catch (error) {
      console.error(error);
      alert("Error shipping product.");
    }
  };

  // Distributor Actions
  const handleReceiveByDistributor = async () => {
    if (!contract) return;
    try {
      const tx = await contract.ReceiveByDistributer(recDistProductId);
      await tx.wait();
      alert("Received by Distributor!");
    } catch (error) {
      console.error(error);
      alert("Error receiving product.");
    }
  };

  const handleShipByDistributor = async () => {
    if (!contract) return;
    try {
      const tx = await contract.ShipByDistributor(shipDistProductId, retailerAddress);
      await tx.wait();
      alert("Shipped by Distributor!");
    } catch (error) {
      console.error(error);
      alert("Error shipping product.");
    }
  };

  // Retailer Actions
  const handleReceiveByRetailer = async () => {
    if (!contract) return;
    try {
      const tx = await contract.ReceiveByRetailer(recRetProductId);
      await tx.wait();
      alert("Received by Retailer!");
    } catch (error) {
      console.error(error);
      alert("Error receiving product.");
    }
  };

  // View Product
  const handleSearchProduct = async () => {
    if (!contract) return;
    try {
      const data = await contract.products(searchProductId);
      setProductDetails({
        id: data.id.toString(),
        name: data.name,
        currentOwner: data.currentOwner,
        currentState: STATE_MAPPING[Number(data.currentState)],
        manufacturer: data.manufacturer,
        distributor: data.distributor,
        retailer: data.retailer
      });
    } catch (error) {
      console.error(error);
      alert("Product not found.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Supply Chain DApp</h1>
      
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <p><strong>Connected Account:</strong> {account}</p>
      )}

      {contract && (
        <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
          
          {/* MANUFACTURER PANEL */}
          <div style={panelStyle}>
            <h3>Manufacturer Actions</h3>
            <div>
              <input placeholder="Product Name" onChange={e => setProductName(e.target.value)} />
              <button onClick={handleCreateProduct}>Create Product</button>
            </div>
            <div style={{ marginTop: "10px" }}>
              <input placeholder="Product ID" type="number" onChange={e => setShipManProductId(e.target.value)} />
              <input placeholder="Distributor Address" onChange={e => setDistributorAddress(e.target.value)} />
              <button onClick={handleShipByManufacturer}>Ship to Distributor</button>
            </div>
          </div>

          {/* DISTRIBUTOR PANEL */}
          <div style={panelStyle}>
            <h3>Distributor Actions</h3>
            <div>
              <input placeholder="Product ID" type="number" onChange={e => setRecDistProductId(e.target.value)} />
              <button onClick={handleReceiveByDistributor}>Receive Product</button>
            </div>
            <div style={{ marginTop: "10px" }}>
              <input placeholder="Product ID" type="number" onChange={e => setShipDistProductId(e.target.value)} />
              <input placeholder="Retailer Address" onChange={e => setRetailerAddress(e.target.value)} />
              <button onClick={handleShipByDistributor}>Ship to Retailer</button>
            </div>
          </div>

          {/* RETAILER PANEL */}
          <div style={panelStyle}>
            <h3>Retailer Actions</h3>
            <div>
              <input placeholder="Product ID" type="number" onChange={e => setRecRetProductId(e.target.value)} />
              <button onClick={handleReceiveByRetailer}>Receive Product</button>
            </div>
          </div>

          {/* PRODUCT TRACKING PANEL */}
          <div style={panelStyle}>
            <h3>Track Product</h3>
            <input placeholder="Enter Product ID" type="number" onChange={e => setSearchProductId(e.target.value)} />
            <button onClick={handleSearchProduct}>Search</button>

            {productDetails && (
              <div style={{ marginTop: "15px", textAlign: "left", background: "#f9f9f9", padding: "10px", color: "black" }}>
                <p><strong>ID:</strong> {productDetails.id}</p>
                <p><strong>Name:</strong> {productDetails.name}</p>
                <p><strong>Status:</strong> {productDetails.currentState}</p>
                <p><strong>Current Owner:</strong> {productDetails.currentOwner}</p>
                <p><strong>Manufacturer:</strong> {productDetails.manufacturer}</p>
                <p><strong>Distributor:</strong> {productDetails.distributor}</p>
                <p><strong>Retailer:</strong> {productDetails.retailer}</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

const panelStyle = {
  border: "1px solid #ccc",
  padding: "15px",
  borderRadius: "8px",
  backgroundColor: "#2c2c2c",
  color: "white"
};

export default App;