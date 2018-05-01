/**
 * CSVService
 *
 * @description :: Helper for handling CSV parsing
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var csv = require("fast-csv");
var moment = require("moment");
var _ = require("lodash");
var Promise = require("bluebird");

module.exports = {
    parseCSV: function (fileLocation) {
        return new Promise(function (resolve, reject) {
            var records = [];
            var report_id;
            var parser = csv
                .fromPath(fileLocation, { headers: true })
                .on("data", function (data) {
                    if (data['date'] == 'report id') {
                        // footer row
                        report_id = data['hours worked'];
                    } else {
                        // data rows
                        records.push(data);
                    }
                })
                .on("end", function () {
                    console.log("done");
                    resolve([report_id, records]);
                });
        });

    },
    processCSVRecords: function (report_id, records) {
        var promises = records.map(function (record) {
            return TimeReport.create({
                "report_id": report_id,
                "employee_id": record['employee id'],
                "work_hours": record['hours worked'],
                "work_date": moment(record['date'], 'DD/MM/YYYY').toDate(),
                "job_group_type": record['job group'],
                "processed": false
            })
        })
        return Promise.all(promises);
    },
    doesReportIdExist: function (report_id) {
        return TimeReport.find({ "report_id": report_id })
        .then(function (records) {
            if (records.length == 0) {
                return false;
            } else {
                return true;
            }
        })
    }
};