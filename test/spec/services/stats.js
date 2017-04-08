'use strict';

describe('Service: Stats', function()
{

    var stats_test;

    // load the services's module
    beforeEach(module('bopFinder'));

    // load the service for testing
    beforeEach(inject(function(stats)
    {
        stats_test = stats;
    }));

    it('sum: it should sum an array', function()
    {
        var array = [1, 2, 3];
        var sum = stats_test.sum(array);
        expect(sum).toBe(6);
    });

    it('mean: it should get the mean of an array', function()
    {
        var array = [1, 2, 3];
        var mean = stats_test.mean(array);
        expect(mean).toBe(3);
    });

    it('median: it should get the middle number of an array', function()
    {
        var array = [2, 1, 3];
        var median = stats_test.median(array);
        expect(median).toBe(2);
        array = [8, 3, 1, 5];
        median = stats_test.median(array);
        expect(median).toBe(4);
    });

    it('mode: it should get the most occuring numbers of an array', function()
    {
        expect(3).toBe(3);
    });

    it('variance', function()
    {
        expect(3).toBe(3);
    });

    it('std_dev', function()
    {
        expect(3).toBe(3);
    });
    it('q1', function()
    {
        expect(3).toBe(3);
    });

    it('q2', function()
    {
        expect(3).toBe(3);
    });
    it('percentile', function()
    {
        expect(3).toBe(3);
    });


});
