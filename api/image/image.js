import { s3_address } from '../../../config/config.js';

// 이미지 업로드
export async function uploadImage(image) {
    const url = s3_address;
    console.log(url);
    const formData = new FormData();
    formData.append('profileImage', image);
    const option = {
        method: 'POST',
        body: formData
    }
    const response = await fetch(url, option);
    const imageUrl = await response.json();
    console.log(imageUrl.data.filePath.toString());
    return imageUrl.data.filePath.toString();
}


// 이미지 압축



//이미지 크기 조정?? (썸네일 용)



