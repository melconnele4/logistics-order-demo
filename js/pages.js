/* ============================================
   账单管理 + 规则配置 + 用户管理页面
   ============================================ */

// ===== 账单管理 =====
function renderBilling(container) {
    container.innerHTML = `
    <div class="page-header">
        <div class="page-header-left"><h1>账单管理</h1><p>运单结算、账单生成与SAP同步</p></div>
        <div class="btn-group">
            <button class="btn btn-secondary" onclick="showToast('导出成功','success')"><i class="fas fa-file-export"></i> 导出</button>
        </div>
    </div>
    <div class="stats-grid">
        <div class="stat-card blue"><div class="stat-icon"><i class="fas fa-file-invoice"></i></div><div class="stat-info"><div class="stat-label">总账单数</div><div class="stat-value">${MockData.bills.length}</div></div></div>
        <div class="stat-card green"><div class="stat-icon"><i class="fas fa-check-circle"></i></div><div class="stat-info"><div class="stat-label">已确认</div><div class="stat-value">${MockData.bills.filter(b=>b.status==='已确认').length}</div></div></div>
        <div class="stat-card orange"><div class="stat-icon"><i class="fas fa-hourglass-half"></i></div><div class="stat-info"><div class="stat-label">待确认</div><div class="stat-value">${MockData.bills.filter(b=>b.status==='待确认').length}</div></div></div>
        <div class="stat-card purple"><div class="stat-icon"><i class="fas fa-yen-sign"></i></div><div class="stat-info"><div class="stat-label">总金额</div><div class="stat-value">${formatCurrency(MockData.bills.reduce((s,b)=>s+b.totalAmount,0))}</div></div></div>
    </div>
    <div class="card">
        <div class="card-header"><h3>账单列表</h3></div>
        <div class="card-body"><div class="table-container"><table><thead><tr>
            <th>账单号</th><th>客户号</th><th>客户名称</th><th>账期</th><th>订单数</th><th>总金额</th>
            <th>状态</th><th>确认时间</th><th>SAP同步</th><th>SAP订单号</th><th>操作</th>
        </tr></thead><tbody>
        ${MockData.bills.map(b => `<tr>
            <td style="font-weight:600">${b.billNo}</td><td>${b.customerId}</td><td>${b.customerName}</td>
            <td>${b.period}</td><td>${b.orderCount}</td>
            <td style="font-weight:700;color:var(--primary)">${formatCurrency(b.totalAmount)}</td>
            <td><span class="status-badge ${b.status==='已确认'?'success':'warning'}">${b.status}</span></td>
            <td>${b.confirmTime||'-'}</td>
            <td>${b.sapSynced?'<span class="status-badge success">已同步</span>':'<span class="status-badge muted">未同步</span>'}</td>
            <td>${b.sapOrderNo||'-'}</td>
            <td><div class="btn-group">
                ${b.status==='待确认'?`<button class="btn btn-sm btn-success" onclick="showToast('账单 ${b.billNo} 已确认','success')"><i class="fas fa-check"></i> 确认</button>`:''}
                ${b.status==='已确认'&&!b.sapSynced?`<button class="btn btn-sm btn-primary" onclick="showToast('已推送SAP','success')"><i class="fas fa-cloud-upload-alt"></i> 传SAP</button>`:''}
            </div></td>
        </tr>`).join('')}
        </tbody></table></div></div>
    </div>`;
}

// ===== 规则配置 =====
function renderConfig(container) {
    container.innerHTML = `
    <div class="page-header">
        <div class="page-header-left"><h1>规则配置</h1><p>管理订单传TMS的固定字段配置</p></div>
        <div class="btn-group"><button class="btn btn-primary" onclick="showToast('配置已保存','success')"><i class="fas fa-save"></i> 保存配置</button></div>
    </div>
    <div class="card">
        <div class="card-header"><h3><i class="fas fa-sliders-h" style="margin-right:8px;color:var(--primary)"></i>订单传输固定值配置</h3></div>
        <div class="card-body">
            <div class="form-grid">
                ${MockData.systemConfig.map(c => `
                <div class="form-group">
                    <label class="form-label">${c.configKey} <span style="font-size:11px;color:var(--text-muted)">(${c.description})</span></label>
                    <input class="form-input" value="${c.configValue}">
                </div>`).join('')}
            </div>
        </div>
    </div>
    <div class="card">
        <div class="card-header"><h3><i class="fas fa-link" style="margin-right:8px;color:var(--accent)"></i>TMS字段映射预览</h3></div>
        <div class="card-body"><div class="table-container"><table><thead><tr>
            <th>线路号</th><th>订单类型</th><th>上传WMS</th><th>始发机构</th><th>发货客户ID</th><th>要货仓库</th><th>产品编号</th><th>单位</th>
        </tr></thead><tbody><tr>
            <td>SW0200</td><td>三方入库单</td><td>N</td><td>商务虚拟工厂</td><td>SWPY</td><td>商务虚拟工厂</td><td>BZ02</td><td>个</td>
        </tr></tbody></table></div></div>
    </div>`;
}

// ===== 用户管理 =====
function renderUsers(container) {
    container.innerHTML = `
    <div class="page-header">
        <div class="page-header-left"><h1>用户管理</h1><p>账号权限管理</p></div>
        <div class="btn-group"><button class="btn btn-primary" onclick="showToast('新增用户功能（演示）','info')"><i class="fas fa-user-plus"></i> 新增用户</button></div>
    </div>
    <div class="card">
        <div class="card-header"><h3>用户列表</h3><span style="font-size:12px;color:var(--text-muted)">共 ${MockData.users.length} 个</span></div>
        <div class="card-body"><div class="table-container"><table><thead><tr>
            <th>ID</th><th>用户名</th><th>角色</th><th>关联客户</th><th>状态</th><th>最后登录</th><th>操作</th>
        </tr></thead><tbody>
        ${MockData.users.map(u => `<tr>
            <td>${u.id}</td><td style="font-weight:600">${u.username}</td>
            <td><span class="status-badge ${u.role==='系统管理员'?'info':u.role==='商务审核员'?'success':'muted'}">${u.role}</span></td>
            <td>${u.customerId||'-'}</td>
            <td><span class="status-badge ${u.isActive?'success':'danger'}">${u.isActive?'启用':'禁用'}</span></td>
            <td>${u.lastLogin}</td>
            <td><div class="btn-group">
                <button class="btn btn-sm btn-secondary" onclick="showToast('编辑用户（演示）','info')"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-${u.isActive?'danger':'success'}" onclick="showToast('${u.isActive?'已禁用':'已启用'}（演示）','${u.isActive?'error':'success'}')"><i class="fas fa-${u.isActive?'ban':'check'}"></i></button>
            </div></td>
        </tr>`).join('')}
        </tbody></table></div></div>
    </div>`;
}
