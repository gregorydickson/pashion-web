<!DOCTYPE html>
<!-- index.gsp -->
<html>
  <head>
    <meta name="layout" content="header-and-footer-guestpage" /> <!-- nee pashion -->
    <asset:stylesheet src="pashion/pashion.css"/>    
    <asset:stylesheet src="pashion/splash.css"/>   
    <asset:stylesheet src="pashion/toastr.css"/>    
    <link rel="dns-prefetch" href="//dvch4zq3tq7l4.cloudfront.net">
    <link rel="preconnect" href="//dvch4zq3tq7l4.cloudfront.net" crossorigin>

    <title>Loading Pashion</title>
    
  </head>

  <body>
    <router-view class="grid-block">
      <div class="splash">
        <div class="message">Loading using Indigital Images</div>
       <!-- <div class="spinner"> </div> -->
      </div>
      

      <script src="https://cdn.pubnub.com/sdk/javascript/pubnub.4.4.4.min.js"></script>  
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.3/jspdf.debug.js"></script>
      <script src="/jspm_packages/system.js"></script>
      <script src="//cdn.jsdelivr.net/blazy/latest/blazy.min.js"></script>
      <script src="/config.js"></script>
      <script src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>

      <script src="/src/common/toastr.js"></script>
      <script>
        System.import('aurelia-bootstrapper');
      </script>


    </router-view>
  </body>
</html>
