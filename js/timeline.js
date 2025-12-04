/**
 * Timeline 時間軸互動
 * - 桌機：滾輪控制左右滑動
 * - 手機：直向排列，滾動時依序顯示
 * - 進場動畫：線條延伸 + item 依序淡入
 */

(function() {
    const timeline = document.querySelector(".timeline");
    const track = document.querySelector(".timeline-track");
    const items = document.querySelectorAll(".timeline-item");
    
    if (!timeline || !track || items.length === 0) return;

    let isAnimated = false;
    const isMobile = () => window.innerWidth <= 767;

    // ========== 進場動畫 ==========
    function animateTimeline() {
        if (isAnimated) return;
        isAnimated = true;

        // 1. 先顯示線條
        timeline.classList.add("is-visible");

        // 2. 延遲後依序顯示 items
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add("show");
            }, 800 + index * 200); // 線條動畫後開始
        });
    }

    // ========== IntersectionObserver 偵測進入視窗 ==========
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateTimeline();
                }
            });
        },
        { threshold: 0.2 }
    );
    observer.observe(timeline);

    // ========== 桌機：滾輪控制左右滑動 ==========
    function handleWheel(e) {
        if (isMobile()) return;

        const trackRect = track.getBoundingClientRect();
        const isInTrackArea = e.clientY >= trackRect.top && e.clientY <= trackRect.bottom;
        
        // 只有在 timeline 區域內才攔截滾輪
        if (!isInTrackArea) return;

        const maxScroll = track.scrollWidth - track.clientWidth;
        const currentScroll = track.scrollLeft;

        // 判斷是否已到邊界
        const atStart = currentScroll <= 0;
        const atEnd = currentScroll >= maxScroll - 1;

        // 如果往左滾且已到最左，或往右滾且已到最右，讓頁面正常滾動
        if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) {
            return;
        }

        // 攔截滾輪，轉為水平滾動
        e.preventDefault();
        
        // 滾動速度調整
        const scrollSpeed = 1.5;
        track.scrollLeft += e.deltaY * scrollSpeed;
    }

    // 使用 passive: false 才能 preventDefault
    timeline.addEventListener("wheel", handleWheel, { passive: false });

    // ========== 手機版：滾動時檢測 item 進入視窗 ==========
    function handleMobileScroll() {
        if (!isMobile()) return;

        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.85;
            
            if (isVisible && !item.classList.contains("show")) {
                item.classList.add("show");
            }
        });
    }

    // 手機版滾動監聽
    let scrollTimeout;
    window.addEventListener("scroll", () => {
        if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
        scrollTimeout = requestAnimationFrame(handleMobileScroll);
    });

    // ========== 視窗大小改變時重置 ==========
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // 重置滾動位置
            if (!isMobile()) {
                track.scrollLeft = 0;
            }
        }, 200);
    });

})();
