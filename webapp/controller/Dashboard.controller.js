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
            this.getView().setModel(oModel,"employeesModel");
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
            var nameFilter = new sap.ui.model.Filter({
                filters: [
                    new sap.ui.model.Filter("FirstName", sap.ui.model.FilterOperator.Contains, name),
                    new sap.ui.model.Filter("LastName", sap.ui.model.FilterOperator.Contains, name)
                ],
                and: false 
            });
            aFilters.push(nameFilter);
        }
        if (eid) {
            aFilters.push(new sap.ui.model.Filter("EmployeeID", sap.ui.model.FilterOperator.Contains, eid));
        }
        if (status) {
            aFilters.push(new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, status));
        }

        var oTable = this.getView().byId("employeeTable");
        var oBinding = oTable.getBinding("items");
        oBinding.filter(aFilters,"employeesModel");
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
    onNextStep: function () {
        var firstName = this.byId("firstNameInput").getValue();
        var lastName = this.byId("lastNameInput").getValue();

        // Validate personal info before moving to the next step
        if (!firstName || !lastName) {
            MessageToast.show("Please fill out both First Name and Last Name");
            return;
        }

        // Hide personal info section and show contact info section
        this.byId("personalInfoBox").setVisible(false);
        this.byId("contactInfoBox").setVisible(true);

        // Hide 'Next' button and show 'Submit' button
        this.byId("nextButton").setVisible(false);
        this.byId("submitButton").setVisible(true);
    },

    // Step 2: Handle "Submit" button press to save employee
    onSubmitAddEmployee: function () {
        var oModel = this.getView().getModel();
        var aEmployees = oModel.getProperty("/employees");

        // Personal Information
        var firstName = this.byId("firstNameInput").getValue();
        var lastName = this.byId("lastNameInput").getValue();

        // Contact Information
        var phone = this.byId("phoneInput").getValue();
        var email = this.byId("emailInput").getValue();

        // Validate email
        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            MessageToast.show("Please enter a valid email address");
            return;
        }

        // Validate that all fields are filled
        if (!phone || !email) {
            MessageToast.show("Please fill all contact fields");
            return;
        }

        // Add the new employee to the model
        var newEmployee = {
            FirstName: firstName,
            LastName: lastName,
            EmployeeID: "E00" + (aEmployees.length + 1),
            Phone: phone,
            Email: email,
            Status: "Active"
        };

        aEmployees.push(newEmployee);
        oModel.setProperty("/employees", aEmployees);

        // Clear input fields
        this.byId("firstNameInput").setValue("");
        this.byId("lastNameInput").setValue("");
        this.byId("phoneInput").setValue("");
        this.byId("emailInput").setValue("");

        // Reset dialog to initial state
        this.byId("personalInfoBox").setVisible(true);
        this.byId("contactInfoBox").setVisible(false);
        this.byId("nextButton").setVisible(true);
        this.byId("submitButton").setVisible(false);
        // Clear the input fields in the dialog
        this.byId("firstNameInput").setValue("");
        this.byId("lastNameInput").setValue("");
        this.byId("emailInput").setValue("");

        // Close the dialog
        this.byId("addEmployeeDialog").close();
        MessageToast.show("Employee added successfully!");
    },

    // Handle "Cancel" button press to close the dialog
    onCancelAddEmployee: function () {
        // Reset dialog state when closing
        this.byId("personalInfoBox").setVisible(true);
        this.byId("contactInfoBox").setVisible(false);
        this.byId("nextButton").setVisible(true);
        this.byId("submitButton").setVisible(false);

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
    //Get employee details
    onEmployeePress: function (oEvent) {
        // Get the selected item directly from the event source
        var oSelectedItem = oEvent.getSource();
        var oContext = oSelectedItem.getBindingContext("employeesModel");

        console.log("Selected Item:", oSelectedItem);
console.log("Selected Item Context:", oContext ? oContext.getObject() : "No data found.");

        
        if (!oContext) {
            console.error("No binding context found.");
            return;
        }
    
        var sPath = oContext.getPath();
        var encodedPath = encodeURIComponent(sPath);
        console.log("Encoded Path:", encodedPath);
    
        // Navigate to the employee details page
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("employeeDetails", {
            path: encodedPath
        });
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
