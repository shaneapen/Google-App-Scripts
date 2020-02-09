function onFormSubmit(row) {
  
   var emailTemplate = HtmlService.createTemplateFromFile('email');
  
   var lock = LockService.getPublicLock();
  
   if (lock.tryLock(2000)) {
     
     var referralCode = "MAG-" + (Math.random()*1e32).toString(36).toUpperCase().slice(0,6); //https://stackoverflow.com/a/30925561/3284379
   
     SpreadsheetApp.getActive().getRange('H'+ row.range.getRow()).setValue(referralCode); 
     
     if(MailApp.getRemainingDailyQuota() > 10){
       
       var toAddress = row.values[1];
       var subject = "Magnum Referral Code";
       var plainTextEmail = "Thank You for registering for MAGNUM 2020 referral program. Your referral code is " + referralCode + ". For further queries, please leave a reply to this email."
       emailTemplate.referralCode = referralCode;
       
       GmailApp.sendEmail(toAddress, subject, plainTextEmail, {
         name: "Magnum Coordinator",
         htmlBody : emailTemplate.evaluate().getContent()
       });
       
       //set row background to green if mail was sent successfully
       SpreadsheetApp.getActiveSheet().getRange(row.range.getRow(),1,1,SpreadsheetApp.getActiveSheet().getLastColumn()).setBackgroundRGB(76, 175, 80);
       
     }else if (MailApp.getRemainingDailyQuota() >= 1){
       GmailApp.sendEmail('technicalcoordinator@ceconline.edu', 'Email Quota for cecmagnum2020@gmail.com will be exhausted soon.', "Email Quota will be exhausted soon.", {
         name: "Magnum Coordinator"
       });
     
     }
    
   }//lock service end
   
}

function debug(){
Logger.log(MailApp.getRemainingDailyQuota());
}