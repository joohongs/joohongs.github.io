window.addEventListener('load', function () {
  // 모든 슬라이더 컨테이너 추출
  const allSliders = document.querySelectorAll('.img-slider-wrap');

  allSliders.forEach((sliderWrap) => {
    // 현재 슬라이더 내부 구성 요소 참조
    const imgSlider = sliderWrap.querySelector('.img-slider');
    const imgSliderTrack = sliderWrap.querySelector('.img-slider-track');
    const pages = sliderWrap.querySelectorAll('.page');
    const imgIndicator = sliderWrap.querySelector('.img-indicator');
    const dots = imgIndicator ? imgIndicator.querySelectorAll('.dot') : [];
    const prevBtn = sliderWrap.querySelector('.prev-btn');
    const nextBtn = sliderWrap.querySelector('.next-btn');

    let currentIndex = 0;
    let autoSlideInterval;
    const realPageCount = pages.length;

    // 모바일 여부 판별 함수 (너비 767px 기준)
    const isMobile = () => window.innerWidth <= 767;

    // 슬라이더 상태 업데이트 및 트랜지션 처리
    function updateSlider(withTransition = true) {
      if (!imgSliderTrack) return;
      imgSliderTrack.style.transition = withTransition ? 'transform 0.5s ease-in-out' : 'none';
      imgSliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

      // 인디케이터 활성 상태 동기화
      const activeIndex = currentIndex >= dots.length ? 0 : currentIndex;
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
      });
    }

    // 자동 슬라이드 시작 (모바일 제외)
    function startAutoSlide() {
      stopAutoSlide();
      if (isMobile()) return;

      autoSlideInterval = setInterval(() => {
        currentIndex++;
        if (currentIndex >= realPageCount) {
          currentIndex = 0;
          updateSlider(false); // 마지막 장에서 첫 장으로 즉시 이동
        } else {
          updateSlider();
        }
      }, 3000);
    }

    // 자동 슬라이드 정지
    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }

    // 이전 버튼 클릭 이벤트
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex === 0) {
          currentIndex = realPageCount - 1;
          updateSlider(false);
        } else {
          currentIndex--;
          updateSlider();
        }
      });
    }

    // 다음 버튼 클릭 이벤트
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex >= realPageCount) {
          currentIndex = 0;
          updateSlider(false);
        } else {
          updateSlider();
        }
      });
    }

    // 인디케이터 점 클릭 이벤트
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        currentIndex = idx;
        updateSlider();
      });
    });

    // 터치 및 드래그 관련 변수
    let touchStartX = 0;
    let touchEndX = 0;

    if (imgSlider) {
      // 터치 시작 시 자동 슬라이드 중지
      imgSlider.addEventListener(
        'touchstart',
        (e) => {
          stopAutoSlide();
          touchStartX = e.changedTouches[0].screenX;
        },
        { passive: true },
      );

      // 터치 종료 시 스와이프 방향 판별 및 이동
      imgSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
          // 50px 이상 이동 시 스와이프로 간주
          if (diff > 0) {
            currentIndex++;
            if (currentIndex >= realPageCount) currentIndex = 0;
          } else {
            currentIndex--;
            if (currentIndex < 0) currentIndex = realPageCount - 1;
          }
          updateSlider();
        }
        if (!isMobile()) startAutoSlide();
      });

      // 마우스 호버 시 자동 슬라이드 제어
      imgSlider.addEventListener('mouseenter', stopAutoSlide);
      imgSlider.addEventListener('mouseleave', () => {
        if (!isMobile()) startAutoSlide();
      });
    }

    // 초기 화면 설정 및 자동 재생 시작
    updateSlider();
    startAutoSlide();
  });

  // 화면 크기 변경에 따른 슬라이드 상태 재설정
  window.addEventListener('resize', () => {
    // 필요 시 개별 슬라이더별 리사이즈 로직 추가 가능
  });
});
