/*
 * 位置情報取得
 */

export default class GeoSearch {

  constructor() {
    this.$geoSearch = $('.js-geoSearch');
  }

  // イベントをセット
  setGeoSearch() {
    const _this = this;

    // 現在地周辺ボタンが押下されたら
    this.$geoSearch.on('click', function() {
      // GeolocationAPIに対応しているかチェック
      _this.checkGeoApi();
    });
  }

  // 現在地周辺ボタンをトルツメ
  hiddenGeoSearch() {
    const $wrap = this.$geoSearch.parents('.js-geoSeachWrap');
    $wrap.addClass('is-hidden');
    $wrap.siblings('.js-slider').removeClass('slider--map');
  }

  // GeolocationAPIに対応しているかチェック
  checkGeoApi() {
    if (navigator.geolocation) { // 位置情報取得可能
      this.getPosition();
    } else { // 位置情報取得不可能
      alert('ご利用の端末では位置情報を取得できません。');
    }
  }

  // 位置情報を取得
  getPosition() {
    // オプション・オブジェクト
    const optionObj = {
      enableHighAccuracy: false, // trueを指定すると精度の高い情報を取得する
      timeout: 10000 // この秒数以上時間がかかった場合、タイムアウトでエラーに
      // maximumAge: 5000 // 次回再び現在位置を取得する時に、ここで指定した秒数だけ今回のデータをキャッシュする。デフォルトは0。
    };

    navigator.geolocation.getCurrentPosition(this.successFunc, this.errorFunc, optionObj);
  }

  // 位置情報の取得に成功した時に実行する関数
  successFunc(position) {
    let latLng = {};
    latLng.lat = position.coords.latitude;
    latLng.lng = position.coords.longitude;

    let mapUrl = '';

    /* global mapBaseUrl:false */

    if (mapBaseUrl.indexOf('?') === -1) { // URLにGETパラメータが存在しない場合
      mapUrl = mapBaseUrl + '?cplt=' + latLng.lat + '&cpln=' + latLng.lng;
    } else { // URLにGETパラメータが存在する場合
      mapUrl = mapBaseUrl + '&cplt=' + latLng.lat + '&cpln=' + latLng.lng;
    }

    // 生成したURLに遷移させる
    location.href = mapUrl;
  }

  // 位置情報の取得に失敗した時に実行する関数
  errorFunc(error) {
    // エラーコードのメッセージを定義
    const errorMessage = {
      0: '位置情報が取得できませんでした。', // 原因不明のエラー
      1: '位置情報が取得できませんでした。ご利用の端末の設定をご確認ください。', // 端末の設定で、もしくはこのページに対して、位置情報の取得が拒否されている
      2: '位置情報が取得できませんでした。電波状況やご利用の端末の設定をご確認ください。', // 電波または端末の設定の問題
      3: '位置情報が取得できませんでした。' // タイムアウト
    };

    // エラーコードに合わせたエラー内容をアラート表示
    alert(errorMessage[error.code]);
  }

}