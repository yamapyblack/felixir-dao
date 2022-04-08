import Link from 'next/link';

 function Header() {
     return <header>
            <nav className="max-w-full bg-slate-700">
                <div className="grid grid-rows-12 grid-flow-col gap-4">
                <div className="col-span-8 px-3 py-1 my-3 text-slate-100 font-medium"><a href="">CryptoFelixir</a></div>
                <div className='justify-end flex'>
                    <div className="rounded-full px-3 py-1 my-3 text-slate-100  hover:bg-rose-700"><Link href="/Junction">Junction</Link></div>
                    <div className="rounded-full px-3 py-1 my-3 text-slate-100  hover:bg-rose-700"><a href="/">Mint NFT</a></div>
                </div>
                </div>
            </nav>
        </header>;
   }

   export default Header;