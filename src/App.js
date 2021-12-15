import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/Rocket.json";
const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const contractABI = abi.abi;
function App() {
  const [account, setAccount] = useState();
  const [metamaskStatus, setMetamaskStatus] = useState(false);
  const [message, setMessage] = useState();
  const [totalRockets, setTotalRockets] = useState(0);
  const [rocketsLog, setRocketsLog] = useState([]);
  const getContract = async () => {
    try {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const RocketContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      return RocketContract;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const countTotalRockets = async () => {
    try {
      const RocketContract = await getContract();
      console.log(RocketContract);
      let count = await RocketContract.getTotalRockets();
      console.log(count.toNumber());
      setTotalRockets(count.toNumber());
    } catch (error) {
      console.log(error);
    }
  };
  const getAllRockets = async () => {
    try {
      const RocketContract = await getContract();
      let allRockets = await RocketContract.getAllRockets();
      console.log(allRockets);
      let allRockets_cleaned = [];
      allRockets.forEach((rocket) => {
        allRockets_cleaned.push({
          launcher: rocket.launcher,
          message: rocket.message,
          timestamp: new Date(rocket.timestamp * 1000),
        });
      });
      setRocketsLog(allRockets_cleaned);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletConnected = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        setMetamaskStatus(true);
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length !== 0) {
          setAccount(accounts[0]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const submitMessage = async (e) => {
    e.preventDefault();
    try {
      const RocketContract = await getContract();
      let rocketTxn = await RocketContract.sendRocket(message, {
        gasLimit: 300000,
      });
      rocketTxn.wait();
      console.log("mined:", rocketTxn);
      await countTotalRockets();
      await getAllRockets();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    checkIfWalletConnected();
    countTotalRockets();
    getAllRockets();
  }, []);

  useEffect(() => {
    console.log(rocketsLog);
  }, [rocketsLog]);
  return (
    <div className="App">
      <div className="main">
        <div className="header">The Rocket Portal 🚀</div>
        <div className="description">
          Here,you can send your message in a 🚀 to me
        </div>
        <div className="total-rockets">total = {totalRockets} 🚀</div>
        {!metamaskStatus && (
          <div className="alert">You don't have a metamask wallet</div>
        )}
        {metamaskStatus && !account && (
          <button onClick={connectWallet}>Connect Metamask</button>
        )}
        {account && <div className="account">Your account : {account}</div>}
        {account && (
          <form onSubmit={submitMessage} className="message">
            <input
              type="text"
              placeholder="Enter your message"
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={submitMessage}>🚀</button>
          </form>
        )}
      </div>
      <div className="transactions">
        {rocketsLog.map((rocket, index) => {
          return (
            <div id={index} key={index} className="one-rocket">
              <div className="address">launcher = {rocket.launcher}</div>
              <div className="message">message = {rocket.message}</div>
              <div className="timestamp">
                timestamp = {rocket.timestamp.toString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
