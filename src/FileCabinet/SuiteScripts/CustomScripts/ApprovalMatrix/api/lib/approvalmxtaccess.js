define(['N/query','N/file'],

    function (query,file) {

        const pr_adminroles = [1181,1349];//Requisition role

        var approvalMatrix = {};

        approvalMatrix.getRequisitionAdminAccess = function (option) {
            log.audit('option',option)
            var custParam = option.custparam;

            var regx = new RegExp(Object.keys(custParam).join("|"), "gi");
            var sSql = file.load({
                id: '../../sql/approvalmxtaccess.sql'
            }).getContents();

            sSql = sSql.replace(regx, function (matched) {
                return custParam[matched];
            });

            var arrRoles = query.runSuiteQL({
                query: sSql
            }).asMappedResults();

            arrRoles = arrRoles.map(function(object){
                return object.id
            });

            return pr_adminroles.some(function(id){return arrRoles.indexOf(id)!=-1} )

            //log.audit('arrRoles', arrRoles)
        }

        return approvalMatrix;

    });
