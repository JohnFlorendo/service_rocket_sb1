define(['N/https', 'N/search', 'N/record', '../../../Helper/jsonmapns', '../../../Library/momentjs/moment'],
    /**
     * @param {https} https
     * @param {search} search
     * @param {record} record
     */
    function (https, search, record, jsonmapns, moment) {

        get = function (option) {
            var retMe = option;
            var resp = https.get({
                url: 'https://api.lever.co/v1/candidates',
                headers: {
                    'Authorization': 'Basic {custsecret_lever_wipapikey}',
                    'Content-Type': 'application/json'
                },
                credentials: ['custsecret_lever_wipapikey']
            });

            if (resp.code == 200 || resp.code == 201) {

                var objBody = JSON.parse(resp.body).data;

                retMe.result = {
                    status: 'SUCCESS',
                    data: objBody
                };
            } else {

                var objBody = {};

                try {
                    objBody = JSON.parse(resp.body);
                }
                catch (err) {

                    var e = err;
                    objBody.message = resp.body;
                }

                retMe.result = {
                    status: 'FAILED',
                    message: resp.code + ': ' + objBody.message
                };
            }

            return retMe;

        };

        create = function (option) {

            try {
                var objOffer = get(option);
                var retMe = {};

                log.audit({
                    title: 'objCandidate',
                    details: objOffer
                });

                return retMe;

            } catch(err) {
                log.audit({
                    title: 'Creation Error',
                    details: err
                });
            }
        };

        update = function (option) {
            try {
                var objOffer = get(option);
                var retMe = {};

                log.audit({
                    title: 'update objCandidate',
                    details: objOffer
                });

                return retMe;
            } catch(err) {
                log.audit({
                    title: 'Update Error',
                    details: err
                });
            }
        };

        return {
            get: get,
            create: create,
            update: update
        };

    });
