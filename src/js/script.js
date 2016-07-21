/*
 * 実行
 */

import Lazyload from './module/Lazyload';
import UserAgent from './module/UserAgent';
import OverflowScroll from './module/OverflowScroll';
import GeoSearch from './module/GeoSearch';
import ViewAll from './module/ViewAll';
import Accordion from './module/Accordion';

(function() {

  const lazyload = new Lazyload();
  const userAgent = new UserAgent();
  const overflowScroll = new OverflowScroll();
  const geoSearch = new GeoSearch();
  const viewAll = new ViewAll();
  const accordion = new Accordion();

  // 遅延ロード
  lazyload.setLazyload();

  const os = userAgent.getOS();

  if (os === 'iPhone') { // iPhoneだったら

    // 現在地取得
    geoSearch.setGeoSearch();

    if (userAgent.getIOSVer() < 500) { // iOS5より古かったら
      // JSで横スクロール
      overflowScroll.setOverflowScroll();
    }

  } else if (os === 'Android') {

    // 現在地周辺ボタンをトルツメ
    geoSearch.hiddenGeoSearch();

    if (userAgent.getAndroidVer() < 4) { // Android4より古かったら
      // JSで横スクロール
      overflowScroll.setOverflowScroll();
    }

  } else {
    // 現在地周辺ボタンをトルツメ
    geoSearch.hiddenGeoSearch();
  }

  // もっと見る
  viewAll.setViewAll();

  // アコーディオン
  accordion.setAccordion();

})();

