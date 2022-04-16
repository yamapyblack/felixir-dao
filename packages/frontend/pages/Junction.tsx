/* eslint-disable react/jsx-key */
/* eslint-disable jsx-a11y/alt-text */
import Header from './components/Header';
import Footer from './components/Footer';
import Modal from './components/Modal';
export default function Junction() {

    function ModalBlock() {
        const numbers = [1, 2, 3, 4, 5];
        const listItems = numbers.map((number) =><Modal/>);
        return <>{listItems}</>
    }

  return (
    <div>
        <Header/>
            <div className="max-w-full container bg-slate-600">
                <div className=''>
                    <div className='grid grid-cols-3 gap-14 space-x-4 space-y-4 box-border p-16 '>
                        <ModalBlock/>
                    </div>
                </div>
            </div>
        <Footer/>
    </div>
  );
}