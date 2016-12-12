# Pashion 

To setup the Development Environment:

* Install Java 8 JDK on your system. JEnv is recommended if you need to switch between JVMs, for example between Java 7 & Java 8. However, it does complicate the environment for Grails somewhat as it requires a grails plugin to work with Grails. So only install if you know that you need multiple java virtual machines.

* Install SDKMan. It dramatically reduces the complexity of installing and upgrading Grails. http://sdkman.io/install.html

* With SDKMan installed, run 'sdk install grails 3.1.12' and let it set that version to be the default.

* git clone git@github.com:gregorydickson/pashion-web.git  (we will be moving to a Pashion account soon but for now use this git repository)

* open two terminal windows. In the first terminal window navigate to the root directory of the application and run 'grails', then 'run-app'

* in the second terminal window, navigate to src/main/webapp 

* run `npm install` to install the npm packages (assuming you already have npm installed). The JSPM packages are in the git repo and do not need to be installed. Some have been modified so do not run jspm.

* Ensure that Gulp is installed globally `npm install -g gulp`

* run `gulp build` to do an initial build, then run `gulp watch` to start developing. Gulp will re-build the project upon any file change.

* All of the Aurelia (Javascript) for the application lives under src/main/webapp/src

* The CSS/SCSS for the application lives under grails-app/assets/stylesheets/pashion and is built using the JVM Asset Pipeline.

* With the grails server running you can view the dashboard at: http://localhost:8080/ which will first require a login

* Press test user account: ellen@pashiontool.com / Pashion123 - Elle Magazine

* Brand test user account:  lauren@pashiontool.com / Pashion123 - Ralph Lauren

* Brand test user account: paco@pashiontool.com / Pashion123 - Paco Rabanne

* The application uses a development database on Amazon AWS which will require internet connectivity. If this is too slow then you can setup MySQL locally.

# Install a javascript package

* We are using jspm and System.js to install and load javascript modules

* to install a new javascript package jspm must be used. Some packages exist in the jspm repository and some exist in the npm repository. First, try using jspm:

- from the src/main/webapp/ directory `jspm install <package>` if the package is not found, try with npm prefix `jspm install npm:<package>`

# Notes on app deployment
* The aurelia app can be bundled for a faster application load.
* The Stormpath library requires the Oracle JDK to support encryption. However, the default AMIs used in Elastic Beanstalk come with Open JDK. I have created a custom ami with Java 8 and an Elastic Beanstalk extention for setting the alternative JDK to support loading of the Stormpath library. The ami is name: java8_102_2nd_try, id: ami-600c5277.

# To Build and Deploy browse.pashiontool.com

* Go into app.js and change:
```
 { route: ['', '/'],       name: 'index',       moduleId: 'index' },
```
  to
```
 { route: ['', '/'],       name: 'guestpage',       moduleId: 'guestpage' },
```
* from your gulp terminal run `gulp bundle`
* from your grails terminal run `war`
* login to Amazon Web Services
* Under Services (in header, left side), choose Elastic Beanstalk
* Ensure that you are in the US East (North Virginia), (in header, right side)
* Under the pashion-dev application, choose the pashion environment (the only green box on the screen, it should not say 'prod' anywhere)
* In the center of the screen, under where it says 'Running Version', click on Upload and Deploy. Note the existing version number of the application.
* Input a new version number by incrementing the last version number. Put this number into the Version Label.
* Click on 'Choose File' and navigate to your pashion-web/build/libs directory.
* Choose the 'pashion-web-0.1.war' file to upload.
* wait for the upload and allow about two to five minutes on the deployment and then check the site from a browser.
* The first time you access it, it might say 'Proxy Error'. Try again after two minutes.
* Revert the app.js to its previous state (Ctrl-Z in Sublime)
* run `gulp unbundle` in your gulp terminal to return to development mode. (then run `gulp watch`)


dev database on aws:
user: pashionweb
pass: ETWxa634WwxGaW6v
