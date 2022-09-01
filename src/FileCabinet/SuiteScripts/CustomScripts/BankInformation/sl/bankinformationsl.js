/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/redirect', 'N/runtime', 'N/query', 'N/file'],
    /**
     * @param {redirect} redirect
     * @param {runtime} runtime
     * @param {query} query
     * @param {file} file
     */

    (redirect, runtime, query, file) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try {
                var inCurrentUser = runtime.getCurrentUser().id;

                var sSql = file.load({
                    // id: 309748 //bankinformation.sql
                    id: '../sql/bankinformation.sql'
                }).getContents();

                var objBankInfo = query.runSuiteQL({
                    query: sSql,
                    params: [inCurrentUser]
                }).asMappedResults()[0];
                log.debug('objBankInfo', objBankInfo);

                redirect.toRecord({
                    type: 'customrecord_bankinformation',
                    id: objBankInfo.bankinfoid,
                    isEditMode: true
                });
            } catch (e) {
                log.debug('error', e);
            }
        }

        return {onRequest}

    });
