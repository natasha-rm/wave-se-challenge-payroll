/**
 * PayrollController
 *
 * @description :: Server-side actions for handling payroll processing.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var moment = require("moment");

module.exports = {
  view: function(req, res) {
    PayReport.find()
    .sort([
        { employee_id: 'ASC' },
        { pay_period_start: 'ASC' },
    ]).exec(function (err, reports) {
        if (err) return res.serverError(err);

        var reportViewModel = [];
        reports.forEach(element => {
        reportViewModel.push({
            "employee_id": element.employee_id,
            "amount": element.amount,
            "currency_type": element.currency_type,
            "pay_period": formatPayPeriod(element.pay_period_start, element.pay_period_end)
        })
        });

        return res.view('pages/report', {
            reports: reportViewModel
        });
    });
  },

};

function formatPayPeriod(start_date, end_date) {
    return moment(start_date).format("DD/MM/YYYY") + " - " + moment(end_date).format("DD/MM/YYYY");
}
