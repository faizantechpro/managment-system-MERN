import React, { useState, useEffect } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Col } from 'react-bootstrap';

import Card from './Cards';
import ButtonIcon from '../../components/commons/ButtonIcon';
import Skeleton from 'react-loading-skeleton';
import MaterialIcon from '../commons/MaterialIcon';

const Columns = ({
  id,
  title,
  color,
  onGetDeals,
  setNotification,
  loading,
  onClick,
  value,
  onAddDeal,
}) => {
  const { deal_type, header, pagination, items } = value;
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (load) setLoad(false);
  }, [value]);

  const handleAddDeal = (e) => {
    e?.preventDefault();
    onAddDeal();
  };

  return (
    <Col className="p-0 mr-1 sticky-bottom">
      <div>
        {value.loading ? (
          <Skeleton count={3} height={80} className="my-2 d-block w-100" />
        ) : (
          <Droppable droppableId={title}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`column-deal ${
                  snapshot.isDraggingOver ? 'bg-gray-300 vh-100' : ''
                }`}
              >
                {items?.map((deal, index) => (
                  <Card
                    key={deal.id}
                    tenant_deal_stage_id={deal.tenant_deal_stage_id}
                    deal={deal}
                    index={index}
                    onGetDeals={onGetDeals}
                    setNotification={setNotification}
                    loading={loading}
                    onAddDeal={handleAddDeal}
                  />
                ))}
                <a
                  href=""
                  className="btn btn-light add-deal w-100 text-center"
                  onClick={(e) => handleAddDeal(e)}
                  style={{ display: 'none' }}
                >
                  <MaterialIcon icon="add" />
                </a>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
        {pagination?.page < pagination?.totalPages ? (
          <ButtonIcon
            classnames="w-100 my-1"
            loading={load}
            disabled={load}
            label={'Load more'}
            onClick={() => {
              onClick(
                { name: deal_type, id: header.tenant_deal_stage_id },
                pagination?.page + 1,
                true
              );
              setLoad(true);
            }}
          />
        ) : null}
      </div>
    </Col>
  );
};

export default Columns;
