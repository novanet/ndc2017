webpackJsonp([1,3],{

/***/ 136:
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid\">\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-2\">\r\n            <img src=\"/Styles/images/novanet-logo.svg\" />\r\n        </div>\r\n        <div class=\"float-right\">\r\n            <div (click)=\"reset()\">\r\n                <span class=\"glyphicon glyphicon-refresh\" aria-hidden=\"true\"></span>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<div *ngIf=\"!authIsSet\">\r\n    <input type=\"password\" [(ngModel)]=\"authKey\" />\r\n    <button type=\"button\" (click)=\"storeAuth()\">Save</button>\r\n </div>\r\n\r\n<div class=\"container-fluid\" *ngIf=\"authIsSet\">\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-8 col-xs-offset-2\">\r\n            <div class=\"row\">\r\n                <div class=\"col-xs-9 col-xs-offset-1 booth\" [class.booth-user-icon]=\"!fileSelected\" [style.background-image]=\"imageSrc\">\r\n                </div>\r\n            </div>\r\n\r\n            <div *ngIf=\"!isSubmitted\" class=\"col-xs-6 col-xs-offset-3\">\r\n                <button type=\"button\" class=\"button\" (click)=\"captureImage()\">Ta bilde</button>\r\n                <input type=\"file\" #inputFile accept=\"image/*\" />\r\n\r\n                <div *ngIf=\"isRunningRecognition\">\r\n                    Processing image..\r\n                </div>\r\n                </div>\r\n            <div *ngIf=\"!isSubmitted\" class=\"col-xs-12\">\r\n\r\n                <div *ngIf=\"fileSelected && !isRunningRecognition && user && user.isExisting && !confirmItsMe\">\r\n                    <h3>Is this you?</h3>\r\n                    <p>Name: {{user.name}}</p>\r\n                    <p>Email: {{user.email}}</p>\r\n                    <button class=\"button half\" (click)=\"itsMe()\">Yes</button>\r\n                    <button class=\"button half\" (click)=\"notMe()\">No</button>\r\n                </div>\r\n\r\n                <div *ngIf=\"fileSelected && !isRunningRecognition && user && user.isExisting && confirmItsMe\" class=\"input-group\">\r\n                    <button type=\"button\" (click)=\"submit()\" class=\"button\" [disabled]=\"!fileSelected || !name || !email\">Submit!</button>\r\n                </div>\r\n\r\n                <div *ngIf=\"fileSelected && !isRunningRecognition && user && !user.isExisting\" class=\"input-group\">\r\n                    <label>Name: <input type=\"text\" [(ngModel)]=\"name\" class=\"form-control\" /></label>\r\n                    <label>Email: <input type=\"email\" [(ngModel)]=\"email\" class=\"form-control\" /></label>\r\n                    <label>Company: <input type=\"text\" [(ngModel)]=\"company\" class=\"form-control\" /></label>\r\n                    <label>Twitter handle: <input type=\"text\" [(ngModel)]=\"twitterHandle\" class=\"form-control\" /></label>\r\n                    <button type=\"button\" *ngIf=\"!isSubmitting\" (click)=\"submit()\" class=\"button\" [disabled]=\"!fileSelected || !name || !email\">Submit!</button>\r\n                    <div class=\"button submit-text\" *ngIf=\"isSubmitting\">Submitting...</div>\r\n                </div>\r\n            </div>\r\n\r\n                \r\n\r\n            <div *ngIf=\"isSubmitted\" class=\"col-xs-12 submit-message\">\r\n                    <h3>Thanks for contributing!</h3>\r\n                    <p><small>Welcome back.</small></p>\r\n            </div>\r\n            <div class=\"col-xs-12 error\" *ngIf=\"error\">\r\n            Oops, something went wrong.\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>"

/***/ }),

/***/ 161:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 162:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(76);


/***/ }),

/***/ 51:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_es6_promise__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_es6_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_es6_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PhotoService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var PhotoService = (function () {
    function PhotoService(http) {
        this.http = http;
    }
    PhotoService.prototype.publishImage = function (userId, file) {
        var headers = new __WEBPACK_IMPORTED_MODULE_0__angular_http__["b" /* Headers */]({ 'Authorization': sessionStorage['authKey'] });
        var options = {
            headers: headers
        };
        var data = new FormData();
        data.append('file', file);
        return this.http.post("/api/photo/" + userId, data, options).toPromise().then(function (response) {
            return __WEBPACK_IMPORTED_MODULE_2_es6_promise__["Promise"].resolve(JSON.parse(response._body));
        }).catch(function (response) {
            return __WEBPACK_IMPORTED_MODULE_2_es6_promise__["Promise"].reject(response._body);
        });
    };
    return PhotoService;
}());
PhotoService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["c" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_http__["c" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_http__["c" /* Http */]) === "function" && _a || Object])
], PhotoService);

var _a;
//# sourceMappingURL=photo.service.js.map

/***/ }),

/***/ 52:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_es6_promise__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_es6_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_es6_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RecognizerService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var RecognizerService = (function () {
    function RecognizerService(http) {
        this.http = http;
    }
    RecognizerService.prototype.processFile = function (file) {
        var form = new FormData();
        form.append('file', file);
        return this.http.post('/api/recognizer/image', form).toPromise().then(function (response) {
            return __WEBPACK_IMPORTED_MODULE_2_es6_promise__["Promise"].resolve(JSON.parse(response._body));
        });
    };
    return RecognizerService;
}());
RecognizerService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["c" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_http__["c" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_http__["c" /* Http */]) === "function" && _a || Object])
], RecognizerService);

