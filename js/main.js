$(function () {
  // 1. 네비게이션 클릭 이벤트
  $('.gnb a').each(function (index) {
    $(this).click(function (e) {
      e.preventDefault(); // a 태그 기본 동작 방지

      // 클릭한 시점의 각 섹션 ID 배열
      let sections = ['#about', '#skill', '#conti', '#backgroundDesign', '#video', '#shorts', '#contact'];

      // 해당 섹션의 현재 위치를 실시간으로 파악
      let targetTop = $(sections[index]).offset().top;

      // Contact 섹션만 예외 처리가 필요하다면 조건문 추가
      let offsetValue = sections[index] === '#contact' ? 0 : 0;

      $('html,body')
        .stop()
        .animate(
          {
            scrollTop: targetTop - offsetValue,
          },
          500,
        );
    });
  });

  // 2. Top 버튼 클릭
  $('.btn-top').click(function () {
    $('html,body').stop().animate({ scrollTop: 0 }, 500);
  });

  // 3. 스크롤 위치에 따른 Top 버튼 노출
  $(window).scroll(function () {
    let scrH = $(window).scrollTop();

    // 화면 높이(window height)를 기준
    if (scrH >= 500) {
      $('.btn-top').addClass('show');
    } else {
      $('.btn-top').removeClass('show');
    }
  });
});
