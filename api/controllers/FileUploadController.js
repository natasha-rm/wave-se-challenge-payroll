/**
 * CsvfileController
 *
 * @description :: Controller for handling CSV file upload.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var Promise = require("bluebird");

module.exports = {
    upload: function (req, res) {
        if (req.method === 'GET') {
            return res.json({
                'status': 'GET not allowed'
            });
        }

        // Call to /upload via GET is error
        var uploadFile = req.file('uploadFile');
        uploadFile.upload(function onUploadComplete(err, files) {
            // Files will be uploaded to .tmp/uploads
            if (err) {
                return res.serverError(err);  // IF ERROR Return and send 500 error
            }

            if (!files || !files[0]) {
                return res.json({
                    'status': 'File not provided'
                });
            }

            return Promise.resolve().then(function () {
                return CSVService.parseCSV(files[0].fd);
            }).then(function (data) {
                var report_id = data[0];
                var records = data[1];

                return CSVService.doesReportIdExist(report_id).then(function (exists) {
                    if (exists) {
                        return res.json({
                            'status': 'Import of duplicate report is not allowed'
                        });
                    } else {
                        return CSVService.processCSVRecords(report_id, records)
                        .then(function () {
                            return PayrollService.processRecords();
                        }).then(function () {
                            return res.redirect('/');
                        })
                    }
                })
            })
        });
    }
};



