<!DOCTYPE html>
<!-- index.gsp -->
<html>
  <head>
    <meta name="layout" content="header-and-footer-guestpage" /> <!-- nee pashion -->
    <asset:stylesheet src="pashion/pashion.css"/>    
    <asset:stylesheet src="pashion/splash.css"/>    


    <title>Loading Pashion Browser</title>
    
  </head>

  <body>
    <router-view class="grid-block">
      <div class="splash">
        <div class="message">Loading using Indigital Images</div>
       <!-- <div class="spinner"> </div> -->
      </div>
      


    <!--  <script src="//messaging-public.realtime.co/js/2.1.0/ortc.js"></script>  -->
      <script src="https://cdn.pubnub.com/sdk/javascript/pubnub.4.3.2.js"></script>  
      <script src="/jspm_packages/system.js"></script>
      <script src="/config.js"></script>
      <script>
        System.import('aurelia-bootstrapper');
      </script>


    </router-view>
  </body>
</html>
