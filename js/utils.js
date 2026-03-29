/* ============================================
   工具函数和全局状态管理
   ============================================ */

const App = {
    currentPage: 'dashboard',
    miniappScreen: 'login',
    miniappUser: null,
};

// ===== Toast 通知 =====
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
}

// ===== Modal 弹窗 =====
function openModal(title, bodyHTML, onConfirm, footerHTML) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = bodyHTML;
    if (footerHTML) document.getElementById('modalFooter').innerHTML = footerHTML;
    document.getElementById('modalOverlay').classList.add('show');
    const confirmBtn = document.getElementById('modalConfirm');
    if (confirmBtn) {
        confirmBtn.onclick = () => { if (onConfirm) onConfirm(); closeModal(); };
    }
}
function closeModal() {
    document.getElementById('modalOverlay').classList.remove('show');
    document.getElementById('modalFooter').innerHTML = `
        <button class="btn btn-secondary" id="modalCancel" onclick="closeModal()">取消</button>
        <button class="btn btn-primary" id="modalConfirm">确认</button>`;
}

// ===== 导航切换 =====
function navigateTo(page) {
    App.currentPage = page;
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const navItem = document.querySelector(`[data-page="${page}"]`);
    if (navItem) navItem.classList.add('active');
    const pageNames = {
        dashboard: '数据看板', contracts: '客户合同', orders: '订单管理',
        billing: '账单管理', config: '规则配置', users: '用户管理', miniapp: '小程序预览'
    };
    document.getElementById('breadcrumbCurrent').textContent = pageNames[page] || page;
    renderPage(page);
}

function renderPage(page) {
    const content = document.getElementById('pageContent');
    const renderers = {
        dashboard: renderDashboard, contracts: renderContracts, orders: renderOrders,
        billing: renderBilling, config: renderConfig, users: renderUsers, miniapp: renderMiniapp,
    };
    if (renderers[page]) renderers[page](content);
}

// ===== 格式化工具 =====
function formatCurrency(n) { return '¥' + Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2 }); }
function formatNumber(n) { return Number(n).toLocaleString('zh-CN'); }
