export function isImage(link: string) {
    let extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.dib', '.jfif', '.tif', '.tiff'];
    let found = extensions.find(i => link.includes(i));
    return !!found;
}