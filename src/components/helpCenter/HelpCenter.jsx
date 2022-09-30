import { useState } from 'react';
import Alert from '../Alert/Alert';
import AlertWrapper from '../Alert/AlertWrapper';
import HelpCenterModal from './HelpCenterModal';

export default function HelpCenter() {
  const [modal, setModal] = useState(false);
  const [sentMessage, setSentMessage] = useState('');

  const toggle = () => setModal(!modal);

  return (
    <>
      <section className="ml-auto mr-1" onClick={toggle}>
        <span className="material-icons-outlined text-gray-700 font-size-2xl cursor-pointer">
          help_outline
        </span>
      </section>
      <HelpCenterModal
        modal={modal}
        toggle={toggle}
        setSentMessage={setSentMessage}
      />
      <AlertWrapper>
        <Alert
          color="success"
          message={sentMessage}
          setMessage={setSentMessage}
        />
      </AlertWrapper>
    </>
  );
}
