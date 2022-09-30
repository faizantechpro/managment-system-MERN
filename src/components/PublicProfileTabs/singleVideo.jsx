import React, { useState } from 'react';
import WistiaEmbed from '../wistia';

export const SingleVideo = (props) => {
  const { setIsSingleVideo, isSingleVideo } = props;
  const [isVideoView, setIsVideoView] = useState();
  console.log(isSingleVideo);
  return (
    <>
      <div className="py-5">
        <div className="mb-3 d-flex align-items-center">
          <button className="btn btn-back" onClick={() => setIsSingleVideo('')}>
            <span className="material-icons-outlined">arrow_back</span>
          </button>
          <h2 className="m-auto video-title">{isSingleVideo.name}</h2>
        </div>
        {isVideoView && (
          <WistiaEmbed
            hashedId={isVideoView || ''}
            isResponsive={true}
            videoFoam={true}
          />
        )}
        {isSingleVideo.video_list?.map((item, index) => (
          <div
            className="row mx-0 px-0 align-items-center mt-3 cr-p"
            onClick={() => setIsVideoView(item.video_link)}
            key={`video-inner-${index}`}
          >
            <div className="col-auto">
              <div className="position-relative">
                <img
                  src="/img/play-button.png"
                  width={48}
                  height={48}
                  className="play-icon"
                  alt=""
                />
                <img src={item.video_banner} className="w-100 rounded" alt="" />
              </div>
            </div>
            <div className="col pl-lg-1">
              <div className="public-video">
                <p className="mb-0">{isSingleVideo.name}</p>
                <h2>{item.name}</h2>
                <p>{item.video_time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
