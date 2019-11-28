import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload-verge',
  templateUrl: './upload-verge.component.html',
  styleUrls: ['./upload-verge.component.css']
})
export class UploadVergeComponent implements OnInit {

  fileCards: FileCard[] = [];
  url: string = 'https://localhost:44365/api/file/';

  constructor(
    private httpClient: HttpClient
  ) { }


  ngOnInit() {
    this.httpClient.get(this.url + 'GetFile').subscribe(response => {
      
    });
  }

  onFileSelect($event: any) {

    for (const key in $event.target.files) {
      const file = $event.target.files[key];
      if (typeof (file) === 'object') {
        this.fileCards.push({
          loading: true,
          link: '',
          name: file.name,
          file: file
        });
      }
    }

    this.fileCards.forEach((fileCard, index) => {
      setTimeout(() => {
        this.fileCards[index].loading = false;
        this.fileCards[index].link = 'xyz';
      }, Math.round(Math.random() * 3000));
    });

  }

  onDeleteClick($event: any, index: number) {
    this.fileCards[index].loading = true;
    setTimeout(() => {
      this.fileCards.splice(index, 1);
    }, Math.round(Math.random() * 3000));
  }

}

class FileCard {
  loading: boolean;
  link: string;
  name: string;
  file: any;
}