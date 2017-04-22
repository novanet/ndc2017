import { FileService } from './file.service';
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
  @ViewChild("canvasEl") public canvasEl: any;
  public imageSrc: SafeUrl;
  public isSubmitted: boolean;
  public fileSelected: boolean;

  public name: string;
  public email: string;
  private inputFileElement: HTMLInputElement;
  private file: File;

  private sanitizer: DomSanitizer;
  private fileService: FileService;

  constructor(sanitizer: DomSanitizer, fileService: FileService) {
    this.sanitizer = sanitizer;
    this.fileService = fileService;
  }

  public submit() {
    //Submit to api
    //then

    this.setupSubmitMessage();
  }

  private setupSubmitMessage() {
    this.isSubmitted = true;

    setTimeout(() => {
      this.reset();
    }, 2000);
  }

  public reset() {
    this.isSubmitted = false;
    this.file = null;
    this.name = null;
    this.email = null;
    this.inputFileElement.value = null;
    this.imageSrc = null;
    this.fileSelected = false;
  }

  public captureImage() {
    this.inputFileElement.click();
  }

  private handleFile = (ev: Event) => {
    if (this.inputFileElement.files.length === 0)
      return;

    this.file = this.inputFileElement.files[0];
    this.fileSelected = true;
    this.processFile();

    

    var reader = new FileReader();
    
    reader.onload = this.onLoadFile;
    reader.readAsDataURL(this.file);


  }

  private onLoadFile(ev: any){
    console.log(ev);
  }

  private processFile = () => {
    this.fileService.processFile(this.file)
      .then((result: any) => {
        console.log('file upload response', result);
        this.imageSrc = this.sanitizer.bypassSecurityTrustStyle(`url('data:image/png;base64, ${result.image}')`);

        var img = document.createElement("img");
        img.src = `data:image/jpg;base64, ${result.image}`;
        let cv = this.canvasEl.nativeElement;
        cv.height = img.height;
        cv.width = img.width;
        let cx = cv.getContext('2d');
        //cv.setTransform(1, 0, 0, 1, img.width / 2, img.height / 2);
        cx.translate(img.width / 2, img.height / 2);
        cx.rotate(Math.PI / 2);
        cx.drawImage(img, -(img.width / 2), -(img.height / 2));
        cx.save();

      }).catch((error) => {
        console.log('file processing failed', error);
      });
  }

  // private onLoadFile = (ev: any) => {
  //   this.imageSrc = this.sanitizer.bypassSecurityTrustStyle(`url(${ev.target.result})`);
  // };
}
