/**
 * JSHint-Loader reporter function
 *
 * @param {Array} data Array of JSHint error objects.
 */
var chalk = require('chalk');

module.exports = function (errors) {

	var emitErrors = this.options.jshint.emitErrors;

	var hints = [];
	if(errors) errors.forEach(function(error) {
		if(!error) return;
		var message = chalk.gray('  line ') + chalk.blue(error.line) + chalk.gray(' char ')  + chalk.blue(error.character) + ': ' + chalk.red(error.reason) + "\n    " + chalk.gray(error.evidence);
		hints.push(message);
	}, this);
	var message = hints.join("\n\n");
	var emitter = emitErrors ? this.emitError : this.emitWarning;
	if(emitter)
		emitter("jshint results in errors\n" + message);
	else
		throw new Error("Your module system doesn't support emitWarning. Update availible? \n" + message);
};