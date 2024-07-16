sap.ui.define([
    "sap/ui/core/mvc/Controller"
  ], function (Controller) {
    "use strict";
  
    return Controller.extend("your.namespace.controller.NotFound", {

        onInit ()
        {},

        onAfterRendering: function() {
          var oHomeButton = this.byId("homeButton")
         
          if (oHomeButton)
          {
            oHomeButton.getDomRef().addEventListener("click",this.onHome.bind(this));
          }
  
      },

      onHome : function ()
      {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("RouteHome");

      },
      
    });
  });