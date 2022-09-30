import React, { useEffect, useState, useCallback } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import './styles.css';
import { colorsDeals } from './constasts/deals';
import Columns from './Column';
import dealService from '../../services/deal.service';
import { DEALS_LABEL, NEW_STAGE_ID, PROBABILITY } from '../../utils/constants';
import { Col, Row, Form } from 'react-bootstrap';
import { isToFixedNoRound } from '../../utils/Utils';
import { capitalize } from 'lodash';
import { usePipelineBoardContext } from '../../contexts/PipelineBoardContext';
import { CardButton } from '../layouts/CardLayout';
import stageService from '../../services/stage.service';
import SimpleModalCreation from '../modal/SimpleModalCreation';
import MaterialIcon from '../commons/MaterialIcon';
import PopoverWrapper from '../commons/PopoverWrapper';
import TooltipComponent from '../lesson/Tooltip';

const AddNewStage = ({ deals, setDeals }) => {
  const { stages, setStages } = usePipelineBoardContext();

  const handleAddNewStage = () => {
    const lastDeal = Object.entries(deals).pop();
    const newPosition = lastDeal[1].stagePosition + 1;
    const newStageKey = `NewStage${newPosition}`;
    const newStageObject = {
      id: `${newStageKey}${NEW_STAGE_ID}`,
      stageId: `${newStageKey}${NEW_STAGE_ID}`,
      name: newStageKey,
      stagePosition: newPosition,
      position: newPosition,
      pagination: { limit: 10, page: 1, totalPages: 1, count: 0 },
      header: { total_amount: 0, total_count: 0 },
      items: [],
      loading: false,
    };
    deals[newStageKey] = newStageObject;
    setDeals(deals);

    setStages([...stages, { ...newStageObject }]);

    // will animate it
    setTimeout(() => {
      const element = document.getElementById('divPipelineBoard');
      if (element) {
        element.scrollLeft += element.offsetWidth;
      }
    }, 50);
  };

  return (
    <div
      style={{ minWidth: 250 }}
      className="d-flex flex-column justify-content-center align-items-center pipeline-board-edit"
    >
      <div className="text-center p-3">
        <h1>Add new stage</h1>
        <h5 className="font-weight-normal">
          Pipeline stages represent the steps in your sales process
        </h5>
        <CardButton
          icon="add"
          type="button"
          title="New Stage"
          className="mt-2 btn btn-sm btn-primary"
          onClick={handleAddNewStage}
        />
      </div>
    </div>
  );
};

const BoardFooter = ({ show, refresh }) => {
  const [items, setItems] = useState([]);

  useEffect(async () => {
    const { data } = await dealService.getStatusSummary();
    const { summary } = data;
    // sorting by won status, so that it shows at first in view
    summary.sort((a, b) => (a.status === 'won' ? -1 : 1));
    setItems(summary);
  }, [refresh]);

  const FooterCard = ({ item }) => {
    return (
      <Droppable droppableId={item.status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`border board-footer-item ${
              item.status
            } py-2 px-4 mb-0 rounded ${
              snapshot.isDraggingOver ? ` deal-types ${item.status}` : ''
            }`}
            role="alert"
          >
            <p className="mb-0 text-capitalize font-weight-bold">
              {item.status}
            </p>
            <p className="mb-0 fs-7">
              {isToFixedNoRound(item.total_amount, 2)} • {item.count}{' '}
              {DEALS_LABEL.toLowerCase()}
            </p>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

  return (
    <div
      className={`position-fixed shadow-lg ease animate slideInUp board-footer bg-white bottom-0 w-100 left-0 ${
        show ? 'opacity-1' : 'opacity-0'
      }`}
    >
      <div className="p-3">
        <div className="d-flex justify-content-between">
          {items?.map((deal, index) => (
            <FooterCard item={deal} key={deal.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

const UpdatePipelineStageForm = ({ stage, deals, setDeals, refreshBoard }) => {
  const [value, setValue] = useState(capitalize(stage.name));
  const [probability, setProbability] = useState(stage.probability || 0);
  const { stages, setStages } = usePipelineBoardContext();
  const newStages = [...stages];
  const [openModal, setOpenModal] = useState(false);
  const [moveDeleteOption, setMoveDeleteOption] = useState('');
  // set first stage id on init
  const [moveStage, setMoveStage] = useState(stages[0]?.deal_stage_id);
  const dealsItems = deals && deals[stage?.name]?.items;
  const dealsCount = dealsItems && dealsItems.length;

  const updateStageObject = (key, value) => {
    newStages.forEach((st) => {
      if (st.id === stage.stageId) {
        st[key] = value;
      }
    });
    setStages(newStages);
  };

  const handleValueChange = (value) => {
    setValue(value);
    updateStageObject('name', value);
  };

  const handleProbabilityChange = (value) => {
    setProbability(value);
    updateStageObject('probability', parseFloat(value));
  };

  const handleDeleteStage = () => {
    setOpenModal(true);
  };

  const handleConfirmModal = async () => {
    setOpenModal(false);

    // move option is selected then call status update api with list of deals
    if (moveDeleteOption === 'Move') {
      if (moveStage) {
        const dealsListToMove = dealsItems.map((d) => ({
          id: d.id,
          tenant_deal_stage_id: moveStage,
        }));
        await dealService.updateDealStage({ data: dealsListToMove });
      }
    }
    setStages([...stages.filter((st) => st.id !== stage.stageId)]);
    delete deals[stage.name || stage.deal_stage.name];
    setDeals(deals);
    if (stage.stageId !== NEW_STAGE_ID) {
      await stageService.deleteStage(
        stage.stageId,
        moveDeleteOption === 'Delete'
      );
    }
  };

  const DeleteButton = () => {
    return (
      <div className="d-flex align-items-center">
        <MaterialIcon icon="delete" clazz="mr-1" />
        <span>Delete Stage</span>
      </div>
    );
  };

  const handleDeleteMoveDealsOption = (e) => {
    setMoveDeleteOption(e.target.value);
  };

  const handleStageChange = (e) => {
    setMoveStage(e.target.value);
  };

  return (
    <div className="card rounded-md p-0 mx-1 rounded-md pipeline-board-edit-form">
      <SimpleModalCreation
        modalTitle={`Delete ${stage.name} Stage`}
        open={openModal}
        bankTeam={false}
        isLoading={false}
        buttonsDisabled={dealsCount > 0 && moveDeleteOption === ''}
        handleSubmit={handleConfirmModal}
        saveButtonStyle="btn-outline-danger btn-sm"
        saveButton={<DeleteButton />}
        onHandleCloseModal={() => setOpenModal(!openModal)}
      >
        {dealsCount > 0 ? (
          <>
            <p className="fs-7">
              {' '}
              Before deleting this pipeline stage, please specify the following:{' '}
            </p>
            <p className="fs-7 font-weight-medium">
              What would you like to do with the {dealsCount} deals in this
              stage?
            </p>
            <p className="mb-0">
              <Form.Check
                inline
                label="Move to another stage"
                name="deleteMoveDeals"
                className="fs-7"
                value="Move"
                type="radio"
                onChange={handleDeleteMoveDealsOption}
              />
            </p>
            {moveDeleteOption === 'Move' && (
              <div className="my-2">
                <select
                  className="form-control w-100"
                  onChange={handleStageChange}
                >
                  {stages.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.deal_stage.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <p>
              <Form.Check
                inline
                label="Delete Deals"
                name="deleteMoveDeals"
                value="Delete"
                type="radio"
                className="fs-7"
                onChange={handleDeleteMoveDealsOption}
              />
            </p>
          </>
        ) : (
          <p>Are you sure you want to delete this stage?</p>
        )}
      </SimpleModalCreation>

      <div className="card-body p-3">
        <div className="d-flex flex-column h-100 justify-content-between">
          <form>
            <div className="form-group">
              <label className="fs-7" htmlFor="stageName">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={value}
                onChange={(e) => handleValueChange(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="fs-7" htmlFor="probability">
                Probability &nbsp;
                <PopoverWrapper
                  position="left"
                  template={
                    <div className="fs-7">
                      <h6 className="font-weight-semi-bold mb-1">
                        Win probability
                      </h6>
                      <p className="mb-0 font-weight-normal">
                        This represents your confidence in winning a deal by the
                        expected close date. Probability can be assigned by deal
                        or pipeline stage and is used to project your future
                        revenue. The default probability for each stage is 100%,
                        but you can assign any value between 0% and 100%.
                      </p>
                    </div>
                  }
                >
                  <a href="#!" className="text-block popover-link">
                    <div className="d-flex align-items-center">
                      <a href="" className="text-gray-800 hoverLink">
                        <MaterialIcon icon="help" />{' '}
                      </a>
                    </div>
                  </a>
                </PopoverWrapper>
              </label>
              <input
                type="number"
                min={0}
                max={100}
                className="form-control"
                placeholder="Probability"
                value={probability}
                onChange={(e) => handleProbabilityChange(e.target.value)}
              />
            </div>
          </form>
          <CardButton
            icon="delete"
            type="button"
            title="Delete Stage"
            className="mt-2 btn btn-sm btn-outline-danger"
            onClick={handleDeleteStage}
          />
        </div>
      </div>
    </div>
  );
};

const sortByPosition = (a, b) => {
  return a[1].stagePosition - b[1].stagePosition;
};

const BoardHeader = ({ deals, setDeals, edit, refreshBoard }) => {
  const { stages } = usePipelineBoardContext();
  return (
    <div className="d-flex">
      <div
        id="divPipelineBoard"
        className={`parent-board-header mb-2 d-flex flex-grow-1 bg-white w-100 top-0 ${
          edit ? 'pipeline-board-edit overflow-y-hidden overflow-x-auto' : ''
        }`}
      >
        {stages?.map((stage, index) => {
          const state =
            Object.hasOwn(deals, stage?.deal_stage?.name) &&
            deals[stage?.deal_stage?.name];
          const title = stage?.deal_stage?.name || '';
          const { header, pagination } = state;
          return (
            <Col
              key={index}
              className={`py-3 position-relative board-header ${
                edit ? 'deal-edit-header' : 'w-100'
              }`}
            >
              <Row className="m-0 px-1">
                <h5 className="d-flex flex-row align-items-center mb-1 font-weight-bold text-capitalize">
                  {title}
                </h5>
              </Row>
              <Row className="m-0 px-1">
                <div className={'d-flex align-item-center fs-8'}>
                  <span>{isToFixedNoRound(header?.total_amount, 2)}</span>
                  <span className="text-muted mx-2">•</span>
                  <span>
                    {pagination?.count} {DEALS_LABEL.toLowerCase()}
                  </span>
                  <span className="text-muted mx-2">•</span>
                  <span>
                    {isToFixedNoRound(
                      (header?.total_amount * stage?.probability) / 100
                    )}{' '}
                    <TooltipComponent title={PROBABILITY?.toLowerCase()}>
                      <MaterialIcon
                        icon="help_outline"
                        clazz="cursor-pointer"
                      />
                    </TooltipComponent>
                  </span>
                </div>
              </Row>
              {edit && (
                <div
                  className="position-absolute w-100 top-50"
                  style={{ top: 90, left: 0 }}
                >
                  <UpdatePipelineStageForm
                    deals={deals}
                    setDeals={setDeals}
                    refreshBoard={refreshBoard}
                    stage={{ ...stage, name: title, stageId: stage.id }}
                  />
                </div>
              )}
            </Col>
          );
        })}
      </div>
      {edit && <AddNewStage deals={deals} setDeals={setDeals} />}
    </div>
  );
};

const Board = ({
  onGetDeals,
  setNotification,
  listDeals = [],
  onClick,
  editPipeline,
  refreshBoard,
  refreshBoardHeader,
  onAddDeal,
}) => {
  const [itemPicked, setItemPicked] = useState(false);
  const [boardColumns, setBoardColumns] = useState({ ...listDeals });
  const [refreshBoardFooter, setRefreshBoardFooter] = useState(1);

  const getStageByName = (name) => {
    const [dealFound] = Object.entries(listDeals || {})
      .filter(([type, value]) => {
        return type === name;
      })
      .map(([type, value = {}]) => {
        return {
          id: value.stageId,
          name: type,
          stagePosition: value.stagePosition,
        };
      });

    return dealFound || '';
  };

  useEffect(() => {
    setBoardColumns({ ...listDeals });
  }, [listDeals]);

  useEffect(() => {
    const columns = document.getElementsByClassName('sticky-bottom');
    const parent = document.getElementsByClassName('parent-column')[0];
    if (columns?.length) {
      for (const column of columns) column.style.height = 'auto';
      for (const column of columns) {
        if (column.clientHeight <= parent.clientHeight) {
          column.style.height = `${parent.clientHeight}px`;
        }
      }
    }
  }, [listDeals]);

  const reorderBetweenRow = (currentStatus, startIndex, endIndex) => {
    const state = listDeals[currentStatus]?.items;

    if (state) {
      const [removed] = state?.splice(startIndex, 1);
      state?.splice(endIndex, 0, removed);
    }
  };

  const reorderBetweenColumn = (
    currentStatus,
    secondStatus,
    startIndex,
    endIndex
  ) => {
    const origin = listDeals[currentStatus]?.items;
    const destiny = listDeals[secondStatus]?.items;

    if (origin && destiny) {
      const [removed] = origin?.splice(startIndex, 1);
      destiny?.splice(endIndex, 0, removed);
    }
  };

  const onUpdateStage = async (draggableId, destination, source) => {
    const id = draggableId.replace('id-', '');
    const status = destination.droppableId;
    const stageId = destination.stageId;
    const data = {
      stage_name: status,
      tenant_deal_stage_id: stageId,
      update_deal:
        destination.droppableId === source.droppableId
          ? [
              {
                type: destination.droppableId,
                tenant_deal_stage_id: destination.stageId,
                position: destination.index,
                origin: source.index,
                limit: listDeals[destination.droppableId].pagination.count,
              },
            ]
          : [
              {
                type: source.droppableId,
                tenant_deal_stage_id: source.stageId,
                position: source.index,
                limit: listDeals[source.droppableId].pagination.count,
              },
              {
                type: destination.droppableId,
                tenant_deal_stage_id: destination.stageId,
                position: listDeals[destination.droppableId].pagination.count,
                destination: true,
                limit: listDeals[destination.droppableId].pagination.count,
              },
            ],
    };

    await dealService.updateDealPosition(id, data);
  };

  const onDragEnd = async (result) => {
    let { destination, source, draggableId } = result;
    if (!destination) destination = source;

    setItemPicked(false);

    if (!destination) return;

    const sourceName = getStageByName(source.droppableId); // here droppableId is name of stage
    const destinationName = getStageByName(destination.droppableId);
    source = { ...source, stageId: sourceName.id };
    destination = { ...destination, stageId: destinationName.id };

    if (!destination.stageId) {
      // this part is when cards are moved between won/lost/delete stages in footer
      await dealService.updateDealStatus(draggableId.replace('id-', ''), {
        status: destination.droppableId,
      });

      // when drag released in board footer update board
      refreshBoard();

      // also update footer won/lost/delete component to show updated count
      setRefreshBoardFooter((prevState) => prevState + 1);
    } else {
      // this part when cards are moved between stages
      if (destination.droppableId !== source.droppableId) {
        reorderBetweenColumn(
          source.droppableId,
          destination.droppableId,
          source.index,
          destination.index
        );

        await onUpdateStage(draggableId, destination, source);

        // when drag released in board footer update board
        refreshBoard();

        // also update footer won/lost/delete component to show updated count
        setRefreshBoardFooter((prevState) => prevState + 1);
      } else {
        reorderBetweenRow(source.droppableId, source.index, destination.index);
        await onUpdateStage(draggableId, destination, source);

        // when drag released in board footer update board
        refreshBoard();

        // also update footer won/lost/delete component to show updated count
        setRefreshBoardFooter((prevState) => prevState + 1);
      }
    }
  };

  const handleLocalDeals = (newDeals) => {
    setBoardColumns({ ...newDeals });
  };

  // using useCallback is optional
  const onBeforeCapture = useCallback(() => {
    setItemPicked(!itemPicked);
    console.log('onBeforeCapture');
  }, []);
  const onBeforeDragStart = useCallback(() => {
    console.log('onBeforeDragStart');
  }, []);
  const onDragStart = useCallback(() => {
    console.log('onDragStart');
  }, []);
  const onDragUpdate = useCallback(() => {
    console.log('onDragUpdate');
  }, []);

  return (
    <div className="position-relative w-100">
      <div className="m-0 pipelines-board">
        <BoardHeader
          deals={{ ...boardColumns }}
          setDeals={handleLocalDeals}
          refreshBoard={refreshBoardHeader}
          edit={editPipeline}
        />
        {!editPipeline && (
          <div className="d-flex flex-row parent-column">
            <DragDropContext
              onDragEnd={onDragEnd}
              onBeforeCapture={onBeforeCapture}
              onBeforeDragStart={onBeforeDragStart}
              onDragStart={onDragStart}
              onDragUpdate={onDragUpdate}
            >
              {Object.entries(listDeals)
                ?.sort(sortByPosition)
                ?.map((state, index) => {
                  const type = state[0] || '';
                  const value = state[1] || {};
                  return (
                    <Columns
                      id={value?.stageId}
                      key={index}
                      title={type}
                      color={colorsDeals[index]}
                      value={{ ...value, deal_type: type }}
                      onGetDeals={onGetDeals}
                      setNotification={setNotification}
                      onClick={onClick}
                      onAddDeal={() => onAddDeal({ ...value, title: type })}
                    />
                  );
                })}
              <BoardFooter show={itemPicked} refresh={refreshBoardFooter} />
            </DragDropContext>
          </div>
        )}
      </div>
    </div>
  );
};

export default Board;
