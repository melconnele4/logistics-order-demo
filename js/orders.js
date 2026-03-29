/* ============================================
   订单管理页面
   ============================================ */

function renderOrders(container) {
    container.innerHTML = `
    <div class="page-header">
        <div class="page-header-left"><h1>订单管理</h1><p>查询审核商务订单，管理订单全生命周期</p></div>
        <div class="btn-group">
            <button class="btn btn-secondary" onclick="showToast('导入功能演示','info')"><i class="fas fa-file-import"></i> 导入</button>
            <button class="btn btn-secondary" onclick="showToast('导出成功','success')"><i class="fas fa-file-export"></i> 导出</button>
        </div>
    </div>
    <div class="filter-bar">
        <div class="filter-group"><label>始发机构</label><select id="filterOrderOrg"><option value="">全部</option>${MockData.tmsOrgs.map(o=>`<option value="${o}">${o}</option>`).join('')}</select></div>
        <div class="filter-group"><label>送达日期</label><input type="date" id="filterOrderDate" value="2026-03-30"></div>
        <div class="filter-group"><label>客户号</label><input type="text" id="filterOrderCustomer" placeholder="多客户用,分隔"></div>
        <div class="filter-group"><label>审核状态</label><select id="filterOrderAudit"><option value="">全部</option><option value="已审核">已审核</option><option value="待审核">待审核</option></select></div>
        <button class="btn btn-primary" onclick="filterOrders()"><i class="fas fa-search"></i> 查询</button>
        <button class="btn btn-secondary" onclick="resetOrderFilter()"><i class="fas fa-redo"></i> 重置</button>
    </div>
    <div class="card">
        <div class="card-header"><h3>订单列表</h3><span style="font-size:12px;color:var(--text-muted)">共 <b id="orderCount">${MockData.orders.length}</b> 条</span></div>
        <div class="card-body"><div class="table-container"><table><thead><tr>
            <th>单号</th><th>中转</th><th>发货客户</th><th>送达日期</th><th>审核状态</th><th>属性</th>
            <th>线路号</th><th>始发机构</th><th>数量</th><th>重量(kg)</th><th>体积(m³)</th><th>收入</th><th>操作</th>
        </tr></thead><tbody id="orderTableBody"></tbody></table></div></div>
    </div>`;
    renderOrderTable(MockData.orders);
}

function renderOrderTable(data) {
    const tbody = document.getElementById('orderTableBody');
    if (!tbody) return;
    const countEl = document.getElementById('orderCount');
    if (countEl) countEl.textContent = data.length;
    const attrColors = { CW: 'info', LC: 'success', LD: 'muted' };
    const attrLabels = { CW: '常温', LC: '冷藏', LD: '冷冻' };
    tbody.innerHTML = data.map(o => `<tr>
        <td><a href="#" onclick="showOrderDetail('${o.orderNo}');return false" style="color:var(--primary);font-weight:600">${o.orderNo}</a></td>
        <td>${o.isTransfer?'<span class="status-badge info">是</span>':'<span style="color:var(--text-muted)">否</span>'}</td>
        <td>${o.senderName}<br><span style="font-size:11px;color:var(--text-muted)">${o.senderId}</span></td>
        <td>${o.deliveryDate}</td>
        <td><span class="status-badge ${o.auditStatus==='已审核'?'success':'warning'}">${o.auditStatus}</span></td>
        <td><span class="status-badge ${attrColors[o.productAttr]||'muted'}">${attrLabels[o.productAttr]||o.productAttr}</span></td>
        <td>${o.routeNo||'<span style="color:var(--text-muted)">-</span>'}</td>
        <td>${o.originOrg}</td>
        <td>${formatNumber(o.quantity)}</td><td>${formatNumber(o.weight)}</td><td>${o.volume}</td>
        <td style="font-weight:600;color:var(--primary)">${formatCurrency(o.revenue)}</td>
        <td><div class="btn-group">
            <button class="btn btn-sm btn-secondary" onclick="showOrderEdit('${o.orderNo}')"><i class="fas fa-edit"></i></button>
            ${o.auditStatus==='待审核'?`<button class="btn btn-sm btn-success" onclick="auditOrder('${o.orderNo}')"><i class="fas fa-check"></i> 审核</button>`:''}
            <button class="btn btn-sm btn-danger" onclick="showToast('订单已删除（演示）','error')"><i class="fas fa-trash"></i></button>
        </div></td>
    </tr>`).join('');
}

