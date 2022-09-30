/** Right Panel Modal, it will popup from right side of window , it takes Title , ShowModal, Children to render and Title as propgs. */

import React from 'react';

const insightRightPanel = ({
  showModal,
  setShowModal,
  children,
  Title,
  containerWidth = 468,
}) => {
  const closeDialoge = async (e) => {
    setShowModal(false);
  };

  return (
    <>
      <div
        id="linkedinSidebar"
        className={`hs-unfold-content sidebar sidebar-lg sidebar-bordered sidebar-box-shadow hs-unfold-content-initialized position-absolute hs-unfold-simple ${
          showModal ? '' : 'hs-unfold-hidden'
        }`}
        data-hs-target-height="0"
        data-hs-unfold-content=""
        style={{ minWidth: containerWidth }}
      >
        <div className="card sidebar-card sidebar-footer-fixed overflow-auto">
          <div className="card-header py-2 mb-2">
            <h3 className="card-header-title">{Title}</h3>
            <a
              className="js-hs-unfold-invoker btn btn-icon btn-xs btn-ghost-dark ml-2"
              onClick={(e) => closeDialoge(e)}
            >
              <i className="material-icons-outlined">clear</i>
            </a>
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default insightRightPanel;
