/*
 * もっと見る
 */

export default class ViewAll {
  // イベントをセット
  setViewAll() {
    $('.js-viewAll').on('click', function() {
      const $this = $(this);
      $this.siblings('.js-viewItem').fadeIn();
      $this.addClass('is-hidden');
    });
  }
}