import React, { useState } from 'react';
import Pagination from '../Pagination';
import { SingleVideo } from './singleVideo';
import { videoList } from './videoJson';
export const PublicVideo = ({ paginationInfo, onPageChange }) => {
  const [isSingleVideo, setIsSingleVideo] = useState('');
  console.log(videoList);
  return (
    <>
      {isSingleVideo ? (
        <SingleVideo
          isSingleVideo={isSingleVideo}
          setIsSingleVideo={setIsSingleVideo}
        />
      ) : (
        <>
          {videoList?.map((item, index) => (
            <div
              className="row mx-0 px-0 align-items-center mt-3"
              onClick={() => setIsSingleVideo(item)}
              key={`video-listes-${index}`}
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
                  <img
                    src={item.video_banner}
                    className="w-100 rounded"
                    alt=""
                  />
                </div>
              </div>
              <div className="col pl-lg-1">
                <div className="public-video">
                  <h2>
                    {' '}
                    <img src={item.icon} alt="" /> {item.name}
                  </h2>
                  <p>{item.video_list.length} videos Available</p>
                </div>
              </div>
            </div>
          ))}
          <hr className="mt-4 mb-4" />
          <div className="mt-3 text-center d-flex justify-content-center">
            <Pagination
              className="m-auto"
              paginationInfo={paginationInfo}
              onPageChange={onPageChange}
            />
          </div>
        </>
      )}
    </>
  );
};
