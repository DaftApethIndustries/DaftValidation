/*jslint evil: false, jquery:true, forin: true, white: false, devel:true */
/*!
 * LooseValidation plugin
 * Author: ryanand26 (2013) (http://www.looseideas.co.uk)
 * @version 0.4
**/

(function ($, undefined) {
	"use strict";

	//Main/Root object
	var _looseValidator = window._looseValidator || {};

	/**
	* Methods accessible through $('form').looseValidation();
	*/
	var methods = {
		init : function (settings) {
			//loop thorugh each passed element
			this.each(function () {
				var el = $(this),
					validatorInstance;

				//test for existing validators
				if (el.data('validator') === undefined) {
					validatorInstance = new Validator(el, settings);
					el.data('validator', validatorInstance);
				}

				return this;
			});
			return this;
		},
		/**
		* Set a validation rule
		*/
		addValidationFunction : function (sName, fRule) {
			var bIsAdded = addFunctionToFunctionSet(sName, fRule, validationRules);

			return bIsAdded;
		},
		/**
		* Set a success function
		*/
		addSuccessFunction : function (sName, fRule) {
			var bIsAdded = addFunctionToFunctionSet(sName, fRule, successFunctions);

			return bIsAdded;
		}
	};


	/**
	* Function to check then add a rule
	*/
	var addFunctionToFunctionSet = function (sName, fRule, oFunctionSet) {
		//values were passed and were the correct type
		if (jQuery.type(sName) === "string" && jQuery.type(fRule) === "function") {
			//function does not already exist
			if (oFunctionSet[sName] === undefined) {
				oFunctionSet[sName] = fRule;
				return true; //added
			}
		}
		return false; //not added
	};

	/**
	* Set of validation functions.
	*/
	var validationRules = {
		/**
		* Check that the field has a value
		*/
		hasValue : function (eField) {
			var nodeName = eField[0].nodeName.toLowerCase(),
				val = eField.val();

			if (nodeName === "select") {
				if (!eField.get(0).selectedIndex) { return false; }
			}
			else if (eField[0].type === "checkbox") {
				if (!eField[0].checked) { return false; }
			}
			else if (nodeName === "textarea") {
				if (jQuery.trim(val).length === 0) { return false; }
			}
			else if (val.length === 0 || val === undefined) {
				return false;
			}
			return true;
		},

		/**
		* Check that the field has a value
		*/
		required : function (eField) {
			return validationRules.hasValue(eField);
		},

		/**
		* Required only if the partner field HAS a value
		*/
		requiredIf : function (eField, sTargetID) {
			var eTarget = $('#' + sTargetID);
			if (eTarget.length) {
				if (validationRules.hasValue(eTarget)) {
					return validationRules.hasValue(eField);
				}
			}
			return true;
		},

		/**
		* Required only if the partner field DOES NOT HAVE a value
		*/
		requiredIfNot : function (eField, sTargetID) {
			var eTarget = $('#' + sTargetID);
			if (eTarget.length) {
				if (validationRules.hasValue(eTarget) === false) {
					return validationRules.hasValue(eField);
				}
			}
			return true;
		},

		/**
		* Test that the value is alphabet characters only
		*/
		alphabet : function (eField) {
			var alphabetRegex = /^[A-Za-z]+$/;
			return alphabetRegex.test(eField.val());
		},

		/**
		* Test that the value is numeric
		*/
		numeric : function (eField) {
			var numberRegex = /^[+\-]?\d+(\.\d+)?([eE][+\-]?\d+)?$/;
			return numberRegex.test(eField.val());
		},

		/**
		* Test that the value matches a valid email
		*/
		email : function (eField) {
			if (eField.val() !== '') {
				var emailRegex = new RegExp('([\\w-+]+(?:\\.[\\w-+]+)*@(?:[\\w-]+\\.)+[a-zA-Z]{2,7})');
				return emailRegex.test(eField.val());
			}
			return true;
		},

		/**
		* Validate password
		*/
		password : function (eField) {
			var val = eField.val(),
				strength = 1,
				rules = [
					/\S{8,}/, //min eight characters
					/[a-z]+/, //includes lower case character
					/[0-9]+/, //includes numeric character ([0-9]) or symbol
					/[A-Z]+/, //includes upper case character
					/[@!$£&*#%\^\?]+/ // includes a symbol
				];

			var i = 0,
				iLen = rules.length,
				result;

			//test against the rules, fail quickly
			while (i < iLen) {
				result = val.match(rules[i]);

				if (result === null) {
					return false;
				}
				i++;
			}

			return true;
		},

		/**
		* Test that the value matches a valid uk postcode
		* Accepted formats: 1. LN NLL eg N1 1AA 2. LLN NLL eg SW4 0QL 3. LNN NLL eg M23 4PJ 4. LLNN NLL eg WS14 0JT 5. LLNL NLL eg SW1N 4TB 6. LNL NLL eg W1C 8LQ
		*/
		postcode : function (eField) {
			var postcodeRegex = new RegExp('^[a-zA-Z]{1,2}[0-9][0-9A-Za-z]{0,1} {0,1}[0-9][A-Za-z]{2}$');
			return postcodeRegex.test(eField.val());
		},

		/**
		* Check value of a field against a specific field
		*/
		matchesField : function (eField, sTargetID) {
			var eTarget = $('#' + sTargetID);
			if (eTarget.length) {
				return eField.val() === eTarget.val();
			}
			return false;
		},

		/**
		* Check value has a minimum number of characters
		**/
		minchars : function (eField, iLen) {
			var val = eField.val(),
				iLength = iLen || 2;
			if (val.length < iLength || val === undefined) {
				return false;
			}
			return true;
		},

		/**
		* Check value against a regex
		*/
		regex : function (eField, sRegex) {
			var val = eField.val(),
				thisRegex;
			try {
				thisRegex = new RegExp(sRegex);
				if (thisRegex.test(val) === false) {
					return false;
				}
			}
			catch (e) {
				namespace.error(e);
			}
			return true;
		}

	};

	/**
	* Set of success functions.
	*/
	var successFunctions = {
		/**
		* Check value of a field against a specific field
		* TEMPORARY IMPLEMENTATION
		*/
		passwordStrength : function (eField) {
			var sClass, sMessage;
			//eField.addClass('alwaysValidate');

			var val = eField.val(),
				strength = 1,
				rules = [/\S{5,}/, /[a-z]+/, /[0-9]+/, /[A-Z]+/];

			var i = 0,
				iLen = rules.length;
			//test against the rules
			while (i < iLen) {
				if (val.match(rules[i])) {
					strength++;
				}
				i++;
			}

			if (strength < 2) {
				sClass = 'psWeak';
				sMessage = '<span></span>Puny';
			}
			else if (strength < 5) {
				sClass = 'psOkay';
				sMessage = '<span></span>Passable';
			}
			else {
				sClass = 'psStrong';
				sMessage = '<span></span>Powerful';
			}
			return {
				'class' : sClass,
				'message' : sMessage
			};
		}
	};

	/**
	* Validation object
	*/
	var Validator = function (eTarget, settings) {
		var _this = this,
			defaults = {
				//initialize the reporter object as part of the validator init
				autoInitReporter : true,
				//fire events for success messages
				enableSuccessMessages : true,
				//class added to track error state of a field
				sValidationFailed : 'error',
				//default class for success message
				sValidationPassedMessage : 'successMessage',
				//attribute that holds the validation data
				sValidationAttr : 'data-validation',
				//attribute that holds the success data
				sSuccessAttr : 'data-success',
				//regex replace characters in the JSON string with double quote
				jsonReplaceRegex : /&#39;|'/g
			},
			options = $.extend({}, defaults, settings);

		/**
		* Get data rules from the DOM and parse them
		*/
		var getValidationData = function (eField) {
			// need to execute validation functions
			var sValidationAttr = eField.attr(options.sValidationAttr);
			if (sValidationAttr === undefined) {
				//validation does not exists therefore it's correct...
				return undefined;
			}
			return jQuery.parseJSON(sValidationAttr.replace(options.jsonReplaceRegex, '"'));
		};

		/**
		* Get success data from the DOM and parse them
		*/
		var getSuccessData = function (eField) {
			// see if success message has been set
			var sSuccessAttr = eField.attr(options.sSuccessAttr);

			if (sSuccessAttr === undefined) {
				//success messages are not defined so halt here
				return undefined;
			}
			return jQuery.parseJSON(sSuccessAttr.replace(options.jsonReplaceRegex, '"'));
		};


		/**
		* Test if a rule exits
		*/
		this.hasRule = function (sRuleName) {
			return validationRules[sRuleName] !== undefined;
		};

		/**
		* Run a specific test
		*/
		this.useRule = function (sRuleName, eField, params) {
			return validationRules[sRuleName](eField, params);
		};

		/**
		* Validate a form
		*/
		this.validateForm = function (event) {
			var invalidCount = 0,
				eForm = $(this),
				//collate elements to validate
				listInputs = eForm.find('input:not([type=submit]), select, textarea');

			//validate each field
			$.each(listInputs, function (index, element) {
				try {
					var validateFieldResult = _this.validateField($(element));
					if (validateFieldResult === false) {
						invalidCount++;
					}
				}
				catch (e) {
					console.log("Error in validation", e);
				}
			});

			if (invalidCount > 0) {
				if (event) {
					event.preventDefault();
					event.stopPropagation();
				}
				eForm.data('invalid', true);
				return false;
			}
			eForm.data('invalid', false);
			return true;
		};

		/**
		* Validate a field
		* Expects an $(input) field
		*/
		this.validateField = function (eField) {
			var oDataRules, aRulesData,
				bValid = true,
				index = 0,
				iLen, sRuleName, stringMessageData, params;

			//test if the field is disabled
			if (eField[0].disabled === true) {
				return true;
			}

			oDataRules = getValidationData(eField);

			//validation does not exists therefore it's correct...
			if (oDataRules === undefined) {
				return true;
			}
			else if (oDataRules && oDataRules.rules) {
				aRulesData = oDataRules.rules;
				iLen = aRulesData.length;

				//check each rule to create a list of all errors
				while (index < iLen) {
					sRuleName = aRulesData[index];
					stringMessageData = oDataRules.messages[index];
					params = false;

					// Set the params if defined
					if (oDataRules.params && oDataRules.params[index]) {
						params = oDataRules.params[index];
					}

					if (this.hasRule(sRuleName)) {
						if (this.useRule(sRuleName, eField, params) === false) {
							showError(eField, stringMessageData);
							bValid = false;
							//As we've failed break out the look
							break;
						}
					}
					index++;
				}
				//once all rules checked
				if (bValid === true) {
					if (eField.hasClass(options.sValidationFailed)) {
						eField.removeClass(options.sValidationFailed);
						hideError(eField);
					}
					//add success state?
					if (eField.val() !== '' && options.enableSuccessMessages === true) {
						addSuccess(eField);
					}
					return true;
				}
				return false;
			}
		};

		/**
		* Bind the events on the form
		*/
		var bind = function (eTarget) {
			var novalidate = "novalidate";

			//disable HTML5 form validation
			if (eTarget[0].nodeName.toLowerCase() === 'form') {
				eTarget.attr(novalidate, novalidate);
			}

			//validate any input that has been actioned
			eTarget
				.on("keyup", "input",  handleKeyupEvent)
				.on("blur", "input.keyPressed", handleFieldEvent)
				.on("blur change", "select, textarea", handleFieldEvent)
				.on("click", "input[type=checkbox]", function (event) {
					var eField = $(this);
					if (eField.hasClass(options.sValidationFailed)) {
						_this.validateField(eField);
					}
				})
				.on("click", "input[type=submit]", _this.validateForm)
				.submit(_this.validateForm);
		};

		/**
		* Handle key action
		*/
		var handleKeyupEvent = function (event) {
			var key = event.which || event.keyCode,
				$this = $(this);

			if (key !== 9) {
				$this.addClass("keyPressed");
			}
			if ($this.hasClass(options.sValidationFailed) || $this.hasClass('alwaysValidate')) {
				_this.validateField($this);
			}
		};

		/**
		* Handle blur/change actions
		*/
		var handleFieldEvent = function (event) {
			_this.validateField($(this));
		};

		/**
		* Show error
		*/
		var showError = function (eField, stringMessageData) {
			eField
				.addClass(options.sValidationFailed)
				.attr('aria-invalid', 'true');

			if (eField[0].nodeName.toLowerCase() === 'select') {
				eField.parent()
					.addClass(options.sValidationFailed)
					.attr('aria-invalid', 'true');
			}

			eField.trigger('validationFailed.looseValidation', stringMessageData);

			return this; // to chain the function
		};

		/**
		* Hide error
		*/
		var hideError = function (eField) {
			eField
				.removeClass(options.sValidationFailed)
				.attr('aria-invalid', 'false');

			if (eField[0].nodeName.toLowerCase() === 'select') {
				eField.parent()
					.removeClass(options.sValidationFailed)
					.attr('aria-invalid', 'false');
			}

			eField.trigger('validationPassed.looseValidation');

			return this; // to chain the function
		};

		/**
		* Add a success message
		*/
		var addSuccess = function (eField) {
			var sSuccessClass = options.sValidationPassedMessage,
				sSuccessMessage = '',
				sSuccessFunction = '',
				bAlwaysUpdate = false,
				oSuccessData, oResponse;

			oSuccessData = getSuccessData(eField);

			//get either the message or function to call for the message
			if (oSuccessData !== undefined) {
				if (oSuccessData.messages) {
					sSuccessMessage = oSuccessData.messages;
				}
				else if (oSuccessData.func) {
					sSuccessFunction = oSuccessData.func;
				}
			}
			//call any functions defined in success
			if (sSuccessFunction.length !== 0) {
				//run function to set success message
				oResponse = successFunctions[sSuccessFunction](eField);
				sSuccessClass = sSuccessClass + ' ' + oResponse['class'];
				sSuccessMessage = oResponse.message;
				bAlwaysUpdate = true;
			}

			if (sSuccessMessage.length !== 0) {
				eField.trigger('validationAddSuccess.looseValidation', {
					"successClass" : sSuccessClass,
					"successMessage" : sSuccessMessage,
					"alwaysUpdate" : bAlwaysUpdate
				});
			}

			return eField;
		};

		/**
		* Init, self executing.
		*/
		var init = (function () {

			//bind event handlers to target
			bind(eTarget);

			if (options.autoInitReporter === true && _looseValidator.Reporter !== undefined) {
				var reporterInstance = new _looseValidator.Reporter(eTarget, options);
			}

		}());

		return this;
	};

	/**
	* Plugin binding
	*/
	$.fn.looseValidation = function (method) {

		// Method calling logic
		// http://docs.jquery.com/Plugins/Authoring#Namespacing
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		}
		else {
			$.error('Method ' +  method + ' does not exist on jQuery.looseValidation');
		}

	};

	window._looseValidator = _looseValidator;

}(jQuery));