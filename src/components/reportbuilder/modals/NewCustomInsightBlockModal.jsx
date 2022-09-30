import { Form, Modal } from 'react-bootstrap';
import React, { useState } from 'react';
import MaterialIcon from '../../commons/MaterialIcon';
import ButtonIcon from '../../commons/ButtonIcon';
import IconDropdownSearch from '../../commons/IconDropdownSearch';
import { icons } from '../../manageLessons/ManageLessonsConstants';
import { v4 as uuidv4 } from 'uuid';

const NewCustomInsightBlockModal = ({
  show,
  setShow,
  handleBack,
  blocks,
  setBlocks,
  currentBlock,
}) => {
  const [blockPosition, setBlockPosition] = useState('flex-row-reverse');
  const [blockIcon, setBlockIcon] = useState({ name: 'info' });
  const [description, setDescription] = useState('');
  const handleSwapPosition = () => {
    setBlockPosition((prevState) =>
      prevState !== '' ? '' : 'flex-row-reverse'
    );
  };

  const handleIconSelect = (item) => {
    setBlockIcon(item);
  };

  const handleSaveBlock = () => {
    const newCustomBlock = {
      id: uuidv4(),
      direction: blockPosition,
      iconConfig: { icon: blockIcon.name, color: 'text-black' },
      description: [description],
      data: {},
      type: 'IconText',
      partnerLogo: {},
    };

    if (currentBlock.type) {
      if (currentBlock.type === 'addNew') {
        blocks.splice(currentBlock.position + 1, 0, newCustomBlock);
      } else {
        // in case of replace just update object in that position
        blocks[currentBlock.position] = newCustomBlock;
      }
    }

    setBlocks([...blocks, newCustomBlock]);
    setBlockIcon({ name: 'info' });
    setDescription('');
    setBlockPosition('flex-row-reverse');
    setShow(false);
  };

  return (
    <Modal
      show={show}
      size="lg"
      animation={false}
      onHide={() => setShow(false)}
    >
      <Modal.Header className="px-3 pt-3" closeButton>
        <h2>Add Custom Block</h2>
      </Modal.Header>
      <Modal.Body className={`p-0 borderline-top`}>
        <div className="p-3 border-bottom">
          <a onClick={handleBack} className="cursor-pointer">
            {' '}
            <MaterialIcon icon="arrow_back" />{' '}
            <span className="font-size-sm2">Back to all </span>
          </a>
        </div>
        <h4 className="text-black p-3 pb-1 font-weight-semi-bold">
          Custom Block
        </h4>
        <div className="border rounded p-3 mx-3 mb-4 pb-5">
          <div className={`row position-relative ${blockPosition}`}>
            <div className={'col-md-10'}>
              <Form.Control
                as="textarea"
                rows={3}
                value={description || ''}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={'Add description text to the block'}
              />
            </div>
            <div className={`col-md-2 ${blockPosition ? 'pr-0' : 'pl-0'}`}>
              <div className="border d-flex position-relative justify-content-center align-items-center bg-gray-200 text-center h-100 rounded">
                <MaterialIcon icon={blockIcon.name} clazz="font-size-4em" />
                <IconDropdownSearch options={icons} onSelect={handleIconSelect}>
                  <a className="cursor-pointer position-absolute bottom-0 right-0">
                    <MaterialIcon icon="unfold_more" clazz="text-black" />{' '}
                  </a>
                </IconDropdownSearch>
              </div>
            </div>
            <div
              className="position-absolute abs-center"
              style={{
                bottom: '-50px',
              }}
            >
              <ButtonIcon
                label="Invert block position"
                icon="swap_horiz"
                color="white"
                classnames="btn-sm shadow"
                onclick={handleSwapPosition}
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="p-3">
        <button
          type="button"
          className="btn btn-white btn-sm mr-1"
          data-dismiss="modal"
          onClick={() => setShow(false)}
        >
          Cancel
        </button>
        <ButtonIcon
          label="Add to Report"
          color="primary"
          classnames="btn-sm"
          onclick={handleSaveBlock}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default NewCustomInsightBlockModal;
