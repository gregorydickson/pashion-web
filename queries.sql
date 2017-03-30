/*
 * Delete all Sample Requests
*/
delete from booking_status;
delete from searchable_item_sample_requests;
update sample_request set shipping_out_id = null;
update sample_request set shipping_return_id = null;
delete from shipping_event;
delete from sample_request;