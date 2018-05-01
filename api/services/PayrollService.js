/**
 * PayrollService
 *
 * @description :: Helper for handling payroll processing.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var _ = require("lodash");
var moment = require("moment");
var Promise = require("bluebird");

module.exports = {
    processRecords: function () {
        JobGroupType.find().then(function (jobGroupTypes) {
            // Call to /processRecords via GET is error
            return TimeReport.find({ processed: false }).then(function (results) {

                // create hashmap of employee and their time records
                var employeeTimeReportData = _.reduce(results, function (result_of_reduce, record) {
                    (result_of_reduce[record.employee_id] || (result_of_reduce[record.employee_id] = [])).push(record);
                    return result_of_reduce;
                }, {});
                var employee_ids = Object.keys(employeeTimeReportData);
                var processEmployeePromises = employee_ids.map(function (employee_id) {
                    return processEmployee(employee_id, employeeTimeReportData[employee_id], jobGroupTypes);
                });

                return Promise.all(processEmployeePromises).then(function () {
                    console.log("Processing complete");
                    // mark the time record as processed                    
                    var timeRecordIds = _.reduce(results, function (result, record) {
                        (result || []).push(record.id);
                        return result;
                    }, []);                    
                    return TimeReport.update({id: timeRecordIds}, { processed: true })

                }).catch(function (err) {
                    console.log("Error encountered");
                    console.log(err);
                })
            })
        });
    }
};

function processEmployee(employee_id, dataForEmployee, jobGroupTypes) {
    // look in payreport table for employee records
    return PayReport.find({
        employee_id: employee_id,
    }).then(function (payRecordsForEmployee) {
        console.log("PayRecords for employee: " + employee_id);
        // console.log(payRecordsForEmployee);

        if (!payRecordsForEmployee) {
            payRecordsForEmployee = [];
        }

        // parse through all timereport records for this employee
        var dataForEmployeePromises = dataForEmployee.map(function (timeRecord) {
            var dateWorked = timeRecord.work_date;
            var foundIndex = _.findIndex(payRecordsForEmployee, function (o) { return o.pay_period_start <= dateWorked && o.pay_period_end >= dateWorked; });
            if (foundIndex != -1) {
                // found, uodate amount
                payRecordsForEmployee[foundIndex] = updatePayRecordInMemory(payRecordsForEmployee[foundIndex], timeRecord, jobGroupTypes);
            } else {
                // not found, create a new record
                var newRecord = createPayRecordInMemory(timeRecord, jobGroupTypes);
                payRecordsForEmployee.push(newRecord);
            }
        })

        return Promise.all(dataForEmployeePromises).then(function () {
            // save the memory list records
            // this can be improved by keeping track of records that actually have updates and only updating those
            return updatePayRecords(payRecordsForEmployee);
        })
    })
}

function updateTimeRecords(timeRecords) {
    var timeRecordsPromises = timeRecords.map(function (result) {
        return TimeReport.update({ id: result.id }, { processed: true })
    })
    return Promise.all(timeRecordsPromises);
}

function updatePayRecords(payRecords) {
    var payRecordsPromises = payRecords.map(function (result) {
        if (!result.id) {
            // if id is null, new record  
            return PayReport.create({
                "employee_id": result.employee_id,
                "pay_period_start": result.pay_period_start,
                "pay_period_end": result.pay_period_end,
                "amount": result.amount,
                "currency_type": result.currency_type
            })
        } else {
            // if id exists, update
            return PayReport.update({ id: result.id }, { amount: result.amount });
        }
    })
    return Promise.all(payRecordsPromises);
}

function createPayRecordInMemory(timeRecord, jobGroupTypes) {
    var jobType = getJobType(jobGroupTypes, timeRecord.job_group_type);
    var pay_period_start, pay_period_end;
    if (IsInFirstHalfOfMonth(timeRecord.work_date)) {
        pay_period_start = getPayPeriodDate(timeRecord.work_date, 1);
        pay_period_end = getPayPeriodDate(timeRecord.work_date, 15);
    } else {
        var lastDateInMonth = moment(timeRecord.work_date).daysInMonth();
        pay_period_start = getPayPeriodDate(timeRecord.work_date, 16);
        pay_period_end = getPayPeriodDate(timeRecord.work_date, lastDateInMonth);
    }

    return {
        "employee_id": timeRecord.employee_id,
        "pay_period_start": pay_period_start,
        "pay_period_end": pay_period_end,
        "amount": getAdditionalAmount(timeRecord.work_hours, jobType.pay_per_hour),
        "currency_type": jobType.currency_type
    };
}

function updatePayRecordInMemory(existingPayRecord, timeRecord, jobGroupTypes) {
    var jobType = getJobType(jobGroupTypes, timeRecord.job_group_type);
    existingPayRecord.amount = existingPayRecord.amount + getAdditionalAmount(timeRecord.work_hours, jobType.pay_per_hour);
    return existingPayRecord;
}

function getJobType(jobGroupTypes, id) {
    return _.find(jobGroupTypes, function (o) { return o.id == id });
}

function IsInFirstHalfOfMonth(work_date) {
    var dateWrapper = moment(work_date);
    if (dateWrapper.get('date') <= 15) {
        return true;
    } else {
        return false;
    }
}

function getPayPeriodDate(work_date, dayOfMonth) {
    return moment(work_date).set('date', dayOfMonth).toDate();
}

function getAdditionalAmount(work_hours, pay_per_hour) {
    return work_hours * pay_per_hour
}
