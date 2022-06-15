define(['N/runtime', '../../SuiteBox/api/suitebox', './lib/requisition'],

// function (runtime, suitebox, customjorbrequisition, requisition) {
    function (runtime, suitebox, requisition) {

        createFolder = function (newRec) {

            var objFolder = suitebox.createFolder({
                    name: newRec.getValue({fieldId: 'tranid'}),
                    parent: null
                },
                {
                    record: 'purchaserequisition',
                    id: newRec.id
                });

            var objCollab = suitebox.addCollab({
                type: 'folder',
                id: objFolder.id,
                email: runtime.getCurrentUser().email,
                role: 'co-owner',
                usertype: 'user'
            }, 'purchaserequisition');


            return objFolder;

        }

        copyRequisition = function (currRecord) {
            return requisition.setSpendScheduleFields(currRecord);
        }

        return {
            createFolder: createFolder,
            copyRequisition: copyRequisition
        };

    });
