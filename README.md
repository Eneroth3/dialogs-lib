dialogs

Simple JS library for SketchUp HtmlDialogs


Dialogs is a lightweight, easy to use library for SketchUp HtmlDialog
dialogs. It is designed purely using web technologies, no Ruby, to allow you to
easily implement it in dialogs in existing projects, without having to replace
Ruby HtmlDialogs with some custom dialog object. Working directly in web
technologies, rather than through a Ruby wrapper, also allows you to make more
versatile dialogs with highly specialized content and any third party lib of
your choice. Dialogs can be thought of as a utility library rather than a full
framework.

Dialogs can:
- automatically add callback actions to controls based on their class
- assign shortcut keys to some standard controls
- implement access keys to controls

For some sort of documentation, see the [somewhat complete example](examples/controls.html).

````ruby
# Simple message box.
base_dir = UI.select_directory(title: "Select directory containing support files")
html = <<-HTML
  <!DOCTYPE HTML>
  <html>
    <head>
      <meta charset="UTF-8">
      <base href="#{base_dir}/" />
      <script src="controls.js"></script>
      <script src="jquery-1.12.4.js"></script>
      <script>
        // Initialize the controls when the document is ready.
        $(document).ready(function() {
          Controls();
        } );
      </script>
    </head>
    <body>
      <p>Eneroth is really cool and geeky!</p>
      <p>(Both Enter and Esc should activate OK)</p>
      <button class="dlg-callback-ok">OK</button>
    </body>
  </html>
HTML
dialog = UI::HtmlDialog.new
dialog.set_html(html)
dialog.add_action_callback("ok") { puts "OK" }
dialog.show
´´´´

````ruby
# Yes No Cancel
base_dir = UI.select_directory(title: "Select directory containing support files")
html = <<-HTML
  <!DOCTYPE HTML>
  <html>
    <head>
      <meta charset="UTF-8">
      <base href="#{base_dir}/" />
      <script src="controls.js"></script>
      <script src="jquery-1.12.4.js"></script>
      <script>
        // Initialize the controls when the document is ready.
        $(document).ready(function() {
          Controls();
        } );
      </script>
    </head>
    <body>
      <p>Bla bla bla.</p>
      <p>(Enter should activate Yes and Esc should activate Cancel.)</p>
      <button data-access-key="y" class="dlg-callback-yes">Yes</button>
      <button data-access-key="n" class="dlg-callback-no">No</button>
      <button onclick="alert('bla bla bla');" class="dlg-callback-cancel">Cancel</button>
    </body>
  </html>
HTML
dialog = UI::HtmlDialog.new
dialog.set_html(html)
dialog.add_action_callback("yes")    { puts "Yes" }
dialog.add_action_callback("no")     { puts "No" }
dialog.add_action_callback("cancel") { puts "Cancel" }
dialog.show
´´´´

FIXME: Freezes from calling Sketchup callback.
TODO: Stop super annoying beep in Alt keydown in HtmlDialog.




