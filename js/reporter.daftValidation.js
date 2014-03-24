/*jslint evil: false, jquery:true, forin: true, white: false, devel:true */
/*!
 * DaftValidation reporter
 * Author: ryanand26 (2013) (http://www.daftapeth.co.uk)
 * @version 0.5
**/

(function ($, undefined) {
	"use strict";

	//Main/Root object
	var _daftValidation = window._daftValidation || {};

	var defaults = {
		useErrorBlock : false,
		errorMessageClass : 'error',
		errorTemplate : '<p class="<%class%>"><%message%></p>',
		successTemplate : '<p class="<%class%>"><%message%></p>'
	};

	/**
	* Validation reporter object
	*/
	var Reporter = function (eTarget, settings) {
		if (eTarget) {
			//bind event handlers to target
			this.bind(eTarget);
		}
		if (settings) {
			this.options = $.extend({}, defaults, settings);
		}

		return this;
	};


	Reporter.prototype = {
		/**
		* Set the insertion point for error and status messages
		* This is to cope with search fields as they have a container div
		*/
		getMsgInsertionPoint : function (eField) {
			var insertionPoint = eField.data('insertionPoint'),
				eParent, lastElement;

			if (insertionPoint !== undefined) {
				return insertionPoint;
			}
			else {
				eParent = eField.parent();
				lastElement = eParent.find(':last-child');
				if (eParent.hasClass('custom-select')) {
					insertionPoint = eParent;
				}
				else if (eField[0].type === 'checkbox') {
					insertionPoint = eField.next();
				}
				else if (eField.hasClass('hasDatepicker')) {
					insertionPoint = lastElement;
				}
				else {
					insertionPoint = eField;//.parent('.controls').find('label');
				}
				eField.data('insertionPoint', insertionPoint);
				return insertionPoint;
			}
		},

		/**
		* Show error
		*/
		showError : function (event, stringMessageData) {
			var eField = $(event.target),
				options = this.options,
				eInsertionPoint, eErrorMessage,
				sErrorHTML = options.errorTemplate;

			// check if the global message is visible and show if not
			//if(eServerErrorBlock.css('display') === 'none'){ showErrorBlock(true); }

			//remove and success message before continuing
			if (options.enableSuccessMessages === true) {
				this.removeSuccess(event);
			}

			// get the message from the field
			// check to see if field error already present create text and append next to field

			eInsertionPoint = this.getMsgInsertionPoint(eField);
			eErrorMessage = eInsertionPoint.siblings('p.' + options.errorMessageClass);

			if (eErrorMessage.length === 0) {
				eInsertionPoint
					.after(sErrorHTML.replace('<%class%>', options.errorMessageClass).replace('<%message%>', stringMessageData))
					.fadeIn();

			}
			else if (eErrorMessage.text() !== stringMessageData) {
				eErrorMessage.text(stringMessageData);
			}
			return this; // to chain the function
		},

		/**
		* Hide error
		*/
		hideError : function (event) {
			var eField = $(event.target);

			// remove fields error message
			this.getMsgInsertionPoint(eField).siblings('p.' + this.options.errorMessageClass).remove();

			/*var invalid = $(this.options.sValidationSelect).find('p.' + this.options.errorMessageClass).length;
			if(invalid === 0 ){
				this.showErrorBlock(false);
			}*/
			return this; // to chain the function
		},

		/**
		* Add a success message
		*/
		addSuccess : function (event, successData) {
			var eField = $(event.target),
				options = this.options,
				sSuccessClass = successData.successClass,
				sSuccessMessage = successData.successMessage,
				bAlwaysUpdate = successData.alwaysUpdate,
				eInsertionPoint, eValid,
				sSuccessHTML = options.errorTemplate;

			if (sSuccessMessage.length !== 0) {
				//get the current success message
				eInsertionPoint = this.getMsgInsertionPoint(eField);
				eValid = eInsertionPoint.siblings('.' + options.sValidationPassedMessage);
				if (eValid.length === 0) {
					eInsertionPoint
						.after(sSuccessHTML.replace('<%class%>', sSuccessClass).replace('<%message%>', sSuccessMessage))
						.fadeIn();
				}
				//else if it was a function, always update
				else if (bAlwaysUpdate === true) {
					eValid
						.attr('class', sSuccessClass)
						.html(sSuccessMessage);
				}
			}

			return eField;
		},

		/**
		* Remove the success message
		*/
		removeSuccess : function (event) {
			var eField = $(event.target);

			//remove related success messages
			this.getMsgInsertionPoint(eField).siblings('.' + this.options.sValidationPassedMessage).remove();
			return eField;
		},

		/**
		* Bind the events on the form
		*/
		bind : function (eTarget) {
			//watch for events
			eTarget
				.on("validationFailed.daftValidation", $.proxy(this.showError, this))
				.on("validationPassed.daftValidation", $.proxy(this.hideError, this))
				.on("validationAddSuccess.daftValidation", $.proxy(this.addSuccess, this));
		},

		/**
		* Bind the events on the form
		*/
		unbind : function (eTarget) {
			//stop watching for events
			eTarget
				.off("validationFailed.daftValidation", $.proxy(this.showError, this))
				.off("validationPassed.daftValidation", $.proxy(this.hideError, this))
				.off("validationAddSuccess.daftValidation", $.proxy(this.addSuccess, this));
		}

	};


	/**
	* Validation reporter object
	* (Functional inheritance)
	*/
	var ReporterBlock = function (eTarget, settings) {
		var options = $.extend({}, defaults, settings);

		return Reporter.call(this, eTarget, options);
	};
	ReporterBlock.prototype = new Reporter();

	/**
	* Get errorBlock element or create it if it does not exist
	*/
	ReporterBlock.prototype.getErrorBlock = function () {
		var options = this.options,
			eServerErrorBlock = $(options.sServerErrorBlockSelect);

		//create if not found
		if (eServerErrorBlock.length === 0) {
			eServerErrorBlock = $('<div class="' + options.sServerErrorBlockSelect + '" style="display:none" />');
			//ARIA - http://www.w3.org/TR/wai-aria-practices/#LiveRegions
			eServerErrorBlock.attr({'aria-live': 'polite', 'aria-atomic': 'false' });
			$(options.sValidationSelect).prepend(eServerErrorBlock);
		}

		return eServerErrorBlock;
	};

	/**
	* Show the errorBlock depending upon boolean
	*/
	ReporterBlock.prototype.showErrorBlock = function (bShow) {
		var errorBlockHTML = '<p class="errorCloud">Ooops!</p><p class="errorText">Something&lsquo;s gone a little bit skew-whiff. Please check and try again.</p>',
			eServerErrorBlock = this.getErrorBlock();
		if (bShow === true) {
			eServerErrorBlock.html().fadeIn();
		}
		else {
			eServerErrorBlock.fadeOut().html();
		}
		return eServerErrorBlock;
	};



	/**
	* Validation reporter object
	*/
	_daftValidation.Reporter = Reporter;
	_daftValidation.ReporterBlock = ReporterBlock;

	window._daftValidation = _daftValidation;

}(jQuery));