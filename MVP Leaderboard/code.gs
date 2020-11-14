/*
   Name: MVP Leaderboard
   Date: 22 Oct 2019
   Author: S Hemanth & Shan Eapen Koshy
   
   App URL: https://script.google.com/macros/s/AKfycbwhzR0SD9hDOeLHD7SUuxqoWL34NUog-YGCNvX8bS--0SQsz_4/exec
*/

var ss = SpreadsheetApp.getActiveSpreadsheet();
var sheet = ss.getSheets()[0];


function doGet(request) {
 myJSON = JSON.stringify(fetchLeaderBoard());
 return ContentService.createTextOutput(myJSON).setMimeType(ContentService.MimeType.JSON);
}


function sortSheetByScoreDescending(){
 var range = sheet.getRange("A2:U200");
 range.sort({column: 7, ascending: false});
}


function fetchLeaderBoard(limit){

 var values = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
 var leaderboard = [];
 if(limit == null){limit = values.length;}

 
 //index begins at 1 since header is present
 for(var i = 1; i < limit; ++i){
   
   leaderboard.push({
     name:values[i][1],
     score:values[i][6]
   });    
   
 }  
 
return leaderboard;
}

function sortOnEditTrigger(){ 
 var sheet = SpreadsheetApp.getActive();
 ScriptApp.newTrigger("sortSheetByScoreDescending")
  .forSpreadsheet(sheet)
  .onEdit()
  .create();  
}

function debug(){
 Logger.log(fetchLeaderBoard())
}
