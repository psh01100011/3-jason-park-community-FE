export function setWriteForm() {
  const writeForm = document.getElementById('write-form');

  const postForm = document.createElement('form');
    postForm.classList.add('write-form');
    postForm.innerHTML = `
    <p>제목</p>
      <input class="write-form-entity" id="title" type="text" placeholder="제목"><br>
      <p>내용</p>
      <textarea class="write-form-entity" id="content" placeholder="내용"></textarea><br>
    `;
    writeForm.appendChild(postForm);
}

export function setRewriteContent(postDetail) {
  document.getElementById('title').value = postDetail.title;
  document.getElementById('content').textContent = postDetail.content;
}