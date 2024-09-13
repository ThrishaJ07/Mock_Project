sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller,JSONModel) {
   "use strict";

   return Controller.extend("ui5.mock.controller.Dashboard", {
       onInit: function () {
        var oModel = new JSONModel("MockData.json");
        this.getView().setModel(oModel);
       },
       
       onFilter: function () {
        var name = this.getView().byId("nameInput").getValue().toLowerCase();
        var eid = this.getView().byId("eidInput").getValue().toLowerCase();
        var status = this.getView().byId("statusInput").getSelectedKey();

        var aFilters = [];
        if (name) {
            aFilters.push(new sap.ui.model.Filter("FirstName", sap.ui.model.FilterOperator.Contains, name));
        }
        if (eid) {
            aFilters.push(new sap.ui.model.Filter("EmployeeID", sap.ui.model.FilterOperator.Contains, eid));
        }
        if (status) {
            aFilters.push(new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, status));
        }

        var oTable = this.getView().byId("employeeTable");
        var oBinding = oTable.getBinding("items");
        oBinding.filter(aFilters);
    },
   });
});
