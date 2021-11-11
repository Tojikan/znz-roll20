import { deleteItem } from './deleteItem';
import { equip } from './equip';
import { limit } from'./limitinventory';
import { rollOptions } from './rolloptions';

equip().init();
limit();
rollOptions();
deleteItem();