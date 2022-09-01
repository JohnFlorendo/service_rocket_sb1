/**
 * @NApiVersion 2.1
 */
define(['./lib/purchaseorder'],

    (purchaseorder) => {

        const createPOfromPR = (newRecord) => {
            return purchaseorder.setLineTaxCodes(newRecord);
        }

        return {createPOfromPR}

    });
