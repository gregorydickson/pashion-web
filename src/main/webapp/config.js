System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: false,
  paths: {
    "*": "dist/*",
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },
  map: {
    "aurelia-animator-css": "npm:aurelia-animator-css@1.0.0",
    "aurelia-bootstrapper": "npm:aurelia-bootstrapper@1.0.0",
    "aurelia-dialog": "npm:aurelia-dialog@1.0.0-beta.3.0.0",
    "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.0",
    "aurelia-fetch-client": "npm:aurelia-fetch-client@1.0.0",
    "aurelia-framework": "npm:aurelia-framework@1.0.5",
    "aurelia-history-browser": "npm:aurelia-history-browser@1.0.0",
    "aurelia-loader-default": "npm:aurelia-loader-default@1.0.0",
    "aurelia-logging-console": "npm:aurelia-logging-console@1.0.0",
    "aurelia-pal": "npm:aurelia-pal@1.1.1",
    "aurelia-pal-browser": "npm:aurelia-pal-browser@1.0.0",
    "aurelia-plugins-cookies": "npm:aurelia-plugins-cookies@1.3.0",
    "aurelia-plugins-tabs": "npm:aurelia-plugins-tabs@1.2.0",
    "aurelia-polyfills": "npm:aurelia-polyfills@1.0.0",
    "aurelia-router": "npm:aurelia-router@1.0.2",
    "aurelia-templating-binding": "npm:aurelia-templating-binding@1.0.0",
    "aurelia-templating-resources": "npm:aurelia-templating-resources@1.0.0",
    "aurelia-templating-router": "npm:aurelia-templating-router@1.0.0",
    "aurelia-ui-virtualization": "npm:aurelia-ui-virtualization@1.0.0-beta.3.0.1",
    "bluebird": "npm:bluebird@3.4.1",
    "bootstrap": "github:twbs/bootstrap@3.3.7",
    "bootstrap-datepicker": "npm:bootstrap-datepicker@1.6.4",
    "fetch": "github:github/fetch@1.0.0",
    "font-awesome": "npm:font-awesome@4.6.3",
    "jquery": "npm:jquery@3.1.1",
    "jquery-ui": "github:components/jqueryui@1.12.1",
    "moment": "npm:moment@2.15.1",
    "nodep-date-input-polyfill": "npm:nodep-date-input-polyfill@4.0.6",
    "select2": "github:select2/select2@3.5.4",
    "text": "github:systemjs/plugin-text@0.0.8",
    "github:components/jqueryui@1.12.1": {
      "jquery": "npm:jquery@3.1.1"
    },
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.4.1"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.6.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.9"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:jspm/nodelibs-vm@0.1.0": {
      "vm-browserify": "npm:vm-browserify@0.0.4"
    },
    "github:select2/select2@3.5.4": {
      "css": "github:systemjs/plugin-css@0.1.32",
      "jquery": "npm:jquery@3.1.1"
    },
    "github:twbs/bootstrap@3.3.7": {
      "jquery": "npm:jquery@3.1.1"
    },
    "npm:assert@1.4.1": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "npm:util@0.10.3"
    },
    "npm:aurelia-animator-css@1.0.0": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.2",
      "aurelia-pal": "npm:aurelia-pal@1.1.1",
      "aurelia-templating": "npm:aurelia-templating@1.1.2"
    },
    "npm:aurelia-binding@1.0.9": {
      "aurelia-logging": "npm:aurelia-logging@1.1.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.2",
      "aurelia-pal": "npm:aurelia-pal@1.1.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.1.0"
    },
    "npm:aurelia-bootstrapper@1.0.0": {
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.0",
      "aurelia-framework": "npm:aurelia-framework@1.0.5",
      "aurelia-history": "npm:aurelia-history@1.0.0",
      "aurelia-history-browser": "npm:aurelia-history-browser@1.0.0",
      "aurelia-loader-default": "npm:aurelia-loader-default@1.0.0",
      "aurelia-logging-console": "npm:aurelia-logging-console@1.0.0",
      "aurelia-pal": "npm:aurelia-pal@1.1.1",
      "aurelia-pal-browser": "npm:aurelia-pal-browser@1.0.0",
      "aurelia-polyfills": "npm:aurelia-polyfills@1.0.0",
      "aurelia-router": "npm:aurelia-router@1.0.2",
      "aurelia-templating": "npm:aurelia-templating@1.1.2",
      "aurelia-templating-binding": "npm:aurelia-templating-binding@1.0.0",
      "aurelia-templating-resources": "npm:aurelia-templating-resources@1.0.0",
      "aurelia-templating-router": "npm:aurelia-templating-router@1.0.0"
    },
    "npm:aurelia-dependency-injection@1.2.0": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.2",
      "aurelia-pal": "npm:aurelia-pal@1.1.1"
    },
    "npm:aurelia-dialog@1.0.0-beta.3.0.0": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.2.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.2",
      "aurelia-pal": "npm:aurelia-pal@1.1.1",
      "aurelia-templating": "npm:aurelia-templating@1.1.2"
    },
    "npm:aurelia-event-aggregator@1.0.0": {
      "aurelia-logging": "npm:aurelia-logging@1.1.1"
    },
    "npm:aurelia-framework@1.0.5": {
      "aurelia-binding": "npm:aurelia-binding@1.0.9",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.2.0",
      "aurelia-loader": "npm:aurelia-loader@1.0.0",
      "aurelia-logging": "npm:aurelia-logging@1.1.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.2",
      "aurelia-pal": "npm:aurelia-pal@1.1.1",
      "aurelia-path": "npm:aurelia-path@1.1.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.1.0",
      "aurelia-templating": "npm:aurelia-templating@1.1.2"
    },
    "npm:aurelia-history-browser@1.0.0": {
      "aurelia-history": "npm:aurelia-history@1.0.0",
      "aurelia-pal": "npm:aurelia-pal@1.1.1"
    },
    "npm:aurelia-loader-default@1.0.0": {
      "aurelia-loader": "npm:aurelia-loader@1.0.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.2",
      "aurelia-pal": "npm:aurelia-pal@1.1.1"
    },
    "npm:aurelia-loader@1.0.0": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.2",
      "aurelia-path": "npm:aurelia-path@1.1.1"
    },
    "npm:aurelia-logging-console@1.0.0": {
      "aurelia-logging": "npm:aurelia-logging@1.1.1"
    },
    "npm:aurelia-metadata@1.0.2": {
      "aurelia-pal": "npm:aurelia-pal@1.1.1"
    },
    "npm:aurelia-pal-browser@1.0.0": {
      "aurelia-pal": "npm:aurelia-pal@1.1.1"
    },
    "npm:aurelia-plugins-tabs@1.2.0": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.2.0",
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.0",
      "aurelia-templating": "npm:aurelia-templating@1.1.2"
    },
    "npm:aurelia-polyfills@1.0.0": {
      "aurelia-pal": "npm:aurelia-pal@1.1.1"
    },
    "npm:aurelia-route-recognizer@1.0.0": {
      "aurelia-path": "npm:aurelia-path@1.1.1"
    },
    "npm:aurelia-router@1.0.2": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.2.0",
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.0",
      "aurelia-history": "npm:aurelia-history@1.0.0",
      "aurelia-logging": "npm:aurelia-logging@1.1.1",
      "aurelia-path": "npm:aurelia-path@1.1.1",
      "aurelia-route-recognizer": "npm:aurelia-route-recognizer@1.0.0"
    },
    "npm:aurelia-task-queue@1.1.0": {
      "aurelia-pal": "npm:aurelia-pal@1.1.1"
    },
    "npm:aurelia-templating-binding@1.0.0": {
      "aurelia-binding": "npm:aurelia-binding@1.0.9",
      "aurelia-logging": "npm:aurelia-logging@1.1.1",
      "aurelia-templating": "npm:aurelia-templating@1.1.2"
    },
    "npm:aurelia-templating-resources@1.0.0": {
      "aurelia-binding": "npm:aurelia-binding@1.0.9",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.2.0",
      "aurelia-loader": "npm:aurelia-loader@1.0.0",
      "aurelia-logging": "npm:aurelia-logging@1.1.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.2",
      "aurelia-pal": "npm:aurelia-pal@1.1.1",
      "aurelia-path": "npm:aurelia-path@1.1.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.1.0",
      "aurelia-templating": "npm:aurelia-templating@1.1.2"
    },
    "npm:aurelia-templating-router@1.0.0": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.2.0",
      "aurelia-logging": "npm:aurelia-logging@1.1.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.2",
      "aurelia-pal": "npm:aurelia-pal@1.1.1",
      "aurelia-path": "npm:aurelia-path@1.1.1",
      "aurelia-router": "npm:aurelia-router@1.0.2",
      "aurelia-templating": "npm:aurelia-templating@1.1.2"
    },
    "npm:aurelia-templating@1.1.2": {
      "aurelia-binding": "npm:aurelia-binding@1.0.9",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.2.0",
      "aurelia-loader": "npm:aurelia-loader@1.0.0",
      "aurelia-logging": "npm:aurelia-logging@1.1.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.2",
      "aurelia-pal": "npm:aurelia-pal@1.1.1",
      "aurelia-path": "npm:aurelia-path@1.1.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.1.0"
    },
    "npm:aurelia-ui-virtualization@1.0.0-beta.3.0.1": {
      "aurelia-binding": "npm:aurelia-binding@1.0.9",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.2.0",
      "aurelia-framework": "npm:aurelia-framework@1.0.5",
      "aurelia-logging": "npm:aurelia-logging@1.1.1",
      "aurelia-logging-console": "npm:aurelia-logging-console@1.0.0",
      "aurelia-pal": "npm:aurelia-pal@1.1.1",
      "aurelia-path": "npm:aurelia-path@1.1.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.1.0",
      "aurelia-templating": "npm:aurelia-templating@1.1.2",
      "aurelia-templating-resources": "npm:aurelia-templating-resources@1.0.0"
    },
    "npm:babel-runtime@6.11.6": {
      "core-js": "npm:core-js@2.4.1",
      "regenerator-runtime": "npm:regenerator-runtime@0.9.5"
    },
    "npm:bluebird@3.4.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:bootstrap-datepicker@1.6.4": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "jquery": "npm:jquery@3.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:buffer@3.6.0": {
      "base64-js": "npm:base64-js@0.0.8",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ieee754": "npm:ieee754@1.1.6",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:core-js@2.4.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:font-awesome@4.6.3": {
      "css": "github:systemjs/plugin-css@0.1.32"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:nodep-date-input-polyfill@4.0.6": {
      "babel-runtime": "npm:babel-runtime@6.11.6",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.9": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:regenerator-runtime@0.9.5": {
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:vm-browserify@0.0.4": {
      "indexof": "npm:indexof@0.0.1"
    }
  },
  bundles: {
    "aurelia.js": [
      "github:github/fetch@1.0.0.js",
      "github:github/fetch@1.0.0/fetch.js",
      "github:twbs/bootstrap@3.3.7.js",
      "github:twbs/bootstrap@3.3.7/css/bootstrap.css!github:systemjs/plugin-text@0.0.8.js",
      "github:twbs/bootstrap@3.3.7/js/bootstrap.js",
      "npm:aurelia-animator-css@1.0.0.js",
      "npm:aurelia-animator-css@1.0.0/aurelia-animator-css.js",
      "npm:aurelia-binding@1.0.9.js",
      "npm:aurelia-binding@1.0.9/aurelia-binding.js",
      "npm:aurelia-bootstrapper@1.0.0.js",
      "npm:aurelia-bootstrapper@1.0.0/aurelia-bootstrapper.js",
      "npm:aurelia-dependency-injection@1.2.0.js",
      "npm:aurelia-dependency-injection@1.2.0/aurelia-dependency-injection.js",
      "npm:aurelia-event-aggregator@1.0.0.js",
      "npm:aurelia-event-aggregator@1.0.0/aurelia-event-aggregator.js",
      "npm:aurelia-fetch-client@1.0.0.js",
      "npm:aurelia-fetch-client@1.0.0/aurelia-fetch-client.js",
      "npm:aurelia-framework@1.0.5.js",
      "npm:aurelia-framework@1.0.5/aurelia-framework.js",
      "npm:aurelia-history-browser@1.0.0.js",
      "npm:aurelia-history-browser@1.0.0/aurelia-history-browser.js",
      "npm:aurelia-history@1.0.0.js",
      "npm:aurelia-history@1.0.0/aurelia-history.js",
      "npm:aurelia-loader-default@1.0.0.js",
      "npm:aurelia-loader-default@1.0.0/aurelia-loader-default.js",
      "npm:aurelia-loader@1.0.0.js",
      "npm:aurelia-loader@1.0.0/aurelia-loader.js",
      "npm:aurelia-logging-console@1.0.0.js",
      "npm:aurelia-logging-console@1.0.0/aurelia-logging-console.js",
      "npm:aurelia-logging@1.1.1.js",
      "npm:aurelia-logging@1.1.1/aurelia-logging.js",
      "npm:aurelia-metadata@1.0.2.js",
      "npm:aurelia-metadata@1.0.2/aurelia-metadata.js",
      "npm:aurelia-pal-browser@1.0.0.js",
      "npm:aurelia-pal-browser@1.0.0/aurelia-pal-browser.js",
      "npm:aurelia-pal@1.1.1.js",
      "npm:aurelia-pal@1.1.1/aurelia-pal.js",
      "npm:aurelia-path@1.1.1.js",
      "npm:aurelia-path@1.1.1/aurelia-path.js",
      "npm:aurelia-polyfills@1.0.0.js",
      "npm:aurelia-polyfills@1.0.0/aurelia-polyfills.js",
      "npm:aurelia-route-recognizer@1.0.0.js",
      "npm:aurelia-route-recognizer@1.0.0/aurelia-route-recognizer.js",
      "npm:aurelia-router@1.0.2.js",
      "npm:aurelia-router@1.0.2/aurelia-router.js",
      "npm:aurelia-task-queue@1.1.0.js",
      "npm:aurelia-task-queue@1.1.0/aurelia-task-queue.js",
      "npm:aurelia-templating-binding@1.0.0.js",
      "npm:aurelia-templating-binding@1.0.0/aurelia-templating-binding.js",
      "npm:aurelia-templating-resources@1.0.0.js",
      "npm:aurelia-templating-resources@1.0.0/abstract-repeater.js",
      "npm:aurelia-templating-resources@1.0.0/analyze-view-factory.js",
      "npm:aurelia-templating-resources@1.0.0/array-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.0.0/aurelia-hide-style.js",
      "npm:aurelia-templating-resources@1.0.0/aurelia-templating-resources.js",
      "npm:aurelia-templating-resources@1.0.0/binding-mode-behaviors.js",
      "npm:aurelia-templating-resources@1.0.0/binding-signaler.js",
      "npm:aurelia-templating-resources@1.0.0/compose.js",
      "npm:aurelia-templating-resources@1.0.0/css-resource.js",
      "npm:aurelia-templating-resources@1.0.0/debounce-binding-behavior.js",
      "npm:aurelia-templating-resources@1.0.0/dynamic-element.js",
      "npm:aurelia-templating-resources@1.0.0/focus.js",
      "npm:aurelia-templating-resources@1.0.0/hide.js",
      "npm:aurelia-templating-resources@1.0.0/html-resource-plugin.js",
      "npm:aurelia-templating-resources@1.0.0/html-sanitizer.js",
      "npm:aurelia-templating-resources@1.0.0/if.js",
      "npm:aurelia-templating-resources@1.0.0/map-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.0.0/null-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.0.0/number-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.0.0/repeat-strategy-locator.js",
      "npm:aurelia-templating-resources@1.0.0/repeat-utilities.js",
      "npm:aurelia-templating-resources@1.0.0/repeat.js",
      "npm:aurelia-templating-resources@1.0.0/replaceable.js",
      "npm:aurelia-templating-resources@1.0.0/sanitize-html.js",
      "npm:aurelia-templating-resources@1.0.0/set-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.0.0/show.js",
      "npm:aurelia-templating-resources@1.0.0/signal-binding-behavior.js",
      "npm:aurelia-templating-resources@1.0.0/throttle-binding-behavior.js",
      "npm:aurelia-templating-resources@1.0.0/update-trigger-binding-behavior.js",
      "npm:aurelia-templating-resources@1.0.0/with.js",
      "npm:aurelia-templating-router@1.0.0.js",
      "npm:aurelia-templating-router@1.0.0/aurelia-templating-router.js",
      "npm:aurelia-templating-router@1.0.0/route-href.js",
      "npm:aurelia-templating-router@1.0.0/route-loader.js",
      "npm:aurelia-templating-router@1.0.0/router-view.js",
      "npm:aurelia-templating@1.1.2.js",
      "npm:aurelia-templating@1.1.2/aurelia-templating.js",
      "npm:jquery@3.1.1.js",
      "npm:jquery@3.1.1/dist/jquery.js"
    ],
    "app-build.js": [
      "add_files/add_files.html!github:systemjs/plugin-text@0.0.8.js",
      "add_files/add_files.js",
      "admin/dialogImportUsers.html!github:systemjs/plugin-text@0.0.8.js",
      "admin/dialogImportUsers.js",
      "admin/dialogNewOffice.html!github:systemjs/plugin-text@0.0.8.js",
      "admin/dialogNewOffice.js",
      "admin/dialogNewUser.html!github:systemjs/plugin-text@0.0.8.js",
      "admin/dialogNewUser.js",
      "adminpage.html!github:systemjs/plugin-text@0.0.8.js",
      "adminpage.js",
      "app.html!github:systemjs/plugin-text@0.0.8.js",
      "app.js",
      "brand/createAddress.html!github:systemjs/plugin-text@0.0.8.js",
      "brand/createAddress.js",
      "calendar.html!github:systemjs/plugin-text@0.0.8.js",
      "calendar.js",
      "calendars/datepicker.js",
      "calendars/requestCalendar.html!github:systemjs/plugin-text@0.0.8.js",
      "calendars/requestCalendar.js",
      "common/customSelect.html!github:systemjs/plugin-text@0.0.8.js",
      "common/customSelect.js",
      "common/dateFormat.js",
      "common/jquery.unveil.js",
      "common/viewDateFormatter.js",
      "common/viewDateFullFormatter.js",
      "common/viewDateTimeFormatter.js",
      "comms/commsBody.html!github:systemjs/plugin-text@0.0.8.js",
      "comms/commsBody.js",
      "comms/commsFooter.html!github:systemjs/plugin-text@0.0.8.js",
      "comms/commsFooter.js",
      "comms/commsHeader.html!github:systemjs/plugin-text@0.0.8.js",
      "comms/commsHeader.js",
      "contacts/contactEntryMessage.html!github:systemjs/plugin-text@0.0.8.js",
      "contacts/contactEntryMessage.js",
      "contacts/contactsHeader.html!github:systemjs/plugin-text@0.0.8.js",
      "contacts/contactsHeader.js",
      "contacts/contactsList.html!github:systemjs/plugin-text@0.0.8.js",
      "contacts/contactsList.js",
      "contacts/dialogConfirmDelete.html!github:systemjs/plugin-text@0.0.8.js",
      "contacts/dialogConfirmDelete.js",
      "contacts/dialogEditContact.html!github:systemjs/plugin-text@0.0.8.js",
      "contacts/dialogEditContact.js",
      "contacts/dialogImportContacts.html!github:systemjs/plugin-text@0.0.8.js",
      "contacts/dialogImportContacts.js",
      "contacts/dialogNewContact.html!github:systemjs/plugin-text@0.0.8.js",
      "contacts/dialogNewContact.js",
      "contacts/dialogRequestContact.html!github:systemjs/plugin-text@0.0.8.js",
      "contacts/dialogRequestContact.js",
      "contacts/dialogUpdatePhoto.html!github:systemjs/plugin-text@0.0.8.js",
      "contacts/dialogUpdatePhoto.js",
      "contacts/filter.js",
      "contacts/sort.js",
      "contacts/take.js",
      "dashboard_filters/filters-available-from.html!github:systemjs/plugin-text@0.0.8.js",
      "dashboard_filters/filters-available-from.js",
      "dashboard_filters/filters-available-to.html!github:systemjs/plugin-text@0.0.8.js",
      "dashboard_filters/filters-available-to.js",
      "dashboard_filters/filters-city.html!github:systemjs/plugin-text@0.0.8.js",
      "dashboard_filters/filters-city.js",
      "dashboard_filters/filters-color.html!github:systemjs/plugin-text@0.0.8.js",
      "dashboard_filters/filters-color.js",
      "dashboard_filters/filters-designer.html!github:systemjs/plugin-text@0.0.8.js",
      "dashboard_filters/filters-designer.js",
      "dashboard_filters/filters-order.html!github:systemjs/plugin-text@0.0.8.js",
      "dashboard_filters/filters-order.js",
      "dashboard_filters/filters-search.html!github:systemjs/plugin-text@0.0.8.js",
      "dashboard_filters/filters-search.js",
      "dashboard_filters/filters-season.html!github:systemjs/plugin-text@0.0.8.js",
      "dashboard_filters/filters-season.js",
      "dashboard_filters/filters-theme.html!github:systemjs/plugin-text@0.0.8.js",
      "dashboard_filters/filters-theme.js",
      "dashboard_filters/filters-type.html!github:systemjs/plugin-text@0.0.8.js",
      "dashboard_filters/filters-type.js",
      "error_dialog/error_dialog_sample.html!github:systemjs/plugin-text@0.0.8.js",
      "error_dialog/error_dialog_sample.js",
      "footer.html!github:systemjs/plugin-text@0.0.8.js",
      "footer.js",
      "guestheader.html!github:systemjs/plugin-text@0.0.8.js",
      "guestheader.js",
      "guestpage.html!github:systemjs/plugin-text@0.0.8.js",
      "guestpage.js",
      "header.html!github:systemjs/plugin-text@0.0.8.js",
      "header.js",
      "hello/introduction.html!github:systemjs/plugin-text@0.0.8.js",
      "hello/introduction.js",
      "hello/introductionGuest.html!github:systemjs/plugin-text@0.0.8.js",
      "hello/introductionGuest.js",
      "hello/nagGuest.html!github:systemjs/plugin-text@0.0.8.js",
      "hello/nagGuest.js",
      "index.html!github:systemjs/plugin-text@0.0.8.js",
      "index.js",
      "items/checkAvailability.html!github:systemjs/plugin-text@0.0.8.js",
      "items/checkAvailability.js",
      "items/editSearchableItem.html!github:systemjs/plugin-text@0.0.8.js",
      "items/editSearchableItem.js",
      "items/set-attribute.js",
      "items/setAvailability.html!github:systemjs/plugin-text@0.0.8.js",
      "items/setAvailability.js",
      "items/sort.js",
      "items/truncate.js",
      "main.js",
      "messages/filter.js",
      "messages/messages.html!github:systemjs/plugin-text@0.0.8.js",
      "messages/messages.js",
      "messages/messagesHeader.html!github:systemjs/plugin-text@0.0.8.js",
      "messages/messagesHeader.js",
      "requestman.html!github:systemjs/plugin-text@0.0.8.js",
      "requestman.js",
      "requests/request-dialog-entry.html!github:systemjs/plugin-text@0.0.8.js",
      "requests/request-dialog-entry.js",
      "requests/requests.html!github:systemjs/plugin-text@0.0.8.js",
      "requests/requests.js",
      "sample_request/createSampleRequest.html!github:systemjs/plugin-text@0.0.8.js",
      "sample_request/createSampleRequest.js",
      "sample_request/createSampleRequestBrand.html!github:systemjs/plugin-text@0.0.8.js",
      "sample_request/createSampleRequestBrand.js",
      "sample_request/editSampleRequest.html!github:systemjs/plugin-text@0.0.8.js",
      "sample_request/editSampleRequest.js",
      "sample_request/sort.js",
      "services/PRAgencyService.js",
      "services/addressService.js",
      "services/brandService.js",
      "services/busy.js",
      "services/pressHouseService.js",
      "services/sampleRequestService.js",
      "services/userService.js",
      "zoom/zoom.html!github:systemjs/plugin-text@0.0.8.js",
      "zoom/zoom.js"
    ]
  },
  depCache: {
    "add_files/add_files.js": [
      "aurelia-dialog",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-framework",
      "common/dateFormat"
    ],
    "admin/dialogImportUsers.js": [
      "aurelia-dialog",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-framework",
      "common/dateFormat"
    ],
    "admin/dialogNewOffice.js": [
      "aurelia-dialog",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-framework",
      "common/dateFormat",
      "services/addressService"
    ],
    "admin/dialogNewUser.js": [
      "aurelia-dialog",
      "aurelia-framework",
      "common/dateFormat",
      "services/userService",
      "services/brandService",
      "services/pressHouseService",
      "services/PRAgencyService"
    ],
    "adminpage.js": [
      "aurelia-framework",
      "./services/userService",
      "aurelia-dialog",
      "./admin/dialogNewUser",
      "./admin/dialogImportUsers",
      "./admin/dialogNewOffice",
      "services/brandService",
      "services/pressHouseService",
      "services/PRAgencyService",
      "services/addressService"
    ],
    "app.js": [
      "./services/userService",
      "aurelia-framework"
    ],
    "brand/createAddress.js": [
      "aurelia-dialog",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-framework"
    ],
    "calendar.js": [
      "aurelia-framework",
      "aurelia-fetch-client",
      "common/dateFormat",
      "fetch"
    ],
    "calendars/datepicker.js": [
      "aurelia-event-aggregator",
      "aurelia-framework",
      "jquery",
      "jquery-ui"
    ],
    "calendars/requestCalendar.js": [
      "aurelia-framework",
      "aurelia-fetch-client",
      "common/dateFormat",
      "fetch"
    ],
    "common/customSelect.js": [
      "aurelia-framework",
      "jquery",
      "select2"
    ],
    "common/viewDateFormatter.js": [
      "moment"
    ],
    "common/viewDateFullFormatter.js": [
      "moment"
    ],
    "common/viewDateTimeFormatter.js": [
      "moment"
    ],
    "comms/commsFooter.js": [
      "aurelia-dialog",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-framework",
      "contacts/dialogRequestContact",
      "contacts/dialogImportContacts",
      "messages/messages"
    ],
    "comms/commsHeader.js": [
      "aurelia-dialog",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-framework",
      "contacts/dialogNewContact",
      "contacts/dialogImportContacts",
      "messages/messages",
      "aurelia-event-aggregator"
    ],
    "contacts/contactEntryMessage.js": [
      "aurelia-fetch-client",
      "aurelia-dialog",
      "fetch",
      "aurelia-framework",
      "common/dateFormat",
      "./dialogEditContact",
      "./dialogUpdatePhoto",
      "messages/messages",
      "services/userService",
      "aurelia-event-aggregator"
    ],
    "contacts/contactsList.js": [
      "aurelia-fetch-client",
      "aurelia-dialog",
      "fetch",
      "aurelia-framework",
      "common/dateFormat",
      "./dialogUpdatePhoto",
      "./dialogConfirmDelete",
      "services/userService",
      "comms/commsHeader",
      "aurelia-event-aggregator"
    ],
    "contacts/dialogConfirmDelete.js": [
      "aurelia-dialog",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-framework",
      "common/dateFormat"
    ],
    "contacts/dialogEditContact.js": [
      "aurelia-dialog",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-framework",
      "common/dateFormat",
      "services/userService",
      "services/brandService",
      "services/pressHouseService",
      "services/PRAgencyService"
    ],
    "contacts/dialogImportContacts.js": [
      "aurelia-dialog",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-framework",
      "common/dateFormat"
    ],
    "contacts/dialogNewContact.js": [
      "aurelia-dialog",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-framework",
      "common/dateFormat"
    ],
    "contacts/dialogRequestContact.js": [
      "aurelia-dialog",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-framework",
      "common/dateFormat",
      "services/userService"
    ],
    "contacts/dialogUpdatePhoto.js": [
      "aurelia-dialog",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-framework",
      "common/dateFormat"
    ],
    "dashboard_filters/filters-available-from.js": [
      "aurelia-framework"
    ],
    "dashboard_filters/filters-available-to.js": [
      "aurelia-framework",
      "aurelia-event-aggregator"
    ],
    "dashboard_filters/filters-city.js": [
      "aurelia-framework",
      "aurelia-fetch-client",
      "fetch"
    ],
    "dashboard_filters/filters-color.js": [
      "aurelia-framework",
      "aurelia-fetch-client",
      "fetch"
    ],
    "dashboard_filters/filters-designer.js": [
      "aurelia-framework",
      "aurelia-fetch-client",
      "fetch",
      "services/brandService"
    ],
    "dashboard_filters/filters-order.js": [
      "aurelia-framework",
      "aurelia-fetch-client",
      "fetch"
    ],
    "dashboard_filters/filters-search.js": [
      "aurelia-framework",
      "aurelia-fetch-client",
      "aurelia-event-aggregator",
      "fetch"
    ],
    "dashboard_filters/filters-season.js": [
      "aurelia-framework",
      "aurelia-fetch-client",
      "fetch"
    ],
    "dashboard_filters/filters-theme.js": [
      "aurelia-framework",
      "aurelia-fetch-client",
      "fetch"
    ],
    "dashboard_filters/filters-type.js": [
      "aurelia-framework",
      "aurelia-fetch-client",
      "fetch"
    ],
    "error_dialog/error_dialog_sample.js": [
      "aurelia-dialog",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-framework",
      "common/dateFormat"
    ],
    "guestheader.js": [
      "aurelia-framework",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-router",
      "./services/userService"
    ],
    "guestpage.js": [
      "aurelia-framework",
      "aurelia-fetch-client",
      "aurelia-dialog",
      "fetch",
      "./zoom/zoom",
      "./services/userService",
      "./services/busy",
      "./hello/introductionGuest",
      "./hello/nagGuest"
    ],
    "header.js": [
      "aurelia-framework",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-router",
      "./services/userService",
      "./contacts/dialogEditContact",
      "aurelia-dialog"
    ],
    "hello/introduction.js": [
      "aurelia-dialog",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-framework",
      "common/dateFormat",
      "services/userService.js"
    ],
    "hello/introductionGuest.js": [
      "aurelia-dialog",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-framework",
      "common/dateFormat"
    ],
    "hello/nagGuest.js": [
      "aurelia-dialog",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-framework",
      "common/dateFormat"
    ],
    "index.js": [
      "aurelia-framework",
      "aurelia-fetch-client",
      "aurelia-event-aggregator",
      "aurelia-dialog",
      "fetch",
      "./sample_request/createSampleRequest",
      "./sample_request/createSampleRequestBrand",
      "./sample_request/editSampleRequest",
      "./items/editSearchableItem",
      "./items/checkAvailability",
      "./items/setAvailability",
      "./hello/introduction",
      "./zoom/zoom",
      "./services/sampleRequestService",
      "./services/userService",
      "./services/brandService",
      "./add_files/add_files",
      "./error_dialog/error_dialog_sample",
      "./services/busy"
    ],
    "items/checkAvailability.js": [
      "aurelia-dialog",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-framework",
      "common/dateFormat"
    ],
    "items/editSearchableItem.js": [
      "aurelia-dialog",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-framework",
      "common/dateFormat"
    ],
    "items/set-attribute.js": [
      "aurelia-binding"
    ],
    "items/setAvailability.js": [
      "aurelia-dialog",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-framework",
      "common/dateFormat"
    ],
    "main.js": [
      "bootstrap"
    ],
    "messages/messages.js": [
      "aurelia-fetch-client",
      "fetch",
      "aurelia-framework",
      "common/dateFormat",
      "services/userService",
      "aurelia-event-aggregator"
    ],
    "requestman.js": [
      "aurelia-framework",
      "./services/userService",
      "./services/sampleRequestService",
      "aurelia-dialog",
      "./contacts/dialogNewContact",
      "./contacts/dialogImportContacts",
      "./sample_request/editSampleRequest"
    ],
    "requests/request-dialog-entry.js": [
      "aurelia-dialog",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-framework",
      "common/dateFormat"
    ],
    "requests/requests.js": [
      "aurelia-framework",
      "aurelia-fetch-client",
      "fetch"
    ],
    "sample_request/createSampleRequest.js": [
      "aurelia-dialog",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-framework",
      "common/dateFormat",
      "services/brandService"
    ],
    "sample_request/createSampleRequestBrand.js": [
      "aurelia-dialog",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-framework",
      "common/dateFormat",
      "services/brandService"
    ],
    "sample_request/editSampleRequest.js": [
      "aurelia-dialog",
      "aurelia-fetch-client",
      "fetch",
      "aurelia-framework",
      "common/dateFormat",
      "services/sampleRequestService",
      "services/userService"
    ],
    "services/addressService.js": [
      "aurelia-framework",
      "aurelia-fetch-client",
      "fetch"
    ],
    "services/brandService.js": [
      "aurelia-framework",
      "aurelia-fetch-client",
      "fetch"
    ],
    "services/PRAgencyService.js": [
      "aurelia-framework",
      "aurelia-fetch-client",
      "fetch"
    ],
    "services/pressHouseService.js": [
      "aurelia-framework",
      "aurelia-fetch-client",
      "fetch"
    ],
    "services/sampleRequestService.js": [
      "aurelia-framework",
      "aurelia-fetch-client",
      "fetch"
    ],
    "services/userService.js": [
      "aurelia-framework",
      "aurelia-fetch-client",
      "fetch"
    ],
    "zoom/zoom.js": [
      "aurelia-dialog",
      "aurelia-framework",
      "common/dateFormat",
      "jquery",
      "services/userService"
    ]
  }
});