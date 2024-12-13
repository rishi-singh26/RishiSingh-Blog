export const generateBase64FromImage = (imageFile: File): Promise<string | ArrayBuffer | null> => {
    const reader = new FileReader();

    const promise: Promise<string | ArrayBuffer | null> = new Promise((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result ?? ''); // Resolve the Base64 string or ArrayBuffer
        reader.onerror = (err) => reject(err); // Reject in case of an error
    });

    reader.readAsDataURL(imageFile); // Start reading the file as Base64
    return promise;
};
