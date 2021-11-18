import { deleteItem } from './deleteItem';
import { equip } from './equip';
import { limit } from'./limitinventory';
import { preventNegative } from './preventNegative';
import { rollwidget } from './rollwidget-commands';
import { rollOptions } from './rolloptions';

equip().init();
limit();
// rollOptions();
deleteItem();
preventNegative();
rollwidget();