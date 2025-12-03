export function setWriteForm() {
  const writeForm = document.getElementById('write-form');

  const postForm = document.createElement('form');
  postForm.classList.add('write-form');
  postForm.innerHTML = `
    <p>제목</p>
    <input class="write-form-entity" id="title" type="text" placeholder="제목"><br>

    <p>내용</p>
    <textarea class="write-form-entity" id="content" placeholder="내용"></textarea><br>

    <p>이미지*</p>

    <input id="imageInput" type="file" accept="image/*" class="hidden-file-input">

    <label id="fileTrigger" for="imageInput" class="custom-file-button">
      파일 선택
    </label>

    <span id="fileStatus" class="file-status">
      선택된 파일 없음
    </span>
  `;

  writeForm.appendChild(postForm);

  document.getElementById('imageInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    document.getElementById('fileStatus').textContent =
    file ? file.name : '선택된 파일 없음';
  });
}

export function setRewriteContent(postDetail) {
  document.getElementById('title').value = postDetail.title;
  document.getElementById('content').textContent = postDetail.content;
  const imageName = postDetail.image.split('/').pop();
  document.getElementById('fileStatus').textContent = imageName;
}