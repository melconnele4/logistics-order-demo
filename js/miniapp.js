/* ============================================
   小程序预览页面
   Skill 6: 订单状态汇总 + 配送信息补齐
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
        orderSummary: renderMPOrderSummary, orderList: renderMPOrderList,
        orderDetail: renderMPOrderDetail, newOrder: renderMPNewOrder,
        addAddress: renderMPAddAddress, billingList: renderMPBillingList,
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
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
                <div onclick="App.miniappScreen='customerInfo';renderMiniappScreen()" style="background:linear-gradient(135deg,var(--primary),var(--secondary));color:white;padding:16px 8px;border-radius:12px;text-align:center;cursor:pointer">
                    <i class="fas fa-address-card" style="font-size:22px"></i><div style="margin-top:6px;font-size:12px;font-weight:600">客户信息</div>
                </div>
                <div onclick="App.miniappScreen='orderSummary';renderMiniappScreen()" style="background:linear-gradient(135deg,var(--accent),var(--success));color:white;padding:16px 8px;border-radius:12px;text-align:center;cursor:pointer">
                    <i class="fas fa-clipboard-list" style="font-size:22px"></i><div style="margin-top:6px;font-size:12px;font-weight:600">订单管理</div>
                </div>
                <div onclick="App.miniappScreen='billingList';renderMiniappScreen()" style="background:linear-gradient(135deg,#e17055,#fdcb6e);color:white;padding:16px 8px;border-radius:12px;text-align:center;cursor:pointer">
                    <i class="fas fa-file-invoice-dollar" style="font-size:22px"></i><div style="margin-top:6px;font-size:12px;font-weight:600">账单管理</div>
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
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                <h4>提货点 (${pickups.length})</h4>
                <button onclick="window._mpAddType='pickup';App.miniappScreen='addAddress';renderMiniappScreen()" style="background:linear-gradient(135deg,var(--primary),var(--secondary));color:white;border:none;padding:6px 14px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer"><i class="fas fa-plus" style="margin-right:4px"></i>新增</button>
            </div>
            ${pickups.map(p => `<div style="padding:10px;background:#f9f9f9;border-radius:8px;margin-bottom:8px">
                <div style="font-weight:600;font-size:13px">${p.pickupName}</div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:4px">${p.contactPerson} ${p.phone}</div>
                <div style="font-size:11px;color:var(--text-muted)">${p.province}${p.city}${p.district}${p.town}</div>
            </div>`).join('')}
        </div>
        <div class="mp-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                <h4>配送点 (${deliveries.length})</h4>
                <button onclick="window._mpAddType='delivery';App.miniappScreen='addAddress';renderMiniappScreen()" style="background:linear-gradient(135deg,var(--accent),var(--success));color:white;border:none;padding:6px 14px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer"><i class="fas fa-plus" style="margin-right:4px"></i>新增</button>
            </div>
            ${deliveries.map(d => `<div style="padding:10px;background:#f9f9f9;border-radius:8px;margin-bottom:8px">
                <div style="font-weight:600;font-size:13px">${d.contactPerson}</div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:4px">${d.phone}</div>
                <div style="font-size:11px;color:var(--text-muted)">${d.province}${d.city}${d.district}${d.town} ${d.detailAddress}</div>
            </div>`).join('')}
        </div>
    </div>`;
}

// ===== Skill 6: 订单状态汇总页 =====
function renderMPOrderSummary(screen) {
    const u = App.miniappUser;
    const orders = MockData.orders.filter(o => o.senderId === u.customerId);
    const statusGroups = {
        '待审核': { icon: 'fa-clock', color: '#f39c12', gradient: 'linear-gradient(135deg,#f39c12,#e67e22)' },
        '已审核': { icon: 'fa-check-circle', color: '#27ae60', gradient: 'linear-gradient(135deg,#27ae60,#2ecc71)' },
        '配送中': { icon: 'fa-shipping-fast', color: '#3498db', gradient: 'linear-gradient(135deg,#3498db,#2980b9)' },
        '已签收': { icon: 'fa-box-open', color: '#2ecc71', gradient: 'linear-gradient(135deg,#2ecc71,#27ae60)' },
        '待发货': { icon: 'fa-inbox', color: '#e17055', gradient: 'linear-gradient(135deg,#e17055,#d63031)' },
    };

    // Count by auditStatus and deliveryStatus
    const auditPending = orders.filter(o => o.auditStatus === '待审核').length;
    const auditPassed = orders.filter(o => o.auditStatus === '已审核').length;
    const delivering = orders.filter(o => o.deliveryStatus === '配送中').length;
    const delivered = orders.filter(o => o.deliveryStatus === '已签收').length;
    const waitShip = orders.filter(o => o.deliveryStatus === '待发货').length;

    screen.innerHTML = `
    <div class="mp-header" style="padding-top:36px;padding-bottom:14px">
        <div style="display:flex;align-items:center;gap:10px;justify-content:center">
            <i class="fas fa-arrow-left" style="cursor:pointer;position:absolute;left:20px" onclick="mpBack()"></i>
            <h2 style="font-size:16px">订单管理</h2>
        </div>
    </div>
    <div class="mp-content">
        <div class="mp-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
                <h4>订单概览</h4>
                <span style="font-size:12px;color:var(--text-muted)">共 ${orders.length} 单</span>
            </div>
            <div class="mp-stats" style="grid-template-columns:1fr 1fr">
                <div class="mp-stat-item"><div class="num" style="color:var(--primary)">${orders.length}</div><div class="label">总订单</div></div>
                <div class="mp-stat-item"><div class="num" style="color:var(--success)">${formatCurrency(orders.reduce((s,o)=>s+o.totalFreight,0))}</div><div class="label">总运费</div></div>
            </div>
        </div>

        <div class="mp-card">
            <h4 style="margin-bottom:12px">按状态查看</h4>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
                <div onclick="window._mpFilterStatus='待审核';window._mpFilterField='auditStatus';App.miniappScreen='orderList';renderMiniappScreen()" style="background:${statusGroups['待审核'].gradient};color:white;padding:16px;border-radius:12px;cursor:pointer;text-align:center;transition:transform 0.2s" onmouseenter="this.style.transform='scale(1.03)'" onmouseleave="this.style.transform='scale(1)'">
                    <i class="fas ${statusGroups['待审核'].icon}" style="font-size:24px"></i>
                    <div style="font-size:24px;font-weight:700;margin:6px 0">${auditPending}</div>
                    <div style="font-size:12px;opacity:0.9">待审核</div>
                </div>
                <div onclick="window._mpFilterStatus='已审核';window._mpFilterField='auditStatus';App.miniappScreen='orderList';renderMiniappScreen()" style="background:${statusGroups['已审核'].gradient};color:white;padding:16px;border-radius:12px;cursor:pointer;text-align:center;transition:transform 0.2s" onmouseenter="this.style.transform='scale(1.03)'" onmouseleave="this.style.transform='scale(1)'">
                    <i class="fas ${statusGroups['已审核'].icon}" style="font-size:24px"></i>
                    <div style="font-size:24px;font-weight:700;margin:6px 0">${auditPassed}</div>
                    <div style="font-size:12px;opacity:0.9">已审核</div>
                </div>
                <div onclick="window._mpFilterStatus='配送中';window._mpFilterField='deliveryStatus';App.miniappScreen='orderList';renderMiniappScreen()" style="background:${statusGroups['配送中'].gradient};color:white;padding:16px;border-radius:12px;cursor:pointer;text-align:center;transition:transform 0.2s" onmouseenter="this.style.transform='scale(1.03)'" onmouseleave="this.style.transform='scale(1)'">
                    <i class="fas ${statusGroups['配送中'].icon}" style="font-size:24px"></i>
                    <div style="font-size:24px;font-weight:700;margin:6px 0">${delivering}</div>
                    <div style="font-size:12px;opacity:0.9">配送中</div>
                </div>
                <div onclick="window._mpFilterStatus='已签收';window._mpFilterField='deliveryStatus';App.miniappScreen='orderList';renderMiniappScreen()" style="background:${statusGroups['已签收'].gradient};color:white;padding:16px;border-radius:12px;cursor:pointer;text-align:center;transition:transform 0.2s" onmouseenter="this.style.transform='scale(1.03)'" onmouseleave="this.style.transform='scale(1)'">
                    <i class="fas ${statusGroups['已签收'].icon}" style="font-size:24px"></i>
                    <div style="font-size:24px;font-weight:700;margin:6px 0">${delivered}</div>
                    <div style="font-size:12px;opacity:0.9">已签收</div>
                </div>
            </div>
            ${waitShip > 0 ? `
            <div onclick="window._mpFilterStatus='待发货';window._mpFilterField='deliveryStatus';App.miniappScreen='orderList';renderMiniappScreen()" style="margin-top:10px;background:${statusGroups['待发货'].gradient};color:white;padding:14px;border-radius:12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:transform 0.2s" onmouseenter="this.style.transform='scale(1.02)'" onmouseleave="this.style.transform='scale(1)'">
                <div><i class="fas ${statusGroups['待发货'].icon}" style="margin-right:8px"></i>待发货</div>
                <div style="font-size:20px;font-weight:700">${waitShip}</div>
            </div>` : ''}
        </div>

        <div style="display:flex;gap:8px;margin-top:4px">
            <button class="mp-btn" style="flex:1;height:36px;font-size:13px;border-radius:8px" onclick="window._mpFilterStatus=null;window._mpFilterField=null;App.miniappScreen='orderList';renderMiniappScreen()"><i class="fas fa-list"></i> 查看全部</button>
            <button class="mp-btn" style="flex:1;height:36px;font-size:13px;border-radius:8px;background:linear-gradient(135deg,var(--accent),var(--success))" onclick="App.miniappScreen='newOrder';renderMiniappScreen()"><i class="fas fa-plus"></i> 新增订单</button>
        </div>
    </div>`;
}

// ===== Skill 6: 订单列表（支持从汇总页筛选进入） =====
function renderMPOrderList(screen) {
    const u = App.miniappUser;
    let orders = MockData.orders.filter(o => o.senderId === u.customerId);
    const filterStatus = window._mpFilterStatus;
    const filterField = window._mpFilterField;
    let filterLabel = '全部订单';

    if (filterStatus && filterField) {
        orders = orders.filter(o => o[filterField] === filterStatus);
        filterLabel = filterStatus;
    }

    const statusColors = { '待审核':'warning', '已审核':'success', '配送中':'info', '已签收':'success', '待发货':'danger' };

    screen.innerHTML = `
    <div class="mp-header" style="padding-top:36px;padding-bottom:14px">
        <div style="display:flex;align-items:center;gap:10px;justify-content:center">
            <i class="fas fa-arrow-left" style="cursor:pointer;position:absolute;left:20px" onclick="mpBack('orderSummary')"></i>
            <h2 style="font-size:16px">${filterLabel} (${orders.length})</h2>
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
                    <div style="display:flex;gap:6px;margin-top:4px">
                        <span class="status-badge ${statusColors[o.auditStatus]||'muted'}" style="font-size:10px">${o.auditStatus}</span>
                        <span class="status-badge ${statusColors[o.deliveryStatus]||'muted'}" style="font-size:10px">${o.deliveryStatus||'未知'}</span>
                    </div>
                </div>
                <i class="fas fa-chevron-right" style="color:var(--text-muted)"></i>
            </div>
        </div>`).join('')}
    </div>`;
}

// ===== Skill 6: 订单详情（补齐配送信息） =====
function renderMPOrderDetail(screen) {
    const o = MockData.orders.find(x => x.orderNo === window._mpOrderNo);
    if (!o) { mpBack('orderSummary'); return; }
    const transfers = MockData.transferPoints.filter(t => t.orderNo === o.orderNo);
    const statusColors = { '待发货':'#e17055', '配送中':'#3498db', '已签收':'#27ae60' };
    const statusBg = { '待发货':'#ffeaa7', '配送中':'#dfe6e9', '已签收':'#d4efdf' };

    screen.innerHTML = `
    <div class="mp-header" style="padding-top:36px;padding-bottom:14px">
        <div style="display:flex;align-items:center;gap:10px;justify-content:center">
            <i class="fas fa-arrow-left" style="cursor:pointer;position:absolute;left:20px" onclick="mpBack('orderList')"></i>
            <h2 style="font-size:16px">订单详情</h2>
        </div>
    </div>
    <div class="mp-content">
        <!-- 订单基本信息 -->
        <div class="mp-card">
            <div style="display:flex;justify-content:space-between;margin-bottom:12px"><h4>${o.orderNo}</h4><span class="status-badge ${o.auditStatus==='已审核'?'success':'warning'}">${o.auditStatus}</span></div>
            <div style="font-size:12px;color:var(--text-secondary);line-height:2">
                <div><b>发货方:</b> ${o.senderName} (${o.senderId})</div>
                <div><b>收货方:</b> ${o.receiverName} (${o.receiverId})</div>
                <div><b>送达日期:</b> ${o.deliveryDate}</div>
                <div><b>产品属性:</b> ${o.productAttr}</div>
                <div><b>是否中转:</b> ${o.isTransfer?'<span style="color:var(--accent);font-weight:600">是</span>':'否'}</div>
                <div><b>数量:</b> ${o.quantity} 件 | <b>重量:</b> ${o.weight} kg | <b>体积:</b> ${o.volume} m³</div>
                <div><b>总运费:</b> <span style="color:var(--primary);font-weight:700">${formatCurrency(o.totalFreight)}</span></div>
                ${o.remark?`<div><b>备注:</b> ${o.remark}</div>`:''}
            </div>
        </div>

        <!-- 配送信息（补齐） -->
        <div class="mp-card" style="border-left:3px solid ${statusColors[o.deliveryStatus]||'#95a5a6'}">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                <h4 style="font-size:14px"><i class="fas fa-shipping-fast" style="margin-right:6px;color:${statusColors[o.deliveryStatus]||'#95a5a6'}"></i>配送信息</h4>
                <span style="background:${statusBg[o.deliveryStatus]||'#eee'};color:${statusColors[o.deliveryStatus]||'#95a5a6'};padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700">${o.deliveryStatus||'未知'}</span>
            </div>
            <div style="font-size:12px;color:var(--text-secondary);line-height:2">
                <div><i class="fas fa-user" style="width:16px;margin-right:4px;color:var(--text-muted)"></i><b>收货联系人:</b> ${o.deliveryContact||'-'}</div>
                <div><i class="fas fa-phone" style="width:16px;margin-right:4px;color:var(--text-muted)"></i><b>联系电话:</b> ${o.deliveryContactPhone||'-'}</div>
                <div><i class="fas fa-map-marker-alt" style="width:16px;margin-right:4px;color:var(--text-muted)"></i><b>配送地址:</b> ${o.deliveryAddress||'-'}</div>
            </div>
        </div>

        ${transfers.length ? `
        <!-- 中转信息 -->
        <div class="mp-card">
            <h4 style="font-size:14px;margin-bottom:10px"><i class="fas fa-exchange-alt" style="margin-right:6px;color:var(--accent)"></i>中转信息 (${transfers.length})</h4>
            ${transfers.map(t => `
            <div style="padding:10px;background:#f8f9fa;border-radius:8px;margin-bottom:6px;border-left:3px solid var(--accent)">
                <div style="display:flex;justify-content:space-between;align-items:center">
                    <span style="font-weight:600;font-size:13px">#${t.seq} ${t.warehouse}</span>
                    <span style="font-size:12px;color:var(--primary);font-weight:600">${formatCurrency(t.freight)}</span>
                </div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:4px">
                    运单号: ${t.waybillNo||'-'} ${t.contactPerson ? `| 联系人: ${t.contactPerson} ${t.phone||''}` : ''}
                </div>
            </div>`).join('')}
        </div>` : ''}
    </div>`;
}

function renderMPNewOrder(screen) {
    const u = App.miniappUser;
    const pickups = MockData.pickupAddresses.filter(p => p.customerId === u.customerId);
    const deliveries = MockData.deliveryAddresses.filter(d => d.customerId === u.customerId);
    screen.innerHTML = `
    <div class="mp-header" style="padding-top:36px;padding-bottom:14px">
        <div style="display:flex;align-items:center;gap:10px;justify-content:center">
            <i class="fas fa-arrow-left" style="cursor:pointer;position:absolute;left:20px" onclick="mpBack('orderSummary')"></i>
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
        <button class="mp-btn" onclick="showToast('订单提交成功，状态：待审核','success');mpBack('orderSummary')" style="margin-top:8px">提交订单</button>
    </div>`;
}

// ===== 新增提货点/配送点表单 =====
function renderMPAddAddress(screen) {
    const isPickup = window._mpAddType === 'pickup';
    const title = isPickup ? '新增提货点' : '新增配送点';
    screen.innerHTML = `
    <div class="mp-header" style="padding-top:36px;padding-bottom:14px">
        <div style="display:flex;align-items:center;gap:10px;justify-content:center">
            <i class="fas fa-arrow-left" style="cursor:pointer;position:absolute;left:20px" onclick="mpBack('customerInfo')"></i>
            <h2 style="font-size:16px">${title}</h2>
        </div>
    </div>
    <div class="mp-content">
        <div class="mp-card">
            <div class="mp-form-group" style="margin-bottom:14px">
                <label style="font-size:12px;font-weight:600;color:var(--text-primary);margin-bottom:6px;display:block">${isPickup ? '提货点名称' : '配送点名称'} <span style="color:#e17055">*</span></label>
                <input class="mp-form-input" id="mpAddrName" placeholder="请输入${isPickup ? '提货点' : '配送点'}名称">
            </div>
            <div class="mp-form-group" style="margin-bottom:14px">
                <label style="font-size:12px;font-weight:600;color:var(--text-primary);margin-bottom:6px;display:block">联系人 <span style="color:#e17055">*</span></label>
                <input class="mp-form-input" id="mpAddrContact" placeholder="请输入联系人姓名">
            </div>
            <div class="mp-form-group" style="margin-bottom:14px">
                <label style="font-size:12px;font-weight:600;color:var(--text-primary);margin-bottom:6px;display:block">联系电话 <span style="color:#e17055">*</span></label>
                <input class="mp-form-input" id="mpAddrPhone" placeholder="请输入手机号" maxlength="11">
                <div id="mpPhoneError" style="font-size:11px;color:#e17055;margin-top:4px;display:none">请输入正确的手机号码</div>
            </div>
        </div>
        <div class="mp-card">
            <label style="font-size:12px;font-weight:600;color:var(--text-primary);margin-bottom:10px;display:block">地址信息 <span style="color:#e17055">*</span></label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
                <div class="mp-form-group">
                    <label style="font-size:11px;color:var(--text-muted);margin-bottom:4px;display:block">省份</label>
                    <select class="mp-form-input" id="mpAddrProvince" style="height:40px">
                        <option value="">请选择</option><option>浙江省</option><option>江苏省</option><option>上海市</option><option>福建省</option><option>广东省</option>
                    </select>
                </div>
                <div class="mp-form-group">
                    <label style="font-size:11px;color:var(--text-muted);margin-bottom:4px;display:block">城市</label>
                    <select class="mp-form-input" id="mpAddrCity" style="height:40px">
                        <option value="">请选择</option><option>温州市</option><option>杭州市</option><option>宁波市</option><option>金华市</option><option>台州市</option><option>丽水市</option>
                    </select>
                </div>
                <div class="mp-form-group">
                    <label style="font-size:11px;color:var(--text-muted);margin-bottom:4px;display:block">区县</label>
                    <select class="mp-form-input" id="mpAddrDistrict" style="height:40px">
                        <option value="">请选择</option><option>平阳县</option><option>瑞安市</option><option>龙湾区</option><option>鹿城区</option><option>苍南县</option><option>乐清市</option>
                    </select>
                </div>
                <div class="mp-form-group">
                    <label style="font-size:11px;color:var(--text-muted);margin-bottom:4px;display:block">乡镇</label>
                    <select class="mp-form-input" id="mpAddrTown" style="height:40px">
                        <option value="">请选择</option><option>昆阳镇</option><option>鳌江镇</option><option>万全镇</option><option>水头镇</option><option>安阳街道</option><option>瑶溪街道</option>
                    </select>
                </div>
            </div>
            <div class="mp-form-group">
                <label style="font-size:11px;color:var(--text-muted);margin-bottom:4px;display:block">详细地址</label>
                <input class="mp-form-input" id="mpAddrDetail" placeholder="请输入详细地址（街道/门牌号/楼栋等）">
            </div>
        </div>
        <div style="display:flex;gap:10px;margin-top:12px">
            <button onclick="mpBack('customerInfo')" style="flex:1;height:44px;border:1px solid #ddd;background:white;color:var(--text-secondary);border-radius:10px;font-size:14px;font-weight:600;cursor:pointer"><i class="fas fa-arrow-left" style="margin-right:4px"></i> 返回</button>
            <button onclick="mpSubmitAddress()" style="flex:2;height:44px;border:none;background:linear-gradient(135deg,var(--primary),var(--secondary));color:white;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer"><i class="fas fa-check" style="margin-right:4px"></i> 提交</button>
        </div>
    </div>`;
}

function mpSubmitAddress() {
    const name = document.getElementById('mpAddrName').value.trim();
    const contact = document.getElementById('mpAddrContact').value.trim();
    const phone = document.getElementById('mpAddrPhone').value.trim();
    const province = document.getElementById('mpAddrProvince').value;
    const city = document.getElementById('mpAddrCity').value;
    const district = document.getElementById('mpAddrDistrict').value;
    const town = document.getElementById('mpAddrTown').value;
    const detail = document.getElementById('mpAddrDetail').value.trim();
    const phoneErr = document.getElementById('mpPhoneError');

    if (!name) { showToast('请输入名称', 'error'); return; }
    if (!contact) { showToast('请输入联系人', 'error'); return; }
    const phoneReg = /^1[3-9]\d{9}$/;
    if (!phone) { showToast('请输入联系电话', 'error'); return; }
    if (!phoneReg.test(phone)) {
        phoneErr.style.display = 'block';
        showToast('手机号格式不正确', 'error');
        return;
    }
    phoneErr.style.display = 'none';
    if (!province || !city || !district || !town) { showToast('请选择完整的四级地址', 'error'); return; }
    if (!detail) { showToast('请输入详细地址', 'error'); return; }

    const isPickup = window._mpAddType === 'pickup';
    showToast(isPickup ? '提货点新增成功' : '配送点新增成功', 'success');
    mpBack('customerInfo');
}

// ===== 账单管理 =====
function renderMPBillingList(screen) {
    const u = App.miniappUser;
    const bills = MockData.bills.filter(b => b.customerId === u.customerId);
    screen.innerHTML = `
    <div class="mp-header" style="padding-top:36px;padding-bottom:14px">
        <div style="display:flex;align-items:center;gap:10px;justify-content:center">
            <i class="fas fa-arrow-left" style="cursor:pointer;position:absolute;left:20px" onclick="mpBack()"></i>
            <h2 style="font-size:16px">账单管理</h2>
        </div>
    </div>
    <div class="mp-content">
        <div class="mp-card">
            <div class="mp-stats" style="grid-template-columns:1fr 1fr">
                <div class="mp-stat-item"><div class="num">${bills.length}</div><div class="label">总账单</div></div>
                <div class="mp-stat-item"><div class="num" style="color:var(--success)">${formatCurrency(bills.reduce((s,b)=>s+b.totalAmount,0))}</div><div class="label">总金额</div></div>
            </div>
        </div>
        ${bills.length === 0 ? '<div class="mp-card" style="text-align:center;color:var(--text-muted);padding:30px">暂无账单</div>' : ''}
        ${bills.map(b => `
        <div class="mp-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                <h5 style="font-size:13px;font-weight:600">${b.billNo}</h5>
                <span class="status-badge ${b.status==='已确认'?'success':'warning'}" style="font-size:10px">${b.status}</span>
            </div>
            <div style="font-size:12px;color:var(--text-secondary);line-height:1.8">
                <div>账期：${b.period} | 订单数：${b.orderCount}</div>
                <div>金额：<span style="color:var(--primary);font-weight:700">${formatCurrency(b.totalAmount)}</span></div>
                ${b.confirmTime ? `<div>确认时间：${b.confirmTime}</div>` : ''}
                ${b.sapSynced ? `<div>SAP：<span style="color:var(--success)">${b.sapOrderNo}</span></div>` : ''}
            </div>
            ${b.status==='待确认' ? `<button onclick="showToast('账单 ${b.billNo} 已确认','success')" style="width:100%;margin-top:10px;height:36px;border:none;background:var(--success);color:white;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer"><i class="fas fa-check" style="margin-right:4px"></i>确认账单</button>` : ''}
        </div>`).join('')}
    </div>`;
}
