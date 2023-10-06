export const images = [
  "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
];

export const videos = [
  "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.jpg",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
];

export const downloadBlob = (data: any, name = "file.txt") => {
  // blob: Blob
  //@ts-ignore
  if (window.navigator && window.navigator.msSaveOrOpenBlob)
    //@ts-ignore
    return window.navigator.msSaveOrOpenBlob(blob);

  // For other browsers:
  // Create a link pointing to the ObjectURL containing the blob.
  // const data = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = data;
  link.download = name;

  // this is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );

  setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    window.URL.revokeObjectURL(data);
    link.remove();
  }, 100);
};
