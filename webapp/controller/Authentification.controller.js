sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator"


],



/* 
*************************************************************************************************************************
*************************************************************************************************************************
*************************************************************************************************************************
*************************************************************************************************************************

            La logique utilisée dans la phase d'authentification est provisoire et n'est pas sécurisé , en attendant la
            disposition des comptes BTP pour tous les collaborateurs concerné par l'auto évaluation d'AYMAX et WEBMAX, 
            pour que la connexion soit à travers leurs coordonnées Cloud.

*************************************************************************************************************************
*************************************************************************************************************************
*************************************************************************************************************************
*************************************************************************************************************************

*/

    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel) {
        
        "use strict";

        var userAuth=false
        var userID = ""
                                    
        return Controller.extend("brahim.project.controller.Authentification", {
            onInit: function () {

                this.byId("imgLogo").setVisible(false);
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
                        console.log(data)           
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
              
                for (const collabData of Object.values(oLogin)) {
                    if ((collabData.Login === login) && (collabData.MotDePasse === password)) 
                    {
                        userAuth = true
                       
                        if(userAuth)
                        {   
                            this.byId("authPage").setVisible(false);
                            this.byId("imgLogo").setVisible(true);
                            userID = collabData.Idcollab
                            var oUserModel = this.getOwnerComponent().getModel();
                            
                            oUserModel.read("/ZCOLLAB_ENTSet(Mandt='200',Idcollab='" + userID + "')", {
                                async: true,
                                success: function(data)
                                {           
                                    data.MotDePasse = Math.random().toString(36).substring(2,30);
                                    localStorage.setItem("userData", JSON.stringify(data));
                                    console.log(data)
                                                    
                                },
                                error: function(oError){
                                    console.log(oError);
                                }
                                });
                            this.getOwnerComponent().getRouter().navTo("Dashboardf")  
                            
                        }                   
                    }
                }  
               
            } ,
        });
    });