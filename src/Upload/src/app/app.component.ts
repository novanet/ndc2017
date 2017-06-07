import { AuthService } from './auth.service';
import { IUser } from './Models/IUser';
import { RecognizerService } from './recognizer.service';
import { UserService } from './user.service';
import { PhotoService } from './photo.service';
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

    public isSubmitting: boolean;
    public isSubmitted: boolean;
    public fileSelected: boolean;
    public isRunningRecognition: boolean;
    public imageSrc: any;
    public user: IUser;
    public confirmItsMe: boolean;
    public error: boolean;
    public errorMessage: string;
    public authError: boolean;

    public name: string;
    public email: string;
    public company: string;
    public twitterHandle: string;
    public authKey: string;
    public authIsSet: boolean;
    private inputFileElement: HTMLInputElement;
    private file: File;

    private sanitizer: DomSanitizer;
    private recognizerService: RecognizerService;
    private userService: UserService;
    private photoService: PhotoService;
    private authService: AuthService;

    constructor(sanitizer: DomSanitizer, recognizerService: RecognizerService, userService: UserService, photoService: PhotoService, authService: AuthService) {
        this.sanitizer = sanitizer;
        this.recognizerService = recognizerService;
        this.userService = userService;
        this.photoService = photoService;
        this.authService = authService;
    }

    public ngOnInit() {
        this.authIsSet = sessionStorage.getItem('authKey') !== null;
    }

    public storeAuth() {
        this.authService.checkAuth(this.authKey)
            .then((response) => {
                if (response) {
                    sessionStorage.setItem('authKey', this.authKey);
                    this.authError = false;
                    this.authIsSet = true;
                    this.authKey = null;
                }
                else {
                    this.authIsSet = false;
                    this.authError = true;
                }
            });
    }

    public submit = () => {
        this.error = false;
        this.errorMessage = null;
        this.isSubmitting = true;
        this.userService.createUser(this.name, this.email, this.company, this.twitterHandle)
            .then((userId) => {
                this.postImage(userId);
            }, (error) => {
                this.isSubmitting = false;
                this.error = true;
                this.errorMessage = this.getErrorMessage(error);
            });
    }

    private getErrorMessage(error: string) {
        switch (error) {
            case 'NameOrEmailMismatch':
                return 'Incorrect email or name - use the same values as last upload';
            case 'MissingFields':
                return 'Name and Email are mandatory';
            default:
                return 'Something went wrong - please try again';
        }
    }

    public postImage = (userId: number) => {
        this.photoService.publishImage(userId, this.file)
            .then((response) => {
                this.setupSubmitMessage();
            }, (error) => {
                this.isSubmitting = false;
                this.error = true;
                this.errorMessage = this.getErrorMessage(error);
            });
    }


    private setupSubmitMessage() {
        this.isSubmitted = true;
        this.isSubmitting = false;
    }

    public reset() {
        this.isSubmitting = false;
        this.isSubmitted = false;
        this.file = null;
        this.name = null;
        this.email = null;
        this.company = null;
        this.twitterHandle = null;
        this.confirmItsMe = false;
        this.inputFileElement.value = null;
        this.fileSelected = false;
        this.user = null;
        this.imageSrc = null;
        this.error = false;
        this.errorMessage = null;
    }

    public takeAnother() {
        this.isSubmitted = false;
        this.captureImage();
    }

    public captureImage() {
        this.isSubmitted = false;
        this.inputFileElement.value = null;
        this.fileSelected = false;
        this.imageSrc = null;
        this.error = false;
        this.errorMessage = null;
        
        setTimeout(() => {
            this.inputFileElement.click();
        });
    }

    public notMe() {
        this.user.isExisting = false;
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
    }

    private processFileOnServer = (file: File) => {
        this.isRunningRecognition = true;
        this.recognizerService.processFile(file)
            .then((result: IUser) => {
                this.user = result;
                this.imageSrc = this.sanitizer.bypassSecurityTrustStyle(`url(data:image/jpg;base64,${result.base64Image})`);
                this.isRunningRecognition = false;
            }).catch(() => {
                this.isRunningRecognition = false;
            });
    }
}
