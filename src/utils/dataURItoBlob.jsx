// https://github.com/graingert/datauritoblob/blob/master/dataURItoBlob.js
export default function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  const byteString = atob(dataURI.split(',')[1]);
  // separate out the mime component
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);
  const dw = new DataView(ab);
  for (let i = 0; i < byteString.length; i += 1) {
    dw.setUint8(i, byteString.charCodeAt(i));
  }
  // write the ArrayBuffer to a blob
  return new Blob([ab], { type: mimeString });
}
