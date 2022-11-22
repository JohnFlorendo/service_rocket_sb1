/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/file', 'N/query', 'N/https'],

    (file, query, https) => {

        const getInputData = (inputContext) => {
            try {
                var sqlResult = file.load({
                    id: '../sql/tripactions.sql'
                }).getContents();

                var arrResult = query.runSuiteQL({
                    query: sqlResult
                }).asMappedResults();

                return [{"status": "success", "projects": arrResult}];
            } catch (e) {
                log.debug('error -> getInputData', e);
            }
        }

        const map = (mapContext) => {
            try {
                mapContext.write({
                    key: 0,
                    value: mapContext.value
                });
            } catch (e) {
                log.debug('error -> map', e);
            }
        }

        const reduce = (reduceContext) => {
            try {
                var objContext = JSON.parse(reduceContext.values[0]);

                https.post({
                    url: 'https://us-central1-it-urd.cloudfunctions.net/ons2ta-projects-prod-main',
                    body: JSON.stringify(objContext),
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Signature': '{custsecret_tripaction_apikey}',
                    },
                    credentials: ['custsecret_tripaction_apikey']
                });
            } catch (e) {
                log.debug('error -> reduce', e);
            }
        }

        const summarize = (summaryContext) => {
            var reduceSummary = summaryContext.reduceSummary;
            reduceSummary.errors.iterator().each(function (key, value) {

                log.error('error', JSON.parse(value));
                return true;
            });
        }

        return {getInputData, map, reduce, summarize}

    });
