import type { NextPage } from 'next'
import React, { useState } from "react";
import { ethers } from "ethers"
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from './components/Header';
import Footer from './components/Footer';
declare global {
  interface Window {
    ethereum: any;
  }
}

const Home: NextPage = () => {
  const mintNumber = 0;
  const [isThumbnail, setIsThumbnail] = useState(true);
  // add Network
  function addChain() {
    try{
      (window as any).ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x13881',
          chainName: 'mumbai',
          nativeCurrency: {
              name: 'MATIC',
              symbol: 'MATIC',
              decimals: 18,
          },
          rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
        }],
      })
    }catch(Exeption){
      console.log("Astar Network already Connected");
    } 
  };
  addChain();

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
      addChain();
    };
    return <>
    <div className="flex item-center border-gray-600 h-96">
      <div className="flex-1 text-right py-2 m-2 pt-12">
        <Image className="" src="/fel_2.png" alt="chara1"  width={256} height={256} objectFit="contain"/>
      </div>
      <div className="flex-1 px-4 py-2 m-2 pt-16">
        <div className="flex-1 border-double border-4 rounded-md bg-sky-500 px-4 py-2 m-2">
          <h3 className="text-4xl text-white font-semibold ">NFT Initial sale</h3>
          <h3 className="text-4xl pt-1 text-white font-semibold ">April 18th</h3>
          <h1 className="text-5xl pt-1 text-white font-semibold "></h1>
          <h1 className="text-5xl pt-1 pb-2 text-white font-semibold "> {mintNumber} / 4000</h1>
          <button className="px-2 py-1 my-1 text-2xl text-white font-semibold rounded-full bg-rose-700" onClick={MetaMuskConnect}>NFT MINT</button>
        </div>
      </div>
      <div className="flex-1 text-left px-4 py-2 m-2 pt-12">
        <Image className="" src="/fel_1.png" alt="chara2"  width={256} height={256} objectFit="contain"/>
      </div>
    </div>
    </>
  }

  function FelixierVideo(){
    return <>
      <div className='flex border-gray-600 h-96'>
        <div className="flex-1 text-center px-4 py-2 m-2 pt-12"></div>
          <div className="flex-1 pr-8 pt-12">
            <iframe width="100%" height="100%"
              src={`https://www.youtube.com/embed/L8EzwDxSdAQ?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        <div className="flex-1 text-center px-4 py-2 m-2 pt-12"></div>
    </div>
    </>
  }
  return (
    <div>
      <Header />
      <main className={styles.title}>
      <Image className="absolute" src="/KeyLayout.png" alt="Main Image"  width={1600} height={500}/>
      <FelixierVideo/>
      <MintButton />
      </main>
      <Footer />
    </div>
  )
}

export default Home
