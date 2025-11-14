export function setProfile() {
    const imageContainer = document.getElementById('image-container');
    //화면 구성

    const wrapper = document.createElement('div');
    wrapper.classList.add('profile-wrapper');

    const image = document.createElement('img');
    image.classList.add('profile-img');
    image.id = 'profile';
    const userProfile = sessionStorage.getItem("profile");
    if(userProfile != null){
        //사진 추가
        image.src = userProfile;
    }
    else{
        //기본 프로필 이미지
        image.src = '/basic.jpg';
    }
    const editOverlay = document.createElement('div');
    editOverlay.classList.add('edit-overlay');
    editOverlay.textContent = "수정";
    const fileInput = document.createElement('input');
    fileInput.id = 'fileInput';
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.hidden = true;
    imageContainer.appendChild(image);

    editOverlay.addEventListener('click', () => {
        fileInput.click();
    });

    // 파일 선택 → 이미지 변경
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            image.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    wrapper.appendChild(image);
    wrapper.appendChild(editOverlay);
    wrapper.appendChild(fileInput);
    imageContainer.appendChild(wrapper);
}
