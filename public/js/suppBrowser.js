if (
  navigator.appName == 'Microsoft Internet Explorer' ||
  !!(
    navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/)
  ) ||
  (typeof $.browser !== 'undefined' && $.browser.msie == 1)
) {
  document.getElementById('root').setAttribute('id', 'unsupported');
  main =
    '<div class="warning-main">' +
    '<img class="logo" src="/img/logo.png" />' +
    "<h2>We're sorry, but </h2>" +
    "<h1>your browser isn't supported</h1>" +
    '<p>We officially support the latest version of the following browsers.</p>' +
    '<h3>Supported Browsers</h3>';
  brwContStart = '<div class="browser-container">';
  chrome =
    '<div class="browser-item">' +
    '<img src="/img/chrome.png" />' +
    '<p>Google Chrome</p>' +
    '</div>';
  firefox =
    '<div class="browser-item">' +
    '<img src="/img/firefox.png" />' +
    '<p>Mozilla Firefox</p>' +
    '</div>';
  edge =
    '<div class="browser-item">' +
    '<img src="/img/edge.png" />' +
    '<p>Microsoft Edge</p>' +
    '</div>';
  safari =
    '<div class="browser-item">' +
    '<img src="/img/safari.png" />' +
    '<p>Safari</p>' +
    '</div>';
  brwContEnd = '</div></div>';
  document.write(main, brwContStart, chrome, firefox, edge, safari, brwContEnd);
}
