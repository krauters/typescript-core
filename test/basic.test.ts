import { expect } from 'chai';
import { spy } from 'sinon';

function add(a: number, b: number): number {
    return a + b;
}

describe('add function', () => {
    it('should return the sum of two numbers', () => {
        const result = add(2, 3)
        expect(result).to.equal(5)
    })

    it('should be called once', () => {
        const spyAdd = spy(add)
        const result = spyAdd(2, 3)
        expect(result).to.equal(5)
        expect(spyAdd.calledOnce).to.be.true
    })
})
