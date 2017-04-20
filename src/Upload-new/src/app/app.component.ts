import { SafeUrl } from '@angular/platform-browser/public_api';
import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  @ViewChild("inputFile") public set inputFile(content: any) {
    if (content) {
      this.inputFileElement = content.nativeElement;
      this.inputFileElement.addEventListener('change', this.handleFile);
    }
  }

  public imageSrc: SafeUrl;
  public isSubmitted: boolean;
  public fileSelected: boolean;

  public name: string;
  public email: string;
  private inputFileElement: HTMLInputElement;
  private file: File;

  private sanitizer: DomSanitizer;

  constructor(sanitizer: DomSanitizer) {
    this.sanitizer = sanitizer;
  }

  public submit() {
  //Submit to api
  //then
    this.setupSubmitMessage();
    this.reset();
  }

  private setupSubmitMessage() {
    this.isSubmitted = true;

    setTimeout(() => {
      this.isSubmitted = false;
    }, 2000);
  }

  public reset() {
    this.file = null;
    this.name = null;
    this.email = null;
    this.inputFileElement.value = null;
    this.imageSrc = null;
    this.fileSelected = false;
  }

  private handleFile = (ev: Event) => {
    if (this.inputFileElement.files.length === 0)
      return;

    this.file = this.inputFileElement.files[0];
    this.fileSelected = true;

    var reader = new FileReader();
    reader.onload = this.onLoadFile;
    reader.readAsDataURL(this.file);
  }

  private onLoadFile = (ev: any) => {
    this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(ev.target.result);
  };
}
