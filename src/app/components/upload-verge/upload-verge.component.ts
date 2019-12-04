import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { retry, retryWhen, delay, scan, subscribeOn } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { FileCard } from 'src/app/models/file-card';
import { FileService } from 'src/app/services/file.service';
import { environment } from 'src/environments/environment';

declare var window: any;
declare var $: any;

@Component({
  selector: 'app-upload-verge',
  templateUrl: './upload-verge.component.html',
  styleUrls: ['./upload-verge.component.css']
})
export class UploadVergeComponent implements OnInit {

  //#region declarations
  fileCards: FileCard[] = [];

  defaultImageUrl: string = environment.imageUrl + 'default.png';  
  message: string = 'Loading please wait...';

  currentIndex: number = -1;
  retryCount: number = 1;

  subGetFile$: Subscription;
  //#endregion

  //#region ctor
  constructor(private fileService: FileService) { }
  //#endregion

  //#region life cycle
  ngOnInit() {
    this.subGetFile$ = this.fileService.getAll()
      .pipe(
        // retry(3)
        retryWhen((err) => {
          return err.pipe(
            scan((retyrCount, val) => {
              this.retryCount += 1;
              if (this.retryCount < 6) {
                this.message = 'Retrying attempt number ' + this.retryCount;
                return this.retryCount;
              } else {
                this.message = 'Error occured, please retry after some time'
                throw (err);
              }
            }),
            delay(1000)
          )
        })
      )
      .subscribe((response: any) => {
        if (response.status) {
          response.files.forEach(file => {
            this.fileCards.push({
              file: null,
              link: file.url,
              retry: false,
              loading: false,
              cancel: false,
              progress: 0,
              name: file.name,
              subscription$: null
            });
          });
        }
      });
  }
  //#endregion

  //#region event
  onFileSelect($event: any) {

    for (const key in $event.target.files) {
      const file = $event.target.files[key];
      if (typeof (file) === 'object') {

        const formData = new FormData();
        formData.append('Upload', file);

        this.fileCards.push({
          loading: true,
          cancel: true,
          retry: false,
          progress: 0,
          link: this.defaultImageUrl,
          name: file.name,
          file: formData,
          subscription$: null
        });
      }
    }

    this.fileCards.forEach((fileCard, index) => {
      if (fileCard.link === this.defaultImageUrl) {
        this.postFile(fileCard);
      }

      // setTimeout(() => {
      //   this.fileCards[index].loading = false;
      //   this.fileCards[index].link = 'xyz';
      // }, Math.round(Math.random() * 3000));
    });

  }

  onDeleteClick($event: any, index: number) {
    this.currentIndex = index;

    setTimeout(() => {
      $('#mdlDelete').modal('show');
    });
  }

  onDeleteAll($event: any) {
    setTimeout(() => {
      $('#mdlDeleteAll').modal('show');
    });
  }

  onDownloadClick($event: any, index: number) {
    let fileCard = this.fileCards[index];
    this.forceDownload(fileCard.link, fileCard.name);
  }

  onDownloadAll($event: any) {
    this.fileCards.forEach((fileCard, index) => {
      if (fileCard.link !== this.defaultImageUrl) {
        this.forceDownload(fileCard.link, fileCard.name);
      }
    });
  }

  onRetryClick($event: any, fileCard: FileCard) {

    let index = this.fileCards.findIndex(i => i.name === fileCard.name);

    this.fileCards[index].loading = true;
    this.fileCards[index].retry = false;
    this.fileCards[index].cancel = true;

    this.postFile(fileCard);
  }

  onCancelClick($event: any, index: number) {
    this.fileCards[index].subscription$.unsubscribe();
    this.fileCards[index].subscription$ = null;

    this.fileCards.splice(index, 1);
    
  }

  onCancelSubscription($event: any) {
    this.message = 'Request is cancelled';
    this.subGetFile$.unsubscribe();
    console.log(this.subGetFile$);

  }

  onModalDeleteClick($event: any) {
    this.fileCards[this.currentIndex].loading = true;
    this.fileService.delete(this.fileCards[this.currentIndex].name).subscribe((response: any) => {
      if (response.status) {
        this.fileCards.splice(this.currentIndex, 1);
        this.currentIndex = -1;
        $('#mdlDelete').modal('hide');
      } else {
        console.log(response.status);
      }
    });

    // setTimeout(() => {
    //   this.fileCards.splice(index, 1);
    // }, Math.round(Math.random() * 3000));
  }

  onModalDeleteAllClick($event: any) {

    $('#mdlDeleteAll').modal('hide');

    this.fileService.deleteAll().subscribe((response: any) => {
      if (response.status) {
        this.fileCards = [];        
      } else {
        console.log(response.status);
      }
    });
  }
  //#endregion

  //#region methods
  postFile(fileCard: FileCard) {

    let index = this.fileCards.findIndex(i => i.name === fileCard.name);

    this.fileCards[index].subscription$ = this.fileService.upload(fileCard.file).subscribe((event: HttpEvent<any>) => {

      switch (event.type) {
        case HttpEventType.Sent:
          // console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          // console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          if (this.fileCards[index]) {
            this.fileCards[index].progress = Math.round(event.loaded / event.total * 100);
          }
          // console.log(`Uploaded! ${this.fileCards[index].progress}%`);
          break;
        case HttpEventType.Response:
          // console.log('User successfully created!', event.body);

          index = this.fileCards.findIndex(i => i.name === fileCard.name);

          let response = event.body;

          if (this.fileCards[index]) {
            if (response.status) {
              this.fileCards[index].loading = false;
              this.fileCards[index].retry = false;
              this.fileCards[index].cancel = false;
              this.fileCards[index].link = response.url;
            } else {
              this.fileCards[index].loading = false;
              this.fileCards[index].cancel = false;
              this.fileCards[index].retry = true;
            }
  
            this.fileCards[index].progress = 0; 
          }
      }

    });
  }

  forceDownload(url: string, fileName: string) {
    this.fileService.getPhysicalFile(fileName).subscribe(response => {
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(response);
      var tag = document.createElement('a');
      tag.href = imageUrl;
      tag.download = fileName;
      document.body.appendChild(tag);
      tag.click();
      document.body.removeChild(tag);
    });

    // var xhr = new XMLHttpRequest();
    // xhr.open("GET", 'https://localhost:44365/api/file/GetPhysicalFile?fileName=' + fileName, true);
    // xhr.responseType = "blob";
    // xhr.onload = function(){
    //     var urlCreator = window.URL || window.webkitURL;
    //     var imageUrl = urlCreator.createObjectURL(this.response);
    //     var tag = document.createElement('a');
    //     tag.href = imageUrl;
    //     tag.download = fileName;
    //     document.body.appendChild(tag);
    //     tag.click();
    //     document.body.removeChild(tag);
    // }
    // xhr.send();
  }

  isImage(link: string) {
    let extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.dib', '.jfif', '.tif', '.tiff'];
    let found = extensions.find(i => link.includes(i));
    return !!found;
  }
  //#endregion

}