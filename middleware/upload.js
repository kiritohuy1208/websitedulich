const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');
const dotenv = require('dotenv')
dotenv.config()
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, './public/hinhanh')
	},
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // const fileName = uniqueSuffix + '.' + file.mimetype.split('/')[1];
        cb(null, file.originalname);
    }
  })
const upload = multer({
    storage: storage
});
const resize = (keyId, format, width, height) => {
    const readStream = getFileStream(keyId);
    let transform = sharp()
    if (format) {
        transform = transform.toFormat(format)
    }
    if (width || height) {
        transform = transform.resize(width, height)
    }
    return readStream.pipe(transform)
}
const {
    BlobServiceClient,
    generateBlobSASQueryParameters,
    StorageSharedKeyCredential,
    BlobSASPermissions
} = require("@azure/storage-blob");

const accountName = process.env.AZURE_ACCOUNT_NAME
const containerName = process.env.AZURE_CONTAINER_NAME
const accountKey = process.env.AZURE_ACCOUNT_KEY

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

const uploadFile = async file => {
    const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        sharedKeyCredential
    );
    const fileStream = fs.createReadStream(file.path)
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(file.filename);
    return blockBlobClient.uploadStream(fileStream, file.size);
}
const getFileLink = (fileName) => {
    const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        sharedKeyCredential
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    const startDate = new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 100);
    startDate.setMinutes(startDate.getMinutes() - 100);
    return blockBlobClient.url + "?" + generateBlobSASQueryParameters({
            containerName: containerName, // Required
            blobName: fileName, // Required
            permissions: BlobSASPermissions.parse("r"), // Required
            startsOn: startDate, //Date.now(), // Required
            expiresOn: expiryDate //new Date(new Date().valueOf() + 86400) // Optional. Date type (1 ngày)
        },
        sharedKeyCredential // StorageSharedKeyCredential - `new StorageSharedKeyCredential(account, accountKey)`
    ).toString();
}

module.exports = {
    upload,
    uploadFile,
    getFileLink
}