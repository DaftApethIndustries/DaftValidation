suite('Validator Contructor', function() {

    setup(function() {
        this.formSelect = '.looseValidation';
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

suite('Validator Test Functions', function() {

    setup(function() {
        this.formSelect = '.looseValidation';
        this.form = $(this.formSelect).looseValidation();
        this.textfield = $('#required');
        this.select = $('#required-select');
        this.checkbox = $('#required-checkbox');
        this.textarea = $('#required-textarea');

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

    test("Required: Textfield: empty textfield fails", function() {
        this.textfield.val('');
        expect(this.validator.useRule('required', this.textfield)).to.be.false;
    });
    test("Required: Textfield: filled textfield passes", function() {
        this.textfield.val('this is a value');
        expect(this.validator.useRule('required', this.textfield)).to.be.true;
    });
    test("Required: Textfield: textfield with spaces only passes", function() {
        this.textfield.val('   ');
        expect(this.validator.useRule('required', this.textfield)).to.be.true;
    });

    test("Required: Select: first index fails", function() {
        this.select[0].selectedIndex = 0;
        expect(this.validator.useRule('required', this.select)).to.be.false;
    });
    test("Required: Select: second index passes", function() {
        this.select[0].selectedIndex = 1;
        expect(this.validator.useRule('required', this.select)).to.be.true;
    });

    test("Required: Checkbox: unchecked fails", function() {
        this.checkbox[0].checked = false;
        expect(this.validator.useRule('required', this.checkbox)).to.be.false;
    });
    test("Required: Checkbox: checked passes", function() {
        this.checkbox[0].checked = true;
        expect(this.validator.useRule('required', this.checkbox)).to.be.true;
    });

    test("Required: Textarea: unfilled textarea passes", function() {
        this.textarea[0].value = '';
        expect(this.validator.useRule('required', this.textarea)).to.be.false;
    });
    test("Required: Textarea: filled textarea passes", function() {
        this.textarea[0].value = 'this is a value';
        expect(this.validator.useRule('required', this.textarea)).to.be.true;
    });
    test("Required: Textarea: with spaces only fails", function() {
        this.textarea[0].value = '      ';
        expect(this.validator.useRule('required', this.textarea)).to.be.false;
    });

});