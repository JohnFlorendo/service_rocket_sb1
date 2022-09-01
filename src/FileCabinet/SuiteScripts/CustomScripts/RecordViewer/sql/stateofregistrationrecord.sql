SELECT CUSTOMRECORD_SR_STATE_REGISTRATION.name as ID
	,CUSTOMRECORD_SR_STATE_REGISTRATION.altname as NAME
	,CUSTOMRECORD_SR_STATE_REGISTRATION.custrecord_sr_statereg_subsidiary as SUBSIDIARY
	,CUSTOMRECORD_SR_STATE_REGISTRATION.custrecord238 as DESCRIPTION
	,CUSTOMRECORD_SR_STATE_REGISTRATION.custrecord239 as STATE
	,CUSTOMRECORD_SR_STATE_REGISTRATION.custrecord_sr_registration_number as REGISTRATION_NO
	,CUSTOMRECORD_SR_STATE_REGISTRATION.custrecord_sr_registration_date as REGISTRATION_DATE
FROM CUSTOMRECORD_SR_STATE_REGISTRATION
WHERE CUSTOMRECORD_SR_STATE_REGISTRATION.id = ?