window.addEventListener('load', function () {
  const allSliders = document.querySelectorAll('.img-slider-wrap');

  allSliders.forEach((sliderWrap) => {
    const imgSlider = sliderWrap.querySelector('.img-slider');
    const imgSliderTrack = sliderWrap.querySelector('.img-slider-track');
    const pages = sliderWrap.querySelectorAll('.page');
    const imgIndicator = sliderWrap.querySelector('.img-indicator');
    const prevBtn = sliderWrap.querySelector('.prev-btn');
    const nextBtn = sliderWrap.querySelector('.next-btn');

    let currentIndex = 0;
    const realPageCount = pages.length;

    // 1. Dot 인디케이터 자동 생성 및 클릭 이벤트
    if (imgIndicator) {
      imgIndicator.innerHTML = '';
      pages.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active');
        dot.dataset.index = idx;

        dot.addEventListener('click', () => {
          currentIndex = idx;
          updateSlider();
        });

        imgIndicator.appendChild(dot);
      });
    }

    const dots = imgIndicator ? imgIndicator.querySelectorAll('.dot') : [];

    // 2. 슬라이더 업데이트 함수
    function updateSlider(withTransition = true) {
      if (!imgSliderTrack) return;
      imgSliderTrack.style.transition = withTransition ? 'transform 0.5s ease-in-out' : 'none';
      imgSliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    // 3. 이전/다음 버튼 클릭 이벤트
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex === 0) {
          currentIndex = realPageCount - 1;
          updateSlider(false); // 마지막 장으로 즉시 이동
        } else {
          currentIndex--;
          updateSlider();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex >= realPageCount) {
          currentIndex = 0;
          updateSlider(false); // 첫 장으로 즉시 이동
        } else {
          updateSlider();
        }
      });
    }

    // 4. 모바일 터치 스와이프 로직
    let touchStartX = 0;
    let touchEndX = 0;

    if (imgSlider) {
      imgSlider.addEventListener(
        'touchstart',
        (e) => {
          touchStartX = e.changedTouches[0].screenX;
        },
        { passive: true },
      );

      imgSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
          // 50px 이상 이동 시 스와이프로 간주
          if (diff > 0) {
            // 왼쪽으로 밀었을 때 (다음)
            currentIndex++;
            if (currentIndex >= realPageCount) currentIndex = 0;
          } else {
            // 오른쪽으로 밀었을 때 (이전)
            currentIndex--;
            if (currentIndex < 0) currentIndex = realPageCount - 1;
          }
          updateSlider();
        }
      });
    }

    // 초기 상태 설정
    updateSlider();
  });
});
