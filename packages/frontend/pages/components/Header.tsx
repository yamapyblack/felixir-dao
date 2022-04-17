/* eslint-disable @next/next/no-html-link-for-pages */
import Link from 'next/link';
import Image from 'next/image'

 function Header() {
     return <header>
            <nav className="max-w-full bg-slate-700">
                <div className="grid grid-rows-12 grid-flow-col gap-4">
                <div className="col-span-8 text-slate-100 font-medium">
                    <Image className="" src="/FelixirDAO-logo.png" alt="chara1"  width={150} height={50} objectFit="contain"/>
                </div>
                <div className='justify-end flex'>
                    <div className="rounded-full px-3 py-1 my-3 text-slate-100"><a href="/">Mint NFT</a></div>
                </div>
                </div>
            </nav>
        </header>;
   }

   export default Header;