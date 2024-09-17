sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/export/Spreadsheet", 
    "sap/ui/export/library"
], function (Controller,JSONModel,MessageToast, Spreadsheet, exportLibrary) {
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
    // Add Employee Dialog
    onAddEmployee: function () {
        var oView = this.getView();
        if (!this.byId("addEmployeeDialog")) {
            oView.addDependent(sap.ui.xmlfragment(oView.getId(), "ui5.mock.view.AddEmployeeDialog", this));
        }
        this.byId("addEmployeeDialog").open();
    },
    // Submit new Employee
    onSubmitAddEmployee: function () {
        var oModel = this.getView().getModel();
        var aEmployees = oModel.getProperty("/employees");

        var firstName = this.byId("firstNameInput").getValue();
        var lastName = this.byId("lastNameInput").getValue();
        var email = this.byId("emailInput").getValue();

        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (!firstName || !lastName || !email) {
            MessageToast.show("Please fill all fields");
            return;
        }

         if (!emailPattern.test(email)) {
            MessageToast.show("Please enter a valid email address");
            return;
    }

        var newEmployee = {
            FirstName: firstName,
            LastName: lastName,
            EmployeeID: "E00" + (aEmployees.length + 1),
            Email: email,
            Status: "Active"
        };

        aEmployees.push(newEmployee);
        oModel.setProperty("/employees", aEmployees);

        // Close Dialog and show success message
        this.byId("addEmployeeDialog").close();
        MessageToast.show("Employee added successfully!");
    },

    // Close Add Employee Dialog
    onCancelAddEmployee: function () {
        this.byId("addEmployeeDialog").close();
    },
    // Delete Employee
    onDelete: function (oEvent) {
        var oModel = this.getView().getModel();
        var aEmployees = oModel.getProperty("/employees");
        var sPath = oEvent.getSource().getBindingContext().getPath();
        // Remove the selected employee from the array
        aEmployees.splice(parseInt(sPath.split("/")[2]), 1);
        oModel.setProperty("/employees", aEmployees);
        MessageToast.show("Employee deleted successfully!");
    },
    onEmployeePress: function (oEvent) {
        // Get the clicked employee data
        var oSelectedItem = oEvent.getSource();
        var oContext = oSelectedItem.getBindingContext();
        var oEmployeeData = oContext.getObject();

        // Set the employee data in the dialog
        this.byId("firstNameText").setText(oEmployeeData.FirstName);
        this.byId("lastNameText").setText(oEmployeeData.LastName);
        this.byId("emailText").setText(oEmployeeData.Email);
        this.byId("employeeIdText").setText(oEmployeeData.EmployeeID);
        this.byId("statusText").setText(oEmployeeData.Status);

        // Open the dialog
        this.byId("employeeDetailsDialog").open();
     },

     onCloseEmployeeDetailsDialog: function () {
        // Close the employee details dialog
        this.byId("employeeDetailsDialog").close();
     },
     // Export to Excel functionality
     onExport: function () {
        var oTable = this.getView().byId("employeeTable");
        var oModel = this.getView().getModel();

        var aCols = this.createColumnConfig(); 
        var oSettings = {
            workbook: { columns: aCols },
            dataSource: oModel.getProperty("/employees"),
            fileName: "Employee_Data.xlsx"
        };

        var oSpreadsheet = new Spreadsheet(oSettings);
        oSpreadsheet.build()
            .then(function () {
                sap.m.MessageToast.show("Spreadsheet export successful!");
            })
            .finally(function () {
                oSpreadsheet.destroy();
            });
    },

    //function to create column configuration for export
    createColumnConfig: function () {
        return [
            {
                label: "First Name",
                property: "FirstName",
                type: exportLibrary.EdmType.String
            },
            {
                label: "Last Name",
                property: "LastName",
                type: exportLibrary.EdmType.String
            },
            {
                label: "Employee ID",
                property: "EmployeeID",
                type: exportLibrary.EdmType.String
            },
            {
                label: "Email",
                property: "Email",
                type: exportLibrary.EdmType.String
            },
            {
                label: "Status",
                property: "Status",
                type: exportLibrary.EdmType.String
            }
        ];
    }
   });
});
