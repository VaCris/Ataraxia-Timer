interface DocumentPictureInPicture {
    requestWindow: (options: { width: number; height: number }) => Promise<Window>
}

interface Window {
    documentPictureInPicture?: DocumentPictureInPicture
}