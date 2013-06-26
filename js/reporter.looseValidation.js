/*jslint evil: false, jquery:true, forin: true, white: false, devel:true */
/*!
 * LooseValidation reporter
 * Author: ryanand26 (2013) (http://www.looseideas.co.uk)
 * @version 0.4
**/

(function ($, undefined) {
	"use strict";

	//Main/Root object
	var _looseValidator = window._looseValidator || {};

	/**
	* Validation reporter object
	*/
	_looseValidator.Reporter = function (eTarget, settings) {
		var _this = this,
			defaults = {
				useErrorBlock : false
			},
			options = $.extend({}, defaults, settings),
			eServerErrorBlock;

		/**
		* Show error
		*/
		var showError = function (event, stringMessageData) {
			var eField = $(event.target);

			// check if the global message is visible and show if not
			//if(eServerErrorBlock.css('display') === 'none'){ showErrorBlock(true); }

			//remove and success message before continuing
			removeSuccess(event);

			// get the message from the field
			// check to see if field error already present create text and append next to field

			var eInsertionPoint = getMsgInsertionPoint(eField),
				eErrorMessage = eInsertionPoint.siblings('p.error');

			if (eErrorMessage.length === 0) {
				var sErrorHTML = '<p class="error">' +  stringMessageData + '</p>';
				eInsertionPoint.after(sErrorHTML).fadeIn();

			}
			else if (eErrorMessage.text() !== stringMessageData) {
				eErrorMessage.text(stringMessageData);
			}
			return this; // to chain the function
		};

		/**
		* Hide error
		*/
		var hideError = function (event) {
			var eField = $(event.target);

			// remove fields error message
			getMsgInsertionPoint(eField).siblings('p.error').remove();

			/*var invalid = $(options.sValidationSelect).find('p.error').length;
			if(invalid === 0 ){
				showErrorBlock(false);
			}*/
			return this; // to chain the function
		};

		/**
		* Get errorBlock element or create it if it does not exist
		*/
		var getErrorBlock = function () {
			var eServerErrorBlock = $(options.sServerErrorBlockSelect);
			//create if not found
			if (eServerErrorBlock.length <= 0) {
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
		var showErrorBlock = function (bShow) {
			if (bShow === true) {
				eServerErrorBlock.html('<p class="errorCloud">Ooops!</p><p class="errorText">Something&lsquo;s gone a little bit skew-whiff. Please check and try again.</p>').fadeIn();
			}
			else {
				eServerErrorBlock.fadeOut().html();
			}
			return eServerErrorBlock;
		};

		/**
		* Add a success message
		*/
		var addSuccess = function (event, successData) {
			var eField = $(event.target),
				sSuccessClass = successData.successClass,
				sSuccessMessage = successData.successMessage,
				eInsertionPoint, eValid;

			if (sSuccessMessage.length !== 0) {
				//get the current success message
				eInsertionPoint = getMsgInsertionPoint(eField);
				eValid = eInsertionPoint.siblings('.' + options.sValidationPassedMessage);
				if (eValid.length === 0) {
					eInsertionPoint.after('<p class="' + sSuccessClass + '">' + sSuccessMessage + '</p>').fadeIn();
				}
				//else if it was a function, always update
				else if (sSuccessFunction.length !== 0) {
					eValid.attr('class', sSuccessClass).html(sSuccessMessage);
				}
			}

			return eField;
		};

		/**
		* Remove the success message
		*/
		var removeSuccess = function (event) {
			var eField = $(event.target);

			//remove related success messages
			getMsgInsertionPoint(eField).siblings('.' + options.sValidationPassedMessage).remove();
			return eField;
		};

		/**
		* Set the insertion point for error and status messages
		* This is to cope with search fields as they have a container div
		*/
		var getMsgInsertionPoint = function (eField) {
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
				else if (eParent.hasClass('inline-button')) {
					insertionPoint = lastElement;
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
		};

		/**
		* Bind the events on the form
		*/
		var bind = function (eTarget) {
			//validate any input that has been actioned
			eTarget
				.on("validationFailed.looseValidation", showError)
				.on("validationPassed.looseValidation", hideError)
				.on("validationAddSuccess.looseValidation", addSuccess)
				.on("validationRemoveSuccess.looseValidation", removeSuccess);
		};

		/**
		* Init, self executing.
		*/
		var init = (function () {

			//bind event handlers to target
			bind(eTarget);

		}());

		return this;
	};

	window._looseValidator = _looseValidator;

}(jQuery));