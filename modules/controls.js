function Controls( options ) {

  function isControl(e) {
    // For now only support buttons.
    // Later5 support input, textarea and maybe link.
    return e.tagName == 'BUTTON';
  }

  function labelNode(e) {
    // On inputs, return the associated label. On button, return button itself.
    return e;
  }

  function initAccessKey(e, accessKey) {
    var ln = labelNode(e);
    var regExp = RegExp(accessKey, 'i');
    ln.innerHTML = ln.innerHTML.replace(regExp , '<u>$&</u>');

    // Let Alt+{accessKey} simulate click event on e.
    // For input elements this should set focus.
  }

  function initControl(e, options) {
    // If click event isn't already defined, and button has a class
    // prefixed with 'button-' (e.g. 'button-ok'),
    // call Sketchup.<className excluding button> (e.g. sketchup.ok').
    e.onclick = function() {alert('test');};

    if (options.accessKeys) {
      var accessKey = e.getAttribute('data-access-key');
      if (accessKey) initAccessKey(e, accessKey);
    }
  }

  function initControls(options) {
    // elements needs to be array, not htmlColelction, as we are adding elements
    // from within a loop over it.
    var elements = Array.from(document.getElementsByTagName("*"));
    for (var i=0, max=elements.length; i < max; i++) {
      e = elements[i];
      if (!isControl(e)) continue;
      initControl(e, options);
    }
  }

  initControls(options);

}
