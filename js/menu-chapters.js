document.addEventListener('DOMContentLoaded', function () {
  var chapterButtons = document.querySelectorAll('.full-menu_chapter');
  var categoryItems = document.querySelectorAll('.full-menu_tabs .nav-item');

  if (!chapterButtons.length || !categoryItems.length) return;

  function activateChapter(chapter) {
    chapterButtons.forEach(function (btn) {
      var isActive = btn.dataset.chapter === chapter;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive);
    });

    var firstVisibleLink = null;
    categoryItems.forEach(function (li) {
      var match = li.dataset.chapter === chapter;
      li.style.display = match ? '' : 'none';
      if (match && !firstVisibleLink) {
        firstVisibleLink = li.querySelector('.nav-link');
      }
    });

    if (firstVisibleLink && firstVisibleLink.getAttribute('aria-selected') !== 'true') {
      firstVisibleLink.click();
    }
  }

  chapterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activateChapter(btn.dataset.chapter);
    });
  });

  activateChapter(chapterButtons[0].dataset.chapter);
});
