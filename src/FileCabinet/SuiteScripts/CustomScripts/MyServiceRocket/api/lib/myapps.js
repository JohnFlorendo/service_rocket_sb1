define(['N/file', 'N/query'],

    function (file, query) {

        get = function (option) {

            //get MyApps with parameter of MyServiceRocket and user

            var custParam = option.custparam;

            var regx = new RegExp(Object.keys(custParam).join("|"), "gi");
            log.audit('regx', regx)
            var sSql = file.load({
                id: '../../sql/myapps.sql'
            }).getContents();

            sSql = sSql.replace(regx, function (matched) {
                return custParam[matched];
            });
            log.audit('sSql', sSql)
            var arrApps = query.runSuiteQL({
                query: sSql
            }).asMappedResults();

            //Return JSON from SQL
            return arrApps;


        };
        getByGroup = function (option) {

            //get MyApps with parameter of MyServiceRocket and user

            var custParam = option.custparam;

            var regx = new RegExp(Object.keys(custParam).join("|"), "gi");
            var sSql = file.load({
                id: '../../sql/myapps_2_0.sql'
            }).getContents();

            sSql = sSql.replace(regx, function (matched) {
                return custParam[matched];
            });

            var arrApps = query.runSuiteQL({
                query: sSql
            }).asMappedResults();

            //Return JSON from SQL
            return consolidateDataByGroup(arrApps);
        };

        consolidateDataByGroup = function (arrApps) {
            try {
                var arrGroupedApps = [];

                for (var index in arrApps) {
                    var objApps = arrApps[index];

                    var groupIndex = arrGroupedApps.findIndex(group => group.groupname === objApps.groupname)

                    var objGroupedApps = {};
                    if (groupIndex == -1) {
                        objGroupedApps.groupname = objApps.groupname;
                        objGroupedApps['apps'] = [];
                        objGroupedApps['apps'].push(objApps);
                        arrGroupedApps.push(objGroupedApps)
                    } else {
                        arrGroupedApps[groupIndex]['apps'].push(objApps);
                    }

                }
                for (var index in arrGroupedApps) {
                    if (arrGroupedApps[index].groupname==null || arrGroupedApps[index].groupname.length === 0) {
                        arrGroupedApps[index].groupname = 'Others';
                    }
                }
                return arrGroupedApps;

            } catch (err) {
                log.error('consolidateDataByGroup', err)
            }
        }

        hasPermission = function (option) {
            try {
                //check MyApps with parameter of user and MyApps

                var custParam = option.custparam;

                var regx = new RegExp(Object.keys(custParam).join("|"), "gi");
                var sSql = file.load({
                    id: '../../sql/myapp.sql'
                }).getContents();

                sSql = sSql.replace(regx, function (matched) {
                    return custParam[matched];
                });


                log.audit({
                    title: 'hasPermission',
                    details: 'sql: ' + sSql
                });

                var arrApps = query.runSuiteQL({
                    query: sSql
                }).asMappedResults();


                ///return boolean
                if (arrApps.length > 0) {
                    return true;
                } else {
                    return false;
                }
            } catch (err) {
                log.error('hasPermission', err)
            }
        };

        getDataPermission = function (option) {
            try {
                //check MyApps with parameter of user and MyApps

                var custParam = option.custparam;

                var regx = new RegExp(Object.keys(custParam).join("|"), "gi");
                var sSql = file.load({
                    id: '../../sql/myapp.sql'
                }).getContents();

                sSql = sSql.replace(regx, function (matched) {
                    return custParam[matched];
                });

                log.audit({
                    title: 'getDataPermission',
                    details: 'sql: ' + sSql
                });

                var arrApps = query.runSuiteQL({
                    query: sSql
                }).asMappedResults();

                var countryParam = ''

                if (arrApps.length) {
                    countryParam = arrApps[0].country
                }

                return countryParam;

            } catch (err) {
                log.error('hasPermission', err)
            }
        };

        filterDataPermission = function (option) {

            var custParam = option.custparam;
            var regx = new RegExp(Object.keys(custParam).join("|"), "gi");

            var sSql = file.load({
                id: 'SuiteScripts/CustomScripts/MyServiceRocket/sql/myappdatapermission.sql'
            }).getContents();

            sSql = sSql.replace(regx, function (matched) {
                return custParam[matched];
            });

            var arrApps = query.runSuiteQL({
                query: sSql
            }).asMappedResults();

            if (arrApps.length > 0) {

                var arrFilters = [];


                if (arrApps[0].subsidiary != null && arrApps[0].subsidiary != '') {
                    arrFilters.push(' subsidiary_hide IN (' + arrApps[0].subsidiary + ') ');
                }

                if (arrApps[0].class != null && arrApps[0].class != '') {
                    arrFilters.push(' class_hide IN (' + arrApps[0].class + ') ');
                }

                if (arrApps[0].location != null && arrApps[0].location) {
                    arrFilters.push(' location_hide IN (' + arrApps[0].location + ') ');
                }

                var sFilters = arrFilters.join('AND');

                var sSql = 'SELECT * FROM ( ' + option.sql + ') ';

                if (arrFilters.length > 0) {
                    sSql = sSql + ' WHERE ' + sFilters;
                }

            }

            return sSql;


        };
        return {
            get: get,
            hasPermission: hasPermission,
            getByGroup: getByGroup,
            getDataPermission: getDataPermission
        };

    });
