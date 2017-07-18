
/*
 * Example: Delete a brand's Sample Requests
*/
select id from sample_request where brand_id = '68';
delete from booking_status where sample_request_id IN(532,533,604,605,617,618);
delete from searchable_item_sample_requests where sample_request_id IN(532,533,604,605,617,618);
update sample_request set shipping_out_id = null where id IN(532,533,604,605,617,618);
update sample_request set shipping_return_id = null where id IN(532,533,604,605,617,618);
delete from shipping_event where sample_request_id IN(532,533,604,605,617,618);
delete from sample_request where id IN(532,533,604,605,617,618);


/*
 * Delete all Sample Requests
*/
delete from booking_status;
delete from searchable_item_sample_requests;
update sample_request set shipping_out_id = null;
update sample_request set shipping_return_id = null;
delete from shipping_event;
delete from sample_request;


/*
	Find all samples for a brand and collection creatd after a certain date
*/
select * from searchable_item where brand_id = '45' and type_id = '2' 
and brand_collection_id = '168' and date_created > '2017-04-03 17:33:50';

ALTER TABLE user AUTO_INCREMENT = 60;