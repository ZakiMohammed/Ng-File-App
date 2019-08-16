import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

    frm: FormGroup;
    files: any[] = [];
    fileNames: string = '';
    allowedExtensions: any[] = ['.jpeg', '.jpg', '.png', '.gif', '.bmp'];

    constructor(
        private builder: FormBuilder
    ) { }

    get f(): { [key: string]: AbstractControl } {
        return this.frm.controls;
    }

    ngOnInit() {
        this.frm = this.builder.group({
            file: ['', Validators.required]
        });
    }

    onSubmit() {

        if (!(this.frm.valid)) {
            return;
        }

        const formData = new FormData();
        this.files.forEach((file: any, index: number) => {
            formData.append('Upload ' + (index + 1), file);
        });

        //   this.userService.upload(formData).subscribe(
        //     (res) => console.log(res),
        //     (err) => console.log(err)
        //   );
    }

    onFileSelect($event: any) {

        this.fileNames = '';
        this.files = [];

        for (const key in $event.target.files) {
            const file = $event.target.files[key];
            if (typeof (file) === 'object') {
                this.files.push(file);
                this.fileNames += file.name + ', ';
            }
        }

        if (this.fileNames) {
            this.fileNames = this.fileNames.substr(0, this.fileNames.length - 2);
        }        
    }

}
