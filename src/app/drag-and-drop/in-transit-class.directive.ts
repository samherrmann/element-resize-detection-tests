import { Directive, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { DraggableService } from './draggable/draggable.service';
import { Subscription } from 'rxjs/Subscription';

@Directive({
  selector: '[dndInTransitClass]'
})
export class InTransitClassDirective implements OnInit, OnDestroy {

  @HostBinding('class.draggable-in-transit')
  isInTransit = false;

  private sub: Subscription;

  constructor(private draggableService: DraggableService) { }

  ngOnInit() {
    this.sub = this.draggableService.inTransit.subscribe(value => this.isInTransit = value);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
