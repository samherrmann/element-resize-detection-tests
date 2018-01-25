import { Component, OnInit, HostListener, ViewContainerRef, ViewChild, ComponentFactoryResolver,
  ComponentFactory, HostBinding, ElementRef } from '@angular/core';
import { DraggableComponent } from '../draggable/draggable.component';
import { DroppableService } from './droppable.service';
import { DraggableFactoryService } from '../draggable/draggable-factory.service';
import { DragAndDropService } from '../drag-and-drop.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-droppable',
  templateUrl: './droppable.component.html',
  styleUrls: ['./droppable.component.scss'],
  providers: [
    DroppableService
  ]
})
export class DroppableComponent implements OnInit {

  @ViewChild('vc', { read: ViewContainerRef })
  viewContainerRef: ViewContainerRef;

  @HostBinding('class.droptarget')
  isDropTarget = false;

  private subscriptions: Subscription[] = [];

  constructor(public elementRef: ElementRef,
    private droppableService: DroppableService,
    private draggableFactoryService: DraggableFactoryService,
    private dragAndDropService: DragAndDropService) { }

  ngOnInit() {
    this.droppableService.register(this);
  }

  addDraggable(): void {
    this.draggableFactoryService.addDraggable(this);
  }

  ngOnDestory() {

  }
}
