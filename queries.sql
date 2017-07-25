
/*
 * Example: Delete a brand's Sample Requests
*/
select id from sample_request where brand_id = '68';
delete from booking_status where sample_request_id IN(532) , (533) , (604) , (605) , (617) , (618);
delete from searchable_item_sample_requests where sample_request_id IN(532) , (533) , (604) , (605) , (617) , (618);
update sample_request set shipping_out_id = null where id IN(532) , (533) , (604) , (605) , (617) , (618);
update sample_request set shipping_return_id = null where id IN(532) , (533) , (604) , (605) , (617) , (618);
delete from shipping_event where sample_request_id IN(532) , (533) , (604) , (605) , (617) , (618);
delete from sample_request where id IN(532) , (533) , (604) , (605) , (617) , (618);


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


INSERT INTO color (name) VALUES ('baby blue') , ('blue light') , ('beige') , ('bicolour') , ('black') , ('bleu') , ('blue') , ('bordeaux'),
                    ('bright') , ('bronze') , ('brown') , ('brown light') , ('burgundy') , ('camel') , ('cobalt') , ('cognac') , ('colorful'),
                    ('coral') , ('cream') , ('duotone') , ('fuschia') , ('glitter') , ('gold') , ('gray') , ('green') , ('grey') , ('ivory') , ('jaune'),
                    ('khaki') , ('lavendar') , ('lilac') , ('lime') , ('metallic') , ('monochrome'),
                    ('multicolour') , ('mustard') , ('navy blue') , ('noir') , ('nude') , ('orange') , ('pastel') , ('pearl'),
                    ('pink') , ('powder') , ('purple') , ('red') , ('rust') , ('salmon') , ('shine') , ('silver') , ('transparent'),
                    ('turquoise') , ('white') , ('yellow');
/*
	sample types
*/
INSERT INTO sample_type (name) VALUES ('bag') , ('babouches') , ('bandana') , ('beads') , ('belt') , ('bermuda') , ('bikini') , ('blazer') , ('blouse') , ('bodice') , ('boots') , ('boyfriend jeans') , ('bomber jacket') , ('boots') , ('bra') , ('bracelet') , (
                    'braces') , ('bustier') , ('button') , ('cap') , ('cape') , ('cardigan') , ('claudine') , ( 'clutch bag') , ('coat') , ('cocktail dress') , ('collar') , ('corsage') , ('corset') , (
                    'costume') , ('crocs') , ('crop top') , ('culotte') , ('dress') , ('dress on pants') , ('diamond') , ('dressing gown') , ('dungarees') , ('earring') , ('fan') , (
                    'feather') , ('flared jeans') , (
                    'gilet') , ('glasses') , ('glove') , ('gown') , ('handbag') , ('handkerchief') , ('hat') , ('headband') , ('heels') , ('hoodie') , ('jacket') , ('jeans') , ('jeggings') , ('jogging') , ('jumper') , (
                    'jumpsuit') , ('jupe') , ('kerchief') , ('kilt') , ('kimono') , ('knots') , ('laysuit') , ('legging') , ('lingerie') , ('loafers') , ('mao collar') , ('mariniere') , ('necklace') , ('necktie') , (
                    'nightgown') , ('nightwear') , ('overalls') , ('oxford') , ('pajama') , ('panties') , ('pants') , ('parka') , (
                    'pantyhose') , ('patch') , ('patchwork') , ('pencil skirt') , ('pearl') , ('perfecto') , ('peter pan collar') , ('platform boots') , ('playsuit') , ('pocket') , ('polo') , (
                    'pompom') , ('poncho') , ('puffer') , ('pullover') , ('pyjama') , ('raincoat') , ('reefer') , ('ribbon') , ('ring') , ('satchel') , ('sandal') , ('scarf') , ('shawl') , ('shoes') , ('shirt') , (
                    'shirt dress') , ('shorts') , ('skirt') , ('skirt dress') , ('sleeve') , ('sleeveless') , (
                    'slip') , ('slipper') , ('slip dress') , ('smoking') , ('socks') , ('stilletos') , ('suit') , ('sunglasses') , ('sweater') , ('sweatpants') , (
                    'sweatshirt') , ('swimsuit') , ('tank top') , ('teeshirt') , ('tennis') , ('tie') , ('tights') , ('top') , ('trainers') , ('trench') , ('trenchcoat') , ('trousers') , ('tunic') , (
                    'turtleneck') , ('tuxedo') , ('underwear') , ('veil') , ('vest') , ('waistcoat') , ('watch') , ('zip');