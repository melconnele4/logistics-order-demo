/* ============================================
   客户合同管理页面
   Skill 1: 审核/批量审核/日志
   Skill 2: 二级信息CRUD
   ============================================ */

function renderContracts(container) {
    container.innerHTML = `
    <div class="page-header">
        <div class="page-header-left"><h1>客户合同管理</h1><p>管理客户合同信息、提货/送货地址、结算方式</p></div>
        <div class="btn-group">
            <button class="btn btn-success" id="batchAuditBtn" onclick="batchAuditContracts()" disabled><i class="fas fa-check-double"></i> 批量审核</button>
            <button class="btn btn-secondary" onclick="showAuditLogs('合同')"><i class="fas fa-history"></i> 审核日志</button>
            <button class="btn btn-secondary" onclick="showToast('导入功能演示','info')"><i class="fas fa-file-import"></i> 导入</button>
            <button class="btn btn-secondary" onclick="showToast('导出成功','success')"><i class="fas fa-file-export"></i> 导出</button>
            <button class="btn btn-primary" onclick="showContractForm()"><i class="fas fa-plus"></i> 新增</button>
        </div>
    </div>

    <!-- 筛选 -->
    <div class="filter-bar">
        <div class="filter-group"><label>客户号</label><input type="text" id="filterContractCustomer" placeholder="多客户用,分隔"></div>
        <div class="filter-group"><label>合同到期日期</label><input type="date" id="filterContractExpire"></div>
        <div class="filter-group"><label>有效性</label><select id="filterContractValidity"><option value="">全部</option><option value="Y">是</option><option value="N">否</option></select></div>
        <div class="filter-group"><label>审核状态</label><select id="filterContractAudit"><option value="">全部</option><option value="已审核">已审核</option><option value="未审核">未审核</option></select></div>
        <button class="btn btn-primary" onclick="filterContracts()"><i class="fas fa-search"></i> 查询</button>
        <button class="btn btn-secondary" onclick="resetContractFilter()"><i class="fas fa-redo"></i> 重置</button>
    </div>

    <!-- 合同列表 -->
    <div class="card">
        <div class="card-header"><h3>合同列表</h3><span style="font-size:12px;color:var(--text-muted)">共 <b id="contractCount">${MockData.contracts.length}</b> 条</span></div>
        <div class="card-body"><div class="table-container"><table><thead><tr>
            <th><input type="checkbox" id="contractCheckAll" onchange="toggleContractCheckAll(this)"></th>
            <th>客户号</th><th>客户名称</th><th>合同到期</th><th>有效性</th><th>审核状态</th>
            <th>审核人</th><th>审核时间</th><th>新增人</th><th>新增时间</th><th>操作</th>
        </tr></thead><tbody id="contractTableBody"></tbody></table></div></div>
    </div>`;
    renderContractTable(MockData.contracts);
}

function renderContractTable(data) {
    const tbody = document.getElementById('contractTableBody');
    if (!tbody) return;
    const countEl = document.getElementById('contractCount');
    if (countEl) countEl.textContent = data.length;
    tbody.innerHTML = data.map(c => `<tr>
        <td><input type="checkbox" class="contract-check" value="${c.customerId}" onchange="updateBatchBtn()"></td>
        <td><a href="#" onclick="showContractDetail('${c.customerId}');return false" style="color:var(--primary);font-weight:600">${c.customerId}</a></td>
        <td>${c.customerName}</td><td>${c.contractExpire}</td>
        <td><span class="status-badge ${c.validity==='Y'?'success':'danger'}">${c.validity==='Y'?'有效':'无效'}</span></td>
        <td><span class="status-badge ${c.auditStatus==='已审核'?'success':'warning'}">${c.auditStatus}</span></td>
        <td>${c.auditor||'-'}</td><td>${c.auditTime||'-'}</td><td>${c.creator}</td><td>${c.createTime}</td>
        <td><div class="btn-group">
            <button class="btn btn-sm btn-secondary" onclick="showContractForm('${c.customerId}')"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-success" onclick="auditContract('${c.customerId}')" title="审核"><i class="fas fa-check"></i></button>
            <button class="btn btn-sm btn-danger" onclick="deleteContract('${c.customerId}')"><i class="fas fa-trash"></i></button>
        </div></td>
    </tr>`).join('');
}

