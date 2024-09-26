sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("ui5.mock.controller.EmployeeDetails", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("employeeDetails").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            var sPath = decodeURIComponent(oEvent.getParameter("arguments").path);
            
            var oView = this.getView();
            var oModel = oView.getModel("employeesModel");
            
            if (!oModel) {
                console.error("employeesModel not found!");
                return;
            }
            
            oView.bindElement({
                path: sPath,
                model: "employeesModel",
                events: {
                    change: this._onBindingChange.bind(this),
                    dataRequested: function () {
                        oView.setBusy(true);
                    },
                    dataReceived: function () {
                        oView.setBusy(false);
                    }
                }
            });
        },        
        _onBindingChange: function () {
            var oView = this.getView();
            var oElement = oView.getBindingContext("employeesModel");
            if (!oElement) {
                console.error("No data found for path.");
                return;
            }
        },
       //Translate to German
        onToggleLanguage: function () {
        var oToggleButton = this.getView().byId("languageToggle");
        this.getOwnerComponent().onToggleLanguage(oToggleButton);
        }   
    });
});
