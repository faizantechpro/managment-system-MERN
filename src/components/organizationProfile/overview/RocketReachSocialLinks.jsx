import React, { useEffect, useState } from 'react';
import linkedin from '../../../assets/svg/linkedin.svg';
import twitter from '../../../assets/svg/twitter.svg';
import facebook from '../../../assets/svg/facebook.svg';

const SocialLinksImages = {
  linkedin,
  twitter,
  facebook,
};

const RocketReachSocialLinks = ({ links }) => {
  const [list, setList] = useState([]);
  useEffect(() => {
    if (links) {
      const newList = [];
      for (const link in links) {
        if (link === 'facebook' || link === 'twitter' || link === 'linkedin') {
          newList.push({
            icon: SocialLinksImages[link],
            url: links[link],
          });
        }
      }
      setList(newList);
    }
  }, [links]);
  return (
    <div className="d-flex align-items-center pt-1">
      {list.map((link) => (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={link.url}
          key={link.url}
          className="mr-2"
        >
          <img src={link.icon} />{' '}
        </a>
      ))}
    </div>
  );
};

export default RocketReachSocialLinks;
