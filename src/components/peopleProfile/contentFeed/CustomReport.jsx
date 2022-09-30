import { ListGroup } from 'react-bootstrap';
import React, { useState } from 'react';
import BlockItem from '../../reportbuilder/blocks/BlockItem';
import {
  DynamicBlock,
  ReportBlockControls,
} from '../../reportbuilder/constants/reportBuilderConstants';
import ControlsBlock from '../../reportbuilder/blocks/ControlsBlock';
import NewCustomInsightBlockModal from '../../reportbuilder/modals/NewCustomInsightBlockModal';
import InsightBlocksModal from '../../reportbuilder/modals/InsightBlocksModal';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const CustomReport = ({ blocks, setBlocks }) => {
  // TODO: will useContext for blocks so that we dont have to pass these as parameters when make it functional with backend.

  const [currentBlock, setCurrentBlock] = useState({});

  const [showInsightsBlockModal, setShowInsightsBlockModal] = useState(false);
  const [showCustomInsightBlockModal, setShowCustomInsightBlockModal] =
    useState(false);

  const handleAddCustomInsightsBlock = () => {
    setShowInsightsBlockModal(false);
    setShowCustomInsightBlockModal(true);
  };

  const openAddBlocksModal = (block, position, type) => {
    setCurrentBlock({ block, position, type });
    setShowInsightsBlockModal(true);
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onHandleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      blocks,
      result.source.index,
      result.destination.index
    );

    setBlocks(items);
  };

  return (
    <>
      <NewCustomInsightBlockModal
        show={showCustomInsightBlockModal}
        setShow={setShowCustomInsightBlockModal}
        handleBack={() => {
          setShowCustomInsightBlockModal(false);
          setShowInsightsBlockModal(true);
        }}
        blocks={blocks}
        setBlocks={setBlocks}
        currentBlock={currentBlock}
      />

      <InsightBlocksModal
        show={showInsightsBlockModal}
        setShow={setShowInsightsBlockModal}
        handleAddCustomInsight={handleAddCustomInsightsBlock}
        blocks={blocks}
        setBlocks={setBlocks}
        currentBlock={currentBlock}
      />

      <div id="customReportContainer" className={`m-0`}>
        <DragDropContext onDragEnd={onHandleDragEnd}>
          <Droppable droppableId="reportBuilder">
            {(provided) => (
              <ListGroup
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="list-group-no-gutters list-group-flush"
              >
                {blocks.map((block, index) => (
                  <BlockItem
                    key={index}
                    isDraggable={!block.isDisabled}
                    index={index}
                  >
                    <DynamicBlock type={block.type} {...block} />
                    {block.isDisabled ? (
                      <div className="position-absolute drop-disabled h-100 w-100 top-0 left-0">
                        <ControlsBlock
                          controls={[
                            {
                              id: 2,
                              icon: 'visibility',
                              type: 'hideShow',
                              tooltip: 'Enable',
                            },
                          ]}
                          currentBlock={block}
                          position={index}
                          blocks={blocks}
                          setBlocks={setBlocks}
                          openAddBlocksModal={openAddBlocksModal}
                          placement="bottom-0 abs-center bg-white"
                        />
                      </div>
                    ) : (
                      <ControlsBlock
                        controls={ReportBlockControls}
                        currentBlock={block}
                        position={index}
                        blocks={blocks}
                        setBlocks={setBlocks}
                        openAddBlocksModal={openAddBlocksModal}
                      />
                    )}
                  </BlockItem>
                ))}
                {provided.placeholder}
              </ListGroup>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </>
  );
};

export default CustomReport;
