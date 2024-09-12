sap.ui.define([
   "sap/ui/core/mvc/Controller"
], function (Controller) {
   "use strict";

   return Controller.extend("ui5.mock.controller.Dashboard", {
       onInit: function () {
           // Initialization code for the dashboard
           console.log("Dashboard view initialized");
       }
   });
});
