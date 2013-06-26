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