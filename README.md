# Testing

* Test Miu Miu with miu@pashiontool.com / Pashion123

# Pashion 

To setup the Development Environment:

* Install Java 8 JDK on your system. JEnv is recommended if you need to switch between JVMs, for example between Java 7 & Java 8. However, it does complicate the environment for Grails somewhat as it requires a grails plugin to work with Grails. So only install if you know that you need multiple java virtual machines.

* Install SDKMan. It dramatically reduces the complexity of installing and upgrading Grails. http://sdkman.io/install.html

* With SDKMan installed, run 'sdk install grails 3.2.4' and let it set that version to be the default.

* Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the Aurelia build tooling runs.

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

* The application uses a database on Amazon AWS which will require internet connectivity. If this is too slow then you can setup MySQL locally.

## Install a javascript package

* We are using jspm and System.js to install and load javascript modules

* to install a new javascript package jspm must be used. Some packages exist in the jspm repository and some exist in the npm repository. First, try using jspm:

- from the src/main/webapp/ directory `jspm install <package>` if the package is not found, try with npm prefix `jspm install npm:<package>`

## Notes on app deployment
* The aurelia app can be bundled for a faster application load.
* The Stormpath library requires the Oracle JDK to support encryption. However, the default AMIs used in Elastic Beanstalk come with Open JDK. I have created a custom ami with Java 8 and an Elastic Beanstalk extention for setting the alternative JDK to support loading of the Stormpath library. The ami is name: java8_102_2nd_try, id: ami-600c5277 (in US East amazon).

## To Build and Deploy browse.pashiontool.com

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
* Ensure that you are in the EU (Ireland) data center, (in header, right side)
* Under the pashion-spa application, choose the browse-pashion environment.
* In the center of the screen, under where it says 'Running Version', click on Upload and Deploy. Note the existing version number of the application.
* Input a new version number by incrementing the last version number. Put this number into the Version Label.
* Click on 'Choose File' and navigate to your pashion-web/build/libs directory.
* Choose the 'pashion-web-0.1.war' file to upload.
* wait for the upload and allow about two to five minutes on the deployment and then check the site from a browser.
* The first time you access it, it might say 'Proxy Error'. Try again after two minutes.
* Revert the app.js to its previous state (Ctrl-Z in Sublime)
* run `gulp unbundle` in your gulp terminal to return to development mode. (then run `gulp watch`)
* to reboot and update the cache of themes and seasons use the Elastic beanstalk 'Restart Instances'

## Deployment of the Single Page Application 

### Notes 
* A custom Amazon Machine Image is required to run the application. This is because the default AMIs come with Open JDK. The StormPath JDK requires Oracle JDK: 
https://github.com/stormpath/stormpath-sdk-java/issues/17
* One custom AMI has been created and is in the US East and London regions. FYI, you can copy AMIs from region to region. And you have to in order to use them in other regions. http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/CopyingAMIs.html
* Instructions on using the Custom AMI in Elastic Beanstalk: http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.managing.ec2.html
* AMI Name: (java8_102_2nd_try)
* An elastic beanstalk extension is in src/main/webapp/.ebextensions that sets the Oracle JDK as the primary JDK in the machine image.
* The curent AMI is one that requires a certain type of virtualization and an m1 generation EC2 instance. An ec2 m1-small works but the m1 types are only available in certain regions.

### To deploy the application
* from your gulp terminal run `gulp bundle` (This is optional)
* from your grails terminal run `war`
* login to Amazon Web Services
* Under Services (in header, left side), choose Elastic Beanstalk
* Ensure that you are in Ireland region, (in header, right side)
* Under the pashion-spa application, choose the pashion-SpA environment
* In the center of the screen, under where it says 'Running Version', click on Upload and Deploy. Note the existing version number of the application.
* Input a new version number by incrementing the last version number. Put this number into the Version Label.
* Click on 'Choose File' and navigate to your pashion-web/build/libs directory.
* Choose the 'pashion-web-0.1.war' file to upload.
* wait for the upload and allow about two to five minutes on the deployment and then check the site from a browser.
* The first time you access it, it might say 'Proxy Error'. Try again after two minutes.
* If you bundled the application in the first step, run `gulp unbundle` in your gulp terminal to return to development mode. (then run `gulp watch`)


