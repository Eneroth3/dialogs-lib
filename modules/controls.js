/*
 * Initialize all controls (button, input, textarea and link) for document.
 * @param {Object} options
 * @param {Boolean} [options.accessKeys=false]
 */
function Controls( options ) {
  // REVIEW: Should underline be shown since init or only when holding down alt?
  // TODO: Read className and assign method calls and shortcuts.

  /*
   * Test if element is a controller supported by this lib.
   * @param {HTMLElement} c
   */
  function isControl(c) {
    // Test on textarea, number input, date input, slider input, checkbox input, radio input.
    return $.inArray( c.tagName, [ 'BUTTON', 'INPUT', 'TEXTAREA', 'A' ] ) !== -1;
  }

  /*
   * Get the node being the label of a control
   * (the node which innerHTML the access key should be underlined in).
   */
  function labelNode(c) {
    c = $(c)
    var label = $("label[for='"+c.attr('id')+"']");
    if (label.length == 0) label = c.closest('label');

    return (label.length == 0) ? c.context : label[0];
  }

  /*
   * "Activate" a control.
   * Simulate click on buttons and links, focus text inputs.
   * @param {HTMLButtonElement|HTMLInputElement|HTMLTextAreaElement|HTMLAnchorElement} c
   */
  function activateControl(c) {
    // Test if this can trigger both events defined by onclick attribute,
    // "normal" events (whatever those are called), and event set by this
    // lib (sketchup.{classname - 'button'}).
    // Should set focus to text inputs.
    switch(c.tagName) {
      case 'BUTTON':
      case 'A':
        c.click();
      case 'INPUT':
      case 'TEXTAREA':
        c.focus();
    }
  }

  /*
   * Initialize access key for a control.
   * Both adds the event listener and underlines the character in the label.
   * Warns if access key couldn't be found in label.
   * @param {HTMLButtonElement|HTMLInputElement|HTMLTextAreaElement|HTMLAnchorElement} c
   * @param {String} accessKey
   */
  function initAccessKey(c, accessKey) {
    var label = labelNode(c);
    var textNodes = $.grep(label.childNodes, function(n) { return n.nodeType == Node.TEXT_NODE });
    if (textNodes.length > 0) {
      // Assume there is only one next node in label.
      var textNode = textNodes[0];
      var regExp = RegExp('^([^'+accessKey+']*)('+accessKey+')(.*)', 'i');
      var matches = textNode.nodeValue.match(regExp);
      if (matches) {
        textNode.nodeValue = matches[1];
        var akNode = document.createElement('U');
        akNode.appendChild(document.createTextNode(matches[2]));
        label.insertBefore(akNode, textNode.nextSibling);
        suffixNode = document.createTextNode(matches[3]);
        label.insertBefore(suffixNode, akNode.nextSibling);
      } else {
        console.warn('No access key \''+accessKey+'\' found in label \''+textNode.nodeValue+'\'.')
      }
    }

    $(document).keydown( { accessKey: accessKey, c: c } , function(e) {
      if (!e.altKey) return;
      if (e.key != e.data.accessKey) return;
      activateControl(e.data.c);
      e.preventDefault();
    });
  }

  /*
   * Initialize a control (button, input, link etc).
   * @param {Object} options
   * @param {Boolean} [options.accessKeys=false]
   */
  function initControl(c, options) {
    // If click event isn't already defined, and button has a class
    // prefixed with 'button-' (e.g. 'button-ok'),
    // call Sketchup.<className excluding button> (e.g. sketchup.ok').
    if (c.tagName == 'BUTTON'){
      c.onclick = function() {alert(this.innerHTML);};
    }

    if (options.accessKeys) {
      var accessKey = c.getAttribute('data-access-key');
      if (accessKey) initAccessKey(c, accessKey);
    }
  }

  /*
   * Initialize all controls (button, input, link etc) for document.
   * @param {Object} options
   * @param {Boolean} [options.accessKeys=false]
   */
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
