sap.ui.define([
    "sap/ui/Device",    
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Popover",
    "sap/m/Button",
    "sap/m/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter',
    'sap/ui/core/IconPool',
    "sap/m/Dialog",
    "sap/m/Text",
    "sap/m/MessageToast",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/UIComponent",
    "sap/ui/core/library",
    "sap/m/Image",
    "sap/m/HBox",
    "sap/m/VBox",
    "../utils/myFormatter",
    "sap/ui/core/Item",
    "sap/ui/comp/smartvariants/PersonalizableInfo",
    "sap/ui/export/Spreadsheet",


], function (Device, Controller, JSONModel, Popover, Button, mobileLibrary,Filter,FilterOperator,Sorter,IconPool,Dialog,Text,MessageToast,DateFormat,UIComponent,coreLibrary,Image,HBox,VBox,myFormatter,Item,PersonalizableInfo,Spreadsheet) {
    "use strict";
 


    /////////////////// Global Variables ///////////////////
    var ButtonType = mobileLibrary.ButtonType,
        PlacementType = mobileLibrary.PlacementType;
    var DialogType = mobileLibrary.DialogType;
    var ValueState = coreLibrary.ValueState;
    var verifSelect = false;
    const date = new Date();
    const month = date.getMonth();
    var year = new Date().getFullYear()
    if ( month <=6 )
    {
        var semesterPeriod =  String(1)
    }
    else
    {
        var semesterPeriod = String(2)
    }

    var quarter = "Q"+ String(Math.floor(month / 3) + 1) + "-" + String(year)
    var semester = "S"+ semesterPeriod + "-" + String(year)
 
    return Controller.extend("brahim.project.controller.Dashboardf", {

        stateFormatter :myFormatter ,

        onInit: function () {

            var that = this;
            this.oSF = this.byId("searchField");  
            
           
            
            // Loading Side Content JSON FILE
            var oSideContentModel = new JSONModel(sap.ui.require.toUrl("brahim/project/model/sideContent.json"));       
            this.getView().setModel(oSideContentModel);
            this._setToggleButtonTooltip(!Device.system.desktop);
            window.addEventListener("resize", this.onWindowResize.bind(this)); 

            // Loading Countries JSON File 
            var oCountryModel = new JSONModel(sap.ui.require.toUrl("brahim/project/model/pays.json"));
            oCountryModel.setSizeLimit(1300);
            this.getView().setModel(oCountryModel,"appData");
  
            // Loading Fonts
              
            var b = [];
            var c = {};
            var B = {
                fontFamily: "BusinessSuiteInAppSymbols",
                fontURI: sap.ui.require.toUrl("sap/ushell/themes/base/fonts/")
            };
            IconPool.registerFont(B);
            b.push(IconPool.fontLoaded("BusinessSuiteInAppSymbols"));
            c["BusinessSuiteInAppSymbols"] = B

            // Loading Home Section Stats Numbers
  
            this.animateCounter(0, 400, 3000 ,"counterText1","+",);
            this.animateCounter(0, 10, 3000 ,"counterText2","+",);
            this.animateCounter(0, 4.5, 3000 ,"counterText3","",);
            this.animateCounter(0, 80, 3000 ,"counterText4","+");
             
            // Disabling Getting Back To Previous Component
            window.history.pushState(null, null, window.location.href);
            window.onpopstate = function () {
                window.history.go(1);
            };

            // Getting Current Connected User Data

            var storedData = localStorage.getItem("userData");

            if (storedData) {
                var userData = JSON.parse(storedData);
                var oUserModel = new JSONModel(userData);
                var idCollaborateur = userData.Idcollab
                var nomCollab = userData.Nom
                var prenomCollab = userData.Prenom 
                var emailCollab = userData.Email
                var agenceCollab = userData.Agence
                var poleCOllab = userData.Pole 
                var etatCollab = userData.Etat
                var posteCollab = userData.Fonction
                var ManagerId =userData.IdManager
                var RhId =userData.IdRh
                var role = userData.Role;
                
                // Setting UserData To a Model , To Display It
                this.getView().setModel(oUserModel, "oUserdataModel");

                var idCollabModel = new JSONModel({ 
                    idCollaborateur: idCollaborateur,
                    nomCollab : nomCollab,
                    prenomCollab:prenomCollab,
                    emailCollab:emailCollab,
                    agenceCollab:agenceCollab,
                    poleCOllab:poleCOllab,
                    etatCollab:etatCollab,
                    posteCollab:posteCollab,
                    roleCollab:role      
                });
                that.getView().setModel(idCollabModel, "idCollabModel");
            }

               // Ressources Section
    
               var oCollabModel = this.getOwnerComponent().getModel();
               var collabManagerList = []
           
               console.log(oCollabModel)

               var arrayIdString = []
               // Model to Read All The Collaborators Data

               oCollabModel.read("/ZCOLLAB_ENTSet", {
                
                   success: function(data){
                       var xModel = new JSONModel(data);
                       that.getView().setModel(xModel,"odataModel");
                       console.log(xModel)

                       for (let collabData of Object.values(data.results))
                       {    
                        if (collabData.Idcollab == ManagerId)
                        {
                            // Getting The Manager of Each Collaborator
                            var Manager = collabData.Prenom + " " + collabData.Nom;         
                        }
                        if (collabData.Idcollab == RhId)
                        {
                            // Getting The RH Responisble of Each Collaborator
                            var ResponsableRh = collabData.Prenom + " " + collabData.Nom;
                        }
                
                        if ((collabData.IdManager == idCollaborateur) && (collabData.Etat == "En cours" || collabData.Etat == "Intercontrat"))
                                                  
                        {
                            // Setting The Collaborators List of Each Manager
                            let newCollab = {
                                IdCollab:collabData.Idcollab ,
                                Collab:collabData.Prenom + " " + collabData.Nom
                            }
                            collabManagerList.push(newCollab)
                            
                        }
   
                       }

                       // Adding The Manager Of Each Collaborator To The Model
                       var Data = idCollabModel.getData();
                       Data.Manager = Manager;
                       idCollabModel.setData(Data);
                                              
                       
                       // Check if the Manager List is Empty or not 
                       // If it is filled , Setting the Collaborators List of Each Manager to the model
                       // If it is empty , Adding The Manager Of Each Collaborator To The Model
                       if (collabManagerList.length != 0)
                       {
                        var currentData = oUserModel.getData();
                        currentData.Manager = Manager;
                        currentData.ResponsableRh = ResponsableRh;
                        currentData.collabManagerList=collabManagerList
                        oUserModel.setData(currentData);
                       }
                       else
                       {
                        var currentData = oUserModel.getData();
                        currentData.Manager = Manager;
                        currentData.ResponsableRh = ResponsableRh;
                        oUserModel.setData(currentData);
                       }

                       // This checks the number of collaborators saved , it is used to generate automatically the ID of the next collaborator once added by RH team
                       for (let collabData of Object.values(data.results))
                       { 
                            arrayIdString.push(collabData.Idcollab)
                       } 

                       var arrayIdNumber = arrayIdString.map((i) => Number(i));
                       const maxId = Math.max(...arrayIdNumber)
                       var xValueModel = new JSONModel({ xValue: maxId });
                       that.getView().setModel(xValueModel, "xValueModel");
                       
                   },
                   error: function(oError){
                       console.log(oError);
                   }
                   });


                  /*  var oCollabManagerModel = this.getOwnerComponent().getModel();       
                   console.log(oCollabModel)
            
                   oCollabManagerModel.read("/ZCOLLAB_ENTSet", {

                    filters: [new sap.ui.model.Filter("IdManager", sap.ui.model.FilterOperator.EQ, idCollaborateur)],

                       success: function(data)
                       {
                            var oCollabManModel = new JSONModel(data);
                            that.getView().setModel(oCollabManModel,"oCollabManModel");
                            console.log(data);
                       },               
                       error: function(oError)
                       {
                            console.log(oError);
                       }
                }) */


            // Setting up the sections viewed by each role
            var listItem = this.getView().byId("navigationList");
                listItem.addEventDelegate({
                onAfterRendering: function() {
                  
                    if (role == "collaborateur")
                    {
                        
                        console.log("collab")
                        setTimeout(function() {
                            var items = listItem.getItems();
                            
                            if (items[2]) {
                                items[2].setVisible(false);
                            }
                            if (items[3]) {
                                var subItems3 = items[3].getItems();
                                if (subItems3[1]) {
                                    subItems3[1].setVisible(false);
                                }
                                if (subItems3[2]) {
                                    subItems3[2].setVisible(false);
                                }
                            }
                            if (items[4]) {
                                var subItems4 = items[4].getItems();
                                if (subItems4[1]) {
                                    subItems4[1].setVisible(false);
                                }
                            }
                        }, 0);
                    }
                    else if  (role == "manager")
                    {   
                        console.log('Manager') 
                        that.getView().byId("collabTable").setVisible(true)

                    }
                    else if  (role == "RH")
                    {   
                        console.log('RH')
                        that.getView().byId("collabTable").setVisible(true)
                    } 
                }
            });

            this.getAnciennete(userData.DateDemarrage,"ancienneteProfile")

            /*Consolidataion Des Résultats*/

            var oAutoEvalModel = this.getOwnerComponent().getModel();

            oAutoEvalModel.read("/ZAUTOEVAL_ENTSet", {
                
                success: function(data){
                    var oAutoEvalModel = new JSONModel(data)
                    that.getView().setModel(oAutoEvalModel,"oAutoEvalModel")
                    console.log(oAutoEvalModel)  
                },
                error: function(oError){
                    console.log(oError);
                }
                });

            var oAutoEvalCollabModel = this.getOwnerComponent().getModel();

            console.log(idCollaborateur)
          
            oAutoEvalCollabModel.read("/ZAUTOEVAL_ENTSet", {

                filters: [new sap.ui.model.Filter("Idcollab", sap.ui.model.FilterOperator.EQ, idCollaborateur)],
                
                success: function(data){
                    var oAutoEvalCollabModel = new JSONModel(data);         
                    that.getView().setModel(oAutoEvalCollabModel,"oAutoEvalCollabModel");
                    if (data)
                    {
                        
                        console.log(data)
                    if ( data.results.find(obj => obj.Trimestre === quarter) )
                        {
                            that.byId("noAutoEval").setVisible(true);
                            that.byId("evaluationCollab").setVisible(false);
                        }
                    }
                     
                },
                error: function(oError){
                    console.log(oError);
                }
                });

            var oEvalModel = this.getOwnerComponent().getModel();
            var filterObject = {}
            var managersArray = []
            var collabArray = []
            var trimestreArray = []
            var arr =[]
            var arr1=[]
            var arr2=[]
            var obj = []

            oEvalModel.read("/ZEVAL_ENTSet", {
                
                success: function(data){
                        
                    for (let evalData of Object.values(data.results))
                       {                
                            evalData.NomComplet = evalData.Prenom + " " + evalData.Nom 
                            managersArray.push(evalData.Prenom + " " + evalData.Nom)
                            collabArray.push(evalData.Collaborateur)
                            trimestreArray.push(evalData.Trimestre)                   
                       } 

                        var oEvalModel = new JSONModel(data)
                        that.getView().setModel(oEvalModel,"oEvalModel")
                        console.log((oEvalModel))

                    filterObject.Managers = [...new Set(managersArray)];
                    for (let manager in Object.values(filterObject.Managers))
                    {
                        let newManager =
                        {
                            Manager : filterObject.Managers[manager]
                        }
                        arr.push(newManager)   
                    }
                    console.log(arr)

                    filterObject.Collabs = [...new Set(collabArray)];
                    for (let collab in Object.values(filterObject.Collabs))
                    {
                        let newCollab =
                        {
                            Collaborateur : filterObject.Collabs[collab]
                        }
                        arr1.push(newCollab)
                    } 

                    filterObject.Trimestres = [...new Set(trimestreArray)];
                    for (let trimestre in Object.values(filterObject.Trimestres))
                    {
                        let newTrimestre =
                        {
                            Trimestre : filterObject.Trimestres[trimestre]
                        }
                        arr2.push(newTrimestre)
                    }
                    obj.push(arr,arr1,arr2)
                    console.log(obj)
              
                    var oFilterObjectModel = new JSONModel(obj)
                    that.getView().setModel(oFilterObjectModel,"oFilterObjectModel")
                    console.log(oFilterObjectModel)
                    console.table(filterObject)
                    console.log(oEvalModel)  
                },
                error: function(oError){
                    console.log(oError);
                }
                });

                this.applyData = this.applyData.bind(this);
                this.fetchData = this.fetchData.bind(this);
                this.getFiltersWithValues = this.getFiltersWithValues.bind(this);
/*                 this.oSmartVariantManagement = this.getView().byId("svm");
 */                this.oExpandedLabel = this.getView().byId("expandedLabel");
                this.oSnappedLabel = this.getView().byId("snappedLabel");
                this.oFilterBar = this.getView().byId("filterbar");
                this.oTable = this.getView().byId("table");  
                this.oFilterBar.registerFetchData(this.fetchData);
                this.oFilterBar.registerApplyData(this.applyData);
                this.oFilterBar.registerGetFiltersWithValues(this.getFiltersWithValues);
    
                var oPersInfo = new PersonalizableInfo({
                    type: "filterBar",
                    keyName: "persistencyKey",
                    dataSource: "",
                    control: this.oFilterBar
                });
            /*     this.oSmartVariantManagement.addPersonalizableControl(oPersInfo);
                this.oSmartVariantManagement.initialise(function () {}, this.oFilterBar); */

            
                var oEngPulseModel = this.getOwnerComponent().getModel();
          
                oEngPulseModel.read("/ZENGPULSE_ENTSet", {
    
                    success: function(data){
                        var oEngPulseModel = new JSONModel(data);         
                        that.getView().setModel(oEngPulseModel,"oEngPulseModel");
                        console.log(oEngPulseModel)
                       
                         
                    },
                    error: function(oError){
                        console.log(oError);
                    }
                    });



            var oEngPulseCollabModel = this.getOwnerComponent().getModel();
          
            oEngPulseCollabModel.read("/ZENGPULSE_ENTSet", {

                filters: [new sap.ui.model.Filter("Idcollab", sap.ui.model.FilterOperator.EQ, idCollaborateur)],
                
                success: function(data){
                    var oEngPulseCollabModel = new JSONModel(data);         
                    that.getView().setModel(oEngPulseCollabModel,"oEngPulseCollabModel");
                    if (data)
                    {
                        console.log(data)   
                        if ( data.results.find(obj => obj.Semestre === semester) )
                        {
                            that.byId("noEngPulse").setVisible(true);
                            that.byId("engagementCollab").setVisible(false);
                            console.log("Hello Darkness")
                        }            
                    }
                     
                },
                error: function(oError){
                    console.log(oError);
                }
                });

            /*Auto Evaluation COLLAB Section*/

               /* VISIBILITY */

                this.getView().byId("collabDetails").setVisible(false);   
                this.byId("saveButton").setVisible(false);
                this.byId("cancelButton").setVisible(false);
                this.byId("collabInfosEdit").setVisible(false);
                this.byId("collabCoordEdit").setVisible(false);
                this.byId("collabTableSection").setVisible(false);
                this.byId("addCollabSection").setVisible(false);
                this.byId("headerInfoDisplay").setVisible(true);
                this.byId("headerInfoEdit").setVisible(false);
                this.byId("noAutoEval").setVisible(false);
                this.byId("infoPanel2").setVisible(false);
                this.byId("infoPanel3").setVisible(false);
                this.getView().byId("collabEvalDetails").setVisible(false);   
                this.getView().byId("collabEngPulseDetails").setVisible(false);   
                this.byId("noEngPulse").setVisible(false);
  
                var busyLoader = this.byId("busyLoader");
                var collabTableSection = this.byId("collabTableSection");
            
                setTimeout(function() {
                    busyLoader.setVisible(false);
                    collabTableSection.setVisible(true)
                }, 4000); 
                
            }, 

            animateCounter: function (start, end, duration,counterText,customText) {
                var counterText = this.byId(counterText);
                var startTime = null;
    
                var step = (timestamp) => {
                    if (!startTime) {
                        startTime = timestamp;
                    }
                    var progress = timestamp - startTime;
                    var currentNumber = Math.min(Math.floor(start + (progress / duration) * end - start), end);
    
                    counterText.setText(customText + currentNumber);
    
                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    }
                };
    
                window.requestAnimationFrame(step);
            },


        onPageReload ()
        {
            window.location.reload()
        },

        getIDEval (mode)
        {
            var idCollabConn = this.getView().getModel("idCollabModel").getProperty("/idCollaborateur");
            var result = '';
            var characters = '0123456789';
              
            for (var i = 0; i < 10; i++) {
                result += characters.charAt(Math.floor(Math.random() * 10));
            }
            
            var IDEVAL= mode + idCollabConn + result;            
            return IDEVAL
        },

        getCurrentDate: function() {
            var now = new Date();
            var day = String(now.getDate())
            var month = String(now.toLocaleString('default', { month: 'long' }));
            var year = String(now.getFullYear())
         
           return (day  + " " + month + " " + year)
 
        },
 
        onSendAutoEval () 
        {
            var answersTab = []
            var month = new Date().getMonth() // getMonth() returns 0-11 (January is 0, December is 11)
            var year = new Date().getFullYear()
            var now = new Date();
            var hours = String(now.getHours()).padStart(2, '0');
            var minutes = String(now.getMinutes()).padStart(2, '0');
            var seconds = String(now.getSeconds()).padStart(2, '0');
            
            if (month <= 2) {
                var period = "Q1"; // January to March
            } else if (month <= 5) {
                var period = "Q2"; // April to June
            } else if (month <= 8) {
                var period = "Q3"; // July to September
            } else {
                var period = "Q4"; // October to December
            }

            for (var i = 1; i <= 5; i++) {

                var oRadioButtonGroup = this.getView().byId("radioQuestions" + i);;
                var indice = oRadioButtonGroup.getSelectedIndex()   
                answersTab.push(indice+1)
            }           

            var oCommentAnswer = this.getView().byId("comment").getValue();
            answersTab.push(oCommentAnswer)
            console.log(answersTab) 
            
            var IDEVAL = this.getIDEval("AUTOEVAL")
            var Trimestre = period + "-" + year
            var endAutoEval = hours + ":" + minutes + ":" + seconds;
            var iDCollabConn = this.getView().getModel("idCollabModel").getProperty("/idCollaborateur")
            var Nom = this.getView().getModel("idCollabModel").getProperty("/nomCollab")
            var Prenom = this.getView().getModel("idCollabModel").getProperty("/prenomCollab")
            var Email = this.getView().getModel("idCollabModel").getProperty("/emailCollab")
            var Agence = this.getView().getModel("idCollabModel").getProperty("/agenceCollab")
            var Pole = this.getView().getModel("idCollabModel").getProperty("/poleCOllab")
            var Etat = this.getView().getModel("idCollabModel").getProperty("/etatCollab")
            var Poste = this.getView().getModel("idCollabModel").getProperty("/posteCollab")
            var Manager = this.getView().getModel("idCollabModel").getProperty("/Manager")
            var startAutoEval = this.getView().getModel("startAutoEvalModel").getProperty("/startAutoEval");
            var dateAutoEval = this.getCurrentDate()
            var autoEvalData = {
                IdAutoeval : IDEVAL,
                Nom : Nom,
                Email : Email,
                DateA : dateAutoEval,
                HDebut : startAutoEval,
                Prenom : Prenom,
                Agence : Agence,
                HFin : endAutoEval,
                Pole : Pole,
                Trimestre : Trimestre,
                Manager : Manager, 
                Etat : Etat,
                Poste : Poste,
                Question1 : answersTab[0].toString(),
                Question2 : answersTab[1].toString(),
                Question3 : answersTab[2].toString(),
                Question4 : answersTab[3].toString(),
                Question5 : answersTab[4].toString(),
                Commentaire : answersTab[5].toString(),
                Idcollab : iDCollabConn
            }

            console.table(autoEvalData)
            var that =this
            var oAutoEvalModel = this.getOwnerComponent().getModel();
           
            oAutoEvalModel.create("/ZAUTOEVAL_ENTSet",autoEvalData, {
                success: function(){
                    console.log("Auto Eval Added Successfully !")  
                    that.byId("noAutoEval").setVisible(true);
                    that.byId("evaluationCollab").setVisible(false);
                },        
                error: function(oError){
                    console.log(oError)
                }
                });

                this.onSuccessMessageDialogPress("Votre réponse a été envoyée.","Nous vous remercions pour le temps que vous avez consacré à votre auto-évaluation ✅","Votre manager reviendra vers vous dans les prochains jours pour finaliser le processus d'entretien d'évaluation des performances par un échange de vive voix 🌟","Cet échange est votre moment privilégié de partage et de proximité, nous vous invitons à en profiter 🚀","Excellente journée.")
            },

        pressOnMe : function ()
        {
            this.onSuccessMessageDialogPress("Votre réponse a été envoyée.","Nous vous remercions pour le temps que vous avez consacré à votre auto-évaluation ✅","Votre manager reviendra vers vous dans les prochains jours pour finaliser le processus d'entretien d'évaluation des performances par un échange de vive voix 🌟","Cet échange est votre moment privilégié de partage et de proximité, nous vous invitons à en profiter 🚀","Excellente journée.")
        },

        onSuccessMessageDialogPress: function (SUCCESSDESC,SUCCESSDESC2,SUCCESSDESC3,SUCCESSDESC4,SUCCESSDESC5) {
			if (!this.oSuccessMessageDialog) {
				this.oSuccessMessageDialog = new Dialog({
					type: DialogType.Message,
					title: "Success",
					state: ValueState.Success,
                    contentWidth:"1400px",
                    content: [
                      
                        new HBox({
                            items: [

                                new VBox(
                                    {   
                                        justifyContent: "Center",
                                        items : [
                                            new Text({
                                                text: SUCCESSDESC,
                                                textAlign: "Left",     
                                          }).addStyleClass("customTextStyle"),    
                                            new Text({
                                                text: SUCCESSDESC2,
                                                textAlign: "Left",     
                                        }).addStyleClass("customTextStyle2"),  
                                            new Text({
                                                text: SUCCESSDESC3,
                                                textAlign: "Left",     
                                        }).addStyleClass("customTextStyle"),  
                                            new Text({
                                                text: SUCCESSDESC4,
                                                textAlign: "Left",     
                                        }).addStyleClass("customTextStyle"),   
                                            new Text({
                                                text: SUCCESSDESC5,
                                                textAlign: "Left",     
                                        }).addStyleClass("customTextStyle"),                                      
                                        ]
                                    }
                                ),
                                                                       
                                new Image({ 
                                    src: "{imageModel>/path}/utils/images/astronaut.png",
                                    
                                })
                            ],
                            
                            justifyContent: "Center"
                        })],
                                   
					beginButton: new Button({
						type: ButtonType.Success,
						text: "OK",
						press: function () {
							this.oSuccessMessageDialog.close();
                            window.location.reload();
						}.bind(this)
					})
				});
			}

			this.oSuccessMessageDialog.open();


		},

        onStartAutoEval ()
        {   
            this.getView().byId("radioQuestions1").setEnabled(true)
            this.getView().byId("radioQuestions2").setEnabled(true)
            this.getView().byId("radioQuestions3").setEnabled(true)
            this.getView().byId("radioQuestions4").setEnabled(true)
            this.getView().byId("radioQuestions5").setEnabled(true)
            this.getView().byId("comment").setEnabled(true)

            var now = new Date();
            var day = String(now.getDate())
            var month = String(now.toLocaleString('default', { month: 'long' }));
            var year = String(now.getFullYear())
                console.log(day  + " " + month + " " + year)

            var hours = String(now.getHours()).padStart(2, '0');
            var minutes = String(now.getMinutes()).padStart(2, '0');
            var seconds = String(now.getSeconds()).padStart(2, '0');
            var startAutoEval = hours + ":" + minutes + ":" + seconds;
            var startAutoEvalModel = new JSONModel({ startAutoEval: startAutoEval });
            this.getView().setModel(startAutoEvalModel, "startAutoEvalModel");

            console.log(startAutoEval)
            
        },        

        onDisappearInfoPanel2 ()
        {
            var that=this
            this.getView().byId("radioQuest1").setEnabled(true)
            this.getView().byId("radioQuest2").setEnabled(true)
            this.getView().byId("radioQuest3").setEnabled(true)
            this.getView().byId("radioQuest4").setEnabled(true)
            this.getView().byId("radioQuest5").setEnabled(true)
            this.getView().byId("radioQuest6").setEnabled(true)
            this.getView().byId("commentEval").setEnabled(true)
            this.getView().byId("infoPanel3").setVisible(false)

            var quarterNow = new JSONModel({quarter : quarter});         
            this.getView().setModel(quarterNow,"quarterNow");            
            this.getView().byId("infoPanel2").setVisible(false)
            var Collab = this.byId("collabSelect").getSelectedItem().getKey()
            var idCollaborateur = this.getView().getModel("idCollabModel").getProperty("/idCollaborateur")
            console.log(Collab)
            var oEvalCollabModel = this.getOwnerComponent().getModel();

            oEvalCollabModel.read("/ZEVAL_ENTSet", {

                filters: [new sap.ui.model.Filter("Idmanager", sap.ui.model.FilterOperator.EQ, idCollaborateur)],
        
                success: function(data){    
                    if (data)
                    {   
                        
                    if ( data.results.find((obj => obj.Trimestre === quarter) && (obj => obj.Idcollab === Collab)) )
                        {
                            that.getView().byId("radioQuest1").setEnabled(false)
                            that.getView().byId("radioQuest2").setEnabled(false)
                            that.getView().byId("radioQuest3").setEnabled(false)
                            that.getView().byId("radioQuest4").setEnabled(false)
                            that.getView().byId("radioQuest5").setEnabled(false)
                            that.getView().byId("radioQuest6").setEnabled(false)
                            that.getView().byId("commentEval").setEnabled(false)            
                            that.getView().byId("infoPanel3").setVisible(true)

                            setTimeout(function() {
                                $( that.getView().byId("infoPanel3").getDomRef()).animate({
                                    opacity: 0,
                                    top: "-=50" 
                                },"slow", function() {
                                    that.getView().byId("infoPanel3").setVisible(false);
                                });

                            }, 5000);
                        }
                    }
                },
                error: function(oError){
                    console.log(oError);
                }
                });

        },
        
        onStartEval ()
        {    
            this.getView().byId("collabSelect").setEnabled(true)
            this.getView().byId("radioQuest1").setEnabled(true)
            this.getView().byId("radioQuest2").setEnabled(true)
            this.getView().byId("radioQuest3").setEnabled(true)
            this.getView().byId("radioQuest4").setEnabled(true)
            this.getView().byId("radioQuest5").setEnabled(true)
            this.getView().byId("radioQuest6").setEnabled(true)
            this.getView().byId("commentEval").setEnabled(true)
           $( this.getView().byId("infoPanel1").getDomRef()).animate({
                opacity: 0,
                top: "-=50" 
            },"slow", function() {
                that.getView().byId("infoPanel1").setVisible(false);
            });
            this.getView().byId("infoPanel2").setVisible(true)

            var now = new Date();
            var hours = String(now.getHours()).padStart(2, '0');
            var minutes = String(now.getMinutes()).padStart(2, '0');
            var seconds = String(now.getSeconds()).padStart(2, '0');
            var startEval = hours + ":" + minutes + ":" + seconds;
            var startEvalModel = new JSONModel({ startEval: startEval });
            this.getView().setModel(startEvalModel, "startEvalModel");

            console.log(startEval)
        },

        onStartEngPulse ()
        {
            this.getView().byId("radioEngPulseQuestions2").setEnabled(true)
            this.getView().byId("radioEngPulseQuestions3").setEnabled(true)
            this.getView().byId("radioEngPulseQuestions4").setEnabled(true)
            this.getView().byId("radioEngPulseQuestions5").setEnabled(true)
            this.getView().byId("radioEngPulseQuestions6").setEnabled(true)
            this.getView().byId("radioEngPulseQuestions7").setEnabled(true)
            this.getView().byId("radioEngPulseQuestions8").setEnabled(true)
            this.getView().byId("radioEngPulseQuestions9").setEnabled(true)
            this.getView().byId("radioEngPulseQuestions10").setEnabled(true)
            this.getView().byId("radioEngPulseQuestions11").setEnabled(true)
            this.getView().byId("radioEngPulseQuestions12").setEnabled(true)
            this.getView().byId("commentEng1").setEnabled(true)
            this.getView().byId("commentEng2").setEnabled(true)
            this.getView().byId("commentEng3").setEnabled(true)
            var now = new Date();
            var hours = String(now.getHours()).padStart(2, '0');
            var minutes = String(now.getMinutes()).padStart(2, '0');
            var seconds = String(now.getSeconds()).padStart(2, '0');
            var startEngPulse = hours + ":" + minutes + ":" + seconds;
            var startEngPulseModel = new JSONModel({ startEngPulse: startEngPulse });
            this.getView().setModel(startEngPulseModel, "startEngPulseModel");
            console.log(startEngPulse)
        },

        onSendEngPulse ()
        { 
            var answersTab = []
            var month = new Date().getMonth() // getMonth() returns 0-11 (January is 0, December is 11)
            var year = new Date().getFullYear()
            var now = new Date();
            var hours = String(now.getHours()).padStart(2, '0');
            var minutes = String(now.getMinutes()).padStart(2, '0');
            var seconds = String(now.getSeconds()).padStart(2, '0');
            
            if (month <= 6)
            {
                var period = "S1"; 
            }
            else 
            {
                var period = "S2"; 
            }

            var role = (this.getView().getModel("idCollabModel").getProperty("/roleCollab"))
            answersTab.push((role=="manager") ? "Oui" : "Non")
            var x = this.getView().byId("radioEngPulseQuestions2").getSelectedButton().getText()
            
            answersTab.push(x)
            answersTab.push(this.getView().byId("radioEngPulseQuestions3").getSelectedButton().getText())
            answersTab.push(this.getView().byId("radioEngPulseQuestions4").getSelectedButton().getText())
            answersTab.push(this.getView().byId("commentEng1").getValue())
            answersTab.push(this.getView().byId("commentEng2").getValue())
            answersTab.push(this.getView().byId("commentEng3").getValue())

            for (var i = 5; i <= 12; i++) {

                var oRadioButtonGroup = this.getView().byId("radioEngPulseQuestions" + i);;
                var indice = oRadioButtonGroup.getSelectedIndex()   
                answersTab.push(indice+1)

            }     
            
            var IDENGPULSE = this.getIDEval("ENGPULSE")
            var Semestre = period + "-" + year
            var endEngPulse = hours + ":" + minutes + ":" + seconds;
            var iDCollabConn = this.getView().getModel("idCollabModel").getProperty("/idCollaborateur")
            var startEngPulse = this.getView().getModel("startEngPulseModel").getProperty("/startEngPulse");
            var Nom = this.getView().getModel("idCollabModel").getProperty("/nomCollab")
            var Prenom = this.getView().getModel("idCollabModel").getProperty("/prenomCollab")
            var Agence = this.getView().getModel("idCollabModel").getProperty("/agenceCollab")
            var Pole = this.getView().getModel("idCollabModel").getProperty("/poleCOllab")
            var dateEngPulse = this.getCurrentDate()
            var EngPulseData = {
                IdEngpulse : IDENGPULSE,
                Nom : Nom,
                Prenom : Prenom,
                Semestre : Semestre,
                DateEp : dateEngPulse,
                HDebut : startEngPulse,
                HFin : endEngPulse,
                Role : role,
                Agence : Agence,
                Pole : Pole,
                Question1 : answersTab[0].toString(),
                Question2 : answersTab[1].toString(),
                Question3 : answersTab[2].toString(),
                Question4 : answersTab[3].toString(),   
                Question5 : answersTab[4].toString(),
                Question6 : answersTab[5].toString(),
                Question7 : answersTab[6].toString(),
                Question8 : answersTab[7].toString(),
                Question9 : answersTab[8].toString(),
                Question10 : answersTab[9].toString(),   
                Question11 : answersTab[10].toString(),
                Question12 : answersTab[11].toString(),
                Question13 : answersTab[12].toString(),
                Question14 : answersTab[13].toString(),
                Question15 : answersTab[14].toString(),
                Idcollab : iDCollabConn
            }
            console.log(EngPulseData)

            var oEngPulseModel = this.getOwnerComponent().getModel();
           
            oEngPulseModel.create("/ZENGPULSE_ENTSet",EngPulseData, {
                success: function(){
                    console.log("Engagement Pulse Added Successfully !")  // You will get Bad Request beacuse NoteGlobale doesn"t support 2.33 (value with .)

                },  
                
                error: function(oError){
                    console.log(oError)
                }
                });

            this.onSuccessMessageDialogPress("Votre réponse a été envoyée.","Nous vous remercions pour le temps que vous avez consacré à l'évaluation d'engagement pulse ✅","L'équipe RH et votre ressource Manager reviendront vers vous pour partager les résultats d'évaluation par un échange de vive voix et de clôturer l'exercice🌟","Cet échange est votre moment privilégié de partage et de proximité, nous vous invitons à en profiter 🚀","Excellente journée.") 

        },
  
        onSendEval () 
        {    
            var answersTab = []
            var month = new Date().getMonth() // getMonth() returns 0-11 (January is 0, December is 11)
            var year = new Date().getFullYear()
            var now = new Date();
            var hours = String(now.getHours()).padStart(2, '0');
            var minutes = String(now.getMinutes()).padStart(2, '0');
            var seconds = String(now.getSeconds()).padStart(2, '0');
            
            if (month <= 2) {
                var period = "Q1"; // January to March
            } else if (month <= 5) {
                var period = "Q2"; // April to June
            } else if (month <= 8) {
                var period = "Q3"; // July to September
            } else {
                var period = "Q4"; // October to December
            }

            for (var i = 1; i <= 6; i++) {

                var oRadioButtonGroup = this.getView().byId("radioQuest" + i);;
                var indice = oRadioButtonGroup.getSelectedIndex()   
                if ((i==3) || (i==5))
                {
                    if (indice == 0)
                    {
                        answersTab.push(indice+5)
                    }
                    else 
                    {
                        answersTab.push(indice+2)
                    }

                }  
                else if (i==4)
                {
                    if (indice == 0)
                    {
                        answersTab.push(indice+1)
                    }
                    else 
                    {
                        answersTab.push(indice+2)
                    }
                } 
                else
                {
                    answersTab.push(indice+1)
                }
            }           

            var oCommentAnswer = this.getView().byId("commentEval").getValue();
            answersTab.push(oCommentAnswer)
            console.log(answersTab) 
            var sum = 0

            for (var i = 0; i <= 5; i++)
            {
                sum = sum + answersTab[i]
            }

            var IDEVAL = this.getIDEval("EVAL")
            var Trimestre = period + "-" + year
            var endAutoEval = hours + ":" + minutes + ":" + seconds;
            var iDCollabConn = this.getView().getModel("idCollabModel").getProperty("/idCollaborateur")
            var startAutoEval = this.getView().getModel("startEvalModel").getProperty("/startEval");
            var NoteGlobale =  parseFloat((sum / 6).toFixed(2))
            var Nom = this.getView().getModel("idCollabModel").getProperty("/nomCollab")
            var Prenom = this.getView().getModel("idCollabModel").getProperty("/prenomCollab")
            var Email = this.getView().getModel("idCollabModel").getProperty("/emailCollab")
            var Agence = this.getView().getModel("idCollabModel").getProperty("/agenceCollab")
            var Pole = this.getView().getModel("idCollabModel").getProperty("/poleCOllab")
            var Idcollab = this.byId("collabSelect").getSelectedItem().getKey()
            var Collaborateur = this.byId("collabSelect").getSelectedItem().getText()
            var dateEval = this.getCurrentDate()
            var EvalData = {
                IdEval : IDEVAL,
                Nom : Nom,
                HDebut : startAutoEval,
                Datee : dateEval,
                Prenom : Prenom,
                Email : Email,
                Collaborateur:Collaborateur,
                HFin : endAutoEval,
                Agence : Agence,
                Trimestre : Trimestre,
                Pole: Pole,
                Question1 : answersTab[0].toString(),
                Question2 : answersTab[1].toString(),
                Question3 : answersTab[2].toString(),//Si oui 5 , sinon 3
                Question4 : answersTab[3].toString(),//Si oui 1 , sinon 3   
                Question5 : answersTab[4].toString(),//Si oui 5 , sinon 3
                Question6 : answersTab[5].toString(),
                Commentaire : answersTab[6].toString(),
                NoteGlobale : NoteGlobale.toString(),
                Idmanager:iDCollabConn,
                Idcollab : Idcollab
            }

            console.table(EvalData)
            var oEvalModel = this.getOwnerComponent().getModel();
           
            oEvalModel.create("/ZEVAL_ENTSet",EvalData, {
                success: function(){
                    console.log("Eval Added Successfully !")  // You will get Bad Request beacuse NoteGlobale doesn"t support 2.33 (value with .)
            
                },  
                
                error: function(oError){
                    console.log(oError)
                }
                });

                this.onSuccessMessageDialogPress("Votre réponse a été envoyée.","Nous vous remercions pour le temps que vous avez consacré à l'évaluation de performance pulse de votre collaborateur ✅","L'équipe RH et votre ressource Manager reviendront vers vous pour partager les résultats d'évaluation des performances trimesterielles de votre équipe par un échange de vive voix et de clôturer l'exercice🌟","Cet échange est votre moment privilégié de partage et de proximité, nous vous invitons à en profiter 🚀","Excellente journée.") 
            },
    
         onDisconnect ()
         {     
            localStorage.removeItem("userData");

            // Navigate to the authentication page
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("Authentification", {}, true); 
            window.location.reload();
         },

        onEdit () 
        {
            this.byId("editButton").setVisible(false);
            this.byId("deleteButton").setVisible(false);
            this.byId("cancelButton").setVisible(true);
			this.byId("saveButton").setVisible(true);
			this.byId("collabInfosEdit").setVisible(true);
            this.byId("collabCoordEdit").setVisible(true);
			this.byId("collabInfosDisplay").setVisible(false);
            this.byId("collabCoordDisplay").setVisible(false);
            this.byId("headerInfoDisplay").setVisible(false);
            this.byId("headerInfoEdit").setVisible(true);
        },

        onCancel: function() {
 
            this.byId("cancelButton").setVisible(false);
            this.byId("collabInfosDisplay").setVisible(true);
            this.byId("collabCoordDisplay").setVisible(true);
            this.byId("headerInfoDisplay").setVisible(true);
            this.byId("saveButton").setVisible(false);
            this.byId("editButton").setVisible(true);
            this.byId("collabInfosEdit").setVisible(false);
            this.byId("collabCoordEdit").setVisible(false);
            this.byId("headerInfoEdit").setVisible(false);
            this.byId("deleteButton").setVisible(true);
            this.byId("AutoEvalSectionR").setVisible(true);

        },
 
        onWindowResize() {
            const oSideNavigation = this.byId("sideNavigation");
            const screenWidth = window.innerWidth;   
            if (screenWidth < 1255) {
                oSideNavigation.setExpanded(false);
            }
        },
 
        onItemSelect: function (oEvent) {
            var oItem = oEvent.getParameter("item");
            this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
        },
 
        handleUserNamePress: function (event) {
            var oPopover = new Popover({
                showHeader: false,
                placement: PlacementType.Bottom,
                content: [
                    new Button({
                        text: 'Feedback',
                        type: ButtonType.Transparent
                    }),
                    new Button({
                        text: 'Help',
                        type: ButtonType.Transparent
                    }),
                    new Button({
                        text: 'Logout',
                        type: ButtonType.Transparent
                    })
                ]
            }).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');
            oPopover.openBy(event.getSource());
        },
 
        onSideNavButtonPress: function () {
            var oToolPage = this.byId("toolPage");
            var bSideExpanded = oToolPage.getSideExpanded();
            this._setToggleButtonTooltip(bSideExpanded);
            oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
        },
 
        _setToggleButtonTooltip: function (bLarge) {
            var oToggleButton = this.byId('sideNavigationToggleButton');
            if (bLarge) {
                oToggleButton.setTooltip('Large Size Navigation');
            } else {
                oToggleButton.setTooltip('Small Size Navigation');
            }
        },
 
        onSearch: function(oEvent)  
        {
            var query = oEvent.getSource().getValue();
            var oList = this.byId("collabTable");
            var oBinding = oList.getBinding("items");
            var aFilter = [];
            if (query)
            {
                var oFilter = new Filter({
                    filters: [      
                      new Filter("Nom", FilterOperator.Contains, query),
                      new Filter("Prenom", FilterOperator.Contains, query),                     
                    ]})
                aFilter.push(oFilter);                
            }
            oBinding.filter(aFilter);
        },
        
        onItemSelected: function(oEvent) {
           
            this.getView().byId("collabDetails").setVisible(true);   
            this.getView().byId("collabTableSection").setVisible(false);
            var oSelectedItem = oEvent.getSource();
            var oContext = oSelectedItem.getBindingContext("odataModel");
            var sPath = oContext.getPath();
            console.log(sPath)
            var oCollabDetailPanel = this.byId("collabDetails");
            oCollabDetailPanel.bindElement({ path: sPath, model: "odataModel" });
            
            var currentIdCollab = new JSONModel({ 
                    currentIdCollab: (this.getView().getModel("odataModel").getProperty(sPath)).Idcollab ,
                    currentCivilite: (this.getView().getModel("odataModel").getProperty(sPath)).Civilite ,
                    currentNom: (this.getView().getModel("odataModel").getProperty(sPath)).Nom ,
                    currentPrenom: (this.getView().getModel("odataModel").getProperty(sPath)).Prenom ,
                    currentType: (this.getView().getModel("odataModel").getProperty(sPath)).Type ,
                    currentPole: (this.getView().getModel("odataModel").getProperty(sPath)).Pole ,
                    currentFonction: (this.getView().getModel("odataModel").getProperty(sPath)).Fonction ,
                    currentAgence : (this.getView().getModel("odataModel").getProperty(sPath)).Agence ,
                    currentDateCreation : (this.getView().getModel("odataModel").getProperty(sPath)).DateCreation,
                    currentIdManager : (this.getView().getModel("odataModel").getProperty(sPath)).IdManager,
                    currentIdRh : (this.getView().getModel("odataModel").getProperty(sPath)).IdRh,
                    currentLogin : (this.getView().getModel("odataModel").getProperty(sPath)).Login,
                    currentPassword : (this.getView().getModel("odataModel").getProperty(sPath)).MotDePasse,
                    currentRole :  (this.getView().getModel("odataModel").getProperty(sPath)).Role,
                    currentState : (this.getView().getModel("odataModel").getProperty(sPath)).Etat,     
                    currentStartDate : (this.getView().getModel("odataModel").getProperty(sPath)).DateDemarrage,
                    currentEtat : (this.getView().getModel("odataModel").getProperty(sPath)).Etat
                    
                });

            this.getView().setModel(currentIdCollab, "currentIdCollabModel");       
            var currentStartDate = this.getView().getModel("currentIdCollabModel").getProperty("/currentStartDate");
            this.getAnciennete(currentStartDate,"anciennete")
            this.getAnciennete(currentStartDate,"anciennete_edit")

            //Model to read AUTOEVAL FOR COLLABORATOR

            var currentId = this.getView().getModel("currentIdCollabModel").getProperty("/currentIdCollab");
            console.log(currentId)

            var currentIdManager = this.getView().getModel("currentIdCollabModel").getProperty("/currentIdManager");
            console.log(currentIdManager)

            var currentIdRH = this.getView().getModel("currentIdCollabModel").getProperty("/currentIdRh");
            console.log(currentIdRH)

            var that = this

            
            var oAutoEvalSelectedCollabModel = this.getOwnerComponent().getModel();
          
            oAutoEvalSelectedCollabModel.read("/ZAUTOEVAL_ENTSet", {

                filters: [new sap.ui.model.Filter("Idcollab", sap.ui.model.FilterOperator.EQ, currentId)],
                
                success: function(data){
                    console.log(data)
                    var oAutoEvalSelectedCollabModel = new JSONModel(data);         
                    that.getView().setModel(oAutoEvalSelectedCollabModel,"oAutoEvalSelectedCollabModel");
                   
                     
                },
                error: function(oError){
                    console.log(oError);
                }
                });

                //Model to read RH AND MANAGER FOR COLLABORATOR
            
            var oCollabManagerModel = this.getOwnerComponent().getModel()

            oCollabManagerModel.read("/ZCOLLAB_ENTSet", {

                filters: [new sap.ui.model.Filter("Idcollab", sap.ui.model.FilterOperator.EQ, currentIdManager)],

                    success: function(data){
                        var oCollabManager = new JSONModel(data)
                        var Manager =  oCollabManager.oData.results[0].Prenom + " " + oCollabManager.oData.results[0].Nom 
                        var oCollabManagerModel = new JSONModel({Manager : Manager})
                        that.getView().setModel(oCollabManagerModel,"oCollabManagerModel");
                        console.log(Manager)
                                       
                    },
                    error: function(oError){
                        console.log(oError);
                    }
                    });

                var oCollabRHModel = this.getOwnerComponent().getModel()
                oCollabRHModel.read("/ZCOLLAB_ENTSet", {
        
                        filters: [new sap.ui.model.Filter("Idcollab", sap.ui.model.FilterOperator.EQ, currentIdRH)],
     
                            success: function(data){
                                var oCollabRH = new JSONModel(data)
                                var RH =  oCollabRH.oData.results[0].Prenom + " " + oCollabRH.oData.results[0].Nom 
                                var oCollabRHModel = new JSONModel({RH : RH})
                                that.getView().setModel(oCollabRHModel,"oCollabRHModel");
                                console.log(RH)
        
                            },
                            error: function(oError){
                                console.log(oError);
                            }
                            });

        },

            onCheckSelect (checkBox,selectId)
            {

                var checkBoxValue = this.byId(checkBox)
                var selectIdValue = this.byId(selectId)
                selectIdValue.setEnabled(!selectIdValue.getEnabled())
                var firstItem = selectIdValue.getFirstItem()
                selectIdValue.removeItem(firstItem)
                if (checkBoxValue.getSelected()) {
                    checkBoxValue.setEnabled(false);
                }
            }, 

            onCheckSelectFromModel (checkBox,selectModel,selectModelPath)
            {
                var checkBoxValue = this.byId(checkBox)
                
                if (checkBoxValue.getSelected()) {
                    checkBoxValue.setEnabled(false);
                }
                this.byId(selectModel).setVisible(false)
                this.byId(selectModelPath).setVisible(true)

            },

        onEvalSelect : function(oEvent) {
            this.getView().byId("collabEvalDetails").setVisible(true);   
            this.getView().byId("collabEvalSection").setVisible(false);
            var oSelectedItem = oEvent.getSource();
            var oContext = oSelectedItem.getBindingContext("oEvalModel");
            var sPath = oContext.getPath();
            console.log(sPath)
            var oCollabDetailPanel = this.byId("collabEvalDetails");
            oCollabDetailPanel.bindElement({ path: sPath, model: "oEvalModel" });

            var currentEval = new JSONModel({ 
                currentId: (this.getView().getModel("oEvalModel").getProperty(sPath)).Idcollab})

            this.getView().setModel(currentEval, "currentEval"); 

            var oAutoEvalModel = this.getView().getModel("oAutoEvalModel")
            console.log(oAutoEvalModel.oData.results)
            var currentIdEval = this.getView().getModel("currentEval").getProperty("/currentId");
            var collabAutoEvalObj = {}
            var i=-1
            var SPathAE = ""

            console.log(this.getView().getModel("oEvalModel").getProperty(sPath))                      

            for (let collabData of Object.values(oAutoEvalModel.oData.results))
            { 
                i = i+1
                if (currentIdEval == collabData.Idcollab)
                {
                    collabAutoEvalObj =collabData
                    break;
                }
            }
         
            console.log(collabAutoEvalObj)
            console.log(i)
        
            
            if (Object.keys(collabAutoEvalObj).length >0)
            {
                this.getView().byId("autoEvalDetailsSection").setVisible(true);

                SPathAE = "/results/"+String(i)
                oCollabDetailPanel.bindElement({ path: SPathAE, model: "oAutoEvalModel" });
            }
            else
            {
              this.getView().byId("autoEvalDetailsSection").setVisible(false);

                console.log("No Auto Eval")
            } 

        },

        onEngPulseSelect : function(oEvent) 
        {
            this.getView().byId("collabEngPulseDetails").setVisible(true);   
            this.getView().byId("collabEngPulseSection").setVisible(false);
            var oSelectedItem = oEvent.getSource();
            var oContext = oSelectedItem.getBindingContext("oEngPulseModel");
            var sPath = oContext.getPath();
            console.log(sPath)
            var oCollabDetailPanel = this.byId("collabEngPulseDetails");
            oCollabDetailPanel.bindElement({ path: sPath, model: "oEngPulseModel" });
        },

        getAnciennete (currentStartDate,ancienneteId)
        {
            var oDateFormat = DateFormat.getDateInstance({
                pattern: "yyyy-MM-dd" });
            var oDate = new Date();
            var sFormattedDate = oDateFormat.format(oDate);          
            const date1 = new Date(currentStartDate);
            const date2 = new Date(sFormattedDate);
            let yearsDiff = date2.getFullYear() - date1.getFullYear();
            let monthsDiff = date2.getMonth() - date1.getMonth();          
            if (monthsDiff < 0) {
                yearsDiff--;
                monthsDiff += 12; }                              
     
            var anciennete = yearsDiff + " an(s) et " + monthsDiff + " mois"     
            this.byId(ancienneteId).setText(anciennete)
        },

        getLogin :function (DD,CV,PL,AG,IDC)
        {
            //DD : date démarrage
            //CV : civilité
            //PL : pole
            //AG : agence
            //IDC : idcollab
            //Date Demarrage
            const lastTwoDigits = (DD.substr(2,2));
            
            //Civilite
            if (CV == 'Mme.') 
               var civiliteCollab = 'F'
            else if (CV == 'M.')
               var civiliteCollab = 'H'

            //Pole
            if (PL == 'ADMINISTRATIF et FINANCIER')
               var poleCollab = 'A'
            else if ( PL == 'SAP BASIS' )
                var poleCollab = 'B'
            else if (PL == 'COMMERCIAL')
                var poleCollab = 'C'
            else if (PL == 'DIGITAL')
                var poleCollab = 'D'
            else if (PL == 'DIRECTION') 
                var poleCollab = 'Dir'
            else if (PL == 'OPERATION')
                var poleCollab = 'O'
            else if (PL == 'PMO')
                var poleCollab = 'P'
            else if (PL == 'RESSOURCE HUMAINE')
                var poleCollab = 'R'
            else if (PL == 'SAP FONCTIONNEL')
                var poleCollab = 'F'
            else if (PL == 'SAP TECHNIQUE')
                var poleCollab = 'T'

            //Agence
            if (AG == 'AYMAX EGYPTE')
               var agenceCollab = 'A'
            else if (AG == 'AYMAX CONSULTING')
                var agenceCollab = 'B'
            else if (AG == 'AYMAX TECHNOLOGY')
                var agenceCollab = 'T'
            
            return lastTwoDigits+civiliteCollab+poleCollab+agenceCollab+IDC
              
        },

        onCreateCollab () 
        {
            var xValue = this.getView().getModel("xValueModel").getProperty("/xValue");
            var oDateFormat = DateFormat.getDateInstance({
                pattern: "dd/MM/yyyy HH:mm" 
            });

            var oDate = new Date();
            var sFormattedDate = oDateFormat.format(oDate);
            console.log(sFormattedDate)
            var IdCollab = (xValue +1);
            var ReferenceInterne = this.byId("comp").getValue();
            var Civilite = this.byId("civilite_collab").getSelectedItem().getText();   
            var Nom = this.byId("nom_collab").getValue();
            var Prenom = this.byId("prenom_collab").getValue();
            var Type = this.byId("type_collab").getSelectedItem().getText();
            var Etat = this.byId("etat_collab").getSelectedItem().getText();
            var Titre = this.byId("titre_collab").getValue();
            var Domaine = this.byId("domaine_collab").getSelectedItem().getText();
            var Experience = this.byId("xp_collab").getValue();
            var Mobilite = this.byId("mobilite_collab").getSelectedItem().getText();
            var Email = this.byId("email_collab").getValue();
            var EmailLinkedin = this.byId("linkedin_collab").getValue();
            var code_pays = this.byId("codephone_collab").getText();
            var NumTel = this.byId("phone_collab").getValue();
            var DateNaissance = this.byId("naissance_collab").getValue();
            var Nationalite = this.byId("nationalite_collab").getSelectedItem().getText();
            var SituationFamiliale = this.byId("situation_familiale").getSelectedItem().getText();
            var NumeroSecuriteSociale = this.byId("nss").getValue();
            var Adresse = this.byId("adresse_collab").getValue();
            var CodePostal = this.byId("code_postal").getValue();
            var Ville = this.byId("ville_collab").getValue();
            var Pays = this.byId("pays_collab").getSelectedItem().getText();
            var Pole = this.byId("pole_collab").getSelectedItem().getText();
            var Agence = this.byId("agence_collab").getSelectedItem().getText();
            var Diplomes = this.byId("diplome_collab").getValue();
            var DateDemarrage = this.byId("date_demarrage").getValue();
            var Fonction = this.byId("fonction_collab").getValue();
            var IdManager = this.byId("responsable_manager").getSelectedItem().getKey();
            var IdRh = this.byId("responsable_rh").getSelectedItem().getKey();
            var Role = this.byId("role_collab").getSelectedItem().getText();
            var Login = this.getLogin(DateDemarrage,Civilite,Pole,Agence,IdCollab.toString())
            var NumeroTelephone = code_pays + NumTel ;
            var collabData = {}
                collabData.Idcollab = IdCollab.toString()
                collabData.ReferenceInterne = ReferenceInterne
                collabData.Civilite = Civilite  
                collabData.Nom = Nom
                collabData.Prenom = Prenom
                collabData.Type = Type
                collabData.Etat = Etat
                collabData.Titre = Titre
                collabData.Domaine = Domaine
                collabData.Experience = Experience
                collabData.Mobilite = Mobilite
                collabData.Email = Email
                collabData.EmailLinkedin = EmailLinkedin
                collabData.NumeroTelephone = NumeroTelephone
                collabData.DateNaissance = DateNaissance
                collabData.Nationalite = Nationalite
                collabData.SituationFamiliale = SituationFamiliale
                collabData.NumeroSecuriteSociale = NumeroSecuriteSociale
                collabData.Adresse = Adresse
                collabData.CodePostal = CodePostal
                collabData.Ville = Ville
                collabData.Pays = Pays
                collabData.Pole = Pole
                collabData.Agence = Agence
                collabData.DateCreation = sFormattedDate
                collabData.DateMiseAJour = sFormattedDate
                collabData.Diplomes = Diplomes
                collabData.DateDemarrage = DateDemarrage
                collabData.Fonction = Fonction
                collabData.IdManager = IdManager
                collabData.IdRh = IdRh
                collabData.Role = Role
                collabData.Login = Login
                collabData.MotDePasse = "INIT"+IdCollab.toString()

            console.log(collabData)

            var oInfoModel = this.getOwnerComponent().getModel();         
            oInfoModel.create("/ZCOLLAB_ENTSet",collabData, {
                success: function(){
                    console.log("Collaborator ADDED Successfully !")
                    MessageToast.show("Collaborateur Ajouté !");
                },
                error: function(oError){
                    console.log(oError)
                }
                }); 
        },

        onApproveDialogPress: function () {
            if (!this.oApproveDialog) {
                this.oApproveDialog = new Dialog({
                    type: DialogType.Message,
                    title: "Mise à jour du Compte",
                    content: new Text({ text: "Confirmez-vous la mise à jour de ce profil ?" }),
                    beginButton: new Button({
                        type: ButtonType.Emphasized,
                        text: "Confirmer",
                        press: function () {
                            this.oApproveDialog.close();                
                            this.byId("collabInfosDisplay").setVisible(true);
                            this.byId("collabCoordDisplay").setVisible(true);
                            this.byId("headerInfoDisplay").setVisible(true);
                            this.byId("saveButton").setVisible(false);
                            this.byId("editButton").setVisible(true);
                            this.byId("collabInfosEdit").setVisible(false);
                            this.byId("collabCoordEdit").setVisible(false);
                            this.byId("headerInfoEdit").setVisible(false);
                            this.byId("deleteButton").setVisible(true);
                            this.byId("AutoEvalSectionR").setVisible(true);
                            var currentIdCollab = this.getView().getModel("currentIdCollabModel").getProperty("/currentIdCollab");
                            var currentCivilite = this.getView().getModel("currentIdCollabModel").getProperty("/currentCivilite");
                            var currentNom = this.getView().getModel("currentIdCollabModel").getProperty("/currentNom");
                            var currentPrenom = this.getView().getModel("currentIdCollabModel").getProperty("/currentPrenom");
                            var currentDateCreation = this.getView().getModel("currentIdCollabModel").getProperty("/currentDateCreation");
                            var currentAgence = this.getView().getModel("currentIdCollabModel").getProperty("/currentAgence");    
                            var currentLogin = this.getView().getModel("currentIdCollabModel").getProperty("/currentLogin");
                            var currentPassword = this.getView().getModel("currentIdCollabModel").getProperty("/currentPassword");
                            
                            var oDateFormat = DateFormat.getDateInstance({
                                pattern: "dd/MM/yyyy HH:mm"
                            });
               
                            var oDate = new Date();
                            var sFormattedDate = oDateFormat.format(oDate);
               
                            console.log(sFormattedDate)
               
                            var ReferenceInterne = this.byId("comp_edit").getValue();
                            var Titre = this.byId("titre_collab_edit").getValue();
                            var Domaine = this.byId("domaine_collab_edit").getValue();
                            var Experience = this.byId("xp_collab_edit").getValue();
                            var Etat = this.byId("etat_collab_edit").getSelectedItem().getText();
                            var Mobilite = this.byId("mobilite_collab_edit").getSelectedItem().getText();
                            var Email = this.byId("email_collab_edit").getValue();
                            var EmailLinkedin = this.byId("linkedin_collab_edit").getValue();                                               
                            var NumTel = this.byId("phone_collab_edit").getValue();
                            var DateNaissance = this.byId("naissance_collab_edit").getValue();
                            if (this.byId("checkNationality").getSelected())
                            {
                                var Nationalite = this.byId("nationalite_collab_edit").getSelectedItem().getText();
                            }
                            else 
                            {
                                var Nationalite = this.byId("nationalite_collab_display").getSelectedItem().getText();

                            }
                            var SituationFamiliale = this.byId("situation_familiale_edit").getSelectedItem().getText();
                            var Pole = this.byId("pole_collab_edit").getSelectedItem().getText();
                            var Role = this.byId("role_collab_edit").getSelectedItem().getText();
                            var NumeroSecuriteSociale = this.byId("nss_edit").getValue();
                            var Adresse = this.byId("adresse_collab_edit").getValue();
                            var CodePostal = this.byId("code_postal_edit").getValue();
                            var Ville = this.byId("ville_collab_edit").getValue();
                            if (this.byId("checkPays").getSelected())
                            {
                                var Pays = this.byId("pays_collab_edit").getSelectedItem().getText();
                            }
                            else
                            {
                                var Pays = this.byId("pays_collab_display").getSelectedItem().getText();
                            }
                            var Diplomes = this.byId("diplome_collab_edit").getValue();
                            var DateDemarrage = this.byId("date_demarrage_edit").getValue();
                            if (this.byId("checkManager").getSelected())
                            {
                                var ManagerId = this.byId("responsable_manager_edit").getSelectedItem().getKey();
                            }
                            else
                            {
                                var ManagerId = this.byId("responsable_manager_display").getSelectedItem().getKey();

                            }
                            if (this.byId("checkRH").getSelected())
                            {
                                var RHId = this.byId("responsable_rh_edit").getSelectedItem().getKey();
                            }
                            else
                            {
                                var RHId = this.byId("responsable_rh_display").getSelectedItem().getKey();
                            }
                            var Type = this.byId("type_collab_edit").getSelectedItem().getText();
                            var Fonction = this.byId("fonction_collab_edit").getValue();

                            switch(Mobilite)
                            {
                                case "France":
                                    var agency = "AYMAX CONSULTING"
                                    break;
                               
                                case "Egypte":
                                    var agency = "AYMAX EGYPTE"
                                    break;
                               
                                case "Tunisie":
                                    var agency = "AYMAX EGYPTE"
                                    break;
 
                                case "Non":
                                    var agency = currentAgence
                                    break;
                            }
 
                            var collabData = {}
                                collabData.Idcollab = currentIdCollab
                                collabData.ReferenceInterne = ReferenceInterne
                                collabData.Civilite = currentCivilite  
                                collabData.Nom = currentNom
                                collabData.Prenom = currentPrenom
                                collabData.Type = Type
                                collabData.Etat = Etat
                                collabData.Titre = Titre
                                collabData.Domaine = Domaine
                                collabData.Experience = Experience
                                collabData.Mobilite = Mobilite
                                collabData.Email = Email
                                collabData.EmailLinkedin = EmailLinkedin
                                collabData.NumeroTelephone = NumTel
                                collabData.DateNaissance = DateNaissance
                                collabData.Nationalite = Nationalite
                                collabData.SituationFamiliale = SituationFamiliale
                                collabData.NumeroSecuriteSociale = NumeroSecuriteSociale
                                collabData.Adresse = Adresse
                                collabData.CodePostal = CodePostal
                                collabData.Ville = Ville
                                collabData.Pays = Pays
                                collabData.Pole = Pole
                                collabData.Agence = agency
                                collabData.DateCreation = currentDateCreation //current
                                collabData.DateMiseAJour = sFormattedDate
                                collabData.Diplomes = Diplomes
                                collabData.DateDemarrage = DateDemarrage
                                collabData.Fonction = Fonction
                                collabData.IdManager = ManagerId
                                collabData.IdRh = RHId
                                collabData.Role = Role
                                collabData.Login = currentLogin
                                collabData.MotDePasse = currentPassword
 
                            console.log(collabData)
                     
 
                    var oUpdateModel = this.getOwnerComponent().getModel();
               
                    oUpdateModel.update("/ZCOLLAB_ENTSet(Mandt='200',Idcollab='" + currentIdCollab + "')",collabData,
                    {        
                        success:function()
                        {
/*                             this.oApproveDialog.close();
 */                         console.log("User Updated Successfuly !")
                            MessageToast.show("Profil mis à jour !");
                            this.byId("deleteButton").setVisible(true);
                        },
                        error:function(oError)
                        {
                            console.log(oError)
                        }
                    }
                )
                window.location.reload()
                }.bind(this)
                    
                    }),
 
                    endButton: new Button({
                        text: "Annuler",
                        press: function () {
                            this.oApproveDialog.close();
                           
                        }.bind(this)
                    })
                });
            }
 
            this.oApproveDialog.open();
        },
 
 
        onDelete :function () {
			if (!this.oApproveDialog) {
				this.oApproveDialog = new Dialog({
					type: DialogType.Message,
					title: "Suppression du Compte",
					content: new Text({ text: "Confirmez-vous la suppression définitive de ce Compte ?" }),
					beginButton: new Button({
						type: ButtonType.Reject,
						text: "Supprimer",
						press: function () {
                            this.byId("collabDetails").setVisible(false);                
                            this.byId("collabTableSection").setVisible(true);
                            this.oApproveDialog.close()
                            var currentIdCollab = this.getView().getModel("currentIdCollabModel").getProperty("/currentIdCollab");
                            var oDeleteModel = this.getOwnerComponent().getModel();

                            oDeleteModel.remove("/ZCOLLAB_ENTSet(Mandt='200',Idcollab='" + currentIdCollab + "')",
                            {         
                                success:function()
                                {
                                    console.log("User Deleted Successfully !")
                                    MessageToast.show("Compte Supprimé !");
							        this.oApproveDialog.close();
                                },
                                error:function(oError)
                                {
                                    console.log(oError)
                                }
                            }) 

						}.bind(this)
					}),
					endButton: new Button({
						text: "Annuler",
						press: function () {
							this.oApproveDialog.close();
						}.bind(this)
					})
				});
			}

			this.oApproveDialog.open();
        },

        onCountryChange: function (oEvent) {

            const selectedItem = oEvent.getParameter("selectedItem").getKey();
            var oModel = this.getView().getModel("appData").getProperty("/Countries");
            for (const countryData of Object.values(oModel)) {
                if (countryData.code === selectedItem) {
                    var sSelectedKey = countryData.dial_code;
                }
            }
            
            this.byId("codephone_collab").setText(sSelectedKey)
        },


        // Export Section
        createColumnConfig: function() {
			var aCols = [];

			/* 1. Add a simple text column */
			aCols.push({
				label: 'Collaborateur',
				property: '{odataModel>Nom}',
				width: 20,
				wrap: true
			});

			/* 2. Add a concatenated text column */

            aCols.push({
				label: 'Type',
				property: '{odataModel>Type}',
				width: 20,
				wrap: true
			});

		/* 	aCols.push({
				label: 'Type',
				type: EdmType.String,
				property: ['Region', 'SampleCurrency'],
				template: '{0} accepts {1}'
            }); */

            /* 3. Add a concatenated text column */
			aCols.push({
				label: 'Agence',
				property: '{odataModel>Agence}',
                width: 20,
				wrap: true
            });

            /* 4. Add a concatenated text column */
			aCols.push({
				label: 'Pole',
				property: '{odataModel>Pole}',
                width: 20,
				wrap: true
            });

            /* 5. Add a concatenated text column */
			aCols.push({
				label: 'Etat',
				property: '{odataModel>Etat}',
                width: 20,
				wrap: true
            });

        return aCols;

        },
            
		

        onExport: function() {
                // Get the data from the model
                var oModel = this.getView().getModel("odataModel");
                var aData = oModel.getProperty("/results");
    
                // Define the columns for the spreadsheet
                var aColumns = [
                    { label: "ID Collaborateur", property: "Idcollab" },
                    { label: "Référence Interne", property: "ReferenceInterne" },
                    { label: "Civilité", property: "Civilite" },
                    { label: "Nom", property: "Nom" },
                    { label: "Prénom", property: "Prenom" },
                    { label: "Type", property: "Type" },
                    { label: "État", property: "Etat" },
                    { label: "Titre", property: "Titre" },
                    { label: "Domaine", property: "Domaine" },
                    { label: "Expérience", property: "Experience" },
                    { label: "Mobilité", property: "Mobilite" },
                    { label: "Email", property: "Email" },
                    { label: "Email LinkedIn", property: "EmailLinkedin" },
                    { label: "Numéro de Téléphone", property: "NumeroTelephone" },
                    { label: "Date de Naissance", property: "DateNaissance" },
                    { label: "Nationalité", property: "Nationalite" },
                    { label: "Situation Familiale", property: "SituationFamiliale" },
                    { label: "Numéro de Sécurité Sociale", property: "NumeroSecuriteSociale" },
                    { label: "Adresse", property: "Adresse" },
                    { label: "Code Postal", property: "CodePostal" },
                    { label: "Ville", property: "Ville" },
                    { label: "Pays", property: "Pays" },
                    { label: "Pôle", property: "Pole" },
                    { label: "Agence", property: "Agence" },
                    { label: "Date de Création", property: "DateCreation" },
                    { label: "Date de Mise à Jour", property: "DateMiseAJour" },
                    { label: "Diplômes", property: "Diplomes" },
                    { label: "Date de Démarrage", property: "DateDemarrage" },
                    { label: "Fonction", property: "Fonction" },
                    { label: "ID Manager", property: "IdManager" },
                    { label: "ID RH", property: "IdRh" },
                    { label: "Rôle", property: "Role" }
                ];
    
                // Create a new spreadsheet
                var oSettings = {
                    workbook: { columns: aColumns },
                    dataSource: aData,
                    fileName: "Collaborateurs.xlsx"
                };
    
                var oSheet = new Spreadsheet(oSettings);
                oSheet.build()
                    .then(function () {
                        sap.m.MessageToast.show("Export terminé!");
                    })
                    .finally(function () {
                        oSheet.destroy();
                    });
            
            },

        // Visibility Sections       

        onBack (sectionOne,sectionTwo)
        {
            this.getView().byId(sectionOne).setVisible(false);
            this.getView().byId(sectionTwo).setVisible(true);
        },

        fetchData: function () {
            var aData = this.oFilterBar.getAllFilterItems().reduce(function (aResult, oFilterItem) {
                aResult.push({
                    groupName: oFilterItem.getGroupName(),
                    fieldName: oFilterItem.getName(),
                    fieldData: oFilterItem.getControl().getSelectedKeys()
                });

                return aResult;
            }, []);

            return aData;
        },

        applyData: function (aData) {
            aData.forEach(function (oDataObject) {
                var oControl = this.oFilterBar.determineControlByName(oDataObject.fieldName, oDataObject.groupName);
                oControl.setSelectedKeys(oDataObject.fieldData);
            }, this);
        },

        getFiltersWithValues: function () {
            var aFiltersWithValue = this.oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                var oControl = oFilterGroupItem.getControl();

                if (oControl && oControl.getSelectedKeys && oControl.getSelectedKeys().length > 0) {
                    aResult.push(oFilterGroupItem);
                }

                return aResult;
            }, []);

            return aFiltersWithValue;
        },

        onSelectionChange: function (oEvent) {
/*             this.oSmartVariantManagement.currentVariantSetModified(true);
 */            this.oFilterBar.fireFilterChange(oEvent);
        },

        onSearchTable: function () {
            var aTableFilters = this.oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                var oControl = oFilterGroupItem.getControl(),
                    aSelectedKeys = oControl.getSelectedKeys(),
                    aFilters = aSelectedKeys.map(function (sSelectedKey) {
                        return new Filter({
                            path: oFilterGroupItem.getName(),
                            operator: FilterOperator.Contains,
                            value1: sSelectedKey
                        });
                    });

                if (aSelectedKeys.length > 0) {
                    aResult.push(new Filter({
                        filters: aFilters,
                        and: false
                    }));
                }

                return aResult;
            }, []);

            this.oTable.getBinding("items").filter(aTableFilters);
            this.oTable.setShowOverlay(false);
        },

        onFilterChange: function () {
            this._updateLabelsAndTable();
        },

        onAfterVariantLoad: function () {
            this._updateLabelsAndTable();
        },

        getFormattedSummaryText: function() {
            var aFiltersWithValues = this.oFilterBar.retrieveFiltersWithValues();

            if (aFiltersWithValues.length === 0) {
                return "No filters active";
            }

            if (aFiltersWithValues.length === 1) {
                return aFiltersWithValues.length + " filter active: " + aFiltersWithValues.join(", ");
            }

            return aFiltersWithValues.length + " filters active: " + aFiltersWithValues.join(", ");
        },

        getFormattedSummaryTextExpanded: function() {
            var aFiltersWithValues = this.oFilterBar.retrieveFiltersWithValues();

            if (aFiltersWithValues.length === 0) {
                return "No filters active";
            }

            var sText = aFiltersWithValues.length + " filters active",
                aNonVisibleFiltersWithValues = this.oFilterBar.retrieveNonVisibleFiltersWithValues();

            if (aFiltersWithValues.length === 1) {
                sText = aFiltersWithValues.length + " filter active";
            }

            if (aNonVisibleFiltersWithValues && aNonVisibleFiltersWithValues.length > 0) {
                sText += " (" + aNonVisibleFiltersWithValues.length + " hidden)";
            }

            return sText;
        },

        _updateLabelsAndTable: function () {
            this.oExpandedLabel.setText(this.getFormattedSummaryTextExpanded());
            this.oSnappedLabel.setText(this.getFormattedSummaryText());
            this.oTable.setShowOverlay(true);
        }

    });
});