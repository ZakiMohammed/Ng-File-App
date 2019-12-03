import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { retry, retryWhen, delay, scan, subscribeOn } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

declare var window: any;

@Component({
  selector: 'app-upload-verge',
  templateUrl: './upload-verge.component.html',
  styleUrls: ['./upload-verge.component.css']
})
export class UploadVergeComponent implements OnInit {

  fileCards: FileCard[] = [];
  url: string = 'https://localhost:44365/api/file/';
  defaultImageUrl: string = './assets/imgs/default.png';
  retryCount: number = 1;
  message: string = 'Loading please wait...';
  progress: number = 0;

  subGetFile$: Subscription;

  constructor(
    private httpClient: HttpClient
  ) { }


  ngOnInit() {
    this.subGetFile$ = this.httpClient.get(this.url + 'GetFile')
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
              loading: false,
              name: file.name
            });
          });
        }
      });
  }

  onFileSelect($event: any) {

    for (const key in $event.target.files) {
      const file = $event.target.files[key];
      if (typeof (file) === 'object') {

        const formData = new FormData();
        formData.append('Upload', file);

        this.fileCards.push({
          loading: true,
          retry: false,
          link: this.defaultImageUrl,
          name: file.name,
          file: formData
        });
      }
    }

    this.fileCards.forEach((fileCard, index) => {
      if (fileCard.link === this.defaultImageUrl) {
        this.postFile(index, fileCard);
      }

      // setTimeout(() => {
      //   this.fileCards[index].loading = false;
      //   this.fileCards[index].link = 'xyz';
      // }, Math.round(Math.random() * 3000));
    });

  }

  onDeleteClick($event: any, index: number) {
    this.fileCards[index].loading = true;
    this.httpClient.delete(this.url + 'DeleteFile?fileName=' + this.fileCards[index].name).subscribe((response: any) => {
      if (response.status) {
        this.fileCards.splice(index, 1);
      }
    });

    // setTimeout(() => {
    //   this.fileCards.splice(index, 1);
    // }, Math.round(Math.random() * 3000));
  }

  onDownloadClick($event: any, index: number) {
    let fileCard = this.fileCards[index];
    this.forceDownload(fileCard.link, fileCard.name);
  }

  onRetryClick($event: any, index: number) {

    this.fileCards[index].loading = true;
    this.fileCards[index].retry = false;

    this.postFile(index);
  }

  onCancelSubscription($event: any) {
    this.message = 'Request is cancelled';
    this.subGetFile$.unsubscribe();
    console.log(this.subGetFile$);

  }

  postFile(index: number, fileCard: FileCard = null) {

    if (!fileCard) {
      fileCard = Object.assign(this.fileCards[index]);
    }

    this.httpClient.post(this.url + 'UploadFile', fileCard.file, {
      reportProgress: true,
      observe: 'events'
    }).subscribe((event: HttpEvent<any>) => {

      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          this.progress = Math.round(event.loaded / event.total * 100);
          console.log(`Uploaded! ${this.progress}%`);
          break;
        case HttpEventType.Response:
          console.log('User successfully created!', event.body);

          let response = event.body;

          if (response.status) {
            this.fileCards[index].loading = false;
            this.fileCards[index].retry = false;
            this.fileCards[index].link = response.url;
          } else {
            this.fileCards[index].loading = false;
            this.fileCards[index].retry = true;
          }

          setTimeout(() => {
            this.progress = 0;
          }, 1500);
      }

    });
  }

  forceDownload(url: string, fileName: string) {
    this.httpClient.get(this.url + 'GetPhysicalFile?fileName=' + fileName, { responseType: "blob" }).subscribe(response => {
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

}

class FileCard {
  retry: boolean;
  loading: boolean;
  link: string;
  name: string;
  file: any;
}