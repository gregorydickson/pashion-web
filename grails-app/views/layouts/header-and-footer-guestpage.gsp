<!DOCTYPE html>
<html>

<head>
    <title>
        <g:layoutTitle default="Grails" />
    </title>
    <g:layoutHead/>
    <link rel='shortcut icon' type='image/x-icon' href='${createLinkTo(dir:'images',file:'pashion.ico')}' />
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-86865308-1', 'auto');
      ga('send', 'pageview');

    </script>
</head>

<body aurelia-app="main">
    <!-- page frame -->
    <div class="grid-frame vertical">
        <!-- Header -->
        
            <ul class="menu-bar" style="background: #ebebeb">
              
                           
                   <!--  <select value.bind="selectval" change.trigger="logout()" name="LAUREN" id="headerModeSelect" class="nav-label-header top-menu-modifier">
                        <option value="no">GUEST</option>
                        <option value= "logout">LOGOUT</option>
                    </select> -->
                    <li></li>
                    <li>
                        <a href="http://www.pashiontool.com/beta" target="_blank" style="padding-top:25px; align-items: flex-start;">JOIN PASHION</a>
                    </li>
                <li></li>
                   
                    <li>
                        <a href="http://www.pashiontool.com" target="_blank"><img src="/assets/PashionRMPlainBlackTag.png" style="max-width:312px; " /></a>
                    </li>
                  <li></li> 
                  
                    <li>
                        <a href="http://www.pashiontool.com" target="_blank" style="padding-top:25px; align-items: flex-end;">HOMEPAGE</a>
                    </li>
                    <li></li>
                               
               
            </ul>
        
        <!-- body -->
        <g:layoutBody/>
        <!-- footer -->
        <div class="footer title-bar">
            <div class="center nav-label-footer">      
                <span class="copyright">&copy;2016 PASHION Ltd. All Rights Reserved.</span>
            </div>
            <div class="left nav-label-footer">       
                <!-- <span style="margin-right: 0.5rem;"><a href="http://www.pashiontool.com" target="_blank">ABOUT</a></span> -->
                <span style="margin-right: 0.5rem;"><a href="mailto:info@pashiontool.com?Subject=Hello" target="_blank">CONTACT</a></span>
                <span style="margin-right: 0.5rem;"><a href="http://www.pashiontool.com" target="_blank">NEWSLETTER</a></span>
                <a style="margin-right: 0.5rem;" href="http://www.indigitalimages.com" target="_blank"><img src="/assets/indigitalimages_logo.png" style="width:120px; height:auto;" /></a> 
            </div>
            <!-- <span class="left nav-label-footer"><a href="#">CONTACT</a></span> -->
            <div class="right nav-label-footer">
                 <span class="right" ><a href="#" click.delegate="launchChat()">LIVE CHAT</a></span>
             </div>
        </div>
    <div>
</body>

</html>
