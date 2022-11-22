/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/https', '../api/lever', '../../Employee/api/lib/onboard'], //, '../../SuiteBox/api/suitebox'],
    /**
     * @param {https} https
     */
    function(https, lever, onboard, suitebox) {

        /**
         * Marks the beginning of the Map/Reduce process and generates input data.
         *
         * @typedef {Object} ObjectRef
         * @property {number} id - Internal ID of the record instance
         * @property {string} type - Record type id
         *
         * @return {Array|Object|Search|RecordRef} inputSummary
         * @since 2015.1
         */
        function getInputData() {

//    	var arrNew = lever.getOpportunity({parameter: '?stage_id=offer'}).result.data;
//    	arrNew = arrNew.map(function(map) {return {id: map.id, stage: 'new'};});
            var arrNew = lever.getOpportunity({
                parameter: '?stage_id=offer&tag=NetSuite Offered'
            }).result.data;
            arrNew = arrNew.map(function (map) {
                map["stage"] = 'new';
                return map;
                // return {
                //     id: map.id,
                //     stage: 'new'
                // };
            });

            var arrUpdate = lever.getOpportunity({
                parameter: '?stage_id=offer&tag=NetSuite Synching'
            }).result.data;
            arrUpdate = arrUpdate.map(function (map) {
                map["stage"] = 'update';
                return map;
                // return {
                //     id: map.id,
                //     stage: 'update'
                // };
            });

            var arrInputs = arrNew.concat(arrUpdate);
            return arrInputs;
        }

        /**
         * Executes when the map entry point is triggered and applies to each key/value pair.
         *
         * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
         * @since 2015.1
         */
        function map(context) {

            var objContext = JSON.parse(context.value);
            var mapKey = objContext.id;
            var mapValue = objContext;

            context.write({
                key: mapKey,
                value: mapValue
            });
        }

        /**
         * Executes when the reduce entry point is triggered and applies to each group.
         *
         * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
         * @since 2015.1
         */
        function reduce(context) {

            var objContext = JSON.parse(context.values[0]);
            var reduceData = objContext;
            var result;

            // if(reduceData.id == "2ec4335b-e46a-4e59-adbe-7d018e0779c7") {
            //     var result = {
            //         id: 2722
            //     };
            //
            //     var employeeId = onboard.update(result);
            //     log.audit({
            //         title: 'Update Onboarding Employee ID',
            //         details: employeeId
            //     });
            // }
            if(reduceData.stage == 'new') {
                log.audit('New');
                result = lever.createOffer(reduceData);
                if(typeof result.id != "undefined") {
                    if(typeof result.offerstatus != "undefined" && result.offerstatus == 'draft') {
                        var employeeId = onboard.create(result);
                        log.audit({
                            title: 'Create Onboarding Employee ID',
                            details: employeeId
                        });
                        if(employeeId) {
                            suitebox.createFolder2({id: employeeId, type: "employee", suiteboxtype:'onboarding'});
                        }
                    }
                }
            } else if(reduceData.stage == 'update') {
                log.audit('update');
                result = lever.updateOffer(reduceData);
                if(typeof result.id != "undefined") {
                    if(typeof result.offerstatus != "undefined" && result.offerstatus == 'draft') {
                        var employeeId = onboard.update(result);
                        log.audit({
                            title: 'Update Onboarding Employee ID',
                            details: employeeId
                        });
                    }
                }
            }
        }

        /**
         * Executes when the summarize entry point is triggered and applies to the result set.
         *
         * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
         * @since 2015.1
         */
        function summarize(summary) {
            var reduceSummary = summary.reduceSummary;
            reduceSummary.errors.iterator().each(function(key, value){
                var msg = 'Process id: ' + key + '. Error was: ' + JSON.parse(value).message + '\n';

                log.audit({
                    title: 'summarize',
                    details: 'error: ' + msg
                });

                return true;
            });
        }

        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };

    });
