const multer = require('multer');
// Obtenir un nom de fichier unique
const getUniqueFileName = (file, req) => {
    const fileName = req.body.firstName + '_' + req.body.lastName + '__' + req.body.email;
    console.log(req.body);
    //const originalName = file.originalname.split(' ').join('-');
    //const fileDate = new Date().toISOString().substr(0, 10);
    //const fileID = new Date().getTime();
    
    return fileName + '.png';
};
// Définition du mode de traitement de l'upload
const uploadStorage = multer.diskStorage({
    destination: './uploads/users',
    filename: (req, file, callback) => {
        if (file) {
            const fileName = getUniqueFileName(file, req);
            // stockage du nom de fichier
            // pour récupération dans le contrôleur
            req.uploadedFileName = fileName;
            callback(null, fileName);
        } else {
            callback(new Error('Pas de fichier'));
        }
    }
});

const fileTypeFilter = (req, file, callback) => {
    // Liste des types de fichier autorisés
    const allowedFileTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
    ];
    if (allowedFileTypes.indexOf(file.mimetype) === -1) {
        return callback(new Error('Seulement des images GIF, JPEG ou PNG'), false);
    }
    callback(null, true);
};
const imageUpload = multer({
    storage: uploadStorage,
    fileFilter: fileTypeFilter,
});

module.exports = {
    singlePhoto: imageUpload.single('photo')
};