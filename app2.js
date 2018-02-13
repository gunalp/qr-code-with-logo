const Excel     = require('exceljs');
const qr        = require('qr-image');
const fs        = require('fs');
const input     = './input/';
const output    = './outputs/';

function seqExec(){
	
	GetFileCount(function (files) {
		
		function inlineSeq(l,cl) {
			
			let extension = files[l].split('.')[1];
			
			if(extension === 'xlsx' || extension === 'xls'){
				ReadQrId(files[l],function (qrIds) {
					GenerateQrId(qrIds,function () {
						l--;
						l === -1 ? cl() : inlineSeq(l,cl)
					})
				})
			}else{
				 l--;
				 l === -1 ? cl() : inlineSeq(l,cl)
			}
			
		}
		
		inlineSeq(files.length-1,function () {
			console.log('Created All Excel To Qr')
		})
	
	})
	
}

function ReadQrId (_file,callback) {
	console.log("ReadQrId: "+_file)
	let data = [];
	
	let workbook = new Excel.Workbook();
	workbook.xlsx.readFile(input+_file)
		.then(() => {
			workbook.eachSheet(function (worksheet, sheetId) {
				let a = {
					sheetName:worksheet.name,
					qrIds    :[]
				};
				worksheet.eachRow(function(row, rowNumber) {
					if(rowNumber !== 1){
						a.qrIds.push(row.getCell(1).value);
						//console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.getCell(1).value));
					}
				});
				data.push(a);
			});
			callback(data)
		});
	
}

function GenerateQrId(qrIdObj,callback) {
	
	function inlineSeqTwo(m,mx) {
		let dynFolder = qrIdObj[m].sheetName;
		console.log(dynFolder);
		
		if (!fs.existsSync(output+dynFolder)){
			fs.mkdirSync(output+dynFolder);
		}
		
		for(let i = 0; i < qrIdObj[m].qrIds.length; i++){
			qr.image(qrIdObj[m].qrIds[i],{
				type: 'png',
				ec_level: 'H',
				size: 25,
				margin: 1,
			}).pipe(fs.createWriteStream(output+dynFolder+'/'+dynFolder+i+'.png'));
		}
		
		m--;
		m ===-1 ? mx() : inlineSeqTwo(m,mx)
		
	}
	
	inlineSeqTwo(qrIdObj.length-1,function () {
		console.log("Done Generate Qr Code");
		callback();
	});
	
}

function GetFileCount (callback) {
	console.log("GetFileCount");
	fs.readdir(input, (err, files) => {
		callback(files);
	});
}

seqExec();