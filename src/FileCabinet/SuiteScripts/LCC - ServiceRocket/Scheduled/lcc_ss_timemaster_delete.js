/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['../Library/lcc_lib_timemaster'],

    function(lib) {

        /**
         * Definition of the Scheduled script trigger point.
         *
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
         * @Since 2015.2
         */
        function execute(scriptContext) {
            lib.deleteTimeMaster();
        }

        return {
            execute: execute
        };

    });