#!/usr/bin/env node

/**
 * sub-adjuster
 * Adjust the time to a subtitle file easy
 *
 * @author devperate <https://github.com/devperate>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

/////////////
const path = require('path');
const fs = require('fs');
const handleError = require('cli-handle-error');
const {Select, NumberPrompt} = require('enquirer');
const {to} = require('await-to-js');
const adjust = require('./adjust');

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	///////
	console.log('Folder:', process.cwd());
	const SRT_EXTENSION = 'srt';
	fs.readdir(process.cwd(), async function (err, files){
		if(err){
			return console.log('Unable to scan directory: ' + err);
		}

		const srts = files.filter(file=>{
			const ext = file.split('.')[file.split('.').length-1];
			return ext == SRT_EXTENSION;
		});

		if(srts.length < 1){
			console.log('\nThe selected folder doesn\'t contain any subtitle file!');
			process.exit(1);
		}

		const prompt_file = new Select({
			name: 'srt',
			message: 'Pick the subtitle to adjust',
			choices: srts
		});

		const[error0, file] = await to (prompt_file.run());
		handleError('Input', error0);

		const prompt_seconds = new NumberPrompt({
			name: 'seconds',
			message: 'Please enter a (+) or (-) number of seconds to adjust'
		});
		
		const[error1, seconds] = await to (prompt_seconds.run());
		handleError('Input', error1);

		adjust(file, seconds);
	});

	debug && log(flags);
})();
