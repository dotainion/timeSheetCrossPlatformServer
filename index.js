const transform = require('./src/Transformer');
const api = require('./src/Spreadsheet');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const { DocumentDocs } = require('./src/Invoice');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());;
app.use(express.json());
app.use(bodyParser.json());

app.post('/invoice', (req, res)=>{
    const doc = new DocumentDocs(req.body.tables);
});

app.post('/create/sheet', async(req, res)=>{
    const createResonse = await api.createSheet();
    console.log(createResonse);
});

app.post('/update/sheet', (req, res)=>{
    
});

app.post('/get/spreadsheet', async(req, res)=>{
    const getResponse = await api.getSpreadsheet(req.body.spreadsheetId);
    if (getResponse?.error){
        return res.status(500).send(getResponse.error);
    }
    res.send(getResponse.data);
    console.log('spread sheets')
});

app.post('/get/sheet', async(req, res)=>{
    const getResponse = await api.getSheet(req.body.title, req.body.spreadsheetId);
    if (getResponse?.error){
        return res.status(500).send(getResponse.error);
    }
    res.send(getResponse);
});

app.post('/copy/sheet', async(req, res)=>{
    /**
     * incoming requests.
     *  calendarRange: {
            from: {
                month: 2,
                year: 2022
            },
            to: {
                month: 5,
                year: 2022
            },
            sheetId,
            spreadsheetId,
        }
     */
    const range = req.body.calendarRange;
    const spreadsheetId = range.spreadsheetId;
    const sheetId = range.sheetId;

    const copies = (range.to.month - range.from.month) +1;
    const copyResponse = await api.copySheet(sheetId, spreadsheetId, spreadsheetId, copies);
    if (copyResponse?.error){
        res.status(500).send(copyResponse?.error);
        return console.log(copyResponse.error);
    }

    const getResponse = await api.getSheet(spreadsheetId);
    if (getResponse?.error){
        res.status(500).send(getResponse?.error);
        return console.log(getResponse.error);
    }

    const newDataCopy = transform.newWeekDayCopy(range);
    const titles = copyResponse.map(r => r.data.title);

    const updateResponse = await api.updateSheet(spreadsheetId, newDataCopy, titles);
    if (updateResponse?.error){
        res.status(500).send(getResponse?.error);
        return console.log(getResponse.error);
    }

    res.send('Sheet copied.');
});

app.get('/test', (req, res)=>{
    res.send('This is a test that sheet received.');
});

app.listen(PORT, ()=>{
    console.log('listing on port 2000');
});