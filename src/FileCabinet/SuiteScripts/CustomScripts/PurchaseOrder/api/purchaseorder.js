/**
 * @NApiVersion 2.1
 */
define(['./lib/purchaseorder'],

    (purchaseorder) => {

        const createPOfromPR = (newRecord) => {
            return purchaseorder.setLineTaxCodes(newRecord);
        }

        const updatePOExpiryDate = (newRecord) => {
            return purchaseorder.setExpiryDate(newRecord);
        }

        const setLineActivityCodes = (newRecord,contextType) => {
            return purchaseorder.setLineActivityCodes(newRecord,contextType);
        }
        const setLineActivityCodesEditMode = (newRecord,contextType) => {
            return purchaseorder.setLineActivityCodesEditMode(newRecord,contextType);
        }
        

        return {createPOfromPR, updatePOExpiryDate, setLineActivityCodes,setLineActivityCodesEditMode}

    });
