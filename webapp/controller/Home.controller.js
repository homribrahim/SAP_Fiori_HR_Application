sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";
 
        return Controller.extend("brahim.project.controller.Home", {
            onInit: function () {
               

            },
        
            onScrollToServices: function() {
                var targetId = this.byId("vb").getId();
                var oHashChanger = UIComponent.getRouterFor(this).getHashChanger();
                 oHashChanger.setHash(targetId);
            },
            onImagePress: function()
            {
                window.open("https://app.ouickly.fr/","_blank")
            },
            onAfterRendering: function() {
                var oButton = this.byId("discoverButton");
                var oConnectButton = this.byId("connectButton")
                if (oButton) {
                    oButton.getDomRef().addEventListener("click", this.onDiscoverPress.bind(this));
                }
              if (oConnectButton)
                {
                    oConnectButton.getDomRef().addEventListener("click",this.onAuth.bind(this));
                }
                  
                
              /*   if (oConnectButton)
                {
                    oConnectButton.getDomRef().addEventListener("click",this.onAuth())  
                } */
            },

            onAuth : function ()
            {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Authentification");

            },
            
            onDiscoverPress: function () {
                this.scrollToSection("vb");
            },

           /*  onAuth:function()
            {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("/Authentification");
            }, */
            
            scrollToSection: function(sectionId) {
                var oSection = this.byId(sectionId);
                if (oSection) {
                    var oDomRef = oSection.getDomRef();
                    if (oDomRef) {
                        oDomRef.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        });
    });