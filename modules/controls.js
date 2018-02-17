function Controls( options ) {

  function isControl(c) {
    // For now only support buttons.
    // Later5 support input, textarea and maybe link.
    return c.tagName == 'BUTTON';
  }

  function labelNode(c) {
    // On inputs, return the associated label. On button, return button itself.
    return c;
  }

  function initAccessKey(c, accessKey) {
    var ln = labelNode(c);
    var regExp = RegExp(accessKey, 'i');
    ln.innerHTML = ln.innerHTML.replace(regExp , '<u>$&</u>');

    $(document).keydown( { accessKey: accessKey, c: c } , function(e) {
      if (!e.altKey) return;
      if (e.key != e.data.accessKey) return;
      // Test if this can trigger both events defined by onclick attribute,
      // "normal" events (whatever those are called), and event set by this
      // lib (sketchup.{classname - 'button'}).
      // Should set focus to text inputs.
      e.data.c.click();
      e.preventDefault();
    });
  }

  function initControl(c, options) {
    // If click event isn't already defined, and button has a class
    // prefixed with 'button-' (e.g. 'button-ok'),
    // call Sketchup.<className excluding button> (e.g. sketchup.ok').
    c.onclick = function() {alert(this.innerHTML);};

    if (options.accessKeys) {
      var accessKey = c.getAttribute('data-access-key');
      if (accessKey) initAccessKey(c, accessKey);
    }
  }

  function initControls(options) {
    // elements needs to be array, not htmlColelction, as we are adding elements
    // from within a loop over it.
    var elements = Array.from(document.getElementsByTagName("*"));
    for (var i=0, max=elements.length; i < max; i++) {
      c = elements[i];
      if (!isControl(c)) continue;
      initControl(c, options);
    }
  }

  initControls(options);

}
