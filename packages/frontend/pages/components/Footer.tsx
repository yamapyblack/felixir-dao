import Link from 'next/link';

 function Footer() {
     return       <footer className="bg-slate-500">
     <div className="grid grid-cols-12 gap-12 place-content-start">
       <div></div>
       <div className='text-xl bg-slate-500 px-1 py-1 text-slate-100'>FelixirDAO</div>
     </div>
     <div className='grid grid-cols-4 lg:grid lg:grid-cols-12 lg:gap-12'>
       <div></div>
       <div className='px-1 pb-2 text-slate-100 '><a href="https://felixirdaoxyz.notion.site/FelixirDAO-65e7bcde62f6464ea0579895256e590e">Document</a></div>
       <div className='px-3 pb-2 text-slate-100 '><a href="https://discord.com/invite/KDb2aTuNS6">Discord</a></div>
       <div className='px-4 pb-2 text-slate-100 '><a href="https://twitter.com/felixirdao">Twitter</a></div>
     </div>
   </footer>;
   }

   export default Footer;