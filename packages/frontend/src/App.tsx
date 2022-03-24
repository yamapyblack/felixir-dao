import React from 'react';
import './App.css';
import { ethers } from "ethers";

function App() {
  const MaxMintNumber = 10000
  const currentMintNumber = 0

  function MetaMuskConnectButton() {
    const MetaMuskConnect = () =>{
      const provider = new ethers.providers.Web3Provider((window as any).ethereum)
  
      const accounts = async () => {
        await provider.send("eth_requestAccounts", []);
      }
      accounts();
      const signer = provider.getSigner()  
    };
    return  <button className="" onClick={MetaMuskConnect}>Connect</button>
  }

  function MintButton() {
    return  <button className="" >Mint</button>
  }
   
  return (
    <div className="App">
      <MetaMuskConnectButton/>
      {currentMintNumber}/{MaxMintNumber}
    </div>
  );
}

export default App;
