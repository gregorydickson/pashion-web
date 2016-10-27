<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link rel='shortcut icon' type='image/x-icon' href='${createLinkTo(dir:'images',file:'pashion.ico')}' />
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link href="https://fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet">
    <asset:stylesheet src="pashion/login.css"/>
    <asset:stylesheet src="pashion/pashion.css"/>

    <title>User Login</title>
</head>
<body>

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

    <!-- Main Body -->

    <router-view class="grid-block">
   </router-view>
    
    <div class="body">
        <g:form action="doLogin" method="post">
            <div class="dialog">
                <p>Enter your login details below:</p>
                <g:if test="${flash.message}">
                    <div class="message" role="status">${flash.message}</div>
                </g:if>
                <table class="userForm">
                    <tr class='prop'>
                        <td valign='top' style='text-align:left;' width='20%'>
                            <label for='email'>Email:</label>
                        </td>
                        <td valign='top' style='text-align:left;' width='80%'>
                            <input id="email" type='text' name='email' value='${user?.email}'/>
                        </td>
                    </tr>
                    <tr class='prop'>
                        <td valign='top' style='text-align:left;' width='20%'>
                            <label for='password'>Password:</label>
                        </td>
                        <td valign='top' style='text-align:left;' width='80%'>
                            <input id="password" type='password' name='password' value='${user?.password}'/>
                        </td>
                    </tr>

                </table>
            </div>
            <div class="buttons">
                <span class="formButton">
                    <input type="submit" value="Login"></input>
                </span>
            </div>
        </g:form>
    </div>
    <!-- footer -->
    <compose view-model="footer"></compose>  
    
</body>
</html>
