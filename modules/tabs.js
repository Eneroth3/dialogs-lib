/*
 * Initialize tab functionality for document.
 * Call this function once the DOM is loaded.
 *
 * @callback onSwitch
 * @param {number} newIndex
 * @param {number} oldIndex
 *
 * @param {Object} [options={}]
 * @param {HTMLElement} [options.tabElement]
 * @param {HTMLElement} [options.tabContentElement]
 * @param {number} [options.startIndex=0]
 * @param {onSwitch} options.onSwitch
 */
function dlgInitTabInterface( options ) {
  'use strict';

  var currentIndex = options['startIndex'] || 0
  var tabs         = $(options['tabElement'])       .children();
  var tabsContents = $(options['tabContentElement']).children();
  var callback     = options['onSwitch'];

  // Low level tab viewing
  function viewTab(index) {
    tabs.removeClass('dlg-tab-selected')
    tabsContents.removeClass('dlg-tab-content-selected')
    tabs.eq(index).addClass('dlg-tab-selected')
    tabsContents.eq(index).addClass('dlg-tab-content-selected')
  }
  viewTab(currentIndex);

  // High level tab switching.
  function switchTab(index) {
    if (callback) callback(index, currentIndex);
    viewTab(index)
    currentIndex = index;
  }

  tabs.each(function() {
    this.onclick = function() {
      var index = tabs.index(this);
      switchTab(index);
    }
  });

  // TODO: return some sort of handler that (some) of these methods can be called upon?
}
