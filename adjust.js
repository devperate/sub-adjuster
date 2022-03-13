const fs = require('fs');
const path = require('path');
let iconv = require('iconv-lite');

module.exports = (file, seconds) => {
	const raw_f = fs.readFileSync(file);
	const text = iconv.decode(raw_f, 'latin1');
	//console.log(text);
	const output = path.join(process.cwd(), getOutputFileName(file));

	const text_array = text.split('\n');
	//console.log(text_array);
	let text_array_fixed = text_array.map(function (line) {
		time = line.split(' --> ');
		if (time.length > 1) {
			time[0] = makePlus(time[0], seconds);
			//console.log(time[0]);
			time[1] = makePlus(time[1], seconds);
			//console.log(time[1]);
			line = time[0] + ' --> ' + time[1];
			//console.log(line);
		}
		return line;
	});

	const text_fixed = text_array_fixed.join('\n');

	fs.writeFile(output, text_fixed, 'utf8', err => {
		if (err) throw err;
		console.log("\nIt's saved!", `${fileName}.fixed.${ext}`);
	});
};

function getOutputFileName(file) {
	const ext = file.split('.')[file.split('.').length - 1];
	let fileName = '';
	fileName += file.split('.').filter((chunk, index, array) => {
		return index < array.length - 1;
	});

	return `${fileName}.fixed.${ext}`;
}

function makePlus(time, adjust) {
	//00:00:28,682 --> 00:00:30,682
	time = time.split(':');
	//console.log(parseFloat(time[2]) + adjust);
	const ms = time[2].split(',')[1];
	time[2] = time[2].split(',')[0];
	time[2] = parseInt(time[2]) + adjust;
	time[1] = parseInt(time[1]);
	time[0] = parseInt(time[0]);
	//console.log('time[2] ' + time[2]);
	if (time[2] >= 59) {
		time[2] -= 60;
		time[1] += 1;

		if (time[1] >= 59) {
			time[1] -= 60;
			time[0] += 1;
		}
	}
	time[2] = ('' + time[2]).length == 1 ? '0' + time[2] : time[2];
	time[1] = ('' + time[1]).length == 1 ? '0' + time[1] : time[1];
	time[0] = ('' + time[0]).length == 1 ? '0' + time[0] : time[0];
	//console.log('the adjusted time is: ' + time[0]+':'+time[1]+':'+time[2]+','+ms);
	return time[0] + ':' + time[1] + ':' + time[2] + ',' + ms;
}
