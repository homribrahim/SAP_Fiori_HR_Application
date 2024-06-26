sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */

    /* 
        ****************               
        **************** 
        ****************   
        ****************               
        **************** 
        ****************   
        
                        La logique utilisée dans la partie d'authentification 
                        est provisoire et n'est pas sécurisé, en attendant que
                        tous les collaborateurs concernés par l'auto évaluation 
                        auront leurs comptes sur le cloud pour qu'ils puissent y accéder.
                        (Les équipes RH , Sales , WebMax , etc ... n'ont pas de comptes pour le moment)
                        
        ****************   
        ****************  
        ****************
        ****************   
        ****************  
        ****************
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
                     
                oLoginModel.read("/ZCOLLAB_ENTSet", {
                    async: true,
                    success: function(data){
                        var oLoginModelData = new JSONModel(data);
                        that.getView().setModel(oLoginModelData,"oLoginModel");   
                        console.log(oLoginModelData)           
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
                        }        
                        this.getOwnerComponent().getRouter().navTo("Dashboardf")  
                    }
                }  
               
            } ,
        });
    });
