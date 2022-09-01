define(['N/record', 'N/search'], function (record, search) {
    const MODULE = 'bankinformation.js'
    const BANK_FORM_LOCATION_MAPPING = [
        {
            locations: [22], //[Canada]
            bankForm: 'Canada Bank Information Form',
            bankFormId: 143
        },
       {
            locations: [14], //[Australia]
            bankForm: 'Australia Bank Information Form',
            bankFormId: 144
       },
       {
            locations: [24], //[United Kingdom]
            bankForm: 'UK Bank Information Form',
            bankFormId: 145
       },
       {
            locations: [6], //[Singapore]
            bankForm: 'SG Bank Information Form',
            bankFormId: 146
       },
       {
            locations: [21], //[malaysia]
            bankForm: 'Malaysia Bank Information Form',
            bankFormId: 147
       },
       {
            locations: [15], //[India]
            bankForm: 'India Bank Information Form',
            bankFormId: 148
       },
       {
            locations: [23], //[Chile]
            bankForm: 'Chile Bank Information Form',
            bankFormId: 149
       }
    ]

    createBankForm = function(option) {
        const title = 'createBankInformation log'
        const stEmployeeId = option.employeeId
        const objBankForm = {
            module: MODULE,
            employeeId: stEmployeeId
        }
        
        try{
            if(!stEmployeeId) {
                objBankForm['message'] = 'Invalid employee'
                log.error(title, objBankForm)
                return
            }
    
            const objEmployeeRec = record.load({
                type: 'employee',
                id: stEmployeeId
            })
    
            const stLocationId = objEmployeeRec.getValue({fieldId: 'location'})
            if(!stLocationId) {
                objBankForm['message'] = 'Invalid employee location'
                log.error(title, objBankForm)
                return
            }
    
            for(var idxBf=0; idxBf<BANK_FORM_LOCATION_MAPPING.length; idxBf++) {
                if(BANK_FORM_LOCATION_MAPPING[idxBf].locations.indexOf(Number(stLocationId)) != -1) {
                    objBankForm['bankFormId'] = BANK_FORM_LOCATION_MAPPING[idxBf].bankFormId
                    break;
                }
            }
            
            if(!objBankForm.hasOwnProperty('bankFormId')) {
                objBankForm['message'] = 'bankFormId not found'
                log.error(title, objBankForm)
                return
            }
            const existingBankForm = checkExistingBankForm({employeeId: stEmployeeId})
            if(existingBankForm.length > 0) {
                objBankForm['message'] = 'Bank Form already exist with an internalid '+existingBankForm[0].id
                log.error(title, objBankForm)
                return
            }
            

            const stBankInfoId = record.create({type: 'customrecord_bankinformation'})
            stBankInfoId.setValue({fieldId: 'customform', value: objBankForm.bankFormId})
            stBankInfoId.setValue({fieldId: 'custrecord_bi_employee', value: objBankForm.employeeId})
            stBankInfoId.setValue({fieldId: 'name', value: '-- unassigned --'})
            objBankForm['createdBankInformation'] = stBankInfoId.save()

            log.audit(title, objBankForm)

        }catch(objError) {
            log.error(title, {
                module: MODULE,
                employeeId:stEmployeeId,
                message: objError.message
            })
        }
    }

    function checkExistingBankForm(option) {
        const stEmployeeId = option.employeeId
        
        const srBankForm = search.create({
            type: 'customrecord_bankinformation',
            filters: [
                ['isinactive', 'is', 'F'], 'AND',
                ['custrecord_bi_employee', 'is', stEmployeeId]
            ]
        }).run().getRange({start: 0, end: 1})
        return srBankForm
    }

    //createBankForm({employeeId: 7130})
    return {
        createBankForm: createBankForm
    }
})