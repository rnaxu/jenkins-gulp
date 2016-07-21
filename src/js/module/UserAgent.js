/*
 * UserAgent取得
 */

export default class UserAgent {

  constructor() {
    this.ua = navigator.userAgent;
  }

  // iPhoneかAndoroidか取得
  getOS() {
    if (this.ua.indexOf('iPhone') > 0) { // iPhoneだったら
      return 'iPhone';
    } else if (this.ua.indexOf('Android') > 0) { // Androidだったら
      return 'Android';
    }
  }

  // iOSのバージョンを取得
  getIOSVer() {
    this.ua.match(/iPhone OS (\w+){1,3}/g);
    const iVersion = (RegExp.$1.replace(/_/g, '') + '00').slice(0, 3);
    return iVersion;
  }

  // Androidのバージョンを取得
  getAndroidVer() {
    const Aversion = parseFloat(this.ua.slice(this.ua.indexOf('Android') + 8));
    return Aversion;
  }

}