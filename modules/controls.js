/*
 * Initialize all controls (button, input, textarea and link) for document.
 * @param {Object} options
 * @param {Boolean} [options.accessKeys=false]
 */
function Controls( options ) {
  "use strict";

  // REVIEW: Should underline be shown since init or only when holding down alt?
  // TODO: Assign shortcuts for standard actions (ok, cancel...).

  /*
   * Test if element is a controller supported by this lib.
   * @param {HTMLElement} c
   */
  function isControl(c) {
    // Test on textarea, number input, date input, slider input, checkbox input, radio input.
    return $.inArray( c.tagName, [ 'BUTTON', 'INPUT', 'TEXTAREA' ] ) !== -1;
  }

  /*
   * Get the node being the label of a control.
   * If there isn't a specific label element, return element itself.
   * @param {HTMLElement} control
   * @return {HTMLElement}
   */
  function labelNode(control) {
    var c = $(control)
    var label = $("label[for='"+c.attr('id')+"']");
    if (label.length == 0) label = c.closest('label');

    return (label.length == 0) ? c.context : label[0];
  }

  /*
   * "Activate" a control.
   * Focus text elements, simulate click on other elements.
   * @param {HTMLElement} control
   */
  function activateControl(control) {
    switch(control.tagName) {
      case 'INPUT':
      case 'TEXTAREA':
        control.focus();
      default:
        control.click();
    }
  }

  /*
   * Find substring of text node and wrap in another node.
   * @param {textNode} textNode
   * @param {regExp} regex - A regular expression matching exactly 3 groups,
   *   text before wrap, text to wrap and text after wrap.
   * @param {node} wrapNode - A newly cerated node, not yet attached to a parent.
   * @return {Boolean} - Whether regex matched text node's content.
   */
  function wrapText(textNode, regex, wrapNode) {
    var matches = textNode.nodeValue.match(regex);
    if (!matches) return false;

    textNode.nodeValue = matches[1];
    wrapNode.appendChild(document.createTextNode(matches[2]));
    textNode.parentNode.insertBefore(wrapNode, textNode.nextSibling);
    var suffixNode = document.createTextNode(matches[3]);
    textNode.parentNode.insertBefore(suffixNode, wrapNode.nextSibling);

    return true;
  }

  /*
   * Find control's access key in its label and wrap it in stylable element.
   * Warns if access key couldn't be found in label.
   * @param {HTMLElement} control
   */
  function initAccessKey(control) {
    var accessKey = control.attr('data-access-key');
    var label = labelNode(control);
    var textNodes = $.grep(label.childNodes, function(n) {
      return n.nodeType == Node.TEXT_NODE
    });
    if (textNodes.length < 1) return;

    // Assume there is only one text node in label.
    var textNode = textNodes[0];
    if (!wrapText(
        textNode,
        RegExp('^([^'+accessKey+']*)('+accessKey+')(.*)', 'i'),
        document.createElement('U')// TODO: Wrap is span with custom class. Style as underline on Alt press only.
      )
    ) console.warn('No access key \''+accessKey+'\' found in label \''+textNode.nodeValue+'\'.')
  }

  /*
   * Initialize all access keys in document.
   */
  function initAccessKeys() {
    $('[data-access-key]').each(function() {
      initAccessKey($(this));
    });

    $(document).keydown(function(e) {
      if (!e.altKey) return;
      var control = $('[data-access-key="'+e.key+'"]')[0]
      if (!control) return;

      activateControl(control);
      e.preventDefault();
    });
  }

  /*
   * Initialize method call and shortcut to button.
   * Warns if button reference a undefined SketchUp callback.
   * @param {HTMLButtonElement} c
   * @param {Object} options
   * @param {Boolean} [options.assignCallbacks=true]
   * @param {Boolean} [options.assignShortcuts=true]
   * TODO: Document what shortcuts lead to what buttons.
   */
  function initButton(c, options) {
    var classes = c.className.split(' ')
    for (var i=0, max=classes.length; i < max; i++) {
      var className = classes[i];
      var matches = className.match(/^dlg-(.+)$/)
      if (!matches) continue;
      var action = matches[1];

      if (options.hasOwnProperty('assignCallbacks') && options['assignCallbacks'] || true) {
        if (typeof sketchup[action] === 'function') {
          console.log('Assign SU callback \''+action+'\' to control \''+c.innerHTML+'\'.')
          c.onclick = sketchup[action];
        } else {
          console.warn('Missing SU callback \''+action+'\'.');
        }
      }

      if (options.hasOwnProperty('assignShortcuts') && options['assignShortcuts'] || true) {
        switch (action) {
          case 'cancel':
          case 'close':
            $(document).keydown( {c: c } , function(e) {
              if (e.key != 'Escape') return;
              activateControl(e.data.c);
              e.preventDefault();
            });
          // TODO: Help can be a link as well, not just a button.
          // Add back support for links?
          case 'help':
            $(document).keydown( {c: c } , function(e) {
              if (e.key != 'F1') return;
              activateControl(e.data.c);
              e.preventDefault();
            });
        }
      }

      break;
    }
  }

  /*
   * Initialize a control (button, input etc).
   * @param {Object} options
   * @param {Boolean} [options.accessKeys=true]
   * @param {Boolean} [options.assignCallbacks=true]
   * @param {Boolean} [options.assignShortcuts=true]
   */
  function initControl(c, options) {
    if (c.tagName == 'BUTTON') initButton(c, options);

    if (options.hasOwnProperty('accessKeys') && options['accessKeys'] || true) {
      var accessKey = c.getAttribute('data-access-key');
      if (accessKey) initAccessKey(c, accessKey);
    }
  }

  /*
   * Initialize all controls (button, input etc) for document.
   * @param {Object} [options={}]
   * @param {Boolean} [options.accessKeys=true]
   * @param {Boolean} [options.assignCallbacks=true]
   * @param {Boolean} [options.assignShortcuts=true]
   */
  function initControls(options = {}) {


    // == REMOVE THIS CODE ==
    /*
    // elements needs to be array, not htmlColelction, as we are adding elements
    // from within a loop over it.
    var elements = Array.from(document.getElementsByTagName("*"));
    for (var i=0, max=elements.length; i < max; i++) {
      var c = elements[i];
      if (!isControl(c)) continue;
      initControl(c, options);
    }
    */




    if (!options.hasOwnProperty('accessKeys') || options['accessKeys']) {
      initAccessKeys()
    }
  }

  initControls(options);

}
