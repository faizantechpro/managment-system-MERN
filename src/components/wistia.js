import React, { Component } from 'react';

class WistiaEmbed extends Component {
  constructor(props) {
    super(props);
    const { hashedId, ...embedOptions } = { ...this.props };

    if (typeof window !== `undefined`) {
      window._wq = window._wq || [];
      window._wq.push({
        id: hashedId,
        options: embedOptions,
        onHasData: (video) => {
          this.handle = video;
        },
      });
    }
  }

  _renderCommon() {
    const { hashedId } = this.props;
    return (
      <div
        className="wistia_swatch"
        style={{
          height: '100%',
          left: 0,
          opacity: 0,
          overflow: 'hidden',
          position: 'absolute',
          top: 0,
          transition: 'opacity 200ms',
          width: '100%',
        }}
      >
        <img
          src={`https://fast.wistia.com/embed/medias/${hashedId}/swatch`}
          style={{
            filter: 'blur(5px)',
            height: '100%',
            objectFit: 'contain',
            width: '100%',
          }}
          alt=""
          aria-hidden="true"
        />
      </div>
    );
  }

  _renderResponsive() {
    const { hashedId, padding } = this.props;

    return (
      <div
        className="wistia_responsive_padding"
        style={{ padding, position: 'relative' }}
      >
        <div
          className="wistia_responsive_wrapper"
          style={{
            height: '100%',
            left: '0',
            position: 'absoulte',
            top: 0,
            width: '100%',
          }}
        >
          <div
            className={`wistia_embed wistia_async_${hashedId} videoFoam=true`}
            style={{ height: '100%', width: '100%', position: 'relative' }}
          >
            {this._renderCommon()}
          </div>
        </div>
      </div>
    );
  }

  _renderFixed() {
    const { width, height, hashedId } = this.props;
    const style = {
      height: height || '480px',
      width: width || '720px',
      position: 'relative',
    };
    return (
      <div className={`wistia_embed wistia_async_${hashedId}`} style={style}>
        {this._renderCommon()}
      </div>
    );
  }

  render() {
    const { isResponsive } = this.props;
    return isResponsive ? this._renderResponsive() : this._renderFixed();
  }

  componentDidMount() {
    if (!document.getElementById('wistia_script')) {
      const wistiaScript = document.createElement('script');
      wistiaScript.id = 'wistia_script';
      wistiaScript.type = 'text/javascript';
      wistiaScript.src = 'https://fast.wistia.com/assets/external/E-v1.js';
      wistiaScript.async = true;
      document.body.appendChild(wistiaScript);
    }
  }

  componentWillUnmount() {
    this.handle && this.handle.remove();
  }
}

WistiaEmbed.defaultProps = {
  isResponsive: true,
};

export default WistiaEmbed;
