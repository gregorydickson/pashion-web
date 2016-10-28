<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link rel='shortcut icon' type='image/x-icon' href='${createLinkTo(dir:'images',file:'pashion.ico')}' />
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link href="https://fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet">

    <meta name="layout" content="header-and-footer"/>

    
    <asset:stylesheet src="pashion/login.css"/>
    <asset:stylesheet src="pashion/pashion.scss"/>
    <asset:stylesheet src="pashion/pashion_components/_dialog.scss"/>
    <asset:stylesheet src="pashion/_settings.scss"/>
   

    <title>User Login</title>
</head>
<body>


    <!-- Main Body -->
        <router-view class="grid-block vertical">
            <div class="body grid-content"></div>
            <div class="grid-block">
                <div class="grid-content"></div>
                <div class="body grid-content">
                <g:form action="doLogin" method="post" style="    width: 200px;
    border: 0.5px solid lightgray;
    padding: 2rem;">
                    <div class="ai-dialog">
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
                    <div>

                            <input class="button" type="submit" value="Login"></input>

                    </div>
                </g:form>
                </div>
                <div class="body grid-content"></div>
            </div>
            <div class="grid-content"></div>

        </router-view>
    
</body>
</html>
