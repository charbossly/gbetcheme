import { generateComponents } from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react/hooks";


export const { UploadButton, UploadDropzone, Uploader } =
    generateComponents<OurFileRouter>();

export const { useUploadThing, uploadFiles } =
    generateReactHelpers<OurFileRouter>();

export function isBase64Image(imageData: string) {
    const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
    return base64Regex.test(imageData);
}