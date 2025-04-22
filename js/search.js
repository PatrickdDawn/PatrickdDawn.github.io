document.addEventListener('DOMContentLoaded', () => {
  const $input = document.getElementById('search-input');
  const $results = document.getElementById('search-results');

  // 加载搜索数据
  fetch('/search.xml')
    .then(r => r.text())
    .then(xml => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, "text/xml");
      const posts = [...doc.querySelectorAll('entry')].map(entry => ({
        title: entry.querySelector('title').textContent,
        url: entry.querySelector('url').textContent,
        content: entry.querySelector('content').textContent
      }));

      $input.addEventListener('input', () => {
        const keyword = $input.value.trim().toLowerCase();
        $results.innerHTML = '';

        if (!keyword) return;

        const matches = posts.filter(post =>
          post.title.toLowerCase().includes(keyword) ||
          post.content.toLowerCase().includes(keyword)
        );

        matches.forEach(post => {
          const $item = document.createElement('div');
          $item.className = 'search-item';
          $item.innerHTML = `
            <h3><a href="${post.url}">${post.title}</a></h3>
            <p>${post.content.substring(0, 150)}...</p>
          `;
          $results.appendChild($item);
        });
      });
    });
});
