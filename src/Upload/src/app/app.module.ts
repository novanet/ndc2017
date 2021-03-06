import { AuthService } from './auth.service';
import { RecognizerService } from './recognizer.service';
import { UserService } from './user.service';
import { PhotoService } from './photo.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    RecognizerService,
    UserService,
    PhotoService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
