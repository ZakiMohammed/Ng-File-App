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
    extensions: any[] = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];
    minSize: number = 1;
    maxSize: number = 2;
    errors: any = null;

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

    onResetClick($event: any) {
        this.frm.reset();
        this.fileNames = '';
        this.files = [];
        this.errors = null;
    }

    onFileSelect($event: any) {

        this.fileNames = '';
        this.files = [];
        this.errors = null;

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

        if (this.files.length) {
            this.files.forEach(file => {
                let extension = file.name.split('.'); extension = extension[1];
                if (!this.extensions.find(i => i === extension)) {
                    if (!this.errors) {
                        this.errors = {};
                    }
                    this.errors.invalidExtension = true;
                    return;
                }
            });
            this.files.forEach(file => {
                let size = file.size / 1024 / 1024;
                if (!(this.minSize <= size && size <= this.maxSize)) {
                    if (!this.errors) {
                        this.errors = {};
                    }
                    this.errors.invalidSize = true;
                    return;
                }
            });
        }
        
        console.log('🏈', this.files);
    }

}
