<!DOCTYPE html>
<html>
  <head>
    <meta name="layout" content="dashboard" />
    <title>Aurelia 3</title>
    <!--The FontAwesome version is locked at 4.6.3 in the package.json file to keep this from breaking.-->
    <link rel="stylesheet" href="/jspm_packages/npm/font-awesome@4.6.3/css/font-awesome.min.css">
    <link rel="stylesheet" href="/styles/styles.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>

  <body>
    <div class="splash">
      <div class="message">Loading</div>
      <i class="fa fa-spinner fa-spin"></i>
    </div>

  
    <script src="/jspm_packages/system.js"></script>
    <script src="/config.js"></script>
    <script>
      System.import('aurelia-bootstrapper');
    </script>
  </body>
</html>
