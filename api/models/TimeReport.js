/**
 * TimeReport.js
 * 
 * @description: Log of hours tracked for each employee. This is an archive of the CSV input
 */


module.exports = {
    attributes: {
        report_id: { type: 'string' },
        employee_id: { type: 'number' },
        work_date: { type: 'ref', columnType: 'timestamp' },
        work_hours: { type: 'number', columnType: 'float' },
        job_group_type: { type: 'string' },
        processed: { type: 'boolean', defaultsTo: false }
    },

};