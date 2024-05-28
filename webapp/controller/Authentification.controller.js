sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("brahim.project.controller.Authentification", {
            onInit: function () {

               /*  var login = this.byId("loginInput").getValue()
                var password = this.byId("passwordInput").getValue()
                
                console.log(login)
                console.log(password)
 */
            },

          /*   onLogin: function (){
                window.open("https://port8080-workspaces-ws-prhhs.eu20.applicationstudio.cloud.sap/index.html#/DashboardF"); 
                var login = this.byId("loginInput").getValue()
                var password = this.byId("passwordInput").getValue()
                console.log(login)
                console.log(password)

                var that = this
                var oAuthModel = this.getOwnerComponent().getModel()

                oAuthModel.read("/ZCOLLAB_ENTSet(Login='" + login + "',MotDePasse='" + password + "')", {
                      filters: [
                          new sap.ui.model.Filter("Role", sap.ui.model.FilterOperator.EQ, "manager")
                      ], 
                      success: function(data){
                        console.log(data)
                        that.getOwnerComponent().getRouter().navTo("DashboardF",
                        {
                            role:data.Role
                        })
                          
                      },
                      error: function(oError){
                          console.log(oError);
                      }
                      });
            } */
        });
    });