function toggleContractCheckAll(el) {
    document.querySelectorAll('.contract-check').forEach(cb => cb.checked = el.checked);
    updateBatchBtn();
}

function updateBatchBtn() {
    const checked = document.querySelectorAll('.contract-check:checked').length;
    const btn = document.getElementById('batchAuditBtn');
    if (btn) {
        btn.disabled = checked === 0;
        btn.innerHTML = `<i class="fas fa-check-double"></i> 批量审核${checked > 0 ? ` (${checked})` : ''}`;
    }
}

function getSelectedContractIds() {
    return Array.from(document.querySelectorAll('.contract-check:checked')).map(cb => cb.value);
}

function filterContracts() {
    let data = [...MockData.contracts];
    const cid = document.getElementById('filterContractCustomer').value.trim();
    const expire = document.getElementById('filterContractExpire').value;
    const validity = document.getElementById('filterContractValidity').value;
    const audit = document.getElementById('filterContractAudit').value;
    if (cid) { const ids = cid.split(',').map(s=>s.trim()); data = data.filter(c => ids.some(id => c.customerId.includes(id))); }
    if (expire) data = data.filter(c => c.contractExpire <= expire);
    if (validity) data = data.filter(c => c.validity === validity);
    if (audit) data = data.filter(c => c.auditStatus === audit);
    renderContractTable(data);
    showToast(`查询到 ${data.length} 条记录`, 'info');
}

function resetContractFilter() {
    document.getElementById('filterContractCustomer').value = '';
    document.getElementById('filterContractExpire').value = '';
    document.getElementById('filterContractValidity').value = '';
    document.getElementById('filterContractAudit').value = '';
    renderContractTable(MockData.contracts);
}

function showContractForm(customerId) {
    const isEdit = !!customerId;
    const c = isEdit ? MockData.contracts.find(x => x.customerId === customerId) : {};
    openModal(isEdit ? '修改合同' : '新增合同', `
        <div class="form-grid">
            <div class="form-group"><label class="form-label">客户号 <span class="required">*</span></label>
                <input class="form-input" id="formCustomerId" value="${c.customerId||''}" ${isEdit?'readonly style="background:#eee"':''}></div>
            <div class="form-group"><label class="form-label">客户名称</label>
                <input class="form-input" id="formCustomerName" value="${c.customerName||''}" readonly style="background:#eee" placeholder="保存时自动带出"></div>
            <div class="form-group"><label class="form-label">合同到期 <span class="required">*</span></label>
                <input class="form-input" type="date" id="formContractExpire" value="${c.contractExpire||''}"></div>
            <div class="form-group"><label class="form-label">有效性</label>
                <input class="form-input" value="${c.validity||'自动判断'}" readonly style="background:#eee"></div>
        </div>`, () => {
        showToast(isEdit ? '合同修改成功（审核状态已重置为未审核）' : '合同新增成功', 'success');
    });
}

