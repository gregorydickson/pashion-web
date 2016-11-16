<!DOCTYPE html>
<!-- index.gsp -->
<html>
  <head>
    <meta name="layout" content="header-and-footer" /> <!-- nee pashion -->
    <asset:stylesheet src="pashion/pashion.css"/>

    <title>PASHION Loading</title>
    
  </head>

  <body>
    <router-view class="grid-block">
      <div class="splash">
        <div class="message">Loading using Indigital Images</div>
        <i class="fa fa-spinner fa-spin"></i>
      </div>


      <script src="//messaging-public.realtime.co/js/2.1.0/ortc.js"></script>    
      <script src="/jspm_packages/system.js"></script>
      <script src="/config.js"></script>
      <script>
        System.import('aurelia-bootstrapper');
      </script>


    </router-view>
  </body>
</html>
