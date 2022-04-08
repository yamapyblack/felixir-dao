import type { NextPage } from 'next'
import { ethers } from "ethers"
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from './components/Header';
import Footer from './components/Footer';


const Home: NextPage = () => {
  let contractText: string = 'hello';

  // メタマスクコネクト用
  function MetaMuskConnectButton() {
    const MetaMuskConnect = async () =>{
      const provider = new ethers.providers.Web3Provider((window as any).ethereum)
  
      const accounts =  await provider.send("eth_requestAccounts", []);
      
      const signer = provider.getSigner()
      const abi = [
        "function greet() view returns (string memory)",
        "function setGreeting(string memory _greeting)"
        ]
      const contractAddress = "0xab8256Fe5E2cD26Be3ECE69b5E421e63664b938e"
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const value = await contract.greet();
      contractText = value;
      console.log(value);

      const value2 = await contract.setGreeting("aaaaa");
      console.log(value2);
    };
    return  <><button className="flex sm:justify-center space-x-4 " onClick={MetaMuskConnect}>Connect</button><br/></>
  }

  // ミントボタン用
  function MintButton() {
    const MetaMuskConnect = async () =>{
      const provider = new ethers.providers.Web3Provider((window as any).ethereum)
  
      const accounts =  await provider.send("eth_requestAccounts", []);
      
      const signer = provider.getSigner()
      const abi = [
        "function greet() view returns (string memory)",
        "function setGreeting(string memory _greeting)"
        ]
      const contractAddress = "0xab8256Fe5E2cD26Be3ECE69b5E421e63664b938e"
      const contract = new ethers.Contract(contractAddress, abi, signer);
    };
    return <>
      <div className="relative">
        <Image className="absolute" src="/section-mint.png" alt="Main Image"  width={1500} height={500} objectFit="contain"/>
        <div className="absolute top-44 inset-0 left-0 right-0">
          <button className="px-2 py-1 my-20 text-lg text-white font-semibold rounded-full bg-rose-700" onClick={MetaMuskConnect}>NFT MINT</button>
        </div>
      </div>
    </>
  }
  return (
    <div>
      <Header />     
      <main className={styles.title}>
      <Image className="absolute" src="/KeyLayout.png" alt="Main Image"  width={1500} height={500}/>
      <MintButton />
      </main>
      <Footer />
    </div>
  )
}

export default Home
