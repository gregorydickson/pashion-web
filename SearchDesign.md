1. Looks are stored as SearchableItems
2. Samples are stored as SearchableItems with a pointer to their Look.
3. The searchable tags are stored in attributes on the Look.
4. Only Looks are searched, not all the samples.
5. When samples are imported, their attributes are added to the attributes of the Look so that searches will find all tags on a Look.
6. Currently, the Edit Item updates the attribute field of a Look, description in the user interface. However, the tags edited on a Sample are not added back to the attributes field on the Look. 