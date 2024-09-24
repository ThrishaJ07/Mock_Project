sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel"
 ], (UIComponent,JSONModel, ResourceModel) => {
    "use strict";
 
    return UIComponent.extend("ui5.mock.Component", {
      metadata : {
         interfaces: ["sap.ui.core.IAsyncContentCreation"],
         manifest: "json"
      },
       init() {
          // call the init function of the parent
          UIComponent.prototype.init.apply(this, arguments);

          // Set the model globally
         var oModel = new JSONModel("MockData.json");
         this.setModel(oModel, "employeesModel");

         // set i18n model
         const i18nModel = new ResourceModel({
            bundleName: "ui5.mock.i18n.i18n"
         });
         this.setModel(i18nModel, "i18n");

         // Create the router and navigate to the initial route
         this.getRouter().initialize();
       }
    });
 });
 