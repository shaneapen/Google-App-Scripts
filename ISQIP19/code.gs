/*

  A google script to show the availble seats for ISQIP'19 with live counter
  
  Developed by Shan Eapen Koshy on 5th June 2019
  
  
  # The total seats is assumed to be 105 with 35 seats each
  # P is the column in the spreadsheet with the user's track
  
  Spreadsheet - https://docs.google.com/spreadsheets/d/1Ecacgk6cThbfRpbEHJFjjATolhfF7yCyzJkpSTBqdo0/edit#gid=638207121
  
  
  Web apps cannot be embedded in websites due to cross origin policy. Use AppScript API instead
   - https://stackoverflow.com/questions/41678397/pass-a-variable-from-web-app-and-display-dialog
   - https://stackoverflow.com/questions/27325176/google-apps-script-fastest-way-to-retrieve-data-from-external-spreadsheets
   - https://github.com/danielireson/google-sheets-blog-cms
   - https://ctrlq.org/code/19871-get-post-requests-google-script

*/


var sheet = SpreadsheetApp.getActiveSpreadsheet();

function doGet(e) {
    var html = HtmlService.createHtmlOutputFromFile('form')
    html.addMetaTag('viewport', 'width=device-width, initial-scale=1');

    return html;

}


//A utility function to recalculate the remaining number of seats

function reCalculateLimit() {
    var  django = 0,android = 0,angular = 0;
    var track_col = SpreadsheetApp.getActiveSheet().getRange("P2:P106").getValues();
  for (var i=0;i < 105;++i) {
    if(track_col[i] == "Django")
      ++django;
    else if(track_col[i] == "Android")
      ++android;
    else if(track_col[i] == "Angular")
      ++angular;
  }
    // If the seats are manually updated in sheet, there is a chance that the available seats may go below 0 
    // The ternary operator takes care of that.
    PropertiesService.getScriptProperties().setProperty("Android", 35-android>=0?35-android:0);
    PropertiesService.getScriptProperties().setProperty("Angular", 35-angular>=0?35-angular:0);
    PropertiesService.getScriptProperties().setProperty("Django", 35-django>=0?35-django:0);
}

function searchDelegateByEmail(formData) {
    emailList = SpreadsheetApp.getActiveSheet().getRange("D2:D106").getValues();
    var found = false;
    var pos;
    var track = formData['track'];
  
    if (remainingSeats()[track] <= 0) {
        return "<p class='error'>Track is full! Please select another.</p>";
    } else {
        for (var i = 0; i < 105; i++) {
            if (emailList[i] == formData['email']) {
                found = true;
                pos = i + 2;
                if (sheet.getRange("P" + pos).getValue() != "") {
                  return "<p class='error'>User has already submitted the choice</p>";
                }
                sheet.getRange("P" + pos).setValue(track);
                PropertiesService.getScriptProperties().setProperty(track, remainingSeats()[track] - 1);
                break;
            }
        }

        if (!found) {
          return "<p class='error'>Email address not found!</p>";
        } else {
            return ("<p class='success'>Thank you for your submission</p>");
        }

    }

}


function remainingSeats() {
    var rem = {
        "Angular": PropertiesService.getScriptProperties().getProperty("Angular"),
        "Android": PropertiesService.getScriptProperties().getProperty("Android"),
        "Django": PropertiesService.getScriptProperties().getProperty("Django")
    }
    return rem;
}

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('ISQIP\'19')
      .addItem('Recalculate Seats', 'reCalculateLimit')
      .addToUi();
}

function debug() {
    Logger.log(remainingSeats());
}