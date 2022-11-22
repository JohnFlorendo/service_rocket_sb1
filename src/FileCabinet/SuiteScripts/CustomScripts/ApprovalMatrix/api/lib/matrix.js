define(['N/file', 'N/query', 'N/record'],

    function (file, query, record) {

        set = function (option) {

            var idRecord = option.recordid;
            var sRecord = option.record;

            var sSql = file.load({
                id: '../../sql/matrix.sql'
            }).getContents();

            var custParam = {
                paramrecord: sRecord,
            };

            var regx = new RegExp(Object.keys(custParam).join("|"), "gi");
            sSql = sSql.replace(regx, function (matched) {
                return custParam[matched];
            });

            var arrMatrix = query.runSuiteQL({
                query: sSql
            }).asMappedResults();


            if (arrMatrix.length == 1) {

                var objMatrix = arrMatrix[0];

                var rec = record.load({
                    type: sRecord,
                    id: idRecord,
                    isDynamic: true
                });

                rec.setValue({
                    fieldId: objMatrix.matrixfield,
                    value: objMatrix.matrix
                });

                rec.setValue({
                    fieldId: objMatrix.statusfield,
                    value: 1
                });

                rec.setValue({
                    fieldId: objApprover.matrixstatusfield,
                    value: 1//approved
                });

                rec.setValue({
                    fieldId: objMatrix.levelfield,
                    value: 0
                });

                rec.save();
            }

            return;

        };

        get = function (sRecord) {
            var sSql = file.load({
                id: '../../sql/matrix.sql'
            }).getContents();

            var custParam = {
                paramrecord: sRecord,
            };

            var regx = new RegExp(Object.keys(custParam).join("|"), "gi");
            sSql = sSql.replace(regx, function (matched) {
                return custParam[matched];
            });

            var arrMatrix = query.runSuiteQL({
                query: sSql
            }).asMappedResults();

            if (arrMatrix.length > 0) {
                var objMatrix = arrMatrix[0];

                return objMatrix;
            }
        }

        return {
            set: set,
            get: get
        };

    });

