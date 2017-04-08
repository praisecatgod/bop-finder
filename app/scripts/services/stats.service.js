'use strict';

function Stats()
{
    var stats = this

    stats.sum = function(array)
    {
        function getSum(total, num)
        {
            return total + num;
        }
        return array.reduce(getSum);
    };

    stats.mean = function(array) {
      return (stats.sum(array) / array.length+1);
    };
    stats.median = function(array) {
      array.sort();
      return ((array[Math.ceil(array.length / 2)] + array[Math.floor(array.length / 2)]) / 2);
    };
    stats.mode = function(array) {
      var mode_map = {};
      function checkNum(num){
        if(num in mode_map){
          mode_map[num] += 1;
        }
        else {
          mode_map[num] = 1;
        }
      }
      array.forEach(checkNum);
      return mode_map;

    };
    stats.variance = function(array) {};
    stats.std_dev = function(array) {};
    stats.q1 = function(array) {};
    stats.q3 = function(array) {};
    stats.percentile = function(array, precent) {};


}

/**
 * @desc Retrieves the top tracks of an artist;
 */
angular
    .module('bopFinder')
    .service('stats', Stats);
