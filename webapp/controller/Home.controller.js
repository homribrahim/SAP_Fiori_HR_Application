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
                if (oButton) {
                    oButton.getDomRef().addEventListener("click", this.onDiscoverPress.bind(this));
                }
            },
            
            onDiscoverPress: function () {
                this.scrollToSection("vb");
            },
            
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