import { Subscription } from 'rxjs';

export class FileCard {
    retry: boolean;
    cancel: boolean;
    loading: boolean;
    progress: number;
    link: string;
    name: string;
    file: any;
    subscription$: Subscription;
}