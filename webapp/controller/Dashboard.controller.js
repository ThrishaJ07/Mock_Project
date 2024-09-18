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

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("dashboard").attachPatternMatched(this._onObjectMatched, this);

            var oModel = new JSONModel("MockData.json");
            this.getView().setModel(oModel);
       },

        _onObjectMatched: function (oEvent) {
            var sUserName = oEvent.getParameter("arguments").username;
            // Set the username in the view
            this.getView().byId("welcomeMessage").setText("Welcome " + sUserName);
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

        // Clear the input fields in the dialog
        this.byId("firstNameInput").setValue("");
        this.byId("lastNameInput").setValue("");
        this.byId("emailInput").setValue("");

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
    // Get the clicked employee data
    onEmployeePress: function (oEvent) {
        var oSelectedItem = oEvent.getSource();
        var oContext = oSelectedItem.getBindingContext();
        var oEmployeeData = oContext.getObject();

        // Set the employee data in the dialog
        var sName = oEmployeeData.FirstName + " " + oEmployeeData.LastName;
        this.byId("nameText").setText(sName);
        this.byId("emailText").setText(oEmployeeData.Email);
        this.byId("employeeIdText").setText(oEmployeeData.EmployeeID);
        this.byId("statusText").setText(oEmployeeData.Status);
        this.byId("phoneText").setText(oEmployeeData.Phone);
        this.byId("departmentText").setText(oEmployeeData.Department);
        this.byId("positionText").setText(oEmployeeData.Position);
        this.byId("hireDateText").setText(oEmployeeData.HireDate);
        this.byId("salaryText").setText(oEmployeeData.Salary);
        var oAddress = oEmployeeData.Address;
        var sAddress = oAddress.Street + ", " + oAddress.City + ", " + oAddress.ZipCode + ", " + oAddress.Country;
        this.byId("addressText").setText(sAddress);

        // Open the dialog
        this.byId("employeeDetailsDialog").open();
     },
     // Close the employee details dialog
     onCloseEmployeeDetailsDialog: function () {
        this.byId("employeeDetailsDialog").close();
     },
     // Export to Excel functionality
     onExport: function () {
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
                MessageToast.show("Spreadsheet export successful!");
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
