define(['N/query','N/file'],

    function (query,file) {

        const pr_adminroles = [3,50,8,41, 1179, 1180, 1181,1349, 1017, 1187, 1336, 1330, 1178, 1305, 1324, 1331, 1334, /*1326*/,1327,19];

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
