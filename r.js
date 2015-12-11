#!/usr/bin/env node
require('babel-core/register');

const fs = require('fs');
const path = require('path');
const paths = require('./gulp/paths');
const isToArchive = process.argv[2] === 'a';
const pagesPath = path.resolve(paths.app, 'pages');
const directory = fs.readdirSync(pagesPath);
const pagePassed = process.argv[3];

// list here pages to hide temporarily by this script
var pages = [
	'root',
	'root-auth',
	'root-buynow',
	'root-email',
	'root-thanks',
	'root-welcome',
];

if (!!pagePassed) {
	pages = [pagePassed];
}

if (!isToArchive) {
	pages = pages.map(function (val) {
		return '_' + val
	});
}

console.log('Beginning pages ' + (isToArchive ? 'arhiving' : 'extracting') + ':');

directory.forEach(function (dir) {
	if (pages.indexOf(dir) >= 0) {
		const pFrom = path.resolve(pagesPath, dir);
		const pTo   = path.resolve(pagesPath, isToArchive ? ('_' + dir) : dir.split('_')[1]);

		console.log('Renaming from ' + pFrom + ' to ' + pTo);
		fs.renameSync(pFrom, pTo);
	}
});

console.log((isToArchive ? 'Arhiving' : 'Extracting') + ' pages done.');