// ===== Skill 1: 单个审核（通过/驳回 + 意见） =====
function auditContract(customerId) {
    const c = MockData.contracts.find(x => x.customerId === customerId);
    if (!c) return;
    if (c.auditStatus === '已审核') { showToast('该合同已审核', 'info'); return; }
    openModal(`审核合同 - ${customerId}`, `
        <div style="padding:8px 0">
            <div style="margin-bottom:16px;padding:12px;background:#f8f9fa;border-radius:8px">
                <div style="font-weight:600;margin-bottom:6px">${c.customerName} (${c.customerId})</div>
                <div style="font-size:12px;color:var(--text-muted)">合同到期：${c.contractExpire} | 有效性：${c.validity==='Y'?'有效':'无效'}</div>
            </div>
            <div class="form-group" style="margin-bottom:14px">
                <label class="form-label">审核结果 <span class="required">*</span></label>
                <div style="display:flex;gap:12px;margin-top:6px">
                    <label style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:8px 16px;border:2px solid var(--success);border-radius:8px;color:var(--success);font-weight:600">
                        <input type="radio" name="auditResult" value="通过" checked style="accent-color:var(--success)"> <i class="fas fa-check-circle"></i> 通过
                    </label>
                    <label style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:8px 16px;border:2px solid var(--danger);border-radius:8px;color:var(--danger);font-weight:600">
                        <input type="radio" name="auditResult" value="驳回" style="accent-color:var(--danger)"> <i class="fas fa-times-circle"></i> 驳回
                    </label>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">审核意见</label>
                <textarea class="form-input" id="auditRemark" rows="3" placeholder="请输入审核意见..." style="resize:vertical"></textarea>
            </div>
        </div>
    `, () => {
        const result = document.querySelector('input[name="auditResult"]:checked').value;
        const remark = document.getElementById('auditRemark').value.trim();
        const now = new Date().toLocaleString('zh-CN', {hour12:false}).replace(/\//g,'-');
        // Update contract
        c.auditStatus = result === '通过' ? '已审核' : '未审核';
        c.auditor = '管理员';
        c.auditTime = now;
        // Log
        MockData.auditLogs.push({
            id: MockData.auditLogs.length + 1, time: now, operator: '管理员',
            action: result === '通过' ? '审核通过' : '审核驳回', targetType: '合同', targetId: customerId, remark
        });
        renderContractTable(MockData.contracts);
        showToast(`合同 ${customerId} ${result === '通过' ? '审核通过' : '已驳回'}`, result === '通过' ? 'success' : 'error');
    });
}

// ===== Skill 1: 批量审核 =====
function batchAuditContracts() {
    const ids = getSelectedContractIds();
    if (ids.length === 0) { showToast('请先选择要审核的合同', 'error'); return; }
    const unaudited = ids.filter(id => { const c = MockData.contracts.find(x=>x.customerId===id); return c && c.auditStatus !== '已审核'; });
    openModal(`批量审核 (${ids.length} 条)`, `
        <div style="padding:8px 0">
            <div style="margin-bottom:12px;font-size:13px;color:var(--text-secondary)">
                已选择 <b>${ids.length}</b> 条合同，其中 <b style="color:var(--warning)">${unaudited.length}</b> 条待审核
                ${unaudited.length < ids.length ? `<br><span style="font-size:12px;color:var(--text-muted)">已审核的 ${ids.length - unaudited.length} 条将跳过</span>` : ''}
            </div>
            <div style="margin-bottom:12px;max-height:120px;overflow:auto;background:#f8f9fa;border-radius:8px;padding:10px">
                ${ids.map(id => {const c=MockData.contracts.find(x=>x.customerId===id); return `<div style="font-size:12px;padding:3px 0"><b>${id}</b> - ${c?c.customerName:''} <span class="status-badge ${c&&c.auditStatus==='已审核'?'success':'warning'}" style="font-size:10px">${c?c.auditStatus:''}</span></div>`}).join('')}
            </div>
            <div class="form-group" style="margin-bottom:14px">
                <label class="form-label">批量审核结果 <span class="required">*</span></label>
                <div style="display:flex;gap:12px;margin-top:6px">
                    <label style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:8px 16px;border:2px solid var(--success);border-radius:8px;color:var(--success);font-weight:600">
                        <input type="radio" name="batchAuditResult" value="通过" checked style="accent-color:var(--success)"> <i class="fas fa-check-circle"></i> 全部通过
                    </label>
                    <label style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:8px 16px;border:2px solid var(--danger);border-radius:8px;color:var(--danger);font-weight:600">
                        <input type="radio" name="batchAuditResult" value="驳回" style="accent-color:var(--danger)"> <i class="fas fa-times-circle"></i> 全部驳回
                    </label>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">审核意见</label>
                <textarea class="form-input" id="batchAuditRemark" rows="2" placeholder="请输入审核意见..." style="resize:vertical"></textarea>
            </div>
        </div>
    `, () => {
        const result = document.querySelector('input[name="batchAuditResult"]:checked').value;
        const remark = document.getElementById('batchAuditRemark').value.trim();
        const now = new Date().toLocaleString('zh-CN', {hour12:false}).replace(/\//g,'-');
        let count = 0;
        unaudited.forEach(id => {
            const c = MockData.contracts.find(x => x.customerId === id);
            if (c) {
                c.auditStatus = result === '通过' ? '已审核' : '未审核';
                c.auditor = '管理员'; c.auditTime = now;
                MockData.auditLogs.push({
                    id: MockData.auditLogs.length + 1, time: now, operator: '管理员',
                    action: result === '通过' ? '审核通过' : '审核驳回', targetType: '合同', targetId: id, remark
                });
                count++;
            }
        });
        renderContractTable(MockData.contracts);
        document.getElementById('contractCheckAll').checked = false;
        updateBatchBtn();
        showToast(`批量审核完成：${count} 条${result === '通过' ? '通过' : '驳回'}`, 'success');
    });
}

// ===== Skill 1: 审核日志查看 =====
function showAuditLogs(type) {
    const logs = type ? MockData.auditLogs.filter(l => l.targetType === type) : MockData.auditLogs;
    openModal(`审核操作日志${type ? ` - ${type}` : ''}`, `
        <div class="table-container" style="max-height:400px;overflow:auto"><table><thead><tr>
            <th>时间</th><th>操作人</th><th>操作</th><th>类型</th><th>目标ID</th><th>备注</th>
        </tr></thead><tbody>
        ${logs.length === 0 ? '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:20px">暂无日志</td></tr>' :
        logs.slice().reverse().map(l => `<tr>
            <td style="font-size:12px;white-space:nowrap">${l.time}</td><td>${l.operator}</td>
            <td><span class="status-badge ${l.action.includes('通过')?'success':'danger'}">${l.action}</span></td>
            <td>${l.targetType}</td><td style="font-weight:600">${l.targetId}</td><td>${l.remark||'-'}</td>
        </tr>`).join('')}
        </tbody></table></div>
    `, null, `<button class="btn btn-secondary" onclick="closeModal()">关闭</button>`);
}

// ===== Skill 2: 合同详情（含二级信息CRUD） =====
function showContractDetail(customerId) {
    const c = MockData.contracts.find(x => x.customerId === customerId);
    if (!c) return;
    window._contractDetailCustomerId = customerId;
    const pickups = MockData.pickupAddresses.filter(p => p.customerId === customerId);
    const deliveries = MockData.deliveryAddresses.filter(d => d.customerId === customerId);
    const settles = MockData.settlements.filter(s => s.customerId === customerId);

    openModal(`客户详情 - ${c.customerName} (${c.customerId})`, `
        <div class="tabs" id="contractDetailTabs">
            <div class="tab active" onclick="switchContractTab('pickup')">提货信息 (${pickups.length})</div>
            <div class="tab" onclick="switchContractTab('delivery')">送货信息 (${deliveries.length})</div>
            <div class="tab" onclick="switchContractTab('settle')">结算信息 (${settles.length})</div>
        </div>
        <div id="contractTabContent">
            ${renderPickupTable(pickups, customerId)}
        </div>
    `, null, `<button class="btn btn-secondary" onclick="closeModal()">关闭</button>`);

    window._contractDetailData = { pickups, deliveries, settles };
}

function switchContractTab(tab) {
    document.querySelectorAll('#contractDetailTabs .tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    const cid = window._contractDetailCustomerId;
    const content = document.getElementById('contractTabContent');
    // Refresh data
    const pickups = MockData.pickupAddresses.filter(p => p.customerId === cid);
    const deliveries = MockData.deliveryAddresses.filter(d => d.customerId === cid);
    const settles = MockData.settlements.filter(s => s.customerId === cid);
    if (tab === 'pickup') content.innerHTML = renderPickupTable(pickups, cid);
    else if (tab === 'delivery') content.innerHTML = renderDeliveryTable(deliveries, cid);
    else content.innerHTML = renderSettleTable(settles, cid);
}

function renderPickupTable(data, customerId) {
    return `<div style="display:flex;justify-content:flex-end;margin-bottom:8px">
        <button class="btn btn-sm btn-primary" onclick="editSubInfo('pickup',null,'${customerId}')"><i class="fas fa-plus"></i> 新增提货点</button>
    </div>
    <div class="table-container" style="max-height:300px;overflow:auto"><table><thead><tr>
        <th>ID</th><th>联系人</th><th>电话</th><th>提货点</th><th>省份</th><th>城市</th><th>区县</th><th>乡镇</th><th>备注</th><th>操作</th>
    </tr></thead><tbody>${data.map(p => `<tr><td>${p.id}</td><td>${p.contactPerson}</td><td>${p.phone}</td><td>${p.pickupName}</td><td>${p.province}</td><td>${p.city}</td><td>${p.district}</td><td>${p.town}</td><td>${p.remark||'-'}</td>
    <td><div class="btn-group">
        <button class="btn btn-sm btn-secondary" onclick="editSubInfo('pickup',${p.id},'${customerId}')"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-danger" onclick="deleteSubInfo('pickup',${p.id},'${customerId}')"><i class="fas fa-trash"></i></button>
    </div></td></tr>`).join('')}</tbody></table></div>`;
}
function renderDeliveryTable(data, customerId) {
    return `<div style="display:flex;justify-content:flex-end;margin-bottom:8px">
        <button class="btn btn-sm btn-primary" onclick="editSubInfo('delivery',null,'${customerId}')"><i class="fas fa-plus"></i> 新增送货点</button>
    </div>
    <div class="table-container" style="max-height:300px;overflow:auto"><table><thead><tr>
        <th>ID</th><th>联系人</th><th>电话</th><th>省份</th><th>城市</th><th>区县</th><th>乡镇</th><th>详细地址</th><th>操作</th>
    </tr></thead><tbody>${data.map(d => `<tr><td>${d.id}</td><td>${d.contactPerson}</td><td>${d.phone}</td><td>${d.province}</td><td>${d.city}</td><td>${d.district}</td><td>${d.town}</td><td>${d.detailAddress}</td>
    <td><div class="btn-group">
        <button class="btn btn-sm btn-secondary" onclick="editSubInfo('delivery',${d.id},'${customerId}')"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-danger" onclick="deleteSubInfo('delivery',${d.id},'${customerId}')"><i class="fas fa-trash"></i></button>
    </div></td></tr>`).join('')}</tbody></table></div>`;
}
function renderSettleTable(data, customerId) {
    return `<div style="display:flex;justify-content:flex-end;margin-bottom:8px">
        <button class="btn btn-sm btn-primary" onclick="editSubInfo('settle',null,'${customerId}')"><i class="fas fa-plus"></i> 新增结算</button>
    </div>
    <div class="table-container" style="max-height:300px;overflow:auto"><table><thead><tr>
        <th>ID</th><th>产品属性</th><th>结算方式</th><th>车型</th><th>单价</th><th>操作</th>
    </tr></thead><tbody>${data.map(s => `<tr><td>${s.id}</td><td>${s.productAttr}</td><td>${s.settleMethod}</td><td>${s.vehicleType||'-'}</td><td>${formatCurrency(s.unitPrice)}</td>
    <td><div class="btn-group">
        <button class="btn btn-sm btn-secondary" onclick="editSubInfo('settle',${s.id},'${customerId}')"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-danger" onclick="deleteSubInfo('settle',${s.id},'${customerId}')"><i class="fas fa-trash"></i></button>
    </div></td></tr>`).join('')}</tbody></table></div>`;
}

// ===== Skill 2: 新增/编辑二级信息 =====
function editSubInfo(type, id, customerId) {
    const isEdit = id !== null;
    let title, formHTML;
    if (type === 'pickup') {
        const item = isEdit ? MockData.pickupAddresses.find(x => x.id === id) : {};
        title = isEdit ? '编辑提货点' : '新增提货点';
        formHTML = `<div class="form-grid">
            <div class="form-group"><label class="form-label">提货点名称 <span class="required">*</span></label><input class="form-input" id="subInfoName" value="${item.pickupName||''}"></div>
            <div class="form-group"><label class="form-label">联系人 <span class="required">*</span></label><input class="form-input" id="subInfoContact" value="${item.contactPerson||''}"></div>
            <div class="form-group"><label class="form-label">电话 <span class="required">*</span></label><input class="form-input" id="subInfoPhone" value="${item.phone||''}"></div>
            <div class="form-group"><label class="form-label">省份</label><input class="form-input" id="subInfoProvince" value="${item.province||'浙江省'}"></div>
            <div class="form-group"><label class="form-label">城市</label><input class="form-input" id="subInfoCity" value="${item.city||'温州市'}"></div>
            <div class="form-group"><label class="form-label">区县</label><input class="form-input" id="subInfoDistrict" value="${item.district||''}"></div>
            <div class="form-group"><label class="form-label">乡镇</label><input class="form-input" id="subInfoTown" value="${item.town||''}"></div>
            <div class="form-group"><label class="form-label">详细地址</label><input class="form-input" id="subInfoDetail" value="${item.detailAddress||''}"></div>
            <div class="form-group full"><label class="form-label">备注</label><input class="form-input" id="subInfoRemark" value="${item.remark||''}"></div>
        </div>`;
    } else if (type === 'delivery') {
        const item = isEdit ? MockData.deliveryAddresses.find(x => x.id === id) : {};
        title = isEdit ? '编辑送货点' : '新增送货点';
        formHTML = `<div class="form-grid">
            <div class="form-group"><label class="form-label">联系人 <span class="required">*</span></label><input class="form-input" id="subInfoContact" value="${item.contactPerson||''}"></div>
            <div class="form-group"><label class="form-label">电话 <span class="required">*</span></label><input class="form-input" id="subInfoPhone" value="${item.phone||''}"></div>
            <div class="form-group"><label class="form-label">省份</label><input class="form-input" id="subInfoProvince" value="${item.province||'浙江省'}"></div>
            <div class="form-group"><label class="form-label">城市</label><input class="form-input" id="subInfoCity" value="${item.city||'温州市'}"></div>
            <div class="form-group"><label class="form-label">区县</label><input class="form-input" id="subInfoDistrict" value="${item.district||''}"></div>
            <div class="form-group"><label class="form-label">乡镇</label><input class="form-input" id="subInfoTown" value="${item.town||''}"></div>
            <div class="form-group full"><label class="form-label">详细地址 <span class="required">*</span></label><input class="form-input" id="subInfoDetail" value="${item.detailAddress||''}"></div>
            <div class="form-group full"><label class="form-label">备注</label><input class="form-input" id="subInfoRemark" value="${item.remark||''}"></div>
        </div>`;
    } else {
        const item = isEdit ? MockData.settlements.find(x => x.id === id) : {};
        title = isEdit ? '编辑结算信息' : '新增结算信息';
        formHTML = `<div class="form-grid">
            <div class="form-group"><label class="form-label">产品属性 <span class="required">*</span></label>
                <select class="form-select" id="subInfoAttr">${MockData.productAttrs.map(a => `<option value="${a.value}" ${a.value===item.productAttr?'selected':''}>${a.label}</option>`).join('')}</select></div>
            <div class="form-group"><label class="form-label">结算方式 <span class="required">*</span></label>
                <select class="form-select" id="subInfoMethod">${MockData.settleMethods.map(m => `<option ${m===item.settleMethod?'selected':''}>${m}</option>`).join('')}</select></div>
            <div class="form-group"><label class="form-label">车型</label>
                <select class="form-select" id="subInfoVehicle"><option value="">-</option>${MockData.vehicleTypes.map(v => `<option ${v===item.vehicleType?'selected':''}>${v}</option>`).join('')}</select></div>
            <div class="form-group"><label class="form-label">单价 <span class="required">*</span></label><input class="form-input" type="number" id="subInfoPrice" value="${item.unitPrice||''}"></div>
        </div>`;
    }

    openModal(title, formHTML, () => {
        // Validation
        if (type === 'pickup') {
            if (!document.getElementById('subInfoName').value.trim()) { showToast('请输入提货点名称','error'); return; }
            if (!document.getElementById('subInfoContact').value.trim()) { showToast('请输入联系人','error'); return; }
        } else if (type === 'delivery') {
            if (!document.getElementById('subInfoContact').value.trim()) { showToast('请输入联系人','error'); return; }
            if (!document.getElementById('subInfoDetail').value.trim()) { showToast('请输入详细地址','error'); return; }
        } else {
            if (!document.getElementById('subInfoPrice').value) { showToast('请输入单价','error'); return; }
        }

        if (type === 'pickup') {
            const arr = MockData.pickupAddresses;
            if (isEdit) {
                const item = arr.find(x => x.id === id);
                item.pickupName = document.getElementById('subInfoName').value.trim();
                item.contactPerson = document.getElementById('subInfoContact').value.trim();
                item.phone = document.getElementById('subInfoPhone').value.trim();
                item.province = document.getElementById('subInfoProvince').value.trim();
                item.city = document.getElementById('subInfoCity').value.trim();
                item.district = document.getElementById('subInfoDistrict').value.trim();
                item.town = document.getElementById('subInfoTown').value.trim();
                item.detailAddress = document.getElementById('subInfoDetail').value.trim();
                item.remark = document.getElementById('subInfoRemark').value.trim();
            } else {
                arr.push({
                    id: Math.max(0,...arr.map(x=>x.id))+1, customerId,
                    contactPerson: document.getElementById('subInfoContact').value.trim(),
                    phone: document.getElementById('subInfoPhone').value.trim(),
                    pickupName: document.getElementById('subInfoName').value.trim(),
                    province: document.getElementById('subInfoProvince').value.trim(),
                    city: document.getElementById('subInfoCity').value.trim(),
                    district: document.getElementById('subInfoDistrict').value.trim(),
                    town: document.getElementById('subInfoTown').value.trim(),
                    detailAddress: document.getElementById('subInfoDetail').value.trim(),
                    remark: document.getElementById('subInfoRemark').value.trim(),
                    creator: '管理员', createTime: new Date().toISOString().split('T')[0]
                });
            }
        } else if (type === 'delivery') {
            const arr = MockData.deliveryAddresses;
            if (isEdit) {
                const item = arr.find(x => x.id === id);
                item.contactPerson = document.getElementById('subInfoContact').value.trim();
                item.phone = document.getElementById('subInfoPhone').value.trim();
                item.province = document.getElementById('subInfoProvince').value.trim();
                item.city = document.getElementById('subInfoCity').value.trim();
                item.district = document.getElementById('subInfoDistrict').value.trim();
                item.town = document.getElementById('subInfoTown').value.trim();
                item.detailAddress = document.getElementById('subInfoDetail').value.trim();
                item.remark = document.getElementById('subInfoRemark').value.trim();
            } else {
                arr.push({
                    id: Math.max(0,...arr.map(x=>x.id))+1, customerId,
                    contactPerson: document.getElementById('subInfoContact').value.trim(),
                    phone: document.getElementById('subInfoPhone').value.trim(),
                    province: document.getElementById('subInfoProvince').value.trim(),
                    city: document.getElementById('subInfoCity').value.trim(),
                    district: document.getElementById('subInfoDistrict').value.trim(),
                    town: document.getElementById('subInfoTown').value.trim(),
                    detailAddress: document.getElementById('subInfoDetail').value.trim(),
                    remark: document.getElementById('subInfoRemark').value.trim(),
                    creator: '管理员', createTime: new Date().toISOString().split('T')[0]
                });
            }
        } else {
            const arr = MockData.settlements;
            if (isEdit) {
                const item = arr.find(x => x.id === id);
                item.productAttr = document.getElementById('subInfoAttr').value;
                item.settleMethod = document.getElementById('subInfoMethod').value;
                item.vehicleType = document.getElementById('subInfoVehicle').value;
                item.unitPrice = parseFloat(document.getElementById('subInfoPrice').value);
            } else {
                arr.push({
                    id: Math.max(0,...arr.map(x=>x.id))+1, customerId,
                    productAttr: document.getElementById('subInfoAttr').value,
                    settleMethod: document.getElementById('subInfoMethod').value,
                    vehicleType: document.getElementById('subInfoVehicle').value,
                    unitPrice: parseFloat(document.getElementById('subInfoPrice').value),
                    creator: '管理员', createTime: new Date().toISOString().split('T')[0]
                });
            }
        }
        showToast(`${isEdit?'修改':'新增'}成功`, 'success');
        // Refresh detail view
        showContractDetail(customerId);
    });
}

// ===== Skill 2: 删除二级信息 =====
function deleteSubInfo(type, id, customerId) {
    openModal('确认删除', `<p style="padding:10px 0">确认删除此条记录？<br><span style="font-size:12px;color:var(--text-muted)">删除后不可恢复</span></p>`, () => {
        let arr;
        if (type === 'pickup') arr = MockData.pickupAddresses;
        else if (type === 'delivery') arr = MockData.deliveryAddresses;
        else arr = MockData.settlements;
        const idx = arr.findIndex(x => x.id === id);
        if (idx > -1) arr.splice(idx, 1);
        showToast('删除成功', 'success');
        showContractDetail(customerId);
    });
}

function deleteContract(customerId) {
    showToast(`合同 ${customerId} 已删除（演示）`, 'error');
}
