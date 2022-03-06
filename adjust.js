const fs = require('fs');
const path = require('path');
let iconv = require('iconv-lite');

module.exports = (file, seconds)=>{
	pRaw = fs.readFileSync(file);
	raw = iconv.decode(pRaw, 'latin1');
	//console.log(raw);
	const ext = file.split('.')[file.split('.').length-1];
	let fileName = '';
	fileName += file.split('.').filter((chunk, index, array)=>{
		return index < array.length-1;
	});
	const output = path.join(process.cwd(), `${fileName}.fixed.${ext}`);
	
	raw_array0 = raw.split('\n');
	//console.log(raw_array0);
	raw_array1 = raw_array0.map(function(val){
		time = val.split(' --> ');
		if(time.length > 1){
			time[0] = makePlus(time[0], seconds);
			//console.log(time[0]);
			time[1] = makePlus(time[1], seconds);
			//console.log(time[1]);
			val = time[0] + ' --> ' + time[1];
			//console.log(val);
		}
		return val;
	});
	raw1 = '';
	raw_array1.forEach(function(val) {
		//console.log(val);
		raw1 += val+'\n';
		return;
	});
	//console.log(raw1);

	fs.writeFile(output, raw1, 'utf8', (err) => {
		if (err) throw err;
		console.log('\nIt\'s saved!', `${fileName}.fixed.${ext}`);
	});
}

function makePlus(time, adjust){
	//00:00:28,682 --> 00:00:30,682
	time = time.split(':');
	//console.log(parseFloat(time[2]) + adjust);
	ms = time[2].split(',')[1];
	time[2] = time[2].split(',')[0];
	time[2] = parseInt(time[2]) + adjust;
	time[1] = parseInt(time[1]);
	time[0] = parseInt(time[0]);
	//console.log('time[2] ' + time[2]);
	if( time[2] >= 59 ){
		time[2] -= 60;
		time[1] += 1;
		
		if( time[1] >= 59 ){
			time[1] -= 60;
			time[0] += 1;
		}
	}
	time[2] = ((''+time[2]).length == 1)?('0'+time[2]):(time[2])
	time[1] = ((''+time[1]).length == 1)?('0'+time[1]):(time[1])
	time[0] = ((''+time[0]).length == 1)?('0'+time[0]):(time[0])
	//console.log('the adjusted time is: ' + time[0]+':'+time[1]+':'+time[2]+','+ms);
	return time[0]+':'+time[1]+':'+time[2]+','+ms;
}