const express = require('express');
const multer = require('multer');
const path = require('path');
const aws = require('aws-sdk'); // aws 설정을 위한 모듈
const multerS3 = require('multer-s3'); // aws s3에 업로드하기 위한 multer 설정
const app = express();
const PORT = 8000;

// aws 설정
aws.config.update({
    accessKeyId: 'AKIAVSYVO5JQORHTPMWA',
    secretAccessKey: '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',
    region: 'ap-northeast-2'
})

// aws s3 인스턴스 생성
const s3 = new aws.S3();

//view engine 설정
app.set('view engine', 'ejs');
//정적파일세팅
app.use('/uploads', express.static(__dirname + '/uploads'));
// //multer 설정
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         //확장자 분리
//         const ext = path.extname(file.originalname);
//         cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
//     },
// });
// const upload = multer({ storage });
// multer 설정 - aws
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'kdt-test-bucket-seunggi',
        acl: 'public-read', // 파일 접근 권한 (public-read로 해야 업로드된 팡ㄹ이 공개)
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname);
        }
    })
})

//router
app.get('/', (req, res) => {
    res.render('index');
});
//multer업로드
app.post('/upload', upload.array('files'), (req, res) => {
    console.log('업로드된 파일:', req.files);
    res.send(req.files);
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
