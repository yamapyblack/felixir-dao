/* eslint-disable jsx-a11y/alt-text */
import Header from './components/Header';
import Footer from './components/Footer';
import Modal from './components/Modal';
import Image from 'next/image';

export default function Junction() {
  return (
    <div>
        <Header/>
            <div className="max-w-full container bg-slate-600">
                <div className=''>
                    <div className='grid grid-cols-3 gap-14 space-x-4 space-y-4 box-border p-16 '>
                        <Modal/>
                        <Image className="" src="/sampleChara.png"  width={300} height={350} />
                        <Image className="box-border h-32 w-32 p-4 border-4 " src="/sampleChara.png"  width={300} height={250} />
                        <Image className="box-border h-32 w-32 p-4 border-4 " src="/sampleChara.png"  width={300} height={250} />

                        <Image className="" src="/sampleChara.png"  width={300} height={350} />
                        <Image className="box-border h-32 w-32 p-4 border-4 " src="/sampleChara.png"  width={300} height={250} />
                        <Image className="box-border h-32 w-32 p-4 border-4 " src="/sampleChara.png"  width={300} height={250} />

                        <Image className="" src="/sampleChara.png"  width={300} height={350} />
                        <Image className="box-border h-32 w-32 p-4 border-4 " src="/sampleChara.png"  width={300} height={250} />
                        <Image className="box-border h-32 w-32 p-4 border-4 " src="/sampleChara.png"  width={300} height={250} />
                    </div>
                </div>
            </div>
        <Footer/>
    </div>
  );
}