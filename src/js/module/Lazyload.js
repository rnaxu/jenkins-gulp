/*
 * 遅延ロード
 */

export default class Lazyload {
  // イベントをセット
  setLazyload() {
    $('.js-lazy').lazyload({
      // effect: 'fadeIn',
      threshold: 300
      // load: function(){
      //     $(this).children('.js-overlay').addClass('js-card__overlay');
      // }
    });
  }
}