// Global variables

var scriptProperties = PropertiesService.getScriptProperties();

function onInstall(e){
    onOpen(e);
}

function onOpen(e) {
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .createMenu('ESN')
      .addItem('Configuration', 'showPromptConfiguration')
      .addItem('Search ESNcard', 'showPromptSearch')
      .addItem('Fill range', 'fillRange')
      .addToUi();

}

function showPromptConfiguration() {
  var ui = SpreadsheetApp.getUi(); // Same variations.

  var result = ui.prompt(
      'Setting things up',
      'Introduce the ID of the Spreadsheet you wish to fetch from',
      ui.ButtonSet.OK_CANCEL);

  // Process the user's response.
  var button = result.getSelectedButton();
  var text = result.getResponseText();

  if (button == ui.Button.OK) {
    scriptProperties.setProperty('DOCUMENT_ID', text);
    ui.alert('The ID has been save correctly');
  }
}

function showPromptSearch() {
  var ui = SpreadsheetApp.getUi(); // Same variations.

  var result = ui.prompt(
      'Search the data related to an ESNcard and paste it in this document',
      'Nº ESNcard',
      ui.ButtonSet.OK_CANCEL);

  var activeCell = SpreadsheetApp.getActiveSpreadsheet().getActiveCell();

  // Process the user's response.
  var button = result.getSelectedButton();
  var text = result.getResponseText();

  if (button == ui.Button.OK) {
    search(text, activeCell);
  }
}

function search(esnCardNumber, activeCell) {
  var documentID = scriptProperties.getProperty('DOCUMENT_ID');

  if(documentID != "" && documentID != null) {

    var sheetESNcard = SpreadsheetApp.openById(documentID).getSheetByName("Respuestas de formulario 1");
    var sheetSearch = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SpreadsheetApp.getActiveSheet().getName());

    var esnCards = sheetESNcard.getRange("A:Z").getValues();

    for (var i = 0; i< esnCards.length; i++) {

      if(esnCards[i][1] == esnCardNumber && esnCards[i][1] != undefined){

        // ESNcard number
        sheetSearch.getRange(activeCell.getA1Notation()).setValue(esnCards[i][1]);
        // name
        sheetSearch.getRange(activeCell.getRow(),activeCell.getColumn() + 1).setValue(esnCards[i][2]);
        // surname
        sheetSearch.getRange(activeCell.getRow(), activeCell.getColumn() + 2).setValue(esnCards[i][3]);
        // date of birth
        sheetSearch.getRange(activeCell.getRow(), activeCell.getColumn() + 3).setValue(esnCards[i][4]).setHorizontalAlignment("center");
        // phone number
        sheetSearch.getRange(activeCell.getRow(), activeCell.getColumn() + 4).setValue(esnCards[i][5]).setHorizontalAlignment("left");
        // email
        sheetSearch.getRange(activeCell.getRow(), activeCell.getColumn() + 5).setValue(esnCards[i][6]).setHorizontalAlignment("left");
        // nationality
        sheetSearch.getRange(activeCell.getRow(), activeCell.getColumn() + 6).setValue(esnCards[i][7]).setHorizontalAlignment("center");
        // documento
        sheetSearch.getRange(activeCell.getRow(), activeCell.getColumn() + 7).setValue(esnCards[i][8]).setHorizontalAlignment("center");
        // document number
        sheetSearch.getRange(activeCell.getRow(), activeCell.getColumn() + 8).setValue(esnCards[i][9]).setHorizontalAlignment("center");
        // expiration date
        sheetSearch.getRange(activeCell.getRow(), activeCell.getColumn() + 9).setValue(esnCards[i][10]).setHorizontalAlignment("center");
        // univesity
        sheetSearch.getRange(activeCell.getRow(), activeCell.getColumn() + 10).setValue(esnCards[i][11]).setHorizontalAlignment("left");
        break;
      }
    }
    if(activeCell.isBlank()){
      SpreadsheetApp.getUi().alert("There is no one registered with the given ESNcard number");
    }
  } else {
    SpreadsheetApp.getUi().alert("You must set up an ID first. Must be the ID of the spreadsheet containing the ESNcards.");
    showPromptConfiguration();
  }
}

function fillRange(){
  var activeRange = SpreadsheetApp.getActiveSpreadsheet().getActiveRange();
  var initialCellIndex = 1;
  var numRows = activeRange.getNumRows();
  while(initialCellIndex <= numRows){
    var currentCell = activeRange.getCell(initialCellIndex, 1);
    search(currentCell.getValue(),currentCell);
    initialCellIndex++;
  }
}