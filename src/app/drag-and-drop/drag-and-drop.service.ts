import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { DragEvent, DragOverEvent, DragEnterEvent, DragLeaveEvent, RemoveEvent, InsertEvent } from './drag-event';
import { DraggableComponent } from './draggable/draggable.component';
import { filter, flatMap, takeUntil, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Observable } from 'rxjs/Observable';
import { DropZoneComponent } from './drop-zone/drop-zone.component';
import { DroppableComponent } from './droppable/droppable.component';
import { Registry } from './registry';

/**
 * This service provides access to the different drag events.
 * Through this service, you can both observe these events and
 * emit them.
 *
 * see: {@link DragEventType}
 */
@Injectable()
export class DragAndDropService {

  /**
   * Registered droppables.
   */
  readonly droppables = new Registry<DroppableComponent>();

  /**
   * Registered draggables.
   */
  readonly draggables = new Registry<DraggableComponent>();

  private readonly _inTransit = new BehaviorSubject<DraggableComponent>(null);

  /**
   * Observable that emits the {@link DraggableComponent} that is being dragged.
   * `null` is emitted when no draggable is being dragged.
   */
  readonly inTransit = this._inTransit.asObservable();

  /**
   * Observable that emits `true` when a draggable is being dragged.
   * Emits `false` otherwise.
   */
  readonly active = this.inTransit.pipe(
    map(e => e !== null)
  );

  private readonly _dragStart = new Subject<DragEvent>();
  readonly dragStart = this._dragStart.asObservable();

  private readonly _drag = new Subject<DragEvent>();
  readonly drag = this._drag.asObservable();

  private readonly _dragEnter = new Subject<DragEnterEvent>();
  readonly dragEnter = this._dragEnter.asObservable();

  private readonly _dragOver = new Subject<DragOverEvent>();
  readonly dragOver = this._dragOver.asObservable();

  private readonly _dragLeave = new Subject<DragLeaveEvent>();
  readonly dragLeave = this._dragLeave.asObservable();

  private readonly _dragEnd = new Subject<DragEvent>();
  readonly dragEnd = this._dragEnd.asObservable();

  private readonly _remove = new Subject<RemoveEvent>();
  readonly remove = this._remove.asObservable();

  private readonly _insert = new Subject<InsertEvent>();
  readonly insert = this._insert.asObservable();

  constructor() { }

  emitDragStart(e: PointerEvent, draggable: DraggableComponent): void {
    this._inTransit.next(draggable);
    this._dragStart.next(new DragEvent('dragstart', e, draggable));
  }

  emitDragEnd(e: PointerEvent): void {
    this._dragEnd.next(new DragEvent('dragend', e, this._inTransit.getValue()));
    this._inTransit.next(null);
  }

  emitDrag(e: PointerEvent): void {
    this._drag.next(new DragEvent('drag', e, this._inTransit.getValue()));
  }

  emitDragOver(e: PointerEvent, dropZone: DropZoneComponent): void {
    this._dragOver.next(new DragOverEvent('dragover', e, this._inTransit.getValue(), dropZone));
  }

  emitDragEnter(e: PointerEvent, dropZone: DropZoneComponent): void {
    this._dragEnter.next(new DragEnterEvent('dragenter', e, this._inTransit.getValue(), dropZone));
  }

  emitDragLeave(e: PointerEvent, dropZone: DropZoneComponent): void {
    this._dragLeave.next(new DragLeaveEvent('dragleave', e, this._inTransit.getValue(), dropZone));
  }

  emitRemove(draggable: DraggableComponent): void {
    this._remove.next(new RemoveEvent('remove', draggable));
  }

  emitInsert(draggable: DraggableComponent): void {
    this._insert.next(new InsertEvent('insert', draggable));
  }

  /**
   * Attaches an event listener to a HTML element when the drag is active and
   * removes the event listener when the drag is inactive.
   * @param el The element on which to attach an event listener.
   * @param eventName The name of the event to listen to.
   */
  listenWhenActive<T>(el: EventTarget, eventName: string): Observable<T> {
    return this.active.pipe(
      filter(e => e === true),
      flatMap(() => {
        return fromEvent<T>(el, eventName).pipe(
          takeUntil(this.active.pipe(filter(e => e === false)))
        );
      })
    );
  }
}
