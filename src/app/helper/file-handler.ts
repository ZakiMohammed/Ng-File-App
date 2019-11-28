export class FileHandler {

    files: any[] = [];
    fileNames: string = '';
    extensions: any[] = [];
    errors: any = null;
    minSize: number = 1;
    maxSize: number = 2;

    getFile(control: any): void {
        const file = control.target.files[0];
        if (typeof (file) === 'object') {
            this.files.push(file);
            this.fileNames += file.name + ', ';
        }

        if (this.fileNames) {
            this.fileNames = this.fileNames.substr(0, this.fileNames.length - 2);
        }

        // if (this.files.length) {
        //     this.files.forEach(file => {
        //         let extension = file.name.split('.'); extension = extension[1];
        //         if (!this.extensions.find(i => i === extension)) {
        //             if (!this.errors) {
        //                 this.errors = {};
        //             }
        //             this.errors.invalidExtension = true;
        //             return;
        //         }
        //     });
        //     this.files.forEach(file => {
        //         let size = file.size / 1024 / 1024;
        //         if (!(this.minSize <= size && size <= this.maxSize)) {
        //             if (!this.errors) {
        //                 this.errors = {};
        //             }
        //             this.errors.invalidSize = true;
        //             return;
        //         }
        //     });
        // }
    }
    getFiles(control: any): void {
        for (const key in control.files) {
            const file = control.files[key];
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
export class FileHandler64 {    
    fileName: any;
    fileNames: any[];

    getFile(control: any): void {
        let file = control.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = (e) => {
            this.fileName = reader.result;
        }
    }
    getFiles(control: any): void {
        Array.from(control.files).forEach((file: File) => {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = (e) => {
                this.fileNames.push(reader.result);
            }
        });
    }
}
