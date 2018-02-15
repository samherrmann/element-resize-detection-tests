import { DraggableComponent } from '../draggable/draggable.component';
import { DroppableComponent } from '../droppable/droppable.component';

export class RelocationEvent {
  constructor(
    public pointerEvent: PointerEvent,
    public draggable: DraggableComponent,
    public droppable: DroppableComponent,
    public index: number
  ) { }
}
