import React, { useEffect, useState } from 'react';
import { ProgressBar } from 'react-bootstrap';

import { formatNumber } from '../../../utils/Utils';
import DealsTableModal from './DealsTableModal';
import DealCard from './DealCards';
import dealService from '../../../services/deal.service';
import AddDeal from './AddDeal';
import EmptyDataButton from '../../emptyDataButton/EmptyDataButton';

const Deals = ({ contactId, organizationId, profileInfo }) => {
  const [pagination, setPagination] = useState({ limit: 15, page: 1 });
  const [deals, setDeals] = useState([]);
  const [won, setWon] = useState(0);
  const [wonPercent, setWonPercent] = useState(0);
  const [wonPrice, setWonPrice] = useState(0);
  const [lost, setLost] = useState(0);
  const [lostPercent, setLostPercent] = useState(0);
  const [lostPrice, setLostPrice] = useState(0);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [openDeal, setOpenDeal] = useState(false);

  const getWonLost = () => {
    const { lostCount, lostPrice, wonCount, wonPrice } = deals?.reduce(
      (acc, deal) => {
        if (deal.status === 'lost') {
          acc.lostCount++;
          acc.lostPrice += deal.amount;
        } else if (deal.status === 'won') {
          acc.wonCount++;
          acc.wonPrice += deal.amount;
        }
        return acc;
      },
      {
        lostCount: 0,
        lostPrice: 0,
        wonCount: 0,
        wonPrice: 0,
      }
    );

    setLost(lostCount);
    setLostPrice(lostPrice);
    setWon(wonCount);
    setWonPrice(wonPrice);
    const wonPercent =
      lostCount + wonCount === 0
        ? 0
        : (wonCount * 100) / (lostCount + wonCount);
    setWonPercent(wonPercent.toFixed(2));
    const LostPercent =
      lostCount + wonCount === 0
        ? 0
        : (lostCount * 100) / (lostCount + wonCount);
    setLostPercent(LostPercent.toFixed(2));
  };

  const getDeals = async () => {
    const dealsFilter = {};

    if (contactId) dealsFilter.contact_person_id = contactId;
    if (organizationId) dealsFilter.contact_organization_id = organizationId;
    await dealService
      .getDeals(dealsFilter, pagination)
      .then(({ data }) => {
        setDeals(data.deals);
        setPagination(data.pagination);
      })
      .catch((err) => console.log(err));
  };

  const openModal = () => {
    setIsOpenModal(true);
  };

  useEffect(() => {
    getDeals();
  }, []);

  useEffect(() => {
    getWonLost();
  }, [deals]);

  useEffect(() => {
    getDeals();
  }, [isOpenModal]);

  return (
    <div className="card mt-4">
      <DealsTableModal
        showModal={isOpenModal}
        setShowModal={setIsOpenModal}
        contactId={contactId}
        organizationId={organizationId}
      />

      <div className="card-header">
        <h4>Deals</h4>

        <div className="ml-auto">
          <AddDeal
            organizationId={organizationId}
            setOpenDeal={setOpenDeal}
            openDeal={openDeal}
            profileInfo={profileInfo}
            onGetDeals={getDeals}
          >
            <button
              className="btn btn-icon btn-sm btn-ghost-primary rounded-circle"
              onClick={() => setOpenDeal(true)}
            >
              <i className="material-icons-outlined">add</i>
            </button>
          </AddDeal>
        </div>
      </div>

      <div className="card-body py-2">
        <div className="list-group list-group-flush list-group-no-gutters">
          {deals.length === 0 && (
            <AddDeal
              organizationId={organizationId}
              setOpenDeal={setOpenDeal}
              openDeal={openDeal}
              profileInfo={profileInfo}
              onGetDeals={getDeals}
            >
              <EmptyDataButton
                setOpenModal={setOpenDeal}
                message=""
                buttonLabel={'Add Deal'}
              />
            </AddDeal>
          )}
          {deals?.slice(0, 3).map((item) => (
            <div className="d-flex my-1 w-100" key={item.id}>
              <DealCard
                item={item}
                formatNumber={formatNumber}
                onGetDeals={getDeals}
              />
            </div>
          ))}

          {deals.length !== 0 && (
            <>
              <div className="my-3">
                <ProgressBar style={{ height: '10px' }}>
                  <ProgressBar
                    variant={`success`}
                    now={wonPercent}
                    isChild={true}
                  />
                  <ProgressBar
                    variant={`danger`}
                    now={lostPercent}
                    isChild={true}
                    style={
                      wonPercent !== 100 && { borderLeft: '4px solid #fff' }
                    }
                  />
                </ProgressBar>
              </div>
              <div className="media">
                <div className="text-success" style={{ width: '25%' }}>
                  <strong>Won</strong>
                </div>
                <div style={{ width: '25%' }}>{won}</div>
                <div style={{ width: '25%' }}>{`${wonPercent}%`}</div>
                <div style={{ width: '25%', textAlign: 'right' }}>
                  {formatNumber(wonPrice, 2)}
                </div>
              </div>
              <div className="media d-flex justify-content-between pb-2">
                <div className="text-error" style={{ width: '25%' }}>
                  <strong>Lost</strong>
                </div>
                <div style={{ width: '25%' }}>{lost}</div>
                <div style={{ width: '25%' }}>{`${lostPercent}%`}</div>
                <div style={{ width: '25%', textAlign: 'right' }}>
                  {formatNumber(lostPrice, 2)}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {deals.length > 0 && (
        <div className="card-footer">
          <button className="btn btn-white btn-sm" onClick={openModal}>
            View All
            <span className="material-icons-outlined">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Deals;
