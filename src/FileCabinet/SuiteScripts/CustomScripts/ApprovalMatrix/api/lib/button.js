define(['N/file', 'N/ui/serverWidget', '../../../Library/handlebars'],

    function (file, serverWidget, handlebars) {

        createButton = function (option) {
            var sTemplate = file.load({
                id: '../../btn/btnhtml.html'
            }).getContents();

            var insertHml = option.form.addField({
                id: 'custpage_pa_jquery1',
                type: serverWidget.FieldType.INLINEHTML,
                label: 'JQ'
            });

            var sHandlebar = handlebars.compile(sTemplate);
            var sHtml = sHandlebar({
                record: option.newRec.type,
                id: option.newRec.id
            });

            insertHml.defaultValue = sHtml;

            option.arrButtons.forEach(function (objButton) {
                option.form.addButton(objButton);
            })
        }

        approveRejectButton = function (newRec) {
            var arrButtons = [{
                id: 'custpage_btn_approve',
                label: 'Approve',
                functionName: newRec.type == 'purchaserequisition' ? 'procurementReview' : 'approve'
            }, {
                id: 'custpage_btn_reject',
                label: 'Reject',
                functionName: 'reject'
            }];

            return arrButtons;
        }

        return {
            createButton: createButton,
            approveRejectButton: approveRejectButton
        }

    });
