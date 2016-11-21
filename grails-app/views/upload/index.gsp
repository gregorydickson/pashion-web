<!DOCTYPE HTML>
<html>
    <head>
        <meta name="layout" content="main" />
                
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/dropzone/4.3.0/css/dropzone.css" type="text/css">
        <script src="//cdnjs.cloudflare.com/ajax/libs/dropzone/4.3.0/dropzone.js"></script>
        <script type="application/javascript">
        Dropzone.options.myAwesomeDropzone = {
            maxFiles: 1,
            //maxFilesize: 10, // MB
            /*accept: function(file, done) {
                if (file.name == "justinbieber.jpg") {
                    done("Naha, you don't.");
                }
                else { done(); }
            }*/
            //autoProcessQueue: false,
            // The setting up of the dropzone
            init: function() {
                var myDropzone = this;

                // First change the button to actually tell Dropzone to process the queue.
                this.element.querySelector("input[type=submit]").addEventListener("click", function(e) {
                    // Make sure that the form isn't actually being sent.
                    e.preventDefault();
                    e.stopPropagation();
                    myDropzone.processQueue();
                });

                // Listen to the sendingmultiple event. In this case, it's the sendingmultiple event instead
                // of the sending event because uploadMultiple is set to true.
                this.on("sendingmultiple", function() {
                    // Gets triggered when the form is actually being sent.
                    // Hide the success button or the complete form.
                });
                this.on("successmultiple", function(files, response) {
                    // Gets triggered when the files have successfully been sent.
                    // Redirect user or notify of success.
                });
                this.on("errormultiple", function(files, response) {
                    // Gets triggered when there was an error sending the files.
                    // Maybe show form again, and notify user of error
                });
            }
        };
    </script>
    </head>
    <body>
        <g:if test="${flash.message}">
            ${flash.message}
        </g:if>
    <form enctype="multipart/form-data" action="${createLink(action: 'upload')}"
          class="dropzone" id="my-awesome-dropzone" method="post">
          <h1> For uploading Look CSV Files</h1>
        <div class="fallback">
            <input name="file" type="file" required="true"/>
            <g:actionSubmit value="Upload" />
        </div>
    </form>
    </body>
</html>