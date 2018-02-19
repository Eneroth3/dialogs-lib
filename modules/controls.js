/*
 * Initialize all controls (button, input, textarea and link) for document.
 * @param {Object} options
 * @param {Boolean} [options.accessKeys=false]
 */
function Controls( options ) {
  "use strict";

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
        break;
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
   * Warn if access key couldn't be found in label.
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
   * Assign callbacks to elements with dlg-callback-* class.
   * Warn if callback method is missing.
   */
  function assignCallbacks() {
    $('[class*="dlg-callback-"]').each(function() {
      var control = $(this).context;
      var action = control.className.match(/dlg-callback-(\S+)/)[1];
      var func = sketchup[action];
      if (typeof func === 'function') {
        console.log('Assign SU callback \''+action+'\' to control \''+control+'\'.')
        // TODO: Test if onclick has benefits over EventListener, e.g. that
        // onclick corresponds to interaction, including Enter and Space, and
        // not just the mouse button being pressed. If so, comment it here.
        // TODO: Test what values are sent in callback. Maybe wrap in anonymous
        // function to prevent sending JS event and stuff.
        // TODO: Only assign if developer hasn't already assigned a call to this
        // element. The classes cancel, yes, no, ok etc should preferably be
        // added, even when the developer specifies their own custom JS call,
        // to be used for shortcuts.
        control.onclick = func;
      } else {
        console.warn('Missing SU callback \''+action+'\'.');
      }
    });
  }

  /*
   * Assign shortcuts to document.
   */
  function assignShortcuts() {
    $(document).keydown(function(e) {
      switch (e.key) {
        case 'Enter':
          // For following focused elements Enter should not be used as
          // shortcut for "submitting" the dialog.
          var active = document.activeElement;
          if (active.tagName == 'BUTTON') return;
          if (active.tagName == 'A') return;
          if (active.tagName == 'TEXTAREA') return;
          if (active.tagName == 'INPUT' && active.type == 'checkbox') return;
          if (active.tagName == 'INPUT' && active.type == 'radio') return;
          // Try the following elements in the order listed.
          var control = $('.dlg-default-action')[0];
          control = control || $('.dlg-callback-yes')[0];
          control = control || $('.dlg-callback-ok')[0];
          control = control || $('.dlg-callback-close')[0];
          if (control) activateControl(control);
          break;
        case 'Escape':
          var control = $('.dlg-callback-cancel')[0];
          control = control || $('.dlg-callback-no')[0];
          control = control || $('.dlg-callback-ok')[0];
          control = control || $('.dlg-callback-close')[0];
          if (control) activateControl(control);
          break;
        case 'F1':
          var control = $('.dlg-callback-help')[0];
          if (control) activateControl(control);
          break;
        default:
          return;
      }
      e.preventDefault();
    });
  }

  /*
   * Initialize library functionality for document.
   * @param {Object} [options={}]
   * @param {Boolean} [options.initAccessKeys=true]
   * @param {Boolean} [options.assignCallbacks=true]
   * @param {Boolean} [options.assignShortcuts=true]
   */
  function initControls(options = {}) {
    if (!options.hasOwnProperty('initAccessKeys') || options['initAccessKeys']) {
      initAccessKeys();
    }
    if (!options.hasOwnProperty('assignCallbacks') || options['assignCallbacks']) {
      assignCallbacks();
    }
    if (!options.hasOwnProperty('assignShortcuts') || options['assignShortcuts']) {
      assignShortcuts();
    }
    $('.dlg-default-action').focus();
  }

  initControls(options);

}
