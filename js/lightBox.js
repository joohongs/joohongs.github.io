document.addEventListener('DOMContentLoaded', () => {
  const allLists = document.querySelectorAll('.conti-img-list');
  const allSliders = document.querySelectorAll('.img-slider-wrap');

  allSliders.forEach((sliderWrap, sliderIndex) => {
    const track = sliderWrap.querySelector('.img-slider-track');
    const pages = sliderWrap.querySelectorAll('.page');
    const nextBtn = sliderWrap.querySelector('.next-btn');
    const prevBtn = sliderWrap.querySelector('.prev-btn');
    const indicator = sliderWrap.querySelector('.img-indicator');

    let currentIndex = 0;
    const slideCount = pages.length;

    // 1. Dot 인디케이터 자동 생성
    if (indicator) {
      indicator.innerHTML = '';
      pages.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        // 초기화 시점에는 0번에만 active
        if (i === 0) dot.classList.add('active');

        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          goToSlide(i);
        });
        indicator.appendChild(dot);
      });
    }

    // 2. 슬라이드 이동 함수
    function goToSlide(index, withTransition = true) {
      if (index < 0) index = slideCount - 1;
      if (index >= slideCount) index = 0;

      currentIndex = index;

      // 트랙 이동
      if (track) {
        track.style.transition = withTransition ? 'transform 0.5s ease-in-out' : 'none';
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
      }

      // [중요] 해당 슬라이더 내의 모든 dot을 찾아서 현재 인덱스만 active 처리
      const dots = sliderWrap.querySelectorAll('.dot');
      dots.forEach((dot, i) => {
        if (i === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    // 3. 버튼 이벤트
    if (nextBtn)
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(currentIndex + 1);
      });

    if (prevBtn)
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(currentIndex - 1);
      });

    // 4. 라이트박스 닫기
    sliderWrap.addEventListener('click', (e) => {
      if (e.target === sliderWrap) {
        sliderWrap.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });

    // 5. 라이트박스 열기 및 인디케이터 강제 초기화
    if (allLists[sliderIndex]) {
      const listItems = allLists[sliderIndex].querySelectorAll('li');
      listItems.forEach((li) => {
        li.addEventListener('click', () => {
          // 열기 직전에 0번 인덱스로, 애니메이션 없이 초기화
          goToSlide(0, false);

          sliderWrap.classList.add('active');
          document.body.style.overflow = 'hidden';

          // 렌더링 후 애니메이션 복구
          setTimeout(() => {
            if (track) track.style.transition = 'transform 0.5s ease-in-out';
          }, 50);
        });
      });
    }
  });
});
