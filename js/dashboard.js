/* ============================================
   数据看板页面
   ============================================ */

function renderDashboard(container) {
    const s = MockData.dashboardStats;
    container.innerHTML = `
    <div class="page-header">
        <div class="page-header-left">
            <h1>数据看板</h1>
            <p>物流商务订单系统运营概览</p>
        </div>
        <div class="btn-group">
            <button class="btn btn-secondary"><i class="fas fa-calendar-alt"></i> 今日</button>
            <button class="btn btn-secondary"><i class="fas fa-download"></i> 导出报表</button>
        </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
        <div class="stat-card blue">
            <div class="stat-icon"><i class="fas fa-clipboard-list"></i></div>
            <div class="stat-info">
                <div class="stat-label">今日订单</div>
                <div class="stat-value">${s.todayOrders}</div>
                <div class="stat-change up"><i class="fas fa-arrow-up"></i> 较昨日 +12%</div>
            </div>
        </div>
        <div class="stat-card orange">
            <div class="stat-icon"><i class="fas fa-clock"></i></div>
            <div class="stat-info">
                <div class="stat-label">待审核</div>
                <div class="stat-value">${s.pendingAudit}</div>
                <div class="stat-change down"><i class="fas fa-arrow-down"></i> 较昨日 -5%</div>
            </div>
        </div>
        <div class="stat-card green">
            <div class="stat-icon"><i class="fas fa-file-contract"></i></div>
            <div class="stat-info">
                <div class="stat-label">有效合同</div>
                <div class="stat-value">${s.activeContracts}</div>
                <div class="stat-change up"><i class="fas fa-arrow-up"></i> 本月新增 2</div>
            </div>
        </div>
        <div class="stat-card purple">
            <div class="stat-icon"><i class="fas fa-yen-sign"></i></div>
            <div class="stat-info">
                <div class="stat-label">本月营收</div>
                <div class="stat-value">${formatCurrency(s.monthRevenue)}</div>
                <div class="stat-change up"><i class="fas fa-arrow-up"></i> 较上月 +18%</div>
            </div>
        </div>
    </div>

    <!-- 业务流程 -->
    <div class="card" style="margin-bottom:20px">
        <div class="card-header"><h3><i class="fas fa-project-diagram" style="margin-right:8px;color:var(--primary)"></i>业务流程</h3></div>
        <div class="card-body">
            <div class="flow-timeline">
                <div class="flow-step"><div class="flow-step-icon" style="background:linear-gradient(135deg,#4f6ef7,#6c5ce7)"><i class="fas fa-database"></i></div><div class="flow-step-label">基础信息维护</div></div>
                <div class="flow-arrow"><i class="fas fa-chevron-right"></i></div>
                <div class="flow-step"><div class="flow-step-icon" style="background:linear-gradient(135deg,#00cec9,#00b894)"><i class="fas fa-mobile-alt"></i></div><div class="flow-step-label">客户下单</div></div>
                <div class="flow-arrow"><i class="fas fa-chevron-right"></i></div>
                <div class="flow-step"><div class="flow-step-icon" style="background:linear-gradient(135deg,#fdcb6e,#e67e22)"><i class="fas fa-check-double"></i></div><div class="flow-step-label">商务审核</div></div>
                <div class="flow-arrow"><i class="fas fa-chevron-right"></i></div>
                <div class="flow-step"><div class="flow-step-icon" style="background:linear-gradient(135deg,#e17055,#d63031)"><i class="fas fa-truck"></i></div><div class="flow-step-label">TMS派车</div></div>
                <div class="flow-arrow"><i class="fas fa-chevron-right"></i></div>
                <div class="flow-step"><div class="flow-step-icon" style="background:linear-gradient(135deg,#00b894,#00cec9)"><i class="fas fa-signature"></i></div><div class="flow-step-label">司机签收</div></div>
                <div class="flow-arrow"><i class="fas fa-chevron-right"></i></div>
                <div class="flow-step"><div class="flow-step-icon" style="background:linear-gradient(135deg,#6c5ce7,#a29bfe)"><i class="fas fa-file-invoice-dollar"></i></div><div class="flow-step-label">账单结算</div></div>
            </div>
        </div>
    </div>

    <!-- 图表区 -->
    <div class="grid-2">
        <div class="card">
            <div class="card-header"><h3><i class="fas fa-chart-bar" style="margin-right:8px;color:var(--primary)"></i>月度订单趋势</h3></div>
            <div class="card-body">
                <div class="chart-placeholder"><div class="chart-bars" id="trendChart"></div></div>
            </div>
        </div>
        <div class="card">
            <div class="card-header"><h3><i class="fas fa-trophy" style="margin-right:8px;color:var(--warning)"></i>客户排行 TOP5</h3></div>
            <div class="card-body">
                <div class="table-container">
                    <table><thead><tr><th>排名</th><th>客户名称</th><th>订单数</th><th>营收</th></tr></thead>
                    <tbody>${s.topCustomers.map((c,i) => `<tr><td><span style="display:inline-flex;width:24px;height:24px;border-radius:50%;background:${i<3?'linear-gradient(135deg,var(--primary),var(--secondary))':'var(--bg-input)'};color:${i<3?'white':'var(--text-muted)'};align-items:center;justify-content:center;font-size:11px;font-weight:700">${i+1}</span></td><td>${c.name}</td><td>${c.orders}</td><td style="font-weight:600;color:var(--primary)">${formatCurrency(c.revenue)}</td></tr>`).join('')}
                    </tbody></table>
                </div>
            </div>
        </div>
    </div>

    <!-- 最近动态 -->
    <div class="card" style="margin-top:20px">
        <div class="card-header"><h3><i class="fas fa-history" style="margin-right:8px;color:var(--accent)"></i>最近动态</h3></div>
        <div class="card-body">
            <div style="display:flex;flex-direction:column;gap:12px">
                ${s.recentActivities.map(a => `
                <div style="display:flex;align-items:center;gap:14px;padding:10px 14px;background:var(--bg-input);border-radius:var(--radius-sm)">
                    <span style="font-size:12px;color:var(--text-muted);min-width:80px">${a.time}</span>
                    <span class="status-badge ${a.type}">${a.action}</span>
                    <span style="font-size:13px;color:var(--text-secondary)">${a.detail}</span>
                </div>`).join('')}
            </div>
        </div>
    </div>`;

    // Animate chart bars
    setTimeout(() => {
        const chart = document.getElementById('trendChart');
        if (!chart) return;
        const max = Math.max(...s.monthlyOrderTrend.map(d => d.value));
        const colors = ['#4f6ef7','#6c5ce7','#00cec9','#00b894','#fdcb6e','#e17055'];
        chart.innerHTML = s.monthlyOrderTrend.map((d, i) => `
            <div class="chart-bar" style="height:0;background:linear-gradient(180deg,${colors[i]},${colors[i]}99)">
                <span class="chart-bar-value">${d.value}</span>
                <span class="chart-bar-label">${d.month}</span>
            </div>`).join('');
        requestAnimationFrame(() => {
            chart.querySelectorAll('.chart-bar').forEach((bar, i) => {
                bar.style.height = (s.monthlyOrderTrend[i].value / max * 180) + 'px';
            });
        });
    }, 100);
}
