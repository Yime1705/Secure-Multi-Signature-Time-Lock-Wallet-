import { useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import "./App.css";

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const CONTRACT_ABI = [
  "event ProductCreated(uint256 indexed productId, string name, address manufacturer)",
  "event StateChanged(uint256 indexed productId, uint8 state, address actor)",
  "event OwnershipTransferred(uint256 indexed productId, address previousOwner, address newOwner)",
  "function createProduct(string name) public",
  "function ShipByManufacturer(uint256 productId, address distributor) public",
  "function ReceiveByDistributer(uint256 productId) public",
  "function ShipByDistributor(uint256 productId, address retailer) public",
  "function ReceiveByRetailer(uint256 productId) public",
  "function transferRetailOwnership(uint256 productId, address previousOwner, address newOwner) public",
  "function products(uint256) view returns (uint256 id, string name, address currentOwner, uint8 currentState, address manufacturer, address distributor, address retailer)",
  "function productCount() view returns (uint256)",
];

const STATE_NAMES = [
  "Produced",
  "Shipped by Manufacturer",
  "Received by Distributor",
  "Shipped by Distributor",
  "Received by Retailer",
];

const STATE_COLORS = ["#00a87e", "#494fdf", "#ec7e00", "#b09000", "#00a87e"];

// Product type for tracking
interface TrackedProduct {
  id: number;
  name: string;
  currentState: number;
  manufacturer: string;
  distributor: string;
  retailer: string;
  timeline: { state: number; timestamp: Date; actor: string }[];
}

// Blockchain status type
interface BlockchainStatus {
  connected: boolean;
  network: string;
  blockNumber: number | null;
  contractAddress: string;
}

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [blockchainStatus, setBlockchainStatus] = useState<BlockchainStatus>({
    connected: false,
    network: "Not Connected",
    blockNumber: null,
    contractAddress: CONTRACT_ADDRESS,
  });

  // Product tracking state
  const [products, setProducts] = useState<TrackedProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Form states
  const [productName, setProductName] = useState("");
  const [shipManProductId, setShipManProductId] = useState("");
  const [distributorAddress, setDistributorAddress] = useState(
    "0x70997970C51812dc3A010C7d01b50e0d17DC79C8",
  );
  const [recDistProductId, setRecDistProductId] = useState("");
  const [shipDistProductId, setShipDistProductId] = useState("");
  const [retailerAddress, setRetailerAddress] = useState(
    "0x3C44CdDdB6a900fa2B585d299e03d12FA4293BC",
  );
  const [recRetProductId, setRecRetProductId] = useState("");
  const [searchProductId, setSearchProductId] = useState("");
  const [productDetails, setProductDetails] = useState<TrackedProduct | null>(
    null,
  );

  // Connect Wallet
  const connectWallet = async () => {
    if ((window as any).ethereum) {
      try {
        const provider = new BrowserProvider((window as any).ethereum);
        const network = await provider.getNetwork();
        const blockNumber = await provider.getBlockNumber();
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setAccount(address);

        const supplyChainContract = new Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer,
        );
        setContract(supplyChainContract);

        setBlockchainStatus({
          connected: true,
          network: network.name || `Chain ID: ${network.chainId}`,
          blockNumber: blockNumber,
          contractAddress: CONTRACT_ADDRESS,
        });

        // Load existing products
        await loadProducts(supplyChainContract);
      } catch (error) {
        console.error("Connection error:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Load all products
  const loadProducts = async (contractInstance: Contract) => {
    setLoadingProducts(true);
    try {
      const count = await contractInstance.productCount();
      const loadedProducts: TrackedProduct[] = [];

      for (let i = 1; i <= Number(count); i++) {
        const data = await contractInstance.products(i);
        loadedProducts.push({
          id: Number(data.id),
          name: data.name,
          currentState: Number(data.currentState),
          manufacturer: data.manufacturer,
          distributor: data.distributor,
          retailer: data.retailer,
          timeline: [],
        });
      }

      setProducts(loadedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
    }
    setLoadingProducts(false);
  };

  // Get product counts by state
  const getProductsByState = (state: number) =>
    products.filter((p) => p.currentState === state);
  const getProductStats = () => ({
    total: products.length,
    produced: getProductsByState(0).length,
    inTransit: getProductsByState(1).length + getProductsByState(3).length,
    received: getProductsByState(2).length + getProductsByState(4).length,
  });

  // Manufacturer Actions
  const handleCreateProduct = async () => {
    if (!contract) return;
    try {
      const tx = await contract.createProduct(productName);
      await tx.wait();
      alert("Product created successfully!");
      setProductName("");
      await loadProducts(contract);
    } catch (error) {
      console.error(error);
      alert("Error creating product. Check console.");
    }
  };

  const handleShipByManufacturer = async () => {
    if (!contract) return;
    try {
      const tx = await contract.ShipByManufacturer(
        shipManProductId,
        distributorAddress,
      );
      await tx.wait();
      alert("Shipped by Manufacturer!");
      setShipManProductId("");
      await loadProducts(contract);
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
      setRecDistProductId("");
      await loadProducts(contract);
    } catch (error) {
      console.error(error);
      alert("Error receiving product.");
    }
  };

  const handleShipByDistributor = async () => {
    if (!contract) return;
    try {
      const tx = await contract.ShipByDistributor(
        shipDistProductId,
        retailerAddress,
      );
      await tx.wait();
      alert("Shipped by Distributor!");
      setShipDistProductId("");
      await loadProducts(contract);
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
      setRecRetProductId("");
      await loadProducts(contract);
    } catch (error) {
      console.error(error);
      alert("Error receiving product.");
    }
  };

  // View Product Details
  const handleSearchProduct = async () => {
    if (!contract) return;
    try {
      const data = await contract.products(searchProductId);
      setProductDetails({
        id: Number(data.id),
        name: data.name,
        currentState: Number(data.currentState),
        manufacturer: data.manufacturer,
        distributor: data.distributor,
        retailer: data.retailer,
        timeline: [],
      });
    } catch (error) {
      console.error(error);
      alert("Product not found.");
    }
  };

  const shortenAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  // Show product detail view
  const showProductDetail = (product: TrackedProduct) => {
    setProductDetails(product);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">SupplyChain</h1>
          {!account ? (
            <button className="btn-primary" onClick={connectWallet}>
              Connect Wallet
            </button>
          ) : (
            <div className="account-badge">
              <span className="status-dot"></span>
              {shortenAddress(account)}
            </div>
          )}
        </div>
      </header>

      <main className="main">
        {/* Blockchain Status Panel */}
        <section className="section blockchain-status">
          <div className="section-header">
            <h2 className="section-title">Blockchain Status</h2>
          </div>
          <div className="status-grid">
            <div className="status-card">
              <span className="status-label">Network</span>
              <span className="status-value">{blockchainStatus.network}</span>
            </div>
            <div className="status-card">
              <span className="status-label">Block</span>
              <span className="status-value">
                {blockchainStatus.blockNumber ?? "—"}
              </span>
            </div>
            <div className="status-card">
              <span className="status-label">Contract</span>
              <span className="status-value mono">
                {shortenAddress(blockchainStatus.contractAddress)}
              </span>
            </div>
            <div className="status-card">
              <span className="status-label">Products</span>
              <span className="status-value">{products.length}</span>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="section stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{getProductStats().produced}</span>
              <span className="stat-label">Produced</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{getProductStats().inTransit}</span>
              <span className="stat-label">In Transit</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{getProductStats().received}</span>
              <span className="stat-label">Received</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{getProductStats().total}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
        </section>

        {contract && (
          <div className="dashboard-grid">
            {/* Product Actions */}
            <div className="panel">
              <div className="panel-section">
                <h3 className="panel-title">Manufacturer</h3>
                <div className="action-group">
                  <input
                    className="input"
                    placeholder="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                  <button className="btn-primary" onClick={handleCreateProduct}>
                    Create Product
                  </button>
                </div>
                <div className="action-group">
                  <input
                    className="input"
                    type="number"
                    placeholder="Product ID"
                    value={shipManProductId}
                    onChange={(e) => setShipManProductId(e.target.value)}
                  />
                  <input
                    className="input"
                    placeholder="Distributor Address"
                    value={distributorAddress}
                    onChange={(e) => setDistributorAddress(e.target.value)}
                  />
                  <button
                    className="btn-secondary"
                    onClick={handleShipByManufacturer}
                  >
                    Ship
                  </button>
                </div>
              </div>

              <div className="panel-section">
                <h3 className="panel-title">Distributor</h3>
                <div className="action-group">
                  <input
                    className="input"
                    type="number"
                    placeholder="Product ID"
                    value={recDistProductId}
                    onChange={(e) => setRecDistProductId(e.target.value)}
                  />
                  <button
                    className="btn-primary"
                    onClick={handleReceiveByDistributor}
                  >
                    Receive
                  </button>
                </div>
                <div className="action-group">
                  <input
                    className="input"
                    type="number"
                    placeholder="Product ID"
                    value={shipDistProductId}
                    onChange={(e) => setShipDistProductId(e.target.value)}
                  />
                  <input
                    className="input"
                    placeholder="Retailer Address"
                    value={retailerAddress}
                    onChange={(e) => setRetailerAddress(e.target.value)}
                  />
                  <button
                    className="btn-secondary"
                    onClick={handleShipByDistributor}
                  >
                    Ship
                  </button>
                </div>
              </div>

              <div className="panel-section">
                <h3 className="panel-title">Retailer</h3>
                <div className="action-group">
                  <input
                    className="input"
                    type="number"
                    placeholder="Product ID"
                    value={recRetProductId}
                    onChange={(e) => setRecRetProductId(e.target.value)}
                  />
                  <button
                    className="btn-primary"
                    onClick={handleReceiveByRetailer}
                  >
                    Receive
                  </button>
                </div>
              </div>
            </div>

            {/* Product Tracker */}
            <div className="panel tracker-panel">
              <h3 className="panel-title">Product Tracker</h3>

              <div className="tracker-search">
                <input
                  className="input"
                  type="number"
                  placeholder="Search by Product ID"
                  value={searchProductId}
                  onChange={(e) => setSearchProductId(e.target.value)}
                />
                <button className="btn-secondary" onClick={handleSearchProduct}>
                  Search
                </button>
              </div>

              {loadingProducts ? (
                <div className="loading">Loading products...</div>
              ) : products.length === 0 ? (
                <div className="empty-state">No products tracked yet</div>
              ) : (
                <div className="tracker-list">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="tracker-item"
                      onClick={() => showProductDetail(product)}
                    >
                      <div className="tracker-item-header">
                        <span className="tracker-id">#{product.id}</span>
                        <span
                          className="tracker-state"
                          style={{
                            backgroundColor:
                              STATE_COLORS[product.currentState] + "20",
                            color: STATE_COLORS[product.currentState],
                          }}
                        >
                          {STATE_NAMES[product.currentState]}
                        </span>
                      </div>
                      <div className="tracker-item-name">{product.name}</div>
                      <div className="tracker-item-meta">
                        <span>{shortenAddress(product.manufacturer)}</span>
                        {product.distributor !==
                          "0x0000000000000000000000000000000000000000" && (
                          <span>→ {shortenAddress(product.distributor)}</span>
                        )}
                        {product.retailer !==
                          "0x0000000000000000000000000000000000000000" && (
                          <span>→ {shortenAddress(product.retailer)}</span>
                        )}
                      </div>
                      <div className="tracker-progress">
                        <div
                          className="tracker-progress-bar"
                          style={{
                            width: `${(product.currentState / 4) * 100}%`,
                            backgroundColor: STATE_COLORS[product.currentState],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            {productDetails && (
              <div className="panel details-panel">
                <h3 className="panel-title">Product #{productDetails.id}</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Name</span>
                    <span className="detail-value">{productDetails.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Current State</span>
                    <span
                      className="detail-value state-badge"
                      style={{
                        color: STATE_COLORS[productDetails.currentState],
                      }}
                    >
                      {STATE_NAMES[productDetails.currentState]}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Manufacturer</span>
                    <span className="detail-value mono">
                      {productDetails.manufacturer}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Distributor</span>
                    <span className="detail-value mono">
                      {productDetails.distributor ===
                      "0x0000000000000000000000000000000000000000"
                        ? "—"
                        : productDetails.distributor}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Retailer</span>
                    <span className="detail-value mono">
                      {productDetails.retailer ===
                      "0x0000000000000000000000000000000000000000"
                        ? "—"
                        : productDetails.retailer}
                    </span>
                  </div>
                </div>

                {/* State Timeline */}
                <div className="timeline">
                  <h4 className="timeline-title">Journey</h4>
                  <div className="timeline-track">
                    {STATE_NAMES.map((_, index) => (
                      <div
                        key={index}
                        className={`timeline-step ${index <= productDetails.currentState ? "active" : ""}`}
                        style={{
                          backgroundColor:
                            index <= productDetails.currentState
                              ? STATE_COLORS[index]
                              : "#e8e8e8",
                        }}
                      >
                        {index < productDetails.currentState && (
                          <span className="timeline-check">✓</span>
                        )}
                        {index === productDetails.currentState && (
                          <span className="timeline-dot"></span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="timeline-labels">
                    {STATE_NAMES.map((name, index) => (
                      <span
                        key={index}
                        className={`timeline-label ${index <= productDetails.currentState ? "active" : ""}`}
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
