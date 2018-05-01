/**
 * PayReport.js
 * 
 * @description: Report for payroll. This table contains the pay for employees in different pay periods
 */


module.exports = {
    attributes: {
        employee_id: { type: 'number' },
        pay_period_start: { type: 'ref', columnType: 'timestamp' },
        pay_period_end: { type: 'ref', columnType: 'timestamp' },
        amount: { type: 'number', columnType: 'float' },
        currency_type: { type: 'string' }
    }
  };