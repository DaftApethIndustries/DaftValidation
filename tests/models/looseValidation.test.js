suite('Validator Contructor', function() {

    setup(function() {
        this.formSelect = '.ruleTests';
        /*this.user = new app.models.User({
            first_name: "Jimmy",
            last_name: "Wilson"
        });*/
    });

    teardown(function() {
        /*this.user = null;*/
    });

    test('Contructor should return Validation object', function() {
        var form = $(this.formSelect).looseValidation();
        expect(form.data('validator')).to.be.ok; // Tests this.user is truthy
    });

    test('Calling validate() multiple times must return the same validator instance', function() {
        var v1 = $(this.formSelect).looseValidation().data('validator'),
            v2 = $(this.formSelect).looseValidation().data('validator');

        expect(v1).to.equal(v2);
    });

    test("addValidationFunction() plugin method exists", function() {
        expect($(this.formSelect).looseValidation('addValidationFunction')).to.exist;
    });

    test("addSuccessFunction() plugin method exists", function() {
        expect($(this.formSelect).looseValidation('addSuccessFunction')).to.exist;
    });

});

/**
* Test the internal validation rules directly
*/
suite('Validator Test Functions', function() {

    setup(function() {
        this.formSelect = '.ruleTests';
        this.form = $(this.formSelect).looseValidation();
        this.textfield = $('#required-a');
        this.select = $('#required-select-a');
        this.checkbox = $('#required-checkbox-a');
        this.textarea = $('#required-textarea-a');

        this.validator = this.form.data('validator');
    });

    teardown(function() {
        this.validator = null;
        this.form = null;
    });

    test("Required: Textfield", function() {
        //empty textfield fails
        this.textfield.val('');
        expect(this.validator.useRule('required', this.textfield)).to.be.false;

        //filled textfield passes
        this.textfield.val('this is a value');
        expect(this.validator.useRule('required', this.textfield)).to.be.true;

        //textfield with spaces only passes
        this.textfield.val('   ');
        expect(this.validator.useRule('required', this.textfield)).to.be.true;
    });

    test("Required: Select", function() {
        //Required: Select: first index fails
        this.select[0].selectedIndex = 0;
        expect(this.validator.useRule('required', this.select)).to.be.false;

        //second index passes
        this.select[0].selectedIndex = 1;
        expect(this.validator.useRule('required', this.select)).to.be.true;
    });

    test("Required: Checkbox", function() {
        this.checkbox[0].checked = false;
        expect(this.validator.useRule('required', this.checkbox)).to.be.false;

        this.checkbox[0].checked = true;
        expect(this.validator.useRule('required', this.checkbox)).to.be.true;
    });

    test("Required: Textarea", function() {
        this.textarea[0].value = '';
        expect(this.validator.useRule('required', this.textarea)).to.be.false;

        this.textarea[0].value = 'this is a value';
        expect(this.validator.useRule('required', this.textarea)).to.be.true;

        this.textarea[0].value = '      ';
        expect(this.validator.useRule('required', this.textarea)).to.be.false;
    });


});

/**
* Test the rule effects through the UI
*/
suite('Validator Binding', function() {

    setup(function() {
        this.formSelect = '.looseValidation';
        this.form = $(this.formSelect).looseValidation();
        this.textfield = $('#required');
        this.select = $('#required-select');

        this.validator = this.form.data('validator');
    });

    teardown(function() {
        this.textfield.val('');
        this.select[0].selectedIndex = 0;
        this.checkbox[0].checked = false;
        this.textarea[0].value = '';

        this.validator = null;
        this.form = null;
    });

    test("validateField : Textfield", function() {
        //empty textfield fails
        this.textfield.val('');
        //call manually
        this.validator.validateField(this.textfield);

        expect(this.textfield.attr('aria-invalid')).to.equal('true');


        //filled textfield passes
        this.textfield.val('this is a value');
        //call manually
        this.validator.validateField(this.textfield);

        expect(this.textfield.attr('aria-invalid')).to.equal('false');
    });

    test("validateField : Textfield modified (keyup) to be emptys fails on blur", function() {
        var event = jQuery.Event("keyup");
        event.keyCode = 33; //keycode 33 === !

        //empty textfield fails
        this.textfield.val();
        //fire a mock keypress to trigger the event chain but not change the field value
        this.textfield.trigger(event).trigger('blur');

        //expect(this.validator.validateField(this.textfield)).to.be.false;
        expect(this.textfield.attr('aria-invalid')).to.equal('true');
    });

    test("validateField : Textfield modified (keyup) with content succeeds on blur", function() {
        var event = jQuery.Event("keyup");
        event.keyCode = 33; //keycode 33 === !

        //filled textfield fails
        this.textfield.val('i am a value');
        //fire a mock keypress to trigger the event chain but not change the field value
        this.textfield.trigger(event).trigger('blur');

        expect(this.textfield.attr('aria-invalid')).to.equal('false');
    });

    test("validateField : Selectbox validated on blur or change", function() {
        //fire a mock keypress to trigger the event chain but not change the field value
        this.select.trigger('blur');

        expect(this.select.attr('aria-invalid')).to.equal('true');

        //change to a valid value for the next test
        this.select[0].selectedIndex = 1;

        //fire a the change event manually as changing it in JS doesnt fire it
        this.select.trigger('change');

        expect(this.select.attr('aria-invalid')).to.equal('false');
    });

});