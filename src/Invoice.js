const { Document, Packer, Paragraph, TextRun, Columns, Table, TableRow, TableCell, BorderStyle, AlignmentType, WidthType, HeadingLevel } = require('docx');
const fs = require('fs');

class DocumentDocs{
    constructor(fileObject = null){
        if (fileObject !== null){
            this.generate(fileObject);
        }
    }

    cells(cellList = [], option = {}){
        const size = option?.noBorder ? {size: 24} : {};
        return cellList.map((title)=> new TableCell({
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: title,
                            bold: option.bold || false,
                            color: '000000',
                            ...size,
                        })
                    ],
                    alignment: option?.noBorder ? AlignmentType.LEFT : AlignmentType.CENTER,
                    spacing: {
                        before: 120,
                        after: 120,
                    },
                })
            ],
            width: {
                size: !title ? 0 : 100 / cellList.length, 
                type: WidthType.PERCENTAGE 
            },
            borders: !option?.noBorder ? null : {
                top: {style: BorderStyle.NONE, size: 0, color: "FFFFFF"},
                bottom: {style: BorderStyle.NONE, size: 0, color: "FFFFFF"},
                left: {style: BorderStyle.NONE, size: 0, color: "FFFFFF"},
                right: {style: BorderStyle.NONE, size: 0, color: "FFFFFF"},
            }
        }) );
    }

    rows(rowList = [], options = {}){
        if (!rowList?.length || options?.isTHead && !rowList?.[0]){
            return [];
        }
        return rowList.map((cells)=> new TableRow({
            children: [
                ...this.cells(cells, options)
            ],
        }) );
    }

    table(tableList = []){
        return tableList.map((table)=> new Table({
            rows: [
                ...this.rows([['', '', '', '', '']], {noBorder: true}),
                ...this.rows([['', '', '', '', '']], {noBorder: true}),
                ...this.rows([['', '', '', '', '']], {noBorder: true}),
                ...this.rows([['Consultant:', table?.agent, '' || '', '', '']], {noBorder: true, bold: true}),
                ...this.rows([['Client:', table?.client, '' || '', table?.weekDate || '', '']], {noBorder: true, bold: true}),
                ...this.rows([['', '', '', '', '']], {noBorder: true}),
                ...this.rows([table?.tHead], {isTHead: true, bold: true}),
                ...this.rows(table?.tRows),
                ...this.rows([['', '', '', '', '']], {noBorder: true}),
                ...this.rows([['', '', '', 'Total Hours', '25.21']], {noBorder: true, bold: true}),
                ...this.rows([['', '', '', 'Rate Per Hour', '25.21 USD']], {noBorder: true}),
                ...this.rows([['Client Signature:', '', '', 'Total Pay', '25.21']], {noBorder: true, bold: true}),
            ],
            width: { 
                size: 100, 
                type: WidthType.PERCENTAGE 
            },
        }) );
    }

    generate(fileValues = []){
        console.log('spreadsheet')
        const doc = new Document({
            sections: [
                {
                    children: [
                        ...this.table(fileValues)
                    ],
                },
            ],
        });
        
        Packer.toBuffer(doc).then((buffer) => {
            fs.writeFileSync("time-sheet-invoice.docx", buffer);
        });
    }
}

module.exports = {
    DocumentDocs
}
