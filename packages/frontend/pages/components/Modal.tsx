/* eslint-disable jsx-a11y/alt-text */
import Modal from 'react-modal'
import { useState } from 'react'
import Image from 'next/image';

// スタイリング
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    width                 : '1300px',
    height                : '500px',
    transform             : 'translate(-50%, -50%)'
  }
};

// アプリのルートを識別するクエリセレクタを指定する。
Modal.setAppElement('#__next')

const App = () => {
  const [modalIsOpen,setIsOpen] = useState(false)

  // モーダルを開く処理
  const openModal = () => {
    setIsOpen(true)
  }

  const afterOpenModal = () => {
    // モーダルが開いた後の処理
  }

  // モーダルを閉じる処理
  const closeModal = () => {
    setIsOpen(false)
  }

    return (
      <>
        <Image onClick={openModal} src="/sampleChara.png" width={300} height={250} />
        <Modal
          // isOpenがtrueならモダールが起動する
          isOpen={modalIsOpen}
          // モーダルが開いた後の処理を定義
          onAfterOpen={afterOpenModal}
          // モーダルを閉じる処理を定義
          onRequestClose={closeModal}
          // スタイリングを定義
          style={customStyles}
        >
          <button onClick={closeModal}>✖︎</button>
          <div className='container'>
              <div className='grid grid-cols-2 gap-12 space-x-4 space-y-4'>                  
                <Image src="/sampleChara.png" width={500} height={400} />
                <div className='grid grid-cols-3 gap-4 space-x-1 space-y-1'>
                    <Image src="/sampleChara.png" width={80} height={50} />
                    <Image src="/sampleChara.png" width={80} height={50} />
                    <Image src="/sampleChara.png" width={80} height={50} />
                    <Image src="/sampleChara.png" width={80} height={50} />
                    <Image src="/sampleChara.png" width={80} height={50} />
                    <Image src="/sampleChara.png" width={80} height={50} />
                    <Image src="/sampleChara.png" width={80} height={50} />
                    <Image src="/sampleChara.png" width={80} height={50} />
                    <Image src="/sampleChara.png" width={80} height={50} />
                </div>
              </div>
          </div>
        </Modal>
      </>
    )
}

export default App
