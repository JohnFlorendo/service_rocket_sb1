define(['N/email', 'N/file', 'N/record', 'N/runtime', 'N/search', '../api/lib/action', '../api/lib/approvalmxtaccess', '../api/lib/displaytype', '../api/lib/button'],
    /**
     * @param {email} email
     * @param {file} file
     * @param {record} record
     * @param {runtime} runtime
     * @param {search} search
     */
    function (email, file, record, runtime, search, action, approvalmxtaccess, displaytype, button) {

        initialize = function (option) {
            return action.initialize(option);
        };

        submit = function (option) {
            return action.submit(option);
        };

        edit = function (option) {
            return action.edit(option);
        };

        cancel = function (option) {
            return action.cancel(option);
        };

        approve = function (option) {
            return action.approve(option);
        };

        reject = function (option) {
            return action.reject(option);
        };

        procurementReview = function (option) {
            return action.procurementReview(option);
        };

        spendScheduleUpdated = function (option) {
            return action.spendScheduleUpdated(option);
        };

        dataChecked = function (option) {
            return action.dataChecked(option);
        };

        current = function (option) {
            return action.current(option);
        };

        getRequisitionAdminAccess = function (option) {
            return approvalmxtaccess.getRequisitionAdminAccess(option);
        }

        fieldDisabled = function (form) {
            return displaytype.disabled(form);
        }

        buttons = function (option) {
            return button.createButton(option);
        }

        buttonApproval = function (newRec) {
            return button.approveRejectButton(newRec);
        }

        return {
            initialize: initialize,
            submit: submit,
            edit: edit,
            approve: approve,
            reject: reject,
            current: current,
            cancel: cancel,
            procurementReview: procurementReview,
            spendScheduleUpdated: spendScheduleUpdated,
            dataChecked: dataChecked,
            getRequisitionAdminAccess: getRequisitionAdminAccess,
            fieldDisabled: fieldDisabled,
            buttons: buttons,
            buttonApproval: buttonApproval
        };

    });
