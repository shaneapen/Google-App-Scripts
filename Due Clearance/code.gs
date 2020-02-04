/*

Name: Due Clearance Form
Author: Shan Eapen Koshy
Date: 21 Jan 2020

# References
1. https://www.labnol.org/code/19960-convert-html-to-pdf


# Optimization/Feature Ideas
1. Generate PDF right after the dues are displayed..check if concurrency issues are to be dealt when generating pdf
2. Create an addon button in sheets to send email to students for pending dues
3. Add global setting variables like 
     - due column start
     - starting row (so warnings can be added above header row)
4. Make inserting notes easier

# Known Issues

1. Status field shown in receipt
2. iframe embed doesn't work if the option is set to anything except "Anyone, even Anonymous"

#Deploy Notes
1. Add JS to new file 

*/

var startRow, maxRows = 65,
    dueStartColumn = 5;


function doGet(e) {
    var html = HtmlService.createHtmlOutputFromFile('login')
    html.addMetaTag('viewport', 'width=device-width, initial-scale=1');
    html.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    return html;

}

function searchDelegateByEmail(formData) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("S8" + formData['batch']);
    if (sheet != null) {
        var emailList = sheet.getRange("C2:C" + maxRows).getValues();
        var admnList = sheet.getRange("A2:A" + maxRows).getValues();
        var lock = LockService.getPublicLock();
        if (lock.tryLock(3000)) {
            var found = false;
            var pos;


            for (var i = 0; i < maxRows; i++) {
                if (emailList[i] == formData['email'] && admnList[i] == formData['admn']) {
                    found = true;
                    pos = i + 2;
                    break;
                }
            }

            if (!found) {
                return ["error", "<p class='error'>Student details not found!</p>"];
            } else {
                var lastCol = String.fromCharCode(65 + sheet.getLastColumn());
                var range = sheet.getRange("A" + pos + ":" + lastCol + pos);

                var header = sheet.getRange("A1:" + lastCol + "1").getValues()[0];
                var rowValues = range.getValues()[0];
                var notes = range.getNotes()[0];

                var data = {
                    'header': header,
                    'data': rowValues,
                    'notes': notes,
                    'metadata': {
                        'dueStartCol': dueStartColumn
                    }
                }

                return ["success", data];
            }



        } else {
            return ["error", "<p class='error'>Server busy..Try again!</p>"];
        }
    } else {
        Logger.log('sheet not found')
        return ["error", "<p class='error'>Batch details not found! Contact admin.</p>"];
    }

}


function makePDF(res) {

    var receipt = HtmlService.createTemplateFromFile('receipt');
    receipt.data = res.data;
    receipt.header = res.header;
    receipt.notes = res.notes;
    receipt.metadata = res.metadata;

    var blob = Utilities.newBlob(receipt.evaluate().getContent(), "text/html", "text.html");
    var pdf = blob.getAs("application/pdf");
    return pdf.getBytes();
}