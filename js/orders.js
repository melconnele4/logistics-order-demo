/* ============================================
   订单管理页面
   Skill 3: 中转标识+中转信息
   Skill 4: 审核字段校验
   Skill 5: 可编辑字段控制+修改记录
   ============================================ */

function renderOrders(container) {
    container.innerHTML = `
    <div class="page-header">
        <div class="page-header-left"><h1>订单管理</h1><p>查询审核商务订单，管理订单全生命周期</p></div>
        <div class="btn-group">
            <button class="btn btn-secondary" onclick="showAuditLogs('订单')"><i class="fas fa-history"></i> 审核日志</button>
            <button class="btn btn-secondary" onclick="showOrderModifyLogs()"><i class="fas fa-clipboard-list"></i> 修改日志</button>
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

// ===== 订单详情（含中转信息展示） =====
function showOrderDetail(orderNo) {
    const o = MockData.orders.find(x => x.orderNo === orderNo);
    if (!o) return;
    const transfers = MockData.transferPoints.filter(t => t.orderNo === orderNo);
    const statusColors = { '待发货':'warning', '配送中':'info', '已签收':'success' };
    openModal(`订单详情 - ${orderNo}`, `
        <div class="form-grid">
            <div class="form-group"><label class="form-label">单号</label><div style="padding:8px 0;font-weight:600">${o.orderNo}</div></div>
            <div class="form-group"><label class="form-label">审核状态</label><div style="padding:8px 0"><span class="status-badge ${o.auditStatus==='已审核'?'success':'warning'}">${o.auditStatus}</span></div></div>
            <div class="form-group"><label class="form-label">发货客户</label><div style="padding:8px 0">${o.senderName} (${o.senderId})</div></div>
            <div class="form-group"><label class="form-label">收货客户</label><div style="padding:8px 0">${o.receiverName} (${o.receiverId})</div></div>
            <div class="form-group"><label class="form-label">送达日期</label><div style="padding:8px 0">${o.deliveryDate}</div></div>
            <div class="form-group"><label class="form-label">产品属性</label><div style="padding:8px 0">${o.productAttr}</div></div>
            <div class="form-group"><label class="form-label">是否中转</label><div style="padding:8px 0">${o.isTransfer?'<span class="status-badge info">是</span>':'否'}</div></div>
            <div class="form-group"><label class="form-label">配送状态</label><div style="padding:8px 0"><span class="status-badge ${statusColors[o.deliveryStatus]||'muted'}">${o.deliveryStatus||'未知'}</span></div></div>
            <div class="form-group"><label class="form-label">数量</label><div style="padding:8px 0">${o.quantity}</div></div>
            <div class="form-group"><label class="form-label">重量</label><div style="padding:8px 0">${o.weight} kg</div></div>
            <div class="form-group"><label class="form-label">体积</label><div style="padding:8px 0">${o.volume} m³</div></div>
            <div class="form-group"><label class="form-label">总运费</label><div style="padding:8px 0;font-weight:700;color:var(--primary)">${formatCurrency(o.totalFreight)}</div></div>
            ${o.remark?`<div class="form-group full"><label class="form-label">备注</label><div style="padding:8px 0">${o.remark}</div></div>`:''}
        </div>
        ${transfers.length?`
        <h4 style="margin:20px 0 10px;font-size:14px">中转点信息</h4>
        <div class="table-container"><table><thead><tr><th>序号</th><th>中转点仓</th><th>联系人</th><th>电话</th><th>运单号</th><th>运费</th></tr></thead>
        <tbody>${transfers.map(t=>`<tr><td>${t.seq}</td><td>${t.warehouse}</td><td>${t.contactPerson||'-'}</td><td>${t.phone||'-'}</td><td>${t.waybillNo||'-'}</td><td>${formatCurrency(t.freight)}</td></tr>`).join('')}</tbody></table></div>`:''}
    `, null, `<button class="btn btn-secondary" onclick="closeModal()">关闭</button>`);
}

// ===== Skill 5: 订单编辑（可编辑字段控制 + Skill 3: 中转信息） =====
function showOrderEdit(orderNo) {
    const o = MockData.orders.find(x => x.orderNo === orderNo);
    if (!o) return;
    const transfers = MockData.transferPoints.filter(t => t.orderNo === orderNo);

    openModal(`修改订单 - ${orderNo}`, `
        <div style="margin-bottom:12px;padding:8px 12px;background:#fff3cd;border-left:4px solid var(--warning);border-radius:4px;font-size:12px;color:#856404">
            <i class="fas fa-info-circle" style="margin-right:4px"></i> 灰色字段为只读，仅开放部分字段可修改
        </div>
        <div class="form-grid">
            <!-- 只读字段 -->
            <div class="form-group"><label class="form-label">单号</label><input class="form-input field-readonly" value="${o.orderNo}" readonly></div>
            <div class="form-group"><label class="form-label">发货客户</label><input class="form-input field-readonly" value="${o.senderName} (${o.senderId})" readonly></div>
            <div class="form-group"><label class="form-label">收货客户</label><input class="form-input field-readonly" value="${o.receiverName} (${o.receiverId})" readonly></div>
            <div class="form-group"><label class="form-label">数量</label><input class="form-input field-readonly" value="${o.quantity}" readonly></div>
            <div class="form-group"><label class="form-label">重量(kg)</label><input class="form-input field-readonly" value="${o.weight}" readonly></div>
            <div class="form-group"><label class="form-label">体积(m³)</label><input class="form-input field-readonly" value="${o.volume}" readonly></div>
            <!-- 可编辑字段 -->
            <div class="form-group"><label class="form-label field-editable-label">送达日期 <i class="fas fa-pen" style="font-size:10px;color:var(--primary)"></i></label><input class="form-input field-editable" type="date" id="editDeliveryDate" value="${o.deliveryDate}"></div>
            <div class="form-group"><label class="form-label field-editable-label">属性 <i class="fas fa-pen" style="font-size:10px;color:var(--primary)"></i></label><select class="form-select field-editable" id="editProductAttr">${MockData.productAttrs.map(a=>`<option value="${a.value}" ${a.value===o.productAttr?'selected':''}>${a.label}</option>`).join('')}</select></div>
            <div class="form-group"><label class="form-label field-editable-label">线路号 <i class="fas fa-pen" style="font-size:10px;color:var(--primary)"></i></label><input class="form-input field-editable" id="editRouteNo" value="${o.routeNo}"></div>
            <div class="form-group"><label class="form-label field-editable-label">始发机构 <i class="fas fa-pen" style="font-size:10px;color:var(--primary)"></i></label><select class="form-select field-editable" id="editOriginOrg">${MockData.tmsOrgs.map(org=>`<option ${org===o.originOrg?'selected':''}>${org}</option>`).join('')}</select></div>
            <div class="form-group"><label class="form-label field-editable-label">收入金额 <i class="fas fa-pen" style="font-size:10px;color:var(--primary)"></i></label><input class="form-input field-editable" type="number" id="editRevenue" value="${o.revenue}"></div>
            <div class="form-group"><label class="form-label field-editable-label">备注 <i class="fas fa-pen" style="font-size:10px;color:var(--primary)"></i></label><input class="form-input field-editable" id="editRemark" value="${o.remark}"></div>
        </div>
        <!-- Skill 3: 中转信息 -->
        <div style="margin-top:16px;padding:14px;background:#f8f9fa;border-radius:10px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                <label class="form-label" style="margin:0;font-weight:700">
                    <i class="fas fa-exchange-alt" style="margin-right:6px;color:var(--accent)"></i>是否中转
                </label>
                <label class="switch-toggle">
                    <input type="checkbox" id="editIsTransfer" ${o.isTransfer?'checked':''} onchange="toggleTransferSection()">
                    <span class="switch-slider"></span>
                </label>
            </div>
            <div id="transferSection" style="display:${o.isTransfer?'block':'none'}">
                <div id="transferRows">
                    ${transfers.map((t, i) => renderTransferRow(t, i)).join('')}
                </div>
                <button class="btn btn-sm btn-primary" onclick="addTransferRow()" style="margin-top:8px"><i class="fas fa-plus"></i> 添加中转点</button>
            </div>
        </div>
    `, () => {
        // Skill 5: Save with modification logs
        const changes = [];
        const newDate = document.getElementById('editDeliveryDate').value;
        const newAttr = document.getElementById('editProductAttr').value;
        const newRoute = document.getElementById('editRouteNo').value;
        const newOrg = document.getElementById('editOriginOrg').value;
        const newRevenue = parseFloat(document.getElementById('editRevenue').value) || 0;
        const newRemark = document.getElementById('editRemark').value;
        const newIsTransfer = document.getElementById('editIsTransfer').checked;

        if (newDate !== o.deliveryDate) changes.push({ field:'送达日期', old:o.deliveryDate, new:newDate });
        if (newAttr !== o.productAttr) changes.push({ field:'产品属性', old:o.productAttr, new:newAttr });
        if (newRoute !== o.routeNo) changes.push({ field:'线路号', old:o.routeNo, new:newRoute });
        if (newOrg !== o.originOrg) changes.push({ field:'始发机构', old:o.originOrg, new:newOrg });
        if (newRevenue !== o.revenue) changes.push({ field:'收入金额', old:String(o.revenue), new:String(newRevenue) });
        if (newRemark !== o.remark) changes.push({ field:'备注', old:o.remark, new:newRemark });
        if (newIsTransfer !== o.isTransfer) changes.push({ field:'是否中转', old:o.isTransfer?'是':'否', new:newIsTransfer?'是':'否' });

        // Apply changes
        o.deliveryDate = newDate; o.productAttr = newAttr; o.routeNo = newRoute;
        o.originOrg = newOrg; o.revenue = newRevenue; o.totalFreight = newRevenue;
        o.remark = newRemark; o.isTransfer = newIsTransfer;

        // Skill 3: Save transfer points
        const existingTps = MockData.transferPoints.filter(t => t.orderNo !== orderNo);
        if (newIsTransfer) {
            const rows = document.querySelectorAll('.transfer-row');
            rows.forEach((row, i) => {
                const warehouse = row.querySelector('.tp-warehouse')?.value || '';
                const waybillNo = row.querySelector('.tp-waybill')?.value || '';
                const freight = parseFloat(row.querySelector('.tp-freight')?.value) || 0;
                const contact = row.querySelector('.tp-contact')?.value || '';
                const phone = row.querySelector('.tp-phone')?.value || '';
                if (warehouse) {
                    existingTps.push({
                        id: Math.max(0,...MockData.transferPoints.map(x=>x.id)) + i + 1,
                        orderNo, seq: i+1, warehouse, waybillNo, freight, contactPerson: contact, phone
                    });
                }
            });
        }
        MockData.transferPoints.length = 0;
        existingTps.forEach(t => MockData.transferPoints.push(t));

        // Skill 5: Log modifications
        const now = new Date().toLocaleString('zh-CN',{hour12:false}).replace(/\//g,'-');
        changes.forEach(ch => {
            MockData.orderModifyLogs.push({
                id: MockData.orderModifyLogs.length + 1,
                time: now, operator: '管理员', orderNo,
                field: ch.field, oldValue: ch.old, newValue: ch.new, remark: ''
            });
        });

        renderOrderTable(MockData.orders);
        showToast(`订单保存成功${changes.length ? `，${changes.length} 个字段已修改` : ''}`, 'success');
    });
}

function toggleTransferSection() {
    const checked = document.getElementById('editIsTransfer').checked;
    const section = document.getElementById('transferSection');
    section.style.display = checked ? 'block' : 'none';
    if (checked && document.querySelectorAll('.transfer-row').length === 0) {
        addTransferRow();
    }
}

function renderTransferRow(t, i) {
    return `<div class="transfer-row" style="background:white;padding:10px;border-radius:8px;margin-bottom:8px;border:1px solid #e2e8f0">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <span style="font-weight:600;font-size:12px;color:var(--primary)">中转点 #${i+1}</span>
            <button class="btn btn-sm btn-danger" onclick="this.closest('.transfer-row').remove()" style="padding:2px 8px"><i class="fas fa-times"></i></button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px">
            <div><label style="font-size:10px;color:var(--text-muted)">中转仓</label><input class="form-input tp-warehouse" value="${t?t.warehouse:''}" style="font-size:12px;padding:6px 8px"></div>
            <div><label style="font-size:10px;color:var(--text-muted)">运单号</label><input class="form-input tp-waybill" value="${t?t.waybillNo:''}" style="font-size:12px;padding:6px 8px"></div>
            <div><label style="font-size:10px;color:var(--text-muted)">运费</label><input class="form-input tp-freight" type="number" value="${t?t.freight:''}" style="font-size:12px;padding:6px 8px"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px">
            <div><label style="font-size:10px;color:var(--text-muted)">联系人</label><input class="form-input tp-contact" value="${t?t.contactPerson||'':''}" style="font-size:12px;padding:6px 8px"></div>
            <div><label style="font-size:10px;color:var(--text-muted)">电话</label><input class="form-input tp-phone" value="${t?t.phone||'':''}" style="font-size:12px;padding:6px 8px"></div>
        </div>
    </div>`;
}

function addTransferRow() {
    const container = document.getElementById('transferRows');
    const idx = container.querySelectorAll('.transfer-row').length;
    container.insertAdjacentHTML('beforeend', renderTransferRow(null, idx));
}

// ===== Skill 4: 订单审核（字段校验） =====
function auditOrder(orderNo) {
    const o = MockData.orders.find(x => x.orderNo === orderNo);
    if (!o) return;

    openModal(`审核订单 - ${orderNo}`, `
        <div style="padding:8px 0">
            <div style="margin-bottom:14px;padding:12px;background:#f8f9fa;border-radius:8px">
                <div style="font-weight:600;margin-bottom:4px">${o.senderName} → ${o.receiverName}</div>
                <div style="font-size:12px;color:var(--text-muted)">送达: ${o.deliveryDate} | ${o.quantity}件 ${o.weight}kg ${o.volume}m³</div>
            </div>
            <div style="margin-bottom:12px;padding:8px 12px;background:#fff3cd;border-left:4px solid var(--warning);border-radius:4px;font-size:12px;color:#856404">
                <i class="fas fa-exclamation-triangle" style="margin-right:4px"></i> 标红字段为必填校验项，审核前请确认信息完整
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label"><span class="required">*</span> 线路号 <span class="field-required-tag">必填</span></label>
                    <input class="form-input audit-field" id="auditRouteNo" value="${o.routeNo}" placeholder="格式：SW开头+数字">
                    <div class="field-error" id="errRouteNo"></div>
                </div>
                <div class="form-group">
                    <label class="form-label"><span class="required">*</span> 始发机构 <span class="field-required-tag">必填</span></label>
                    <select class="form-select audit-field" id="auditOriginOrg">${MockData.tmsOrgs.map(org=>`<option ${org===o.originOrg?'selected':''}>${org}</option>`).join('')}</select>
                    <div class="field-error" id="errOriginOrg"></div>
                </div>
                <div class="form-group">
                    <label class="form-label"><span class="required">*</span> 产品属性 <span class="field-required-tag">必填</span></label>
                    <select class="form-select audit-field" id="auditProductAttr">${MockData.productAttrs.map(a=>`<option value="${a.value}" ${a.value===o.productAttr?'selected':''}>${a.label}</option>`).join('')}</select>
                    <div class="field-error" id="errProductAttr"></div>
                </div>
                <div class="form-group">
                    <label class="form-label"><span class="required">*</span> 收入金额 <span class="field-required-tag">必填</span></label>
                    <input class="form-input audit-field" type="number" id="auditRevenue" value="${o.revenue}" placeholder="金额必须>0">
                    <div class="field-error" id="errRevenue"></div>
                </div>
            </div>
            <div class="form-group" style="margin-top:8px">
                <label class="form-label">审核意见</label>
                <textarea class="form-input" id="auditOrderRemark" rows="2" placeholder="可选填写" style="resize:vertical"></textarea>
            </div>
        </div>
    `, () => {
        // Validate
        let hasError = false;
        const routeNo = document.getElementById('auditRouteNo').value.trim();
        const originOrg = document.getElementById('auditOriginOrg').value;
        const productAttr = document.getElementById('auditProductAttr').value;
        const revenue = parseFloat(document.getElementById('auditRevenue').value);
        const remark = document.getElementById('auditOrderRemark').value.trim();

        // Clear errors
        document.querySelectorAll('.field-error').forEach(el => { el.textContent = ''; el.style.display = 'none'; });
        document.querySelectorAll('.audit-field').forEach(el => el.classList.remove('field-error-border'));

        // Route validation
        if (!routeNo) {
            setFieldError('errRouteNo', 'auditRouteNo', '线路号不能为空'); hasError = true;
        } else if (!/^SW\d+$/.test(routeNo)) {
            setFieldError('errRouteNo', 'auditRouteNo', '线路号格式错误，须为SW+数字（如SW0200）'); hasError = true;
        }
        // Origin org validation
        if (!originOrg) {
            setFieldError('errOriginOrg', 'auditOriginOrg', '始发机构不能为空'); hasError = true;
        }
        // Product attr validation
        if (!productAttr) {
            setFieldError('errProductAttr', 'auditProductAttr', '产品属性不能为空'); hasError = true;
        }
        // Revenue validation
        if (isNaN(revenue) || revenue <= 0) {
            setFieldError('errRevenue', 'auditRevenue', '收入金额必须大于0'); hasError = true;
        }

        if (hasError) {
            showToast('校验未通过，请检查标红字段', 'error');
            return;
        }

        // Apply and audit
        o.routeNo = routeNo; o.originOrg = originOrg;
        o.productAttr = productAttr; o.revenue = revenue;
        o.totalFreight = revenue; o.auditStatus = '已审核';

        const now = new Date().toLocaleString('zh-CN',{hour12:false}).replace(/\//g,'-');
        MockData.auditLogs.push({
            id: MockData.auditLogs.length + 1, time: now, operator: '管理员',
            action: '审核通过', targetType: '订单', targetId: orderNo, remark
        });

        renderOrderTable(MockData.orders);
        showToast(`订单 ${orderNo} 审核通过，已传TMS`, 'success');
    });
}

function setFieldError(errId, fieldId, msg) {
    const errEl = document.getElementById(errId);
    const fieldEl = document.getElementById(fieldId);
    if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
    if (fieldEl) fieldEl.classList.add('field-error-border');
}

// ===== Skill 5: 修改日志查看 =====
function showOrderModifyLogs() {
    const logs = MockData.orderModifyLogs;
    openModal('订单修改日志', `
        <div class="table-container" style="max-height:400px;overflow:auto"><table><thead><tr>
            <th>时间</th><th>操作人</th><th>订单号</th><th>修改字段</th><th>原值</th><th>新值</th><th>备注</th>
        </tr></thead><tbody>
        ${logs.length === 0 ? '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:20px">暂无修改记录</td></tr>' :
        logs.slice().reverse().map(l => `<tr>
            <td style="font-size:12px;white-space:nowrap">${l.time}</td><td>${l.operator}</td>
            <td style="font-weight:600">${l.orderNo}</td><td>${l.field}</td>
            <td style="color:var(--danger);text-decoration:line-through">${l.oldValue||'-'}</td>
            <td style="color:var(--success);font-weight:600">${l.newValue}</td><td>${l.remark||'-'}</td>
        </tr>`).join('')}
        </tbody></table></div>
    `, null, `<button class="btn btn-secondary" onclick="closeModal()">关闭</button>`);
}
