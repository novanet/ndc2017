import { IContestantData } from './Models/IContestantData';
import { RecognizerService } from './recognizer.service';
import { UserService } from './user.service';
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
  @ViewChild("canvasEl") public set canvasEl(content: any) {
    if (content) {
      this.canvasElement = content.nativeElement;
    }
  }

  public isSubmitted: boolean;
  public fileSelected: boolean;
  public isRunningRecognition: boolean;
  public imageSrc: any;
  public contestantData: IContestantData;
  public confirmItsMe: boolean;

  public name: string;
  public email: string;
  public company: string;
  public twitterHandle: string;

  private inputFileElement: HTMLInputElement;
  private canvasElement: HTMLCanvasElement;
  private file: File;

  private sanitizer: DomSanitizer;
  private recognizerService: RecognizerService;
  private userService: UserService;

  constructor(sanitizer: DomSanitizer, recognizerService: RecognizerService, userService: UserService) {
    this.sanitizer = sanitizer;
    this.recognizerService = recognizerService;
    this.userService = userService;
  }

  public submit() {
    //Submit to api - this.file or this.getImageFromCanvas() (base64 string)
    //then
      this.userService.createUser(this.name, this.email, this.company, this.twitterHandle)
          .then((response) => {
              debugger;
              console.log('create user', response);
          }, (error) => {
              debugger;
              console.log('createuser failed', error);
          });
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
    this.confirmItsMe = false;
    this.inputFileElement.value = null;
    this.fileSelected = false;
    this.contestantData = null;
    this.imageSrc = null;

    let ctx = this.canvasElement.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  }

  public captureImage() {
      this.reset();
    this.inputFileElement.click();
  }

  public notMe() {
      this.contestantData.isExisting = false;
  }

  public itsMe() {
      this.confirmItsMe = true;
  }

  private handleFile = (ev: Event) => {
    if (this.inputFileElement.files.length === 0)
      return;

    this.file = this.inputFileElement.files[0];
    this.fileSelected = true;
      this.processFileOnServer(this.file)
    // this.processFileOnServer(this.file);

    //var reader = new FileReader();

    //reader.onload = this.processFile;
    //reader.readAsDataURL(this.file);
  }

  private processFileOnServer = (file: File) => {
    this.isRunningRecognition = true;
    this.recognizerService.processFile(file)
      .then((result: IContestantData) => {
          this.contestantData = result;
          this.imageSrc = this.sanitizer.bypassSecurityTrustStyle(`url(data:image/jpg;base64,${result.base64Image})`);
        this.isRunningRecognition = false;
      }).catch(() => {
        this.isRunningRecognition = false;
      });
  }

  private processFile = (ev: any) => {
    let img = new Image();

    img.onload = () => {
      let rotate = img.width > img.height;

      let height = rotate ? img.width : img.height;
      let width = rotate ? img.height : img.width;

      let cv = this.canvasElement;
      cv.height = height;
      cv.width = width;

      let ctx = cv.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
      ctx.beginPath();
      ctx.translate(img.height / 2, img.width / 2);

      if (rotate)
        ctx.rotate(Math.PI / 2);

      if (rotate)
        ctx.drawImage(img, -(img.width / 2), -(img.height / 2));
      else
        ctx.drawImage(img, -(img.height / 2), -(img.width / 2));

      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    img.src = ev.target.result;

    //this.processFileOnServer();
  }

  private getImageFromCanvas() {
    return this.canvasElement.toDataURL('image/jpg');
  }
}
