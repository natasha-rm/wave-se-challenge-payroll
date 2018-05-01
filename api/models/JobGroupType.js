/**
 * JobGroupType.js
 * 
 * @description: Supported job groups. This table stores the hours rate per job group
 */


module.exports = {
    attributes: {
        id: { type: 'string', required: true },
        pay_per_hour: { type: 'number' },
        currency_type: { type: 'string' }
    },
  };