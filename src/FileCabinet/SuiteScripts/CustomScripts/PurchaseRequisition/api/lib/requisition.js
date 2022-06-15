define([],
    function () {

        setSpendScheduleFields = function (currRecord) {
            var arrFieldId = ['custbody_ss_grand_total', 'custbody_ss_total_committed', 'custbody_ss_total_available', 'custbody_ss_total_buffer']

            for (var stField in arrFieldId) {
                var stFieldId = arrFieldId[stField];

                var stFields = currRecord.getField({
                    fieldId: stFieldId
                });
                stFields.isDisabled = false;

                currRecord.setValue({
                    fieldId: stFieldId,
                    value: 0
                });
            }
        };

        return {
            setSpendScheduleFields: setSpendScheduleFields
        };

    });