var _a;
//# sourceMappingURL=recognizer.service.js.map

/***/ }),

/***/ 53:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_es6_promise__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_es6_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_es6_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var UserService = (function () {
    function UserService(http) {
        this.http = http;
    }
    UserService.prototype.createUser = function (name, email, company, twitterHandle) {
        var headers = new __WEBPACK_IMPORTED_MODULE_0__angular_http__["b" /* Headers */]({ 'Authorization': sessionStorage['authKey'], 'Content-Type': 'application/json' });
        var data = {
            'name': name,
            'email': email,
            'company': company,
            'twitterHandle': twitterHandle
        };
        var options = {
            headers: headers
        };
        return this.http.post('/api/user', data, options).toPromise().then(function (response) {
            return __WEBPACK_IMPORTED_MODULE_2_es6_promise__["Promise"].resolve(JSON.parse(response._body));
        }).catch(function (response) {
            return __WEBPACK_IMPORTED_MODULE_2_es6_promise__["Promise"].reject(response._body);
        });
    };
    return UserService;
}());
UserService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["c" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_http__["c" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_http__["c" /* Http */]) === "function" && _a || Object])
], UserService);

var _a;
//# sourceMappingURL=user.service.js.map

/***/ }),

/***/ 75:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 75;


/***/ }),

/***/ 76:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(83);




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 81:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__recognizer_service__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__user_service__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__photo_service__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser__ = __webpack_require__(17);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AppComponent = (function () {
    function AppComponent(sanitizer, recognizerService, userService, photoService) {
        var _this = this;
        this.submit = function () {
            _this.error = false;
            _this.isSubmitting = true;
            _this.userService.createUser(_this.name, _this.email, _this.company, _this.twitterHandle)
                .then(function (userId) {
                _this.postImage(userId);
            }, function (error) {
                _this.isSubmitting = false;
                _this.error = true;
            });
        };
        this.postImage = function (userId) {
            _this.photoService.publishImage(userId, _this.file)
                .then(function (response) {
                _this.setupSubmitMessage();
            }, function (error) {
                _this.isSubmitting = false;
                _this.error = true;
            });
        };
        this.handleFile = function (ev) {
            if (_this.inputFileElement.files.length === 0)
                return;
            _this.file = _this.inputFileElement.files[0];
            _this.fileSelected = true;
            _this.processFileOnServer(_this.file);
        };
        this.processFileOnServer = function (file) {
            _this.isRunningRecognition = true;
            _this.recognizerService.processFile(file)
                .then(function (result) {
                _this.user = result;
                _this.imageSrc = _this.sanitizer.bypassSecurityTrustStyle("url(data:image/jpg;base64," + result.base64Image + ")");
                _this.isRunningRecognition = false;
            }).catch(function () {
                _this.isRunningRecognition = false;
            });
        };
        this.sanitizer = sanitizer;
        this.recognizerService = recognizerService;
        this.userService = userService;
        this.photoService = photoService;
    }
    Object.defineProperty(AppComponent.prototype, "inputFile", {
        set: function (content) {
            if (content) {
                this.inputFileElement = content.nativeElement;
                this.inputFileElement.addEventListener('change', this.handleFile);
            }
        },
        enumerable: true,
        configurable: true
    });
    AppComponent.prototype.ngOnInit = function () {
        this.authIsSet = sessionStorage.getItem('authKey') !== null;
    };
    AppComponent.prototype.storeAuth = function () {
        sessionStorage.setItem('authKey', this.authKey);
        this.authIsSet = true;
        this.authKey = null;
    };
    AppComponent.prototype.setupSubmitMessage = function () {
        var _this = this;
        this.isSubmitted = true;
        setTimeout(function () {
            _this.reset();
        }, 2000);
    };
    AppComponent.prototype.reset = function () {
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
    };
    AppComponent.prototype.captureImage = function () {
        this.reset();
        this.inputFileElement.click();
    };
    AppComponent.prototype.notMe = function () {
        this.user.isExisting = false;
    };
    AppComponent.prototype.itsMe = function () {
        this.confirmItsMe = true;
    };
    return AppComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__angular_core__["_3" /* ViewChild */])("inputFile"),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], AppComponent.prototype, "inputFile", null);
AppComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__angular_core__["_4" /* Component */])({
        selector: 'app-root',
        template: __webpack_require__(136)
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser__["c" /* DomSanitizer */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser__["c" /* DomSanitizer */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__recognizer_service__["a" /* RecognizerService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__recognizer_service__["a" /* RecognizerService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__user_service__["a" /* UserService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__user_service__["a" /* UserService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_2__photo_service__["a" /* PhotoService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__photo_service__["a" /* PhotoService */]) === "function" && _d || Object])
], AppComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 82:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__recognizer_service__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__user_service__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__photo_service__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_forms__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_http__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__app_component__ = __webpack_require__(81);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__angular_core__["b" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* AppComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_5__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_6__angular_http__["a" /* HttpModule */]
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_0__recognizer_service__["a" /* RecognizerService */],
            __WEBPACK_IMPORTED_MODULE_1__user_service__["a" /* UserService */],
            __WEBPACK_IMPORTED_MODULE_2__photo_service__["a" /* PhotoService */]
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 83:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ })

},[162]);
//# sourceMappingURL=main.bundle.js.map