function filterOrders() {
    let data = [...MockData.orders];
    const org = document.getElementById('filterOrderOrg').value;
    const date = document.getElementById('filterOrderDate').value;
    const cid = document.getElementById('filterOrderCustomer').value.trim();
    const audit = document.getElementById('filterOrderAudit').value;
    if (org) data = data.filter(o => o.originOrg === org);
    if (date) data = data.filter(o => o.deliveryDate === date);
    if (cid) { const ids = cid.split(',').map(s=>s.trim()); data = data.filter(o => ids.some(id => o.senderId.includes(id)||o.receiverId.includes(id))); }
    if (audit) data = data.filter(o => o.auditStatus === audit);
    renderOrderTable(data);
    showToast(`查询到 ${data.length} 条订单`, 'info');
}

function resetOrderFilter() {
    document.getElementById('filterOrderOrg').value = '';
    document.getElementById('filterOrderDate').value = '';
    document.getElementById('filterOrderCustomer').value = '';
    document.getElementById('filterOrderAudit').value = '';
    renderOrderTable(MockData.orders);
}

function showOrderDetail(orderNo) {
    const o = MockData.orders.find(x => x.orderNo === orderNo);
    if (!o) return;
    const transfers = MockData.transferPoints.filter(t => t.orderNo === orderNo);
    openModal(`订单详情 - ${orderNo}`, `
        <div class="form-grid">
            <div class="form-group"><label class="form-label">单号</label><div style="padding:8px 0;font-weight:600">${o.orderNo}</div></div>
            <div class="form-group"><label class="form-label">审核状态</label><div style="padding:8px 0"><span class="status-badge ${o.auditStatus==='已审核'?'success':'warning'}">${o.auditStatus}</span></div></div>
            <div class="form-group"><label class="form-label">发货客户</label><div style="padding:8px 0">${o.senderName} (${o.senderId})</div></div>
            <div class="form-group"><label class="form-label">收货客户</label><div style="padding:8px 0">${o.receiverName} (${o.receiverId})</div></div>
            <div class="form-group"><label class="form-label">送达日期</label><div style="padding:8px 0">${o.deliveryDate}</div></div>
            <div class="form-group"><label class="form-label">产品属性</label><div style="padding:8px 0">${o.productAttr}</div></div>
            <div class="form-group"><label class="form-label">数量</label><div style="padding:8px 0">${o.quantity}</div></div>
            <div class="form-group"><label class="form-label">重量</label><div style="padding:8px 0">${o.weight} kg</div></div>
            <div class="form-group"><label class="form-label">体积</label><div style="padding:8px 0">${o.volume} m³</div></div>
            <div class="form-group"><label class="form-label">总运费</label><div style="padding:8px 0;font-weight:700;color:var(--primary)">${formatCurrency(o.totalFreight)}</div></div>
            ${o.remark?`<div class="form-group full"><label class="form-label">备注</label><div style="padding:8px 0">${o.remark}</div></div>`:''}
        </div>
        ${transfers.length?`
        <h4 style="margin:20px 0 10px;font-size:14px">中转点信息</h4>
        <div class="table-container"><table><thead><tr><th>序号</th><th>中转点仓</th><th>运单号</th><th>运费</th></tr></thead>
        <tbody>${transfers.map(t=>`<tr><td>${t.seq}</td><td>${t.warehouse}</td><td>${t.waybillNo||'-'}</td><td>${formatCurrency(t.freight)}</td></tr>`).join('')}</tbody></table></div>`:''}
    `, null, `<button class="btn btn-secondary" onclick="closeModal()">关闭</button>`);
}

function showOrderEdit(orderNo) {
    const o = MockData.orders.find(x => x.orderNo === orderNo);
    if (!o) return;
    openModal(`修改订单 - ${orderNo}`, `
        <div class="form-grid">
            <div class="form-group"><label class="form-label">送达日期</label><input class="form-input" type="date" value="${o.deliveryDate}"></div>
            <div class="form-group"><label class="form-label">属性</label><select class="form-select">${MockData.productAttrs.map(a=>`<option ${a.value===o.productAttr?'selected':''}>${a.label}</option>`).join('')}</select></div>
            <div class="form-group"><label class="form-label">线路号</label><input class="form-input" value="${o.routeNo}"></div>
            <div class="form-group"><label class="form-label">始发机构</label><select class="form-select">${MockData.tmsOrgs.map(org=>`<option ${org===o.originOrg?'selected':''}>${org}</option>`).join('')}</select></div>
            <div class="form-group"><label class="form-label">收入金额</label><input class="form-input" type="number" value="${o.revenue}"></div>
            <div class="form-group"><label class="form-label">备注</label><input class="form-input" value="${o.remark}"></div>
        </div>`, () => showToast('订单修改保存成功', 'success'));
}

function auditOrder(orderNo) {
    openModal('审核确认', `<p style="padding:10px 0">确认审核订单 <b>${orderNo}</b>？<br><span style="color:var(--text-muted);font-size:13px">审核通过后将自动传送TMS系统生成三方入库单</span></p>`, () => {
        showToast(`订单 ${orderNo} 审核通过，已传TMS`, 'success');
    });
}
