const qr      = require('qr-image');
const fs      = require('fs');
const sharp   = require('sharp');
const sleep   = require('system-sleep');
const qrList  = [];

let inlineSeq = function (l,cl) {
	console.log(l);
	let qrID  = makeid();
	let fPathT= __dirname+'/temps/';
	let fPath = __dirname+'/outputs/';
	let fNameT= 'canatqr'+l+'.png';
	let fName = 'canatqr_w'+l+'.png';
	let fOrj  = fPath+fName;
	let fOrjT = fPathT+fNameT;
	
	qr.image(qrID,{
		type: 'png',
		ec_level: 'H',
		size: 25,
		margin: 1,
	}).pipe(fs.createWriteStream(fOrjT));
	sleep(50);
	sharp(fOrjT)
		.overlayWith('logo.png',{gravity:sharp.gravity.centre})
		.toFile(fOrj, function(err) {
			if(err){
				console.log(err)
			}else{
				let a = {
					qrId : "",
					qrImage:""
				};
				a.qrId = qrID;
				a.qrImage = fName;
				qrList.push(a);
				l--;
				l === -1 ? cl() : inlineSeq(l,cl)
			}
		});
};

inlineSeq(150-1,function () {
	
	fs.writeFile("./dataList.json", JSON.stringify(qrList), function(err) {if(err) {return console.log(err)}});
	console.log("Done");
});

function makeid() {
	let text = "";
	let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	
	for (let i = 0; i < 8; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	
	return text;
}