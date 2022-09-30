import { ListGroup, Modal } from 'react-bootstrap';
import Search from '../../manageUsers/Search';
import ButtonFilterDropdown from '../../commons/ButtonFilterDropdown';
import ButtonIcon from '../../commons/ButtonIcon';
import BlockItem from '../blocks/BlockItem';
import React, { useState } from 'react';
import {
  DynamicBlock,
  ReportBlocksType,
} from '../constants/reportBuilderConstants';
import { v4 as uuidv4 } from 'uuid';
import NoDataFound from '../../commons/NoDataFound';

const InsightBlocksModal = ({
  show,
  setShow,
  handleAddCustomInsight,
  blocks,
  setBlocks,
  currentBlock,
}) => {
  const [defaultBlocks] = useState([...blocks]);
  const [optionSelected, setOptionSelected] = useState(ReportBlocksType[0]);
  const [search, setSearch] = useState('');

  const handleOptionSelected = (e, option) => {
    setOptionSelected(option);
  };

  const handleReplace = (block) => {
    const newBlock = {
      ...block,
    };
    if (currentBlock.type) {
      if (currentBlock.type === 'addNew') {
        newBlock.id = uuidv4();
        blocks.splice(currentBlock.position + 1, 0, newBlock);
      } else {
        // in case of replace just update object in that position
        blocks[currentBlock.position] = newBlock;
      }
    }
    setBlocks([...blocks, newBlock]);
    setShow(false);
  };

  const filterBlocks = (block) => {
    return search
      ? JSON.stringify(block).toLowerCase().includes(search.toLowerCase())
      : optionSelected
      ? optionSelected.key === 'All'
        ? block
        : block.type === optionSelected.key ||
          block.type === optionSelected.name
      : false;
  };

  return (
    <Modal
      size={`lg`}
      show={show}
      animation={false}
      onHide={() => setShow(false)}
    >
      <Modal.Header className="px-3 pt-3" closeButton>
        <h2>Add New Block</h2>
      </Modal.Header>
      <Modal.Body className={`p-0 borderline-top`}>
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          <div className="search-fixed">
            <Search
              onHandleChange={(e) => setSearch(e.target.value)}
              searchPlaceholder={'Search'}
              classnames="px-0"
            />
          </div>
          <div className="d-flex align-items-center">
            <ButtonFilterDropdown
              filterOptionSelected={optionSelected}
              handleFilterSelect={handleOptionSelected}
              btnToggleStyle={'btn-md'}
              buttonText="All Blocks"
              options={ReportBlocksType}
            />
            <ButtonIcon
              icon="add"
              color="primary"
              classnames="ml-2"
              label="Add Custom Block"
              onclick={handleAddCustomInsight}
            />
          </div>
        </div>
        <div className="p-3">
          <ListGroup className="list-group-no-gutters mt-2 list-group-flush">
            <h4 className="text-black font-weight-semi-bold">All Insights</h4>
            {defaultBlocks.filter(filterBlocks).map((block) => (
              <BlockItem
                key={block.id}
                isDraggable={false}
                style="border mb-3 rounded-lg"
              >
                <DynamicBlock
                  type={block.type}
                  {...block}
                  showAdd={() => handleReplace(block)}
                />
              </BlockItem>
            ))}
            {!defaultBlocks.filter(filterBlocks).length && (
              <NoDataFound
                title="No insights found."
                description="To get started, add a custom block from top right."
                icon="dashboard"
                containerStyle="text-gray-900 my-6 py-6"
              />
            )}
          </ListGroup>
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
      </Modal.Footer>
    </Modal>
  );
};

export default InsightBlocksModal;
