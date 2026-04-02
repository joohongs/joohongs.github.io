document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. 다중 이미지 슬라이더 라이트박스 기능
     ========================================================================== */
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

    // Dot 인디케이터 자동 생성
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

    // 슬라이드 이동 함수
    function goToSlide(index, withTransition = true) {
      if (index < 0) index = slideCount - 1;
      if (index >= slideCount) index = 0;

      currentIndex = index;

      // 트랙 이동
      if (track) {
        track.style.transition = withTransition ? 'transform 0.5s ease-in-out' : 'none';
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
      }

      // 해당 슬라이더 내의 모든 dot을 찾아서 현재 인덱스만 active 처리
      const dots = sliderWrap.querySelectorAll('.dot');
      dots.forEach((dot, i) => {
        if (i === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    // 버튼 이벤트
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(currentIndex + 1);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(currentIndex - 1);
      });
    }

    // 슬라이더 라이트박스 닫기
    sliderWrap.addEventListener('click', (e) => {
      if (e.target === sliderWrap) {
        sliderWrap.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });

    // 슬라이더 라이트박스 열기 및 인디케이터 강제 초기화
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

  /* ==========================================================================
     2. 배경 디자인 단일 이미지 라이트박스 기능
     ========================================================================== */
  const thumbnails = document.querySelectorAll('.backimage-list img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  // 요소들이 페이지에 존재하는지 확인 후 이벤트 등록 (안전 장치)
  if (thumbnails.length > 0 && lightbox && lightboxImg) {
    // 각 썸네일에 클릭 이벤트 추가
    thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener('click', (e) => {
        // 클릭한 썸네일의 src와 alt 속성을 가져와 라이트박스 이미지에 적용
        const targetSrc = e.target.getAttribute('src');
        const targetAlt = e.target.getAttribute('alt');

        lightboxImg.setAttribute('src', targetSrc);
        lightboxImg.setAttribute('alt', targetAlt);

        // 화면에 표시
        lightbox.classList.add('show');
      });
    });

    // 라이트박스(검은 배경)를 클릭하면 창이 닫히도록 설정
    lightbox.addEventListener('click', () => {
      lightbox.classList.remove('show');
    });
  }
});
