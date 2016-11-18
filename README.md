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


dev database on aws:
user: pashionweb
pass: ETWxa634WwxGaW6v
