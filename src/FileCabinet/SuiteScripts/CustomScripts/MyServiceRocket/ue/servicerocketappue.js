/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['../../MyServiceRocket/api/myservicerocket','N/runtime',],
    
    (myservicerocket,runtime) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {
            var recObj = scriptContext.newRecord;

            var idMe = runtime.getCurrentUser().id;
            log.audit('scriptContext',scriptContext.type)
            var hasPermission = myservicerocket.hasMyAppsPermission({
                custparam: {
                    paramuser: idMe,
                    paramapps: recObj.type+'_'+scriptContext.type
                }
            });

            if (!hasPermission) {
                var objError={
                    title: 'Access Restriction',
                    message: 'You do not have privileges to view this page.'
                }

                throw objError.message;
            }
        }

        return {beforeLoad}

    });
