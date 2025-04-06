export default function getCroppedImg(imageSrc, pixelCrop, fileType = "image/png") {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = "anonymous";

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }

        const extension = fileType === "image/jpeg" ? "jpg" : "png";
        const file = new File([blob], `croplogo.${extension}`, { type: fileType });
        resolve(file);
      }, fileType);
    };

    image.onerror = reject;
  });
}
