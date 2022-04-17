import type { NextPage } from 'next'
import React, { useState, useEffect } from "react";
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

const abi = [
  "function buy() external payable",
  "function isSaleNow() view returns(bool)",
  "function counter() view returns(uint)"
]
// TODO yamaura
const contractAddress = "0x40581657AD36237baE43B7B2A67a63dfd31111b5"

const Home: NextPage = () => {
  // let mintNumber = 0;
  // let mintFlag:boolean = false;

  //TODO yamaura
  const tokenPrice = "0.1";

  const [mintNum, setMintNum] = useState(0);
  const [saleFlag, setSaleFlag] = useState(false);

  useEffect(() => {
    const setSaleInfo = async() =>{
      console.log("setSaleInfo")
  
      const provider = new ethers.providers.Web3Provider((window as any).ethereum)  
      console.log(provider)
  
      const accounts =  await provider.send("eth_requestAccounts", []);
      
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try{
        const mintNumber = (await contract.counter()).toString() - 1;
        const saleFlag = await contract.isSaleNow();
        console.log("mintNumber", mintNumber);
        console.log("saleFlag", saleFlag);
        setMintNum(mintNumber)
        setSaleFlag(saleFlag)  
      }catch(e){
        console.log(e)
      }
    }

      // add Network
    const addChain = async() => {
      try{
        await (window as any).ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x250',
            chainName: 'Astar Network',
            nativeCurrency: {
                name: 'ASTR',
                symbol: 'ASTR',
                decimals: 592,
            },
            rpcUrls: ['https://astar.api.onfinality.io/public'],
          }],
        })
        console.log("try");
        setSaleInfo();
      }catch(Exeption){
        console.log("Astar Network already Connected");
        console.log("catch");
      }finally{
        console.log("finally");
      }
    }
    addChain();

  }, []);



  // ミントボタン用
  function MintButton() {
    console.log("MintButton")

    const MetaMuskConnect = async () =>{
      console.log("MetaMuskConnect")

      // addChain();
      const provider = new ethers.providers.Web3Provider((window as any).ethereum)
  
      const accounts =  await provider.send("eth_requestAccounts", []);
      
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer);
      contract.buy({value: ethers.utils.parseEther(tokenPrice)});
    };

    return <>
    <div className="flex item-center border-gray-600 h-96">
      <div className="flex-1 text-right py-2 m-2 pt-16">
        <Image className="" src="/fel_2.png" alt="chara1"  width={256} height={256} objectFit="contain"/>
      </div>
      <div className="flex-1 px-4 py-2 m-2 pt-16">
        <div className="flex-1 border-double border-4 rounded-md bg-sky-500 px-4 py-2 m-2">
          <h3 className="text-4xl text-white font-semibold ">NFT Initial Sale</h3>
          <h1 className="text-2xl pt-1 text-white font-semibold ">START DATE: April 18th</h1>
          <h1 className="text-2xl pt-1 text-white font-semibold ">14:00(UTC) | 23:00(JST)</h1>
          <h1 className="text-5xl pt-1 pb-2 text-white font-semibold "> {mintNum} / 4000</h1>

          { !saleFlag && <h3 className="text-3xl pt-1 text-white font-semibold ">Wait until the sale</h3>}
          { (saleFlag && mintNum < 4000) && <button id="mintButton" className="px-2 py-1 my-1 text-2xl text-white font-semibold rounded-full bg-rose-700" onClick={MetaMuskConnect}>NFT MINT</button>}
          { (saleFlag && mintNum >= 4000) && <h3 className="text-3xl pt-1 text-white font-semibold ">End of sale</h3>}

          </div>
      </div>
      <div className="flex-1 text-left px-4 py-2 m-2 pt-16">
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
