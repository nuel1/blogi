import {
  Directive,
  HostBinding,
  HostListener,
  EventEmitter,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appDragDropFileUpload]',
})
export class DragDropFileUploadDirective {
  @HostBinding('class.file-over') fileover = false;
  @Output() onFileDropped: EventEmitter<File> = new EventEmitter();
  constructor() {}

  @HostListener('dragover', ['$event']) onDragOver(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.fileover = true;
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.fileover = false;
  }

  @HostListener('drop', ['$event']) onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.fileover = false;

    //

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit(files.item(0));
    }
  }
}
