/*
    Description: Script that resends an incoming email to the final address instead of forwarding. 
                 The forwarded email should preserve all the original headers.
    Author: Shan Eapen Koshy
    Made on: June 21st 2019
    Report bugs to shaneapen@gmail.com
*/

var MAX_ROWS = 10;
var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
sheet.getRange("A2").setValue("Forwarding emails from " + Session.getActiveUser().getEmail());


function onOpen() {
    var menu = [{
            name: "Start forwarding",
            functionName: "startForwarding"
        },
        {
            name: "Stop forwarding",
            functionName: "stopForwarding"
        }
    ];
    sheet.addMenu("Gmail Auto Forwarder", menu);
}

function startForwarding() {

    var dateAsEpoch = Number(new Date().getTime() / 1000.0).toFixed(0)
    PropertiesService.getUserProperties().setProperty("dateAsEpoch", dateAsEpoch);
    sheet.getRange("A3").setValue("Status: Active").setBackgroundColor('#93c47d');
    createTimeDrivenTriggers();
    checkNewMessagesAndSend();

}

function stopForwarding() {

    sheet.getRange("A3").setValue("Status: Inactive").setBackgroundColor('#e06666');
    //deleting all triggers
    var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
        if (triggers[i].getHandlerFunction() == "checkNewMessagesAndSend") {
            ScriptApp.deleteTrigger(triggers[i]);
        }
    }
}

function gmailAutoForwarderStatus() {
    
    var remainingQuota = MailApp.getRemainingDailyQuota();

    if (remainingQuota < 1) {
        sheet.getRange("A4").setValue("You have completely used up Gmail's sending limit for today.");
        return false;
    } else if (remainingQuota < 15) {
        sheet.getRange("A4").setValue("You have almost used up Gmail's sending limit for today");
    } else {
        sheet.getRange("A4").setValue("You have nothing to worry about.");
    }

    var status = sheet.getRange("A3").getValue();
    if (status.toLowerCase() == "status: active") {
        return true;
    }

    return false;

}

function checkNewMessagesAndSend() {  

    if(gmailAutoForwarderStatus() == false){
        return;
    }
    
    var lastCheckedDate = PropertiesService.getUserProperties().getProperty("dateAsEpoch");

    var data = sheet.getRange(6,1,MAX_ROWS,2).getValues(); //row,column,noOfRows,noOfCols

    for (var z = 0; z < MAX_ROWS && data[z][1]!=""; ++z) {

        var threads = GmailApp.search('after:' + lastCheckedDate + ' ' + data[z][0]);
        var messages = GmailApp.getMessagesForThreads(threads);
     
        //messages.length corresponds to number of threads    
        for (var i = 0; i < messages.length; ++i) {

            for (var j = 0; j < messages[i].length; ++j) {
              

                var messageDate = Number(messages[i][j].getDate().getTime() / 1000.0).toFixed(0);

                if (messageDate > lastCheckedDate) {

                    var header = messages[i][j].getFrom().trim();
                    var extract = {
                        name: "",
                        email: ""
                    };
                    var emails = header.match(/[^@<\s]+@[^@\s>]+/g);
                    if (emails) {
                        extract.email = emails[0];
                    }
                    var names = header.split(/\s+/);
                    if (names.length > 1) {
                        names.pop();
                        extract.name = names.join(" ").replace(/"/g, "");
                    }
                    GmailApp.sendEmail(data[z][1], messages[i][j].getSubject(), 'If you are seeing this it\'s beacause your email client cannot render HTML messages.', {
                        htmlBody: messages[i][j].getBody(),
                        attachments: messages[i][j].getAttachments(),
                        name: extract.name,
                        bcc: messages[i][j].getBcc(),
                        cc: messages[i][j].getCc(),
                        replyTo: (!messages[i][j].getReplyTo() ? extract.email : messages[i][j].getReplyTo),
                    });

                } else {
                    break; //break out of loop if thread doesn't contain anymore new messages
                }
            }
        }
    }
  
    var currentDate = new Date();
    var currentDateAsEpoch = Number(currentDate.getTime() / 1000.0).toFixed(0);
    PropertiesService.getUserProperties().setProperty("dateAsEpoch", currentDateAsEpoch);
    sheet.getRange("B3").setValue("Last checked: " + currentDate.toLocaleString());

}


function createTimeDrivenTriggers() {
    ScriptApp.newTrigger('checkNewMessagesAndSend') 
        .timeBased()
        .everyHours(1)
        .create();
}


function DEBUG_remaining(){
  Logger.log(MailApp.getRemainingDailyQuota());
}