const Chai = require('chai');
const {
    expect
} = Chai;

describe('Sanity check', () => {
    it('1 + 1 should equal 2', () => {
        expect(1 + 1).to.equal(2);
    });
});