## Image Upload

### Image to S3 Process
1. Download all images in a Collection.
	1. In Google Drive, select all the images, right click > download.
	2. Expand the downloaded .zip file.
2. Resize images to 25%:
  1. (Mac workflow) Select all images in a finder window.
  2. right click (two finger tap) and choose open. The images should display in Preview.
  3. Click inside the left pane and then Cmd-A to select all images.
  4. Go to Tools > Adjust Size.
  5. Type 25 in Width input box (it will change Height to 25 also)
  6. Click OK, then close the window which will start the save process.
3. Copy rename.sh into the directory with the files and run it via the command line. Note: this can only be run on Collections that are not missing a Look (are sequentially numbered 1 to the final Look).
  1. If the Looks are not sequentially number, I have used the finder to rename them in the following process. In your open finder window, select all the files in the Collection then: File > Rename
  2. Example: SoniaRykiel_028_ss17.jpg. I take the initial string to remove, SoniaRykiel_ and replace it with 0, then I take the trailing part of the name that I want to remove, '_ss17' and replace it with nothing in the Replace With input box. The final files will be in the form of 0028.jpg.
4. In AWS, navigate to S3 (no region), enter the pashion-tool directory.
5. If the designer does not exist, create the folder structure: /sonia-rykiel/2017/spring/ready-to-wear/
6. In the appropriate directory (ready-to-wear) Choose: Actions > Upload, then drag files into the Drag and Drop area, select 'Start Uploading'
7. After uploading, select all the uploaded files in S3, then Choose: Actions > Make Public.


### CSV to Upload Process
1. Open Google Sheet.
2. Verify Path (Column AJ) is in the correct form: /sonia-rykiel/2017/spring/ready-to-wear/ and exists for all looks.
3. File > Download As > Comma Separated Values (.csv current sheet)
4. In a running instance of the application. (run with `grails>prod run` or at browse.pashiontool.com) go to /upload/ (http://browse.pashiontool.com/upload/ or http://localhost:8080/upload/)
5. Choose the City for the collection, then drag the CSV file to the 'Drop files here to Upload' area. The file will upload. You can view the command line to view debugging information on the upload. The code for this upload is in UploadController.groovy index() method.
6. You may verify the data by connecting to the database with Sequel Pro.
7. To prepare for the next upload, refresh the /upload/ screen in the browser.

### Verification
* You can verify the collection by viewing browse.pashiontool.com and selecting the designer (and Collection if neccessary). Verify that there are no broken images. In case of discrepancies, you may view the collection in Vogue Runway for comparison. Occasionally, the 'make public' portion in S3 has to be reapplied if you see errors in the javascript console 503 permission errors. 
* Broken images may indicate that there was a missing look image and the images, when renamed, are now out of sync with the Looks.
* I have noticed that even when there are missing images, we have data for the Look in the CSV
* In these instances of missing images. I have deleted the record in the Searchable_Items table so that errors do not appear in the Javascript console and broken images do not show in the user interface.



# Onboarding
 * Create Directory in StormPath for the Brand, put directory URI in the Brand's record in the table.
 * Create Group for the user type (Brand or Press). Add the application to the Group.
 * Create users with the page /users/create


# Databases

## Development Database - contains bookable samples for testing and development:
* pashionweb.c7nidmmcu7kv.us-east-1.rds.amazonaws.com:3306/pashionweb
* username: pashionweb
* password: ETWxa634WwxGaW6v


## browse.pashiontool.com and Production Single Page Application(SPA) DB, marked as Production in application.yml
* pashion-prod.cnjmlfc6tctw.eu-west-1.rds.amazonaws.com:3306/pashionprod
* username: pashionprod
* password: 2Mc9Nf17gBzyGs*a4$WS

