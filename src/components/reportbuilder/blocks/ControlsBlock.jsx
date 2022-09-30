import TooltipComponent from '../../lesson/Tooltip';
import MaterialIcon from '../../commons/MaterialIcon';
import React from 'react';

const ControlItem = ({
  ctrl,
  blocks,
  position,
  setBlocks,
  currentBlock,
  openAddBlocksModal,
}) => {
  const handleCtrlClick = () => {
    let newBlocks = [...blocks];
    switch (ctrl.type) {
      case 'addNew':
      case 'replace':
        openAddBlocksModal(currentBlock, position, ctrl.type);
        break;
      case 'hideShow': // it has become enable/disable kind of thing
        newBlocks = newBlocks.map((block) => ({
          ...block,
          isDisabled:
            block.id === currentBlock.id ? !block.isDisabled : block.isDisabled,
        }));
        setBlocks(newBlocks);
        break;
      case 'changePosition':
        newBlocks = newBlocks.map((block) => ({
          ...block,
          direction:
            block.id === currentBlock.id
              ? block.direction
                ? ''
                : 'flex-row-reverse'
              : block.direction,
        }));
        setBlocks(newBlocks);
        break;
      case 'remove':
        newBlocks = newBlocks.filter((block) => block.id !== currentBlock.id);
        setBlocks(newBlocks);
        break;
      case 'move':
        break;
    }
  };

  return (
    <TooltipComponent title={ctrl.tooltip}>
      <a onClick={handleCtrlClick} className="cursor-pointer px-1">
        <MaterialIcon icon={ctrl.icon} clazz="px-1 cursor-pointer" />
      </a>
    </TooltipComponent>
  );
};

const ControlsBlock = ({
  blocks,
  controls,
  position,
  setBlocks,
  placement = 'bg-gray-5 bottom-0 abs-center',
  currentBlock,
  openAddBlocksModal,
}) => {
  return (
    <div
      className={`report-sticky-controls card position-absolute ${placement}`}
    >
      <div className="d-flex p-2 align-items-center">
        {controls.map((ctrl) => (
          <ControlItem
            key={ctrl.id}
            ctrl={ctrl}
            currentBlock={currentBlock}
            position={position}
            blocks={blocks}
            setBlocks={setBlocks}
            openAddBlocksModal={openAddBlocksModal}
          />
        ))}
      </div>
    </div>
  );
};

export default ControlsBlock;
