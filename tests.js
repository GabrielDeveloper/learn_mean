var assert = require("assert");

describe('my feature', function() {
    it ('works', function () {
        assert.equal('A', 'B');
    })

    it ('fails gracefully', function (){
        assert.throws(function() {
            throw 'Error!';
        });
    });
});

describe('my other feature', function (){
    it ('async', function () {
        setTimeout(function(){
            done();
        }, 25);
    });
});
