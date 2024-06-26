sap.ui.define([], () => {
    "use strict";
   
    return {
          statusText(SE) {
             
              if (SE == "En cours" ){
                  return "Success";
              } else if (SE =="Sortie") {
                  return "Error";
             
              } else {
                  return "Warning";
              }
                 
            },
            formatIconColor(C) {
              if (C == "M." ){
                return "Accent6";
               } else if (C =="Mme.") {
                return "Accent2";
             }
   
            }
           
          }
   
     
  });