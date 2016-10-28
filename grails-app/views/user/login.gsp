<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link rel='shortcut icon' type='image/x-icon' href='${createLinkTo(dir:'images',file:'pashion.ico')}' />
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link href="https://fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet">

    <meta name="layout" content="header-and-footer"/>

    
    
    <asset:stylesheet src="pashion/pashion.css"/>
    <asset:stylesheet src="pashion/login.css"/>

   

    <title>User Login</title>
</head>
<body>

    <!-- Main Body -->
        <router-view class="grid-block  login-background">                
            <div class="ai-dialog" style="width: auto;">

                <!-- dialog header -->
                <div class="ai-dialog-header">
                    <div class="grid-block align-center tool-header shrink ">
                        <div id="" class="grid-block tool-header shrink">
                            <span class="ui-text-label-m-broad">LOGIN </span> 
                        </div>
                    </div>
                </div> <!-- ai-dialog-header -->

                <!-- error messages -->
                <div class="">
                    <g:if test="${flash.message}">
                        <div class="message" role="status">${flash.message}</div>
                    </g:if>
                </div>

                <!-- dialog body-->
                <g:form action="doLogin" method="post">
                    <div class="ai-dialog-body">
                    <div class="vertical grid-block">
                        <div class="grid-content shrink" style="margin-top: 1rem;">
                            <span class="inline-label">
                                <span class="form-label">Username</span>
                                <input id="email" type='text' name='email' value='${user?.email}'>
                            </span>
                        </div>
                        <div class="grid-content shrink" style="margin-top: 1rem;">
                               
                            <span class="inline-label">
                                <span class="form-label">Password</span>
                                <input id="password" type='password' name='password' value='${user?.password}'/>
                            </span>
                        </div>
                    </div>
                    </div> <!-- ai-dialog-body -->

                    <!-- Dialog Footer button -->
                    <div class="ai-dialog-footer">
                        <input class="button" type="submit" value="Login"></input>
                    </div> <!-- ai-dialog-footer> -->

                </g:form>
            </div> <!-- ai-dialog -->
        </router-view>
    
</body>
</html>
