/* ============================================
   应用初始化
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // 初始化页面
    renderPage('dashboard');

    // 导航点击事件
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            if (page) navigateTo(page);
        });
    });

    // 菜单切换（移动端）
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });

    // 关闭弹窗
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal();
    });
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalCancel').addEventListener('click', closeModal);
});
