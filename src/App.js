import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [account, setAccount] = useState();
  const [metamaskStatus, setMetamaskStatus] = useState(false);
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
  useEffect(() => {
    checkIfWalletConnected();
  }, []);
  return (
    <div className="App">
      <div className="main">
        <div className="header">The Rocket Portal 🚀</div>
        <div className="description">
          Here,you can send your message in a 🚀 to me
        </div>
        {!metamaskStatus && (
          <div className="alert">You don't have a metamask wallet</div>
        )}
        {account && <div className="account">Your account : {account}</div>}
        {metamaskStatus && !account && (
          <button onClick={connectWallet}>Connect Metamask</button>
        )}
      </div>
      <div className="transactions"></div>
    </div>
  );
}

export default App;
