/**
 * JobGroupType.js
 * 
 * @description: Supported job groups
 */


module.exports = {
    attributes: {
        id: { type: 'string', required: true },
        pay_per_hour: { type: 'number' },
        currency_type: { type: 'string' }
    },
  };