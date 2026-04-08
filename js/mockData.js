/* ============================================
   物流商务订单系统 - 模拟数据
   ============================================ */

const MockData = (() => {

    // ===== 系统配置 =====
    const systemConfig = [
        { id: 1, configKey: '订单类型', configValue: 'TPL_IN', description: '三方入库单' },
        { id: 2, configKey: '是否上传WMS', configValue: 'N', description: '默认不上传WMS' },
        { id: 3, configKey: '产品编号', configValue: 'BZ02', description: '默认产品编号' },
        { id: 4, configKey: '单位', configValue: '个', description: '默认计量单位' },
        { id: 5, configKey: '始发仓库', configValue: '商务虚拟工厂', description: '默认始发仚库' },
        { id: 6, configKey: '要货仓库', configValue: '商务虚拟工厂', description: '默认要货仓库' },
        { id: 7, configKey: '发货点', configValue: '平阳一期', description: '默认发货点' },
    ];

    // ===== 客户合同 =====
    const contracts = [
        {
            id: 1, customerId: 'SWPY', customerName: '商务平阳', contractExpire: '2026-12-31',
            validity: 'Y', auditStatus: '已审核', auditor: '张三', auditTime: '2026-01-15 10:30:00',
            creator: '李四', createTime: '2026-01-10 09:00:00', modifier: '', modifyTime: ''
        },
        {
            id: 2, customerId: 'TH0003', customerName: '瑞安冷库提货', contractExpire: '2026-09-30',
            validity: 'Y', auditStatus: '已审核', auditor: '张三', auditTime: '2026-02-20 14:20:00',
            creator: '王五', createTime: '2026-02-18 11:00:00', modifier: '', modifyTime: ''
        },
        {
            id: 3, customerId: 'TH0004', customerName: '龙湾瑶溪白楼下提货', contractExpire: '2026-06-15',
            validity: 'Y', auditStatus: '已审核', auditor: '张三', auditTime: '2026-01-25 09:45:00',
            creator: '李四', createTime: '2026-01-22 16:00:00', modifier: '王五', modifyTime: '2026-03-01 10:00:00'
        },
        {
            id: 4, customerId: 'TH0005', customerName: '鳌江海跃冷库', contractExpire: '2026-08-20',
            validity: 'Y', auditStatus: '未审核', auditor: '', auditTime: '',
            creator: '赵六', createTime: '2026-03-05 08:30:00', modifier: '', modifyTime: ''
        },
        {
            id: 5, customerId: 'TH0006', customerName: '鳌江杨鸣', contractExpire: '2025-12-31',
            validity: 'N', auditStatus: '已审核', auditor: '张三', auditTime: '2025-06-10 11:00:00',
            creator: '李四', createTime: '2025-05-20 09:00:00', modifier: '', modifyTime: ''
        },
        {
            id: 6, customerId: 'TH0007', customerName: '鑫鑫牧业', contractExpire: '2026-11-30',
            validity: 'Y', auditStatus: '已审核', auditor: '王五', auditTime: '2026-02-28 16:30:00',
            creator: '赵六', createTime: '2026-02-25 14:00:00', modifier: '', modifyTime: ''
        },
        {
            id: 7, customerId: 'TH0008', customerName: '温州鹿城冷链', contractExpire: '2026-10-15',
            validity: 'Y', auditStatus: '未审核', auditor: '', auditTime: '',
            creator: '李四', createTime: '2026-03-10 10:30:00', modifier: '', modifyTime: ''
        },
        {
            id: 8, customerId: 'TH0009', customerName: '苍南金乡物流', contractExpire: '2026-07-01',
            validity: 'Y', auditStatus: '已审核', auditor: '张三', auditTime: '2026-03-15 09:00:00',
            creator: '王五', createTime: '2026-03-12 08:00:00', modifier: '', modifyTime: ''
        },
    ];

    // ===== 提货地址 =====
    const pickupAddresses = [
        { id: 1, customerId: 'SWPY', contactPerson: '陈经理', phone: '13800001001', pickupName: '平阳提货点A', province: '浙江省', city: '温州市', district: '平阳县', town: '昆阳镇', detailAddress: '工业园区A栋3号仓', remark: '工作日8-18点', creator: '李四', createTime: '2026-01-10' },
        { id: 2, customerId: 'SWPY', contactPerson: '林主管', phone: '13800001002', pickupName: '平阳提货点B', province: '浙江省', city: '温州市', district: '平阳县', town: '万全镇', detailAddress: '物流中心B区', remark: '', creator: '李四', createTime: '2026-01-10' },
        { id: 3, customerId: 'TH0003', contactPerson: '周经理', phone: '13800002001', pickupName: '瑞安冷库提货点', province: '浙江省', city: '温州市', district: '瑞安市', town: '安阳街道', detailAddress: '冷链物流园1号库', remark: '需提前预约', creator: '王五', createTime: '2026-02-18' },
        { id: 4, customerId: 'TH0004', contactPerson: '吴师傅', phone: '13800003001', pickupName: '龙湾提货点', province: '浙江省', city: '温州市', district: '龙湾区', town: '瑶溪街道', detailAddress: '白楼下冷库园区', remark: '', creator: '李四', createTime: '2026-01-22' },
        { id: 5, customerId: 'TH0005', contactPerson: '黄经理', phone: '13800004001', pickupName: '鳌江海跃冷库', province: '浙江省', city: '温州市', district: '平阳县', town: '鳌江镇', detailAddress: '海跃冷链基地C区', remark: '24小时收货', creator: '赵六', createTime: '2026-03-05' },
        { id: 6, customerId: 'TH0007', contactPerson: '郑总', phone: '13800006001', pickupName: '鑫鑫牧业提货点', province: '浙江省', city: '温州市', district: '平阳县', town: '水头镇', detailAddress: '牧业产业园2号', remark: '', creator: '赵六', createTime: '2026-02-25' },
    ];

    // ===== 送货地址 =====
    const deliveryAddresses = [
        { id: 1, customerId: 'SWPY', contactPerson: '张收货', phone: '13900001001', province: '浙江省', city: '杭州市', district: '余杭区', town: '仓前街道', detailAddress: '未来科技城冷链中心', remark: '', creator: '李四', createTime: '2026-01-10' },
        { id: 2, customerId: 'SWPY', contactPerson: '刘收货', phone: '13900001002', province: '浙江省', city: '宁波市', district: '北仑区', town: '新碶街道', detailAddress: '港口冷藏仓储A区', remark: '周末不收货', creator: '李四', createTime: '2026-01-10' },
        { id: 3, customerId: 'TH0003', contactPerson: '赵收货', phone: '13900002001', province: '浙江省', city: '金华市', district: '义乌市', town: '稠城街道', detailAddress: '国际商贸城冷链仓', remark: '', creator: '王五', createTime: '2026-02-18' },
        { id: 4, customerId: 'TH0004', contactPerson: '孙收货', phone: '13900003001', province: '浙江省', city: '台州市', district: '路桥区', town: '路桥街道', detailAddress: '中央冷链配送中心', remark: '', creator: '李四', createTime: '2026-01-22' },
        { id: 5, customerId: 'TH0005', contactPerson: '马收货', phone: '13900004001', province: '浙江省', city: '温州市', district: '鹿城区', town: '南汇街道', detailAddress: '鹿城冷链配送中心', remark: '提前2小时通知', creator: '赵六', createTime: '2026-03-05' },
        { id: 6, customerId: 'TH0007', contactPerson: '杨收货', phone: '13900006001', province: '浙江省', city: '丽水市', district: '莲都区', town: '紫金街道', detailAddress: '丽水冷链物流园', remark: '', creator: '赵六', createTime: '2026-02-25' },
    ];

    // ===== 结算信息 =====
    const settlements = [
        { id: 1, customerId: 'SWPY', productAttr: 'CW', settleMethod: '吨', vehicleType: '', unitPrice: 280.00, creator: '李四', createTime: '2026-01-10' },
        { id: 2, customerId: 'SWPY', productAttr: 'LC', settleMethod: '车', vehicleType: '9.6米冷藏车', unitPrice: 3500.00, creator: '李四', createTime: '2026-01-10' },
        { id: 3, customerId: 'TH0003', productAttr: 'LD', settleMethod: '方', vehicleType: '', unitPrice: 120.00, creator: '王五', createTime: '2026-02-18' },
        { id: 4, customerId: 'TH0004', productAttr: 'CW', settleMethod: '个', vehicleType: '', unitPrice: 15.00, creator: '李四', createTime: '2026-01-22' },
        { id: 5, customerId: 'TH0005', productAttr: 'LC', settleMethod: '吨', vehicleType: '', unitPrice: 350.00, creator: '赵六', createTime: '2026-03-05' },
        { id: 6, customerId: 'TH0007', productAttr: 'CW', settleMethod: '车', vehicleType: '4.2米冷藏车', unitPrice: 1800.00, creator: '赵六', createTime: '2026-02-25' },
    ];

    // ===== 商务订单 =====
    const orders = [
        {
            id: 1, orderNo: 'SW2026032901', isTransfer: false,
            senderId: 'SWPY', senderName: '商务平阳',
            deliveryDate: '2026-03-30', auditStatus: '已审核',
            productAttr: 'CW', routeNo: 'SW0200', originOrg: '商务虚拟工厂',
            revenue: 2000, remark: '加急配送',
            receiverId: 'TH0003', receiverName: '瑞安冷库提货',
            receiverPhone: '13900002001', quantity: 50, weight: 1547.29, volume: 14.505,
            totalFreight: 2000, creator: '系统', createTime: '2026-03-29 08:00:00',
            deliveryAddress: '浙江省温州市瑞安市安阳街道冷链物流园1号库', deliveryContact: '赵收货', deliveryContactPhone: '13900002001', deliveryStatus: '已签收'
        },
        {
            id: 2, orderNo: 'SW2026032902', isTransfer: true,
            senderId: 'SWPY', senderName: '商务平阳',
            deliveryDate: '2026-03-30', auditStatus: '已审核',
            productAttr: 'LC', routeNo: 'SW0200', originOrg: '商务虚拟工厂',
            revenue: 3500, remark: '',
            receiverId: 'TH0004', receiverName: '龙湾瑶溪白楼下提货',
            receiverPhone: '13900003001', quantity: 80, weight: 2450.00, volume: 22.300,
            totalFreight: 3500, creator: '系统', createTime: '2026-03-29 08:15:00',
            deliveryAddress: '浙江省温州市龙湾区瑶溪街道白楼下冷库园区', deliveryContact: '孙收货', deliveryContactPhone: '13900003001', deliveryStatus: '配送中'
        },
        {
            id: 3, orderNo: 'SW2026032903', isTransfer: false,
            senderId: 'TH0003', senderName: '瑞安冷库提货',
            deliveryDate: '2026-03-30', auditStatus: '待审核',
            productAttr: 'LD', routeNo: '', originOrg: '商务虚拟工厂',
            revenue: 0, remark: '冷冻品，注意温控',
            receiverId: 'TH0005', receiverName: '鳌江海跃冷库',
            receiverPhone: '13900004001', quantity: 30, weight: 980.50, volume: 8.200,
            totalFreight: 0, creator: '系统', createTime: '2026-03-29 09:00:00',
            deliveryAddress: '浙江省温州市平阳县鳌江镇海跃冷链基地C区', deliveryContact: '马收货', deliveryContactPhone: '13900004001', deliveryStatus: '待发货'
        },
        {
            id: 4, orderNo: 'SW2026032904', isTransfer: false,
            senderId: 'TH0005', senderName: '鳌江海跃冷库',
            deliveryDate: '2026-03-31', auditStatus: '待审核',
            productAttr: 'CW', routeNo: '', originOrg: '商务虚拟工厂',
            revenue: 0, remark: '',
            receiverId: 'TH0006', receiverName: '鳌江杨鸣',
            receiverPhone: '13900005001', quantity: 120, weight: 3600.00, volume: 30.000,
            totalFreight: 0, creator: '系统', createTime: '2026-03-29 09:30:00',
            deliveryAddress: '浙江省温州市平阳县鳌江镇杨鸣冷库', deliveryContact: '杨收货', deliveryContactPhone: '13900005001', deliveryStatus: '待发货'
        },
        {
            id: 5, orderNo: 'SW2026032801', isTransfer: false,
            senderId: 'SWPY', senderName: '商务平阳',
            deliveryDate: '2026-03-29', auditStatus: '已审核',
            productAttr: 'CW', routeNo: 'SW0100', originOrg: '商务虚拟工厂',
            revenue: 1800, remark: '',
            receiverId: 'TH0007', receiverName: '鑫鑫牧业',
            receiverPhone: '13900006001', quantity: 40, weight: 1200.00, volume: 10.500,
            totalFreight: 1800, creator: '系统', createTime: '2026-03-28 14:00:00',
            deliveryAddress: '浙江省温州市平阳县水头镇牧业产业园2号', deliveryContact: '杨收货', deliveryContactPhone: '13900006001', deliveryStatus: '已签收'
        },
        {
            id: 6, orderNo: 'SW2026032802', isTransfer: true,
            senderId: 'TH0007', senderName: '鑫鑫牧业',
            deliveryDate: '2026-03-29', auditStatus: '已审核',
            productAttr: 'LC', routeNo: 'SW0300', originOrg: '商务虚拟工厂',
            revenue: 4200, remark: '冷藏专车',
            receiverId: 'SWPY', receiverName: '商务平阳',
            receiverPhone: '13800001001', quantity: 100, weight: 3200.00, volume: 28.000,
            totalFreight: 4200, creator: '系统', createTime: '2026-03-28 15:00:00',
            deliveryAddress: '浙江省温州市平阳县昆阳镇工业园区A栋3号仓', deliveryContact: '陈经理', deliveryContactPhone: '13800001001', deliveryStatus: '配送中'
        },
        {
            id: 7, orderNo: 'SW2026032701', isTransfer: false,
            senderId: 'TH0003', senderName: '瑞安冷库提货',
            deliveryDate: '2026-03-28', auditStatus: '已审核',
            productAttr: 'LD', routeNo: 'SW0200', originOrg: '商务虚拟工厂',
            revenue: 1500, remark: '',
            receiverId: 'TH0004', receiverName: '龙湾瑶溪白楼下提货',
            receiverPhone: '13900003001', quantity: 25, weight: 750.00, volume: 6.800,
            totalFreight: 1500, creator: '系统', createTime: '2026-03-27 10:00:00',
            deliveryAddress: '浙江省温州市龙湾区瑶溪街道白楼下冷库园区', deliveryContact: '孙收货', deliveryContactPhone: '13900003001', deliveryStatus: '已签收'
        },
        {
            id: 8, orderNo: 'SW2026032702', isTransfer: false,
            senderId: 'SWPY', senderName: '商务平阳',
            deliveryDate: '2026-03-28', auditStatus: '已审核',
            productAttr: 'CW', routeNo: 'SW0100', originOrg: '商务虚拟工厂',
            revenue: 2200, remark: '',
            receiverId: 'TH0005', receiverName: '鳌江海跃冷库',
            receiverPhone: '13900004001', quantity: 60, weight: 1800.00, volume: 15.000,
            totalFreight: 2200, creator: '系统', createTime: '2026-03-27 11:00:00',
            deliveryAddress: '浙江省温州市平阳县鳌江镇海跃冷链基地C区', deliveryContact: '马收货', deliveryContactPhone: '13900004001', deliveryStatus: '已签收'
        },
    ];

    // ===== 中转点信息 =====
    const transferPoints = [
        { id: 1, orderNo: 'SW2026032902', seq: 1, warehouse: '瑞安中转冷库', waybillNo: 'YD20260329001', freight: 1500, contactPerson: '周经理', phone: '13800002001' },
        { id: 2, orderNo: 'SW2026032902', seq: 2, warehouse: '龙湾配送中心', waybillNo: 'YD20260329002', freight: 2000, contactPerson: '吴师傅', phone: '13800003001' },
        { id: 3, orderNo: 'SW2026032802', seq: 1, warehouse: '平阳中转站', waybillNo: 'YD20260328003', freight: 2000, contactPerson: '林主管', phone: '13800001002' },
        { id: 4, orderNo: 'SW2026032802', seq: 2, warehouse: '鹿城集散中心', waybillNo: 'YD20260328004', freight: 2200, contactPerson: '郑总', phone: '13800006001' },
    ];

    // ===== 审核操作日志 =====
    const auditLogs = [
        { id: 1, time: '2026-01-15 10:30:00', operator: '张三', action: '审核通过', targetType: '合同', targetId: 'SWPY', remark: '资质齐全' },
        { id: 2, time: '2026-02-20 14:20:00', operator: '张三', action: '审核通过', targetType: '合同', targetId: 'TH0003', remark: '' },
        { id: 3, time: '2026-03-29 08:05:00', operator: '张三', action: '审核通过', targetType: '订单', targetId: 'SW2026032901', remark: '加急处理' },
        { id: 4, time: '2026-03-29 08:20:00', operator: '张三', action: '审核通过', targetType: '订单', targetId: 'SW2026032902', remark: '' },
    ];

    // ===== 订单修改日志 =====
    const orderModifyLogs = [
        { id: 1, time: '2026-03-29 10:00:00', operator: '张三', orderNo: 'SW2026032901', field: '收入金额', oldValue: '1800', newValue: '2000', remark: '客户确认调整' },
    ];

    // ===== 账单 =====
    const bills = [
        { id: 1, billNo: 'BL2026030001', customerId: 'SWPY', customerName: '商务平阳', orderCount: 3, totalAmount: 6000.00, status: '已确认', confirmTime: '2026-03-28 16:00:00', sapSynced: true, sapOrderNo: 'SAP20260328001', period: '2026年3月' },
        { id: 2, billNo: 'BL2026030002', customerId: 'TH0003', customerName: '瑞安冷库提货', orderCount: 2, totalAmount: 3000.00, status: '已确认', confirmTime: '2026-03-28 17:00:00', sapSynced: true, sapOrderNo: 'SAP20260328002', period: '2026年3月' },
        { id: 3, billNo: 'BL2026030003', customerId: 'TH0007', customerName: '鑫鑫牧业', orderCount: 1, totalAmount: 4200.00, status: '待确认', confirmTime: '', sapSynced: false, sapOrderNo: '', period: '2026年3月' },
        { id: 4, billNo: 'BL2026030004', customerId: 'TH0004', customerName: '龙湾瑶溪白楼下提货', orderCount: 2, totalAmount: 5000.00, status: '待确认', confirmTime: '', sapSynced: false, sapOrderNo: '', period: '2026年3月' },
        { id: 5, billNo: 'BL2026020001', customerId: 'SWPY', customerName: '商务平阳', orderCount: 8, totalAmount: 18500.00, status: '已确认', confirmTime: '2026-03-05 10:00:00', sapSynced: true, sapOrderNo: 'SAP20260305001', period: '2026年2月' },
        { id: 6, billNo: 'BL2026020002', customerId: 'TH0005', customerName: '鳌江海跃冷库', orderCount: 4, totalAmount: 9800.00, status: '已确认', confirmTime: '2026-03-05 11:00:00', sapSynced: true, sapOrderNo: 'SAP20260305002', period: '2026年2月' },
    ];

    // ===== 用户账号 =====
    const users = [
        { id: 1, username: 'admin', role: '系统管理员', customerId: '', isActive: true, lastLogin: '2026-03-29 08:00:00' },
        { id: 2, username: 'zhangsan', role: '商务审核员', customerId: '', isActive: true, lastLogin: '2026-03-29 09:15:00' },
        { id: 3, username: 'wangwu', role: '商务审核员', customerId: '', isActive: true, lastLogin: '2026-03-28 14:00:00' },
        { id: 4, username: 'SWPY', role: '客户', customerId: 'SWPY', isActive: true, lastLogin: '2026-03-29 07:30:00' },
        { id: 5, username: 'TH0003', role: '客户', customerId: 'TH0003', isActive: true, lastLogin: '2026-03-28 10:00:00' },
        { id: 6, username: 'TH0005', role: '客户', customerId: 'TH0005', isActive: true, lastLogin: '2026-03-27 16:00:00' },
        { id: 7, username: 'TH0007', role: '客户', customerId: 'TH0007', isActive: true, lastLogin: '2026-03-26 09:00:00' },
        { id: 8, username: 'zhaoliu', role: '商务审核员', customerId: '', isActive: false, lastLogin: '2026-03-01 08:00:00' },
    ];

    // ===== 组织机构(TMS) =====
    const tmsOrgs = [
        '商务虚拟工厂', '温州冷链中心', '杭州配送中心', '宁波集散中心', '金华中转站', '台州分拨中心'
    ];

    // ===== 车型(TMS) =====
    const vehicleTypes = [
        '4.2米冷藏车', '6.8米冷藏车', '9.6米冷藏车', '13米冷藏车', '4.2米常温车', '6.8米常温车', '9.6米常温车'
    ];

    // ===== 产品属性 =====
    const productAttrs = [
        { value: 'CW', label: 'CW - 常温' },
        { value: 'LC', label: 'LC - 冷藏' },
        { value: 'LD', label: 'LD - 冷冻' },
    ];

    // ===== 结算方式 =====
    const settleMethods = ['个', '吨', '方', '车'];

    // ===== Dashboard 统计 =====
    const dashboardStats = {
        todayOrders: 4,
        pendingAudit: 2,
        activeContracts: 6,
        monthRevenue: 15200,
        monthlyOrderTrend: [
            { month: '10月', value: 42 },
            { month: '11月', value: 56 },
            { month: '12月', value: 48 },
            { month: '1月', value: 65 },
            { month: '2月', value: 38 },
            { month: '3月', value: 72 },
        ],
        orderStatusDist: {
            '已审核': 6,
            '待审核': 2,
        },
        topCustomers: [
            { name: '商务平阳', orders: 28, revenue: 56000 },
            { name: '鑫鑫牧业', orders: 15, revenue: 32000 },
            { name: '瑞安冷库提货', orders: 12, revenue: 24000 },
            { name: '鳌江海跃冷库', orders: 10, revenue: 18000 },
            { name: '龙湾瑶溪白楼下提货', orders: 8, revenue: 15000 },
        ],
        recentActivities: [
            { time: '09:30', action: '新增订单', detail: 'SW2026032904 - 鳌江海跃冷库→鳌江杨鸣', type: 'info' },
            { time: '09:00', action: '新增订单', detail: 'SW2026032903 - 瑞安冷库→鳌江海跃冷库', type: 'info' },
            { time: '08:15', action: '审核通过', detail: 'SW2026032902 - 商务平阳→龙湾瑶溪', type: 'success' },
            { time: '08:00', action: '审核通过', detail: 'SW2026032901 - 商务平阳→瑞安冷库', type: 'success' },
            { time: '昨天 17:00', action: '账单确认', detail: 'BL2026030002 - 瑞安冷库提货 ¥3,000', type: 'warning' },
            { time: '昨天 16:00', action: '账单确认', detail: 'BL2026030001 - 商务平阳 ¥6,000', type: 'warning' },
        ]
    };

    return {
        systemConfig,
        contracts,
        pickupAddresses,
        deliveryAddresses,
        settlements,
        orders,
        transferPoints,
        auditLogs,
        orderModifyLogs,
        bills,
        users,
        tmsOrgs,
        vehicleTypes,
        productAttrs,
        settleMethods,
        dashboardStats,
    };
})();
