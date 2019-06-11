/*

    A Google App Script to send HTML emails.
    Developed by Shan Eapen Koshy on 11 June 2019
    
    Email template generated using free service - https://beefree.io/editor/
    
    HTML emails need to follow certain guidlines - https://templates.mailchimp.com/getting-started/html-email-basics/
    
    Class HtmlTemplate Reference - https://developers.google.com/apps-script/reference/html/html-template
    
*/


function sendEmail() {
  
  var htmlEmailBody = HtmlService.createTemplateFromFile('email');
  htmlEmailBody.name = "Shan Eapen Koshy";
  
  var toAddress = "shaneapen@gmail.com";
  var subject = "Hurray Again!"
  
  GmailApp.sendEmail(toAddress, subject, 'Normal Body', {
    htmlBody : htmlEmailBody.evaluate().getContent()
  });
  
}


function remainingQuota(){
 Logger.log(MailApp.getRemainingDailyQuota());
}