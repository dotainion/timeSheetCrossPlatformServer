const { google } = require('googleapis');
const keys = require('../kyes.json');



class GoogleApiService{
    apiRef;
    client;
    spreadsheetId = '1oHdNqPtzJNs-gLmI6Dzz62c3qoYrpHFBnYp0w_Ov0vw';

    constructor(){
        this.client = new google.auth.JWT(
            keys.client_email,
            null,
            keys.private_key,
            ['https://www.googleapis.com/auth/spreadsheets']
        );

        this.client.authorize((err, tokens)=>{
            if (err){
                return this.parseError(err);
            }
            console.log('Connected');
            this.initializeGoogleApi();
        });
    }

    parseError(error, mothodName='Not Specified.'){
        let errorMessage = 'Ooops! Something went wrong. Sorry i couldnt tell what it was.';
        if (error?.message){
            errorMessage = error.message;
        }
        if (error.errors?.[0]?.message){
            errorMessage = error.errors[0].message;
        }
        console.log('From Spreadsheet.js at method => ' + mothodName);
        return {error: errorMessage};
    }

    async initializeGoogleApi(){
        this.apiRef = google.sheets({
            version: 'v4',
            auth: this.client
        });        
    }

    async getSpreadsheet(spreadsheetId){
        try{
            //this will not return spreadsheet values.
            if(typeof spreadsheetId === 'string'){
                spreadsheetId = [spreadsheetId];
            }
            let sheets = [];
            for (let id of spreadsheetId){
                const sheet = await this.apiRef.spreadsheets.get({
                    spreadsheetId: id,
                    ranges: [],
                    auth: this.client
                });
                sheets.push(sheet);
            }
            let spreadsheet = {data:[]};
            for (let sheet of sheets){
                spreadsheet.data.push(sheet.data);
            }
            return spreadsheet;
            
        }catch(error){
            console.log(error);
            return this.parseError(error, 'getSheet');
        }
    }

    async getSheet(titles, spreadsheetId){
        try{
            let sheets = [];
            for(let title of titles){
                const sheet = await this.apiRef.spreadsheets.values.get({
                    spreadsheetId,
                    range: `${title}!A1:K22`
                });
                sheets.push({values: sheet.data.values, title});
            }
            return sheets;
            
        }catch(error){
            console.log(error);
            return this.parseError(error, 'getSheet');
        }
    }

    async copySheet(sheetId, spreadsheetId, destinationSpreadsheetId, copies=1){
        try{
            let responses = [];
            for (let _ of [...Array(copies).keys()]){
                const res = await this.apiRef.spreadsheets.sheets.copyTo({
                    sheetId,
                    spreadsheetId,
                    resource: {
                        destinationSpreadsheetId,
                    },
                    auth: this.client
                });
                responses.push(res);
            }

            return responses;
            
        }catch(error){
            return this.parseError(error, 'copySheet');
        }
    }

    async updateSheet(spreadsheetId, collector, sheetTitles=[]){
        try{
            let index = 0;
            let responses = [];
            for (let calendarValues of collector.list()){
                const res = await this.apiRef.spreadsheets.values.update({
                    spreadsheetId,
                    range: `${sheetTitles[index]}!A1`,//'Sheet!A1',
                    valueInputOption: 'USER_ENTERED',
                    resource: {
                        values: calendarValues,
                        properties: {
                            title: 'Filre' + index,
                            sheetType: "GRID"
                        }
                    }
                });
                index ++;
                responses.push(res);
            }
            console.log('done')
            return responses;
            
        }catch(error){
            return this.parseError(error, 'updateSheet');
        }
    }

    async createSheet(){
        try{
            //not working...
            /*const sheets = req.body.sheets;
            const spreadsheetId = req.body.spreadsheetId;
            
            const newSheet = sheets.map((sheet)=>{
                return{
                    addSheet: {
                        properties: {
                            title: sheet.title
                        }
                    }
                }
            });
            
            return await this.apiRef.spreadsheets.batchUpdate({
                resource: {
                    requests: [
                        ...newSheet
                    ]
                },
                auth: api.client,
                spreadsheetId: spreadsheetId,
            })*/
                    
        }catch(error){
            console.log(error)
            return this.parseError(error, 'createSheet');
        }
    }
}

module.exports = new GoogleApiService()