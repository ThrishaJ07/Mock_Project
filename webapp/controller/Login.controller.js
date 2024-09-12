
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
function (Controller, MessageBox) {
    "use strict";

    return Controller.extend("ui5.mock.controller.Login", {

        users: [
            { username: 'User1', password: '1234' },
            { username: 'User2', password: '5678' },
            { username: 'User3', password: '0123' }
        ],

        onInit: function () {

        },
        onLoginUser : function(){
            var username = this.getView().byId('inp_username');
            var password = this.getView().byId('inp_password');

            if(username.getValue() === ''){
                MessageBox.error("Please enter username");
                return;
            } else if(password.getValue() === ''){
                MessageBox.error("Please enter Password");
                return;
            } else{
                var userFound = this.users.some(function(user){
                    return user.username === username.getValue() && user.password === password.getValue()
                    
                });
                if(userFound){
                    this.getOwnerComponent().getRouter().navTo("dashboard", {}, true);
                }else{
                    MessageBox.error("Invalid Username or Password!");
                    return;
                }
            }
        }
    });
});



