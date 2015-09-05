#! /usr/bin/env node

	// includes
var fs   = require('fs')
	, path = require('path')
	, util = require('util')

	// call args
	, args       = process.argv.slice(2)
/*
	, inDirName  = args[0]
	, inDirPath  = path.join(process.env.PWD, inDirName)
	, outDirName = args[1] 
	, outDirPath = path.join(process.env.PWD, outDirName)
*/

	, inDirPath  = args[0] // just lazy absolute paths for now
	, outDirPath = args[1] // just lazy absolute paths for now

	, paths      = [inDirPath, outDirPath]

	// the magic
	, neededFiles = all(paths, function () {
			watch(inDirPath)
		})

// check if both the in and out directories exist
paths.forEach(function (value, key) {
	fs.stat(value, function(err, stats) {
		if (err) {
			console.warn(err)
			throw new Error(err)
		}

		if (stats.isDirectory()) {
			neededFiles(value)
		}
	})
})

/**
 * Thing that needs a bunch of matches
 *
 * @param {Array} needs - a list of strings that need to be matched
 * @param {Function} fn - thing to be called when all needs are met
 * @returns {Function} - callback used to pass individual values
 */
function all (needs, fn) {
	var resLength = 0

	return function (some) {
		if (!!~needs.indexOf(some)) resLength++
		if (resLength >= needs.length) fn()
	}
}

/**
 * kick off the watch event!
 *
 * @param {String} _path - directory to watch
 */
function watch (_path) {
	console.log('watching...')

	fs.watch(_path, function (event, filename) {
		if (filename) {
			console.log('copying ' + filename);
			fs.createReadStream(path.join(_path, filename))
				.pipe(fs.createWriteStream(path.join(outDirPath, filename)));
		}
	})
}

/**
 * function description
 *
 * @param {string} foo - foo description
 * @returns {string}
 */
// functino copy (_path, file) {}
