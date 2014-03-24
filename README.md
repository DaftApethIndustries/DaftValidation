#daftValidation
===============

JS validation plugin that uses data attributes to hold functions and tests.

(c) 2011 Daft Apeth Industries (enquiries@daftapeth.co.uk)

Released under The MIT License.

## Homepage:

http://github.com/ryanand26/daftValidation


## Usage:

1. Insert the necessary elements in your document. CSS is optional, e.g.:
   
		<script type='text/javascript' src='/js/daftValidation.js'></script>


2. Initialise, e.g.:

		<script type='text/javascript'>
			$(document).ready(function() {
				$('.daftValidation').daftValidation();
			});
		</script>

3. Add settings to the HTML

		<input data-validation='{"rules":["required"],"messages":["Please fill this in"]}' data-success='{ "messages" : "Success" }' />

### Warning

The biggest issue with this approach is that the attribute must be valid JSON. Quotes or double quotes in the messages will break the parsing.

## Validation options

	+ required
	+ requiredIf
	+ requiredIfNot
	+ numeric
	+ email
	+ password
	+ postcode
	+ matchesField
	+ minchars
	+ regex
	+ multiple validations

See index.html for examples of usage.

## Plugin Options:
	+ autoInitReporter: (defaults to true) Initialize the reporter object as part of the validator init
	+ enableSuccessMessages: (defaults to true) Fire events for success messages
	+ sValidationFailed: (defaults to 'error') The class added to the field and message when it's in an error state.
	+ sValidationPassedMessage: (defaults to 'successMessage') The class added to the success message.
	+ sValidationAttr: (defaults to (defaults to 'data-validation') Attribute used for validation settings.
	+ sSuccessAttr: (defaults to 'data-success') Attribute used for success settings.
	+ jsonReplaceRegex : (defaults to  /&#39;|'/g) Regex replace characters in the JSON string with double quote