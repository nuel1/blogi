import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Blog } from '../../../model/blog';
import { DomSanitizer } from '@angular/platform-browser';
import * as pdfjs from 'pdfjs-dist';
(pdfjs as any).GlobalWorkerOptions.workerSrc =
  './assets/pdfjs-dist/pdf.worker.min.js';

@Component({
  selector: 'blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.scss'],
})
export class BlogFormComponent implements OnInit, OnChanges {
  formBuilder = inject(FormBuilder);
  domSanitizer = inject(DomSanitizer);

  @Input() uploadedImageURL = '';
  @Input() loading = false;
  @Input() blog: Blog | undefined;
  @Input() btnText: 'create blog' | 'edit blog' = 'create blog';
  @Output() onUploadFile: EventEmitter<File> = new EventEmitter();
  @Output() onRemoveCover: EventEmitter<string> = new EventEmitter();
  @Output() onSubmit: EventEmitter<Blog> = new EventEmitter();

  form = this.formBuilder.group({
    cover: ['', Validators.required],
    title: ['', Validators.required],
    author: ['', Validators.required],
    content: ['', Validators.required],
  });

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '200px',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    defaultParagraphSeparator: 'p',
    defaultFontName: '',
    defaultFontSize: '',
    customClasses: [],
    uploadUrl: 'v1/image',
    // upload: (file: File) => {
    //   return
    // },
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['subscript', 'superscript', 'fontName', 'heading'],
      [
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'toggleEditorMode',
        'customClasses',
      ],
    ],
  };

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['uploadedImageURL']) {
      const url = changes['uploadedImageURL'].currentValue;
      this.form.controls.cover.setValue(url);
    }

    if (changes['blog'] && changes['blog'].currentValue) {
      this.autoFillForm(changes['blog'].currentValue);
      this.uploadedImageURL = this.form.controls.cover.value as string;
    }
  }

  autoFillForm(data: Blog) {
    this.form.setValue({
      cover: data.cover,
      title: data.title,
      author: data.author,
      content: data.content,
    });
  }

  getImageFile(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.item(0) as File;
    this.onUploadFile.emit(file);
  }

  openSystemFileUploader(type: 'image' | 'document') {
    if (type === 'image') document.getElementById('input-img-file')?.click();
    else document.getElementById('input-doc-file')?.click();
  }

  submit() {
    this.onSubmit.emit(this.form.value as Blog);
  }

  getDocumentOnDrop(doc: File) {
    const type = doc.type as '.pdf' | '.txt' | 'csv' | 'docx' | 'xml';
    switch (type) {
      case '.pdf':
        this.parsePDF(doc);
    }
  }

  getDocumentOnSelect(e: any) {
    const fileList: FileList = e.target.files;
    const doc = fileList.item(0) as File;
    this.readAsTxt(doc);
    const extension = doc.type as 'application/pdf' | 'text/plain';
    switch (extension) {
      case 'application/pdf':
        this.parsePDF(doc);
        break;
      case 'text/plain':
        this.readAsTxt(doc);
    }
  }

  readAsTxt(doc: File) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const fileContent = fileReader.result as string;
      this.form.controls.content.setValue(fileContent);
    };

    fileReader.readAsText(doc);
  }

  parsePDF(file: File) {
    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      const arrayBuffer = fileReader.result as ArrayBuffer;
      const pdfData = new Uint8Array(arrayBuffer);

      const pdfDocument = await pdfjs.getDocument({ data: pdfData }).promise;
      const numPages = pdfDocument.numPages;
      let pageText = '';
      for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
        const pdfPage = await pdfDocument.getPage(pageNumber);
        const textContent = await pdfPage.getTextContent();

        pageText += textContent.items.map((item: any) => item.str).join(' ');
      }
      this.form.controls.content.setValue(pageText);
    };

    fileReader.readAsArrayBuffer(file);
  }
}
