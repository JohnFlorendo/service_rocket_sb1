define(['N/query', 'N/file', '../../../SuiteTable/api/suitetable'],

    function(query, file, suitetable) {

            getList = function(option){

                    var objData;
                    var arrOpps = [];
                    var idLast = 0;

                    do {

                            var arrResult = suitetable.getData({
                                    sqlfile: 'SuiteScripts/CustomScripts/RecordViewer/sql/stateofregistrationlist.sql',
                                    params : [idLast]
                            });
                            log.audit('arrResult',arrResult)
                            objData = arrResult;

                            arrOpps = arrOpps.concat(arrResult.data);
                            idLast = arrResult.data[arrResult.data.length -1][9];

                    } while (arrResult.data.length >= 5000);


                    objData.data = arrOpps;
                    log.audit('objData',objData)
                    return objData;

            };

            getRecord = function(option){

                    var objData = suitetable.getData({
                            sqlfile: 'SuiteScripts/CustomScripts/RecordViewer/sql/stateofregistrationrecord.sql',
                            params : [option.id]
                    });

                    var arrHeaders = objData.header;
                    var sHeader = [];

                    arrHeaders.forEach( function(header) {
                            sHeader.push(header.title);
                    });

                    objData.header = JSON.stringify(sHeader);
                    objData.data = JSON.stringify(objData.data);
                    //log.audit('getRecord',objData)
                    return objData;

            };


            return {
                    getList: getList,
                    getRecord: getRecord
            };

    });
