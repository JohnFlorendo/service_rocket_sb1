/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/record', 'N/runtime'],

    (record, runtime) => {

        const getInputData = (inputContext) => {
            const scriptObj = runtime.getCurrentScript();

            var arrData = [];
            var stData = scriptObj.getParameter({name: 'custscript_param_arrdata'});
            if (stData) {
                arrData = JSON.parse(stData);
            }

            return arrData;
        }

        const map = (mapContext) => {
            try {
                var objValue = JSON.parse(mapContext.value);

                if (typeof objValue.spend_schedule_id != 'undefined' && typeof objValue.purchaseorder_id != 'undefined') {
                    record.submitFields({
                        type: "customrecord_sr_spend_schedule",
                        id: objValue.spend_schedule_id,
                        values: {custrecord_sr_sp_sch_po_trans: objValue.purchaseorder_id}
                    });
                }

            } catch (error) {
                log.error(error.name, error);
            }
        }

        return {getInputData, map}

    });
