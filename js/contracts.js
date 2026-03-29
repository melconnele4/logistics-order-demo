/* ============================================
   客户合同管理页面
   ============================================ */

function renderContracts(container) {
    container.innerHTML = `
    <div class="page-header">
        <div class="page-header-left"><h1>客户合同管理</h1><p>管理客户合同信息、提货/送货地址、结算方式</p></div>
        <div class="btn-group">
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
        <td><a href="#" onclick="showContractDetail('${c.customerId}');return false" style="color:var(--primary);font-weight:600">${c.customerId}</a></td>
        <td>${c.customerName}</td><td>${c.contractExpire}</td>
        <td><span class="status-badge ${c.validity==='Y'?'success':'danger'}">${c.validity==='Y'?'有效':'无效'}</span></td>
        <td><span class="status-badge ${c.auditStatus==='已审核'?'success':'warning'}">${c.auditStatus}</span></td>
        <td>${c.auditor||'-'}</td><td>${c.auditTime||'-'}</td><td>${c.creator}</td><td>${c.createTime}</td>
        <td><div class="btn-group">
            <button class="btn btn-sm btn-secondary" onclick="showContractForm('${c.customerId}')"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-success" onclick="auditContract('${c.customerId}')"><i class="fas fa-check"></i></button>
            <button class="btn btn-sm btn-danger" onclick="deleteContract('${c.customerId}')"><i class="fas fa-trash"></i></button>
        </div></td>
    </tr>`).join('');
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

function showContractDetail(customerId) {
    const c = MockData.contracts.find(x => x.customerId === customerId);
    if (!c) return;
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
            ${renderPickupTable(pickups)}
        </div>
    `, null, `<button class="btn btn-secondary" onclick="closeModal()">关闭</button>`);

    window._contractDetailData = { pickups, deliveries, settles };
}

function switchContractTab(tab) {
    document.querySelectorAll('#contractDetailTabs .tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    const d = window._contractDetailData;
    const content = document.getElementById('contractTabContent');
    if (tab === 'pickup') content.innerHTML = renderPickupTable(d.pickups);
    else if (tab === 'delivery') content.innerHTML = renderDeliveryTable(d.deliveries);
    else content.innerHTML = renderSettleTable(d.settles);
}

function renderPickupTable(data) {
    return `<div class="table-container" style="max-height:300px;overflow:auto"><table><thead><tr>
        <th>ID</th><th>联系人</th><th>电话</th><th>提货点</th><th>省份</th><th>城市</th><th>区县</th><th>乡镇</th><th>备注</th>
    </tr></thead><tbody>${data.map(p => `<tr><td>${p.id}</td><td>${p.contactPerson}</td><td>${p.phone}</td><td>${p.pickupName}</td><td>${p.province}</td><td>${p.city}</td><td>${p.district}</td><td>${p.town}</td><td>${p.remark||'-'}</td></tr>`).join('')}</tbody></table></div>`;
}
function renderDeliveryTable(data) {
    return `<div class="table-container" style="max-height:300px;overflow:auto"><table><thead><tr>
        <th>ID</th><th>联系人</th><th>电话</th><th>省份</th><th>城市</th><th>区县</th><th>乡镇</th><th>详细地址</th>
    </tr></thead><tbody>${data.map(d => `<tr><td>${d.id}</td><td>${d.contactPerson}</td><td>${d.phone}</td><td>${d.province}</td><td>${d.city}</td><td>${d.district}</td><td>${d.town}</td><td>${d.detailAddress}</td></tr>`).join('')}</tbody></table></div>`;
}
function renderSettleTable(data) {
    return `<div class="table-container" style="max-height:300px;overflow:auto"><table><thead><tr>
        <th>ID</th><th>产品属性</th><th>结算方式</th><th>车型</th><th>单价</th>
    </tr></thead><tbody>${data.map(s => `<tr><td>${s.id}</td><td>${s.productAttr}</td><td>${s.settleMethod}</td><td>${s.vehicleType||'-'}</td><td>${formatCurrency(s.unitPrice)}</td></tr>`).join('')}</tbody></table></div>`;
}

function auditContract(customerId) {
    showToast(`合同 ${customerId} 审核通过`, 'success');
}
function deleteContract(customerId) {
    showToast(`合同 ${customerId} 已删除（演示）`, 'error');
}
