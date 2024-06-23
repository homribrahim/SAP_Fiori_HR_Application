sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator"


],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,BusyIndicator) {
        
        "use strict";

        var userAuth=false
        var userID = ""

        return Controller.extend("brahim.project.controller.Authentification", {
            onInit: function () {

              /*   
                if(localStorage.getItem("userData"))
                {
                    this.getOwnerComponent().getRouter().navTo("Dashboardf")
                   this.getOwnerComponent().getRouter().getRoute().stop()   
                }  */

/*                 window.history.forward();
 */
              /*   this.byId("authPage").setVisible(true);
                this.byId("imgLogo").setVisible(false); */

                this.byId("imgLogo").setVisible(false);
                var oLoginModel = this.getOwnerComponent().getModel();
                var that = this;
                /* console.log(oCollabModel) */
                     
                oLoginModel.read("/ZCOLLAB_ENTSet", {
                  /*   filters: [
                        new sap.ui.model.Filter("Role", sap.ui.model.FilterOperator.EQ, "manager")
                    ],  */
                    async: true,
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

            onDuc : function ()
            {
                this.byId("authPage").setVisible(false);
                this.byId("imgLogo").setVisible(true);
            },

            onLogin: function (){

             /*    var authPage = this.byId("authPage").setVisible(false);
                var imgLogo = this.byId("imgLogo").setVisible(true);  */

/*                 this.byId("authPage").setVisible(false);
 */               /*  this.byId("imgLogo").setVisible(true);

                     */ 

                
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
