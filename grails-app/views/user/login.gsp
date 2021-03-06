<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link rel='shortcut icon' type='image/x-icon' href='${createLinkTo(dir:'images',file:'pashion.ico')}' />
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link href="https://fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet">

    <meta name="layout" content="header-and-footer"/>
    
    <asset:stylesheet src="pashion/pashion.css"/>
    <asset:stylesheet src="pashion/login.css"/>
    <asset:javascript src="login.js"/>


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
                        <div class="message" style="color:red; text-align: center; margin-top: 2rem;" role="status">${flash.message}</div>
                    </g:if>
                </div>

                <!-- dialog body-->
                <g:form action="doLogin" name="login" method="post">
                    <div class="ai-dialog-body">
                        <div class="vertical grid-block">

                            <!-- Username -->
                            <div class="grid-content shrink" >
                                <span class="inline-label">
                                    <span class="slim-text-box-label">Username</span>
                                    <input id="email" type='text' name='email' value='${user?.email}'>
                                </span>
                            </div>

                            <!-- Password -->
                            <div class="grid-content shrink" >
                                <span class="inline-label">
                                    <span class="slim-text-box-label">Password</span>
                                    <input id="password" type='password' name='password' value='${user?.password}'/>
                                    <a id="password-word" style= "width: 30px; margin-left: 1rem;" href="javascript:hide_un_hide_password()" style="">Show</a>
                                </span>
                            </div>
                        </div>

                        <!-- Role
                        <div class="grid-content shrink" >
                            <span class="inline-label">
                                <span class="slim-text-box-label">Role</span>
                            <select name="" id="" value.bind="selectedSample">
                                <option value="">Brand</option>
                                <option value="">Press</option>
                                <option value="">Administrator</option>
                            </select>
                            <a style= "width: 30px; margin-left: 1rem;" href="#" style=""><img src="/assets/QuestionMark.png" /></a>
                            </span>
                        </div>
                        -->


                    </div> <!-- ai-dialog-body -->
                

                    <!-- Dialog Footer button -->
                    <div class="ai-dialog-footer">
                        <div class="grid-block vertical">
                            <div class="grid-content">
                                <input style="margin-top: 0.5rem; margin-left:7px;" class="button" type="submit" value="Log Me In"></input>
                            </div>
                </g:form >
                            <a href="javascript:request_access()" target:blank style="margin-top: 1rem; margin-bottom:20px;">Request Access</a>
                            <!-- <a href="#" style="margin-top: 0.5rem;">Help Getting Started</a> -->
                          <!--  <form style="margin-top: 0.5rem;" action="/user/guest" method="post" id="2">
                                <a  onclick="document.getElementById('2').submit();">Continue as Guest</a>
                            </form> -->
                        </div>
                    </div> <!-- ai-dialog-footer> -->
                
            </div> <!-- ai-dialog -->
        </router-view>
    
</body>
</html>
