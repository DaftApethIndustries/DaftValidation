#looseValidation
===============

JS validation plugin that uses data attributes to hold functions and tests.

(c) 2011 Ryan Mitchell (ryanand26@gmail.com)

Released under The MIT License.

## Homepage:

http://github.com/ryanand26/looseValidation


## Usage:

1. Insert the necessary elements in your document. CSS is optional, e.g.:
   
		<script type='text/javascript' src='/js/looseValidation.js'></script>


2. Initialise, e.g.:

		<script type='text/javascript'>
			$(document).ready(function() {
				$('.looseValidation').looseValidation();
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

	+ sValidationFailed: (defaults to 'error') The class added to the field and message when it's in an error state.
	+ sValidationPassed: (defaults to 'valid') The class added to the field when it's in success state.
	+ sValidationPassedMessage: (defaults to 'successMessage') The class added to the success message.
	+ sValidationAttr: (defaults to (defaults to 'data-validation') Attribute used for validation settings.
	+ sSuccessAttr: (defaults to 'data-success') Attribute used for success settings.