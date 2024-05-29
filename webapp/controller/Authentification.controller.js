sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel) {
        "use strict";

        return Controller.extend("brahim.project.controller.Authentification", {
            onInit: function () {

                window.history.forward();

                var oLoginModel = this.getOwnerComponent().getModel();
                var that = this;
                /* console.log(oCollabModel) */
               
                oLoginModel.read("/ZCOLLAB_ENTSet", {
                  /*   filters: [
                        new sap.ui.model.Filter("Role", sap.ui.model.FilterOperator.EQ, "manager")
                    ],  */
                    success: function(data){
                        var xModel = new JSONModel(data);
                        that.getView().setModel(xModel,"oLoginModel");   
                        console.log(xModel)           
                    },
                    error: function(oError){
                        console.log(oError);
                    }
                    });
            },

          

            onLogin: function (){
                
                var oLogin = this.getView().getModel("oLoginModel").getProperty("/results")
                console.log(oLogin)
                var login = this.byId("loginInput").getValue()
                var password = this.byId("passwordInput").getValue()
                var userAuth = false
                var that = this 

                for (const collabData of Object.values(oLogin)) {
                    if ((collabData.Login === login) && (collabData.MotDePasse === password)) 
                    {
                        var userAuth = true


                        var userAuthModel = new JSONModel({ userAuth: userAuth });
                        that.getView().setModel(userAuthModel, 'userAuthModel');

                        console.log(collabData.Idcollab)
                        if(userAuth)
                        {
                            that.getOwnerComponent().getRouter().navTo("Dashboardf",
                            {
                                id : collabData.Idcollab
                            }
                              
                            )
                        }                   
                    }
                }

                console.log("The User Is " + userAuth)
                console.log("The Login Introduced Is" + login)
                console.log("The Password Introduced Is " + password) 
 /*
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
                      });*/
            } ,
            getVariable()
            {
                var userAuth = this.getView().getModel("userAuthModel").getProperty("/userAuth");
                console.log(userAuth)
            }
        });
    });
