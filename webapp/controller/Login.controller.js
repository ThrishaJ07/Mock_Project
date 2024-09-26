sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel" 
],
function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("ui5.mock.controller.Login", {

        users: [
            { username: 'User1', password: '1234' },
            { username: 'User2', password: '5678' },
            { username: 'User3', password: '0123' }
        ],

        onInit: function () {
            var oViewModel = new JSONModel({
                isLoginEnabled: false
            });
            this.getView().setModel(oViewModel);
        },
        onInputChange: function() {
            var username = this.getView().byId('inp_username').getValue();
            var password = this.getView().byId('inp_password').getValue();

            // Check if both fields are non-empty to enable the login button
            var isLoginEnabled = (username !== "" && password !== "");

            // Update the model with the enabled state
            this.getView().getModel().setProperty("/isLoginEnabled", isLoginEnabled);
        },
        onLoginUser : function(){
            var usernameField = this.getView().byId('inp_username');
            var passwordField = this.getView().byId('inp_password');

            var username = usernameField.getValue();
            var password = passwordField.getValue();

            var userFound = this.users.some(function(user) {
                return user.username === username && user.password === password;
            });

            if (!userFound) {
                // Set error state on username field if the username is invalid
                var sInvalidfieldMessage = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("invalidFieldMessage");
                usernameField.setValueState("Error");
                usernameField.setValueStateText(sInvalidfieldMessage);
                passwordField.setValueState("Error");
                passwordField.setValueStateText(sInvalidfieldMessage);
            } else {
                this.getOwnerComponent().getRouter().navTo("dashboard",
                { 
                    username: username 

                });
            }
        },
        //Translate to German
        onToggleLanguage: function () {
            var oToggleButton = this.getView().byId("languageToggle");
            this.getOwnerComponent().onToggleLanguage(oToggleButton);
        }
    });
});