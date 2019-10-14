const {google} = require('googleapis');
const keys = require('./key.json');

const client = new google.auth.JWT(
    keys.client_email, 
    null,
    keys.private_key, 
    ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize(function(error,tokens) {
    if(error) {
        console.log(error);
        return;
    } else {
        console.log('Connceted!');
        gsrun(client);
    }
});

async function gsrun(cl) {
    const gsapi = google.sheets({version: 'v4', auth: cl});
    const opt = {
        spreadsheetId: '1WuB2hBh0NDIKerwYf7TjGDPrnuEkRLAEMgZMxbY6Ifg',
        range: 'data_test!A2:B4'
    };

    let data = await gsapi.spreadsheets.values.get(opt);
    let dataArray = data.data.values;
    let newDataArray = dataArray.map(function(r) {
        r.push(r[0] + '-' + r[1]);
        return r;
    });

    const updateOptions = {
        spreadsheetId: '1WuB2hBh0NDIKerwYf7TjGDPrnuEkRLAEMgZMxbY6Ifg',
        range: 'data_test!A5',
        valueInputOption: 'USER_ENTERED',
        resource: {values: newDataArray} 
    };
    let res = await gsapi.spreadsheets.values.update(updateOptions);

    console.log(res);
}