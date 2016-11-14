<!DOCTYPE html>
<html>

<head>
    <title>
        <g:layoutTitle default="Grails" />
    </title>
    <g:layoutHead/>
    <link rel='shortcut icon' type='image/x-icon' href='${createLinkTo(dir:'images',file:'pashion.ico')}' />
</head>

<body aurelia-app="main">
    <!-- page frame -->
    <div class="grid-frame vertical">
        <!-- Header -->
        <div class="">
            <ul class="menu-bar dark">
                <li>
                    <select name="LAUREN" id="headerModeSelect" class="nav-label-header top-menu-modifier" style="margin-left:64px;">
                        <option>LOGIN</option>
                    </select>
                    <li></li>
                    <li></li>
                    <li>
                        <a href="#"><img src="/assets/PashionRMPlainWhite.png" width="127px" /></a>
                    </li>
                    <li></li>
                    <li></li>
                    <li>
                    </li>
                </li>
            </ul>
        </div>
        <!-- body -->
        <g:layoutBody/>
        <!-- footer -->
        <div class="footer dark title-bar">
            <div class="left nav-label-footer">
                <span style="margin-right: 1rem;"><a class="inactiveLink" href="#">HELP</a></span>
                <span style="margin-right: 1rem;"><a class="inactiveLink" href="#">ABOUT</a></span>
                <span style="margin-right: 1rem;"><a class="inactiveLink" href="#">CONTACT</a></span>
                <a href="#"><img src="/assets/indigitalimages_logo.png" style="width:120px; height:auto;" /></a>
            </div>
            <!-- <span class="left nav-label-footer"><a href="#">CONTACT</a></span> -->
            <span class="right copyright">Copyright 2016 PASHION Ltd. All Rights Reserved.</a></span>
        </div>
    <div>
</body>

</html>
