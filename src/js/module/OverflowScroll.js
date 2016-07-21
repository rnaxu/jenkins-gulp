/*
 * 横スクロール レガシー対応
 */

export default class OverflowScroll {

  constructor() {
    this.$target = $('.js-overflowScroll');
    this.touchStartX = 0;
    this.touchX = 0;
    this.scrollEndX = 0;
  }

  // イベントをセット
  setOverflowScroll() {
    const _this = this;

    this.$target.on('touchstart', function(event) {
      const touch = event.originalEvent.changedTouches[0];
      _this.touchStartX = touch.pageX;
    });

    this.$target.on('touchmove', function(event) {
      event.preventDefault();
      const touch = event.originalEvent.changedTouches[0];
      _this.touchX = touch.pageX;
      $(this).scrollLeft(_this.scrollEndX + (_this.touchStartX - _this.touchX));
    });

    this.$target.on('touchend', function() {
      _this.scrollEndX = $(this).scrollLeft();
    });
  }

}