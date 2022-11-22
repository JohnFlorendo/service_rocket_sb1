define(['N/ui/serverWidget'],

    function (serverWidget) {

        disabled = function (form) {
            var objField = {
                customForm: 'customform',
                requisitonNumber: 'tranid',
                requestor: 'entity',
                receivedBy: 'duedate',
                date: 'trandate',
                description: 'memo',
                notesAndSupportingInfo: 'custbody_purchase_notes',
                department: 'department',
                class: 'class',
                location: 'location',
                requisitionCurrency: 'custbody_req_currency',
                nextRenewalDate: 'custbody_next_renewal_date',
                nextRenewalReminderDate: 'custbody_next_renewal_reminder_date',
                rentalOwner: 'custbody_renewal_owner',
                noticePeriod: 'custbody_notice_period_duration_days'
            }

            for (var fieldId in objField) {
                var fld = form.getField(objField[fieldId]);

                fld.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
            }
        };

        return {
            disabled: disabled
        };
    });
