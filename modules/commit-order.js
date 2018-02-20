function commitOrder() {
  var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  document.body.className = isMac ? 'dlg-mac' : 'dlg-win';
}
