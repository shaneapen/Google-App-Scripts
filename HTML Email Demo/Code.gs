/*

    A Google App Script to send HTML emails.
    Developed by Shan Eapen Koshy on 11 June 2019
    
    Email template generated using free service - https://beefree.io/editor/
    
    HTML emails need to follow certain guidlines - https://templates.mailchimp.com/getting-started/html-email-basics/
    
    Class HtmlTemplate Reference - https://developers.google.com/apps-script/reference/html/html-template
    
*/


function bulkSendEmail() {
  
  var htmlEmailBody = HtmlService.createTemplateFromFile('email');
  
  //startIndex and endIndex represents the row numbers
  var startIndex = 3;
  var endIndex = 3;
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var names = sheet.getRange("B" + startIndex + ":B"+ endIndex).getValues();
  var emails = sheet.getRange("C" + startIndex + ":C"+ endIndex).getValues();
  var subject = "Complete your track selection | ISQIP'19";
   
  var loopLimit = endIndex - (startIndex-1); //startIndex-1 because 1st row is header
  
  for (var i = 0;i < loopLimit;++i){

    htmlEmailBody.name = names[i];
  
    GmailApp.sendEmail(emails[i], subject, 'Normal Body', {
      name: "Shan Eapen Koshy",
      htmlBody : htmlEmailBody.evaluate().getContent()
    });
    
  }
  
  sheet.getRange("B"+startIndex+":B"+ (endIndex)).setBackgroundRGB(0, 128, 0);

}


function remainingQuota(){
 Logger.log(MailApp.getRemainingDailyQuota());
}