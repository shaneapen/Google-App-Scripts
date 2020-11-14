function formOnSubmit(row) {
    Logger.log(row.values);
   //use lock service
   //updateCodeInSheet();
   
    
    var emailTemplate = HtmlService.createTemplateFromFile('email');
    var referralCode = "MAG-" + (Math.random()*1e32).toString(36).toUpperCase().slice(0,6); //https://stackoverflow.com/a/30925561/3284379
    emailTemplate.referralCode = referralCode;
   
    var toAddress = 'shaneapen@gmail.com';
    var subject = "Magnum Referral Code";
    var plainTextEmail = "Thank You for registering for MAGNUM 2020 referral program. Your referral code is " + referralCode + ". For further queries, please leave a reply to this email.";
   
    Logger.log(row.range.getRow());
    SpreadsheetApp.getActiveSheet().getRange(row.range.getRow(),1,1,SpreadsheetApp.getActiveSheet().getLastColumn()).setBackgroundRGB(76, 175, 80);
 //   GmailApp.sendEmail(toAddress, subject, plainTextEmail, {
 //      name: "Magnum Coordinator",
 //      htmlBody : emailTemplate.evaluate().getContent()
 //    });
   
 }
 
 
 function test_onFormSubmit() {
   var dataRange = SpreadsheetApp.getActiveSheet().getDataRange();
   var data = dataRange.getValues();
   var headers = data[0];
   // Start at row 1, skipping headers in row 0
   for (var row=1; row < data.length; row++) {
     var e = {};
     e.values = data[row].filter(Boolean);  // filter: https://stackoverflow.com/a/19888749
     e.range = dataRange.offset(row,0,1,data[0].length);
     e.namedValues = {};
     // Loop through headers to create namedValues object
     // NOTE: all namedValues are arrays.
     for (var col=0; col<headers.length; col++) {
       e.namedValues[headers[col]] = [data[row][col]];
     }
     // Pass the simulated event to onFormSubmit
     formOnSubmit(e);
   }
 }
 
 
 