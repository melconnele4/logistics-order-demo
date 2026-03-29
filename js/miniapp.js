/* ============================================
   小程序预览页面
   ============================================ */

function renderMiniapp(container) {
    container.innerHTML = `
    <div class="page-header">
        <div class="page-header-left"><h1>小程序预览</h1><p>客户端微信小程序交互模拟</p></div>
        <div class="btn-group">
            <button class="btn btn-secondary" onclick="resetMiniapp()"><i class="fas fa-redo"></i> 重置</button>
        </div>
    </div>
    <div style="display:flex;justify-content:center;padding:20px 0">
        <div class="phone-frame">
            <div class="phone-notch"></div>
            <div class="phone-screen" id="phoneScreen"></div>
        </div>
    </div>`;
    App.miniappScreen = 'login';
    App.miniappUser = null;
    renderMiniappScreen();
}

function resetMiniapp() {
    App.miniappScreen = 'login';
    App.miniappUser = null;
    renderMiniappScreen();
}

function renderMiniappScreen() {
    const screen = document.getElementById('phoneScreen');
    if (!screen) return;
    const renderers = {
        login: renderMPLogin, home: renderMPHome, customerInfo: renderMPCustomerInfo,
        orderList: renderMPOrderList, orderDetail: renderMPOrderDetail, newOrder: renderMPNewOrder,
    };
    if (renderers[App.miniappScreen]) renderers[App.miniappScreen](screen);
}

function renderMPLogin(screen) {
    screen.innerHTML = `
    <div class="mp-login">
        <div class="phone-notch" style="position:relative;margin:-60px auto 20px;"></div>
        <div class="mp-login-logo"><i class="fas fa-truck-fast"></i></div>
        <h3>物流商务订单系统</h3>
        <div class="mp-form-group"><input class="mp-form-input" id="mpUsername" placeholder="请输入客户账号" value="SWPY"></div>
        <div class="mp-form-group"><input class="mp-form-input" type="password" id="mpPassword" placeholder="请输入密码" value="123456"></div>
        <button class="mp-btn" onclick="mpLogin()">登 录</button>
        <p style="text-align:center;margin-top:16px;font-size:12px;color:var(--text-muted)">提示：输入 SWPY / TH0003 / TH0007 登录</p>
    </div>`;
}

function mpLogin() {
    const username = document.getElementById('mpUsername').value.trim();
    const contract = MockData.contracts.find(c => c.customerId === username && c.validity === 'Y' && c.auditStatus === '已审核');
    if (!contract) { showToast('登录失败：账号无效或未审核', 'error'); return; }
    App.miniappUser = contract;
    App.miniappScreen = 'home';
    renderMiniappScreen();
}

function renderMPHome(screen) {
    const u = App.miniappUser;
    screen.innerHTML = `
    <div class="mp-header">
        <h2>物流商务订单</h2>
        <p>${u.customerId} - ${u.customerName}</p>
    </div>
    <div class="mp-content">
        <div class="mp-card">
            <h4 style="margin-bottom:12px">功能入口</h4>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                <div onclick="App.miniappScreen='customerInfo';renderMiniappScreen()" style="background:linear-gradient(135deg,var(--primary),var(--secondary));color:white;padding:20px;border-radius:12px;text-align:center;cursor:pointer">
                    <i class="fas fa-address-card" style="font-size:24px"></i><div style="margin-top:8px;font-size:13px;font-weight:600">客户信息</div>
                </div>
                <div onclick="App.miniappScreen='orderList';renderMiniappScreen()" style="background:linear-gradient(135deg,var(--accent),var(--success));color:white;padding:20px;border-radius:12px;text-align:center;cursor:pointer">
                    <i class="fas fa-clipboard-list" style="font-size:24px"></i><div style="margin-top:8px;font-size:13px;font-weight:600">订单管理</div>
                </div>
            </div>
        </div>
        <div class="mp-card">
            <h4>快捷统计</h4>
            <div class="mp-stats">
                <div class="mp-stat-item"><div class="num">${MockData.pickupAddresses.filter(p=>p.customerId===u.customerId).length}</div><div class="label">提货点</div></div>
                <div class="mp-stat-item"><div class="num">${MockData.deliveryAddresses.filter(d=>d.customerId===u.customerId).length}</div><div class="label">配送点</div></div>
                <div class="mp-stat-item"><div class="num">${MockData.settlements.filter(s=>s.customerId===u.customerId).length}</div><div class="label">结算方式</div></div>
            </div>
        </div>
    </div>`;
}

function mpBack(target) {
    App.miniappScreen = target || 'home';
    renderMiniappScreen();
}

function renderMPCustomerInfo(screen) {
    const u = App.miniappUser;
    const pickups = MockData.pickupAddresses.filter(p => p.customerId === u.customerId);
    const deliveries = MockData.deliveryAddresses.filter(d => d.customerId === u.customerId);
    screen.innerHTML = `
    <div class="mp-header" style="padding-top:36px;padding-bottom:14px">
        <div style="display:flex;align-items:center;gap:10px;justify-content:center">
            <i class="fas fa-arrow-left" style="cursor:pointer;position:absolute;left:20px" onclick="mpBack()"></i>
            <h2 style="font-size:16px">客户信息</h2>
        </div>
    </div>
    <div class="mp-content">
        <div class="mp-card"><h4>${u.customerName}</h4><p style="font-size:12px;color:var(--text-muted)">客户号: ${u.customerId} | 合同到期: ${u.contractExpire}</p></div>
        <div class="mp-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><h4>提货点 (${pickups.length})</h4></div>
            ${pickups.map(p => `<div style="padding:10px;background:#f9f9f9;border-radius:8px;margin-bottom:8px">
                <div style="font-weight:600;font-size:13px">${p.pickupName}</div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:4px">${p.contactPerson} ${p.phone}</div>
                <div style="font-size:11px;color:var(--text-muted)">${p.province}${p.city}${p.district}${p.town}</div>
            </div>`).join('')}
        </div>
        <div class="mp-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><h4>配送点 (${deliveries.length})</h4></div>
            ${deliveries.map(d => `<div style="padding:10px;background:#f9f9f9;border-radius:8px;margin-bottom:8px">
                <div style="font-weight:600;font-size:13px">${d.contactPerson}</div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:4px">${d.phone}</div>
                <div style="font-size:11px;color:var(--text-muted)">${d.province}${d.city}${d.district}${d.town} ${d.detailAddress}</div>
            </div>`).join('')}
        </div>
    </div>`;
}

function renderMPOrderList(screen) {
    const u = App.miniappUser;
    const orders = MockData.orders.filter(o => o.senderId === u.customerId);
    screen.innerHTML = `
    <div class="mp-header" style="padding-top:36px;padding-bottom:14px">
        <div style="display:flex;align-items:center;gap:10px;justify-content:center">
            <i class="fas fa-arrow-left" style="cursor:pointer;position:absolute;left:20px" onclick="mpBack()"></i>
            <h2 style="font-size:16px">订单管理</h2>
        </div>
    </div>
    <div class="mp-content">
        <div style="display:flex;gap:8px;margin-bottom:12px">
            <button class="mp-btn" style="flex:1;height:36px;font-size:13px;border-radius:8px" onclick="App.miniappScreen='newOrder';renderMiniappScreen()"><i class="fas fa-plus"></i> 新增订单</button>
        </div>
        ${orders.length === 0 ? '<div class="mp-card" style="text-align:center;color:var(--text-muted);padding:30px">暂无订单</div>' : ''}
        ${orders.map(o => `
        <div class="mp-card" style="cursor:pointer" onclick="window._mpOrderNo='${o.orderNo}';App.miniappScreen='orderDetail';renderMiniappScreen()">
            <div class="mp-order-item" style="border:none;padding:0">
                <div class="mp-order-info">
                    <h5>${o.orderNo}</h5>
                    <p>${o.senderName} → ${o.receiverName}</p>
                    <p>送达: ${o.deliveryDate} | ${o.quantity}件 ${o.weight}kg</p>
                </div>
                <span class="status-badge ${o.auditStatus==='已审核'?'success':'warning'}" style="font-size:10px">${o.auditStatus}</span>
            </div>
        </div>`).join('')}
    </div>`;
}

function renderMPOrderDetail(screen) {
    const o = MockData.orders.find(x => x.orderNo === window._mpOrderNo);
    if (!o) { mpBack('orderList'); return; }
    screen.innerHTML = `
    <div class="mp-header" style="padding-top:36px;padding-bottom:14px">
        <div style="display:flex;align-items:center;gap:10px;justify-content:center">
            <i class="fas fa-arrow-left" style="cursor:pointer;position:absolute;left:20px" onclick="mpBack('orderList')"></i>
            <h2 style="font-size:16px">订单详情</h2>
        </div>
    </div>
    <div class="mp-content">
        <div class="mp-card">
            <div style="display:flex;justify-content:space-between;margin-bottom:12px"><h4>${o.orderNo}</h4><span class="status-badge ${o.auditStatus==='已审核'?'success':'warning'}">${o.auditStatus}</span></div>
            <div style="font-size:12px;color:var(--text-secondary);line-height:2">
                <div><b>发货方:</b> ${o.senderName} (${o.senderId})</div>
                <div><b>收货方:</b> ${o.receiverName} (${o.receiverId})</div>
                <div><b>送达日期:</b> ${o.deliveryDate}</div>
                <div><b>产品属性:</b> ${o.productAttr}</div>
                <div><b>数量:</b> ${o.quantity} 件 | <b>重量:</b> ${o.weight} kg | <b>体积:</b> ${o.volume} m³</div>
                <div><b>总运费:</b> <span style="color:var(--primary);font-weight:700">${formatCurrency(o.totalFreight)}</span></div>
                ${o.remark?`<div><b>备注:</b> ${o.remark}</div>`:''}
            </div>
        </div>
    </div>`;
}

function renderMPNewOrder(screen) {
    const u = App.miniappUser;
    const pickups = MockData.pickupAddresses.filter(p => p.customerId === u.customerId);
    const deliveries = MockData.deliveryAddresses.filter(d => d.customerId === u.customerId);
    screen.innerHTML = `
    <div class="mp-header" style="padding-top:36px;padding-bottom:14px">
        <div style="display:flex;align-items:center;gap:10px;justify-content:center">
            <i class="fas fa-arrow-left" style="cursor:pointer;position:absolute;left:20px" onclick="mpBack('orderList')"></i>
            <h2 style="font-size:16px">新增订单</h2>
        </div>
    </div>
    <div class="mp-content">
        <div class="mp-card">
            <h4 style="margin-bottom:12px">提货信息</h4>
            <select class="mp-form-input" style="height:40px;margin-bottom:8px">${pickups.map(p => `<option>${p.pickupName} - ${p.contactPerson}</option>`).join('')}</select>
        </div>
        <div class="mp-card">
            <h4 style="margin-bottom:12px">送达信息</h4>
            <select class="mp-form-input" style="height:40px;margin-bottom:8px">${deliveries.map(d => `<option>${d.contactPerson} - ${d.province}${d.city}</option>`).join('')}</select>
            <div class="mp-form-group"><input class="mp-form-input" type="date" value="2026-03-31" style="margin-top:4px"></div>
        </div>
        <div class="mp-card">
            <h4 style="margin-bottom:12px">货物信息</h4>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                <div class="mp-form-group"><label style="font-size:11px;color:var(--text-muted)">数量</label><input class="mp-form-input" type="number" value="50"></div>
                <div class="mp-form-group"><label style="font-size:11px;color:var(--text-muted)">重量(kg)</label><input class="mp-form-input" type="number" value="1500"></div>
                <div class="mp-form-group"><label style="font-size:11px;color:var(--text-muted)">体积(m³)</label><input class="mp-form-input" type="number" value="12.5"></div>
                <div class="mp-form-group"><label style="font-size:11px;color:var(--text-muted)">产品属性</label><select class="mp-form-input" style="height:40px">${MockData.productAttrs.map(a => `<option value="${a.value}">${a.label}</option>`).join('')}</select></div>
            </div>
        </div>
        <button class="mp-btn" onclick="showToast('订单提交成功，状态：待审核','success');mpBack('orderList')" style="margin-top:8px">提交订单</button>
    </div>`;
}
