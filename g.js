#!/usr/bin/env node
'use strict';

function camelize(str) {
	return str.replace(/[-_\s]+(.)?/g, function(match, c) {
		return c ? c.toUpperCase() : "";
	});
}

const fs   = require('fs');
const type = process.argv[2];
const name = process.argv[3];
let gen  = '';

switch(type) {
	case 'p':
	case 'page':
	case 'pages': {
		gen = 'pages';
		console.log("Starting page \"" + name + "\" generation:");
		break;
	}
	case 'b':
	case 'block':
	case 'blocks': {
		gen = 'blocks';
		console.log("Starting block \"" + name + "\" generation:");
		break;
	}
}

if (!gen) {
	console.log("No generator for \"" + type + "\".");
	return;
}

const folder = './app/' + gen + '/';
const folderPath = folder + name;

fs.mkdirSync(folderPath);
console.log("Folder [" + folderPath + "] was created");

const filePath = folderPath + '/' + name;
let files = {};

if (gen === 'blocks') {
	files[filePath + '.jade'] = [
		'mixin ' + name + '(opts)',
		'\t-var opts = opts || {}',
		'\t-var blks = blocks || {}',
		'\t-var ' + camelize(name) + ' = blks["' + name + '"] || {}',
		'\t-var items = ' + camelize(name) + '.items || opts.items || []',
		'\t-var modifiers = opts.mods || []',
		'\t-var tagName = opts.tagName || "div"',
		'',
		'\t-var classes = [\'' + name + '\']',
		'\t-each modifier in modifiers',
		'\t\t-classes.push(classes[0]+\'_\'+modifier)',
		'',
		'\t//- != JSON.stringify(attributes)',
		'\t//- != JSON.stringify(opts)',
		'',
		'\t#{tagName}(class=classes)&attributes(attributes)',
		'\t\t| Block \'' + name + '\' content:',
		'\t\tbr',
		'\t\tblock',
		''
	].join('\n');

	files[filePath + '.styl'] = [
		'.' + name + '',
		'\t// write here styles of \'' + name + '\' block',
		''
	].join('\n');
}

if (gen === 'pages') {
	let inheritance = process.argv[4];

	files[filePath + '.jade'] = [
		typeof inheritance !== 'undefined'
			? 'extends ../' + inheritance + '/' + inheritance
			: 'extends ../_layout-default',
		'',
		'include ../../blocks/container/container',
		'',
		'block content',
		'\t+container({mods:[\'' + name + '\']})',
		'\t\t| Page \'' + name + '\' content',
		''
	].join('\n');

	files[filePath + '.json'] = [
		'{',
		'\t',
		'}',
		''
	].join('\n');
}

for (let i in files) {
	const fd = fs.openSync(i, 'wx+');
	fs.writeSync(fd, files[i])
	fs.closeSync(fd);
	console.log("File [" + i + "] was created");
}

if (gen === 'pages') {
	console.log("Page \"" + name + "\" generation is done");
}

if (gen === 'blocks') {
	console.log("Block \"" + name + "\" generation is done");
}
