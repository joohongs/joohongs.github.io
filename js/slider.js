document.addEventListener('DOMContentLoaded', function () {
  // 1. 비디오 섹션으로 탐색 범위 한정 (다른 슬라이더와 클래스명 충돌 방지)
  const videoSection = document.querySelector('#video');
  if (!videoSection) return; // 해당 섹션이 없으면 에러 방지

  // 비디오 섹션 안에서만 카드와 인디케이터 영역 찾기
  const cards = videoSection.querySelectorAll('.card');
  const indicatorContainer = videoSection.querySelector('.indicator-container');
  const sliderTrack = videoSection.querySelector('.slider-track');

  // 상태 변수 초기화
  let currentIndex = 0;
  let autoSlideInterval;

  // 2. 인디케이터 동적 생성 (카드 개수에 비례)
  indicatorContainer.innerHTML = '';
  cards.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    dot.setAttribute('data-index', index);
    if (index === 0) dot.classList.add('active'); // 첫 번째 점 활성화
    indicatorContainer.appendChild(dot);
  });

  // 비디오 섹션 내 생성된 인디케이터 선택
  const dots = videoSection.querySelectorAll('.dot');

  // 3. 슬라이더 화면 업데이트 로직
  function updateSlider() {
    cards.forEach((card, index) => {
      // 상태 클래스 초기화
      card.classList.remove('active', 'prev-card', 'next-card');

      if (index === currentIndex) {
        card.classList.add('active');
      } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
        card.classList.add('prev-card');
      } else if (index === (currentIndex + 1) % cards.length) {
        card.classList.add('next-card');
      } else {
        // 카드가 4개 이상일 때 뒤에 겹치는 나머지 카드 숨김 처리
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
      }

      // 화면에 보이는 카드(active, prev, next)는 CSS 디자인 속성을 따르도록 인라인 스타일 제거
      if (card.classList.contains('active') || card.classList.contains('prev-card') || card.classList.contains('next-card')) {
        card.style.opacity = '';
        card.style.pointerEvents = '';
      }
    });

    // 인디케이터 활성화 상태 동기화
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  // 4. 자동 슬라이드 시작 로직
  function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % cards.length;
      updateSlider();
    }, 3000);
  }

  // 5. 자동 슬라이드 정지 로직
  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // 6. 마우스 이벤트 (슬라이더 일시정지 및 재개)
  cards.forEach((card) => {
    card.addEventListener('mouseenter', stopAutoSlide);
    card.addEventListener('mouseleave', startAutoSlide);
  });

  dots.forEach((dot) => {
    dot.addEventListener('mouseenter', stopAutoSlide);
    dot.addEventListener('mouseleave', startAutoSlide);
    // 클릭 시 해당 카드 인덱스로 이동
    dot.addEventListener('click', () => {
      currentIndex = parseInt(dot.getAttribute('data-index'));
      updateSlider();
    });
  });

  // 7. 드래그 및 터치 넘기기 로직
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  const dragThreshold = 60; // 슬라이드 넘어가는 기준 픽셀

  function onDragStart(e) {
    stopAutoSlide();
    isDragging = true;
    startX = e.type.includes('touch') ? e.touches[0].pageX : e.pageX;
  }

  function onDragMove(e) {
    if (!isDragging) return;
    const currentX = e.type.includes('touch') ? e.touches[0].pageX : e.pageX;
    currentTranslate = currentX - startX;
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;

    // 이동 거리에 따른 슬라이드 전환 계산
    if (currentTranslate < -dragThreshold) {
      currentIndex = (currentIndex + 1) % cards.length;
    } else if (currentTranslate > dragThreshold) {
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    }

    updateSlider();
    currentTranslate = 0;
    startAutoSlide();
  }

  // 슬라이더 트랙 마우스 및 터치 이벤트 연결
  sliderTrack.addEventListener('mousedown', onDragStart);
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);
  sliderTrack.addEventListener('touchstart', onDragStart, { passive: true });
  window.addEventListener('touchmove', onDragMove, { passive: true });
  window.addEventListener('touchend', onDragEnd);

  // 8. 초기화 실행
  updateSlider();
  startAutoSlide();
});
