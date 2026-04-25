import './index.css';
import { db, storage } from './firebase.js';
import { collection, onSnapshot, addDoc, getDocs, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

let orders = [];
let menuItems = [];

export function normalizePlatform(rawPlatform) {
  if (!rawPlatform) return 'Unknown';
  const platMap = {
    'cater2.me': 'Cater2.me',
    'ezcater': 'ezCater',
    'uber eats': 'Uber Eats',
    'doordash': 'DoorDash',
    'clubfeast': 'ClubFeast',
    'direct': 'Direct',
    'manual': 'Direct',
    'manual entry': 'Direct',
    'forkable': 'Forkable',
    'fooda': 'Fooda',
    'foodja': 'Foodja',
    'hungry': 'Hungry',
    'zerocater': 'Zerocater'
  };
  return platMap[rawPlatform.toLowerCase().trim()] || rawPlatform.trim();
}

const MOCK_ORDERS = [
  {
    id: '#ORD-7023',
    platform: 'Forkable',
    customerName: 'Acme Corp',
    typeOfOrder: 'Meal Manager',
    deliveryDate: '2026-04-08',
    deliveryTime: '11:30 AM',
    deliveryMethod: 'Platform',
    pickUpTime: '11:00 AM',
    subtotal: 350.00,
    total: 385.00,
    netPayout: 310.50,
    status: 'Completed',
    items: [
      { name: 'Gourmet Salmon Bowl', amount: 15, notes: 'No onions on 5 of them' },
      { name: 'Vegan Wrap Assortment', amount: 5, notes: 'Gluten-free wraps' }
    ],
    overallNotes: 'Leave at front desk with receptionist.'
  },
  {
    id: '#ORD-7024',
    platform: 'Doordash',
    customerName: 'TechFlow HQ',
    typeOfOrder: 'Catering',
    deliveryDate: '2026-04-09',
    deliveryTime: '12:00 PM',
    deliveryMethod: 'Third-Party',
    pickUpTime: '11:15 AM',
    subtotal: 540.00,
    total: 590.25,
    netPayout: 460.00,
    status: 'New',
    items: [
      { name: 'Artisan Sandwich Platter', amount: 3, notes: 'Half turkey, half roast beef' },
      { name: 'Caesar Salad (Large)', amount: 2, notes: 'Dressing on the side' }
    ],
    overallNotes: 'Please call upon arrival.'
  },
  {
    id: '#ORD-7025',
    platform: 'ezCater',
    customerName: 'Stark Industries',
    typeOfOrder: 'Catering',
    deliveryDate: '2026-04-10',
    deliveryTime: '01:00 PM',
    deliveryMethod: 'HolyShred',
    pickUpTime: '',
    subtotal: 1200.00,
    total: 1350.00,
    netPayout: 1050.00,
    status: 'Finalized',
    items: [
      { name: 'Corporate Breakfast Box', amount: 50, notes: '' }
    ],
    overallNotes: 'VIP client, ensure impeccable presentation.'
  }
];

const MOCK_MENUS = [
  { title: 'Artisan Sandwich Platter', desc: 'A premium artisan sandwich platter, beautifully arranged. Includes turkey, club, and vegan options.', platform: 'ezCater', imgPath: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&w=600&q=80' },
  { title: 'Gourmet Salmon Bowls', desc: 'Fresh, vibrant colors, organic ingredients, beautifully plated salmon bowls with quinoa.', platform: 'Forkable', imgPath: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80' },
  { title: 'Corporate Breakfast Box', desc: 'Assorted pastries, fresh fruit, and premium coffee setup for early morning meetings.', platform: 'DoorDash', imgPath: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e40?auto=format&fit=crop&w=600&q=80' },
  { title: 'Vegan Wrap Assortment', desc: 'Plant-based wraps with house-made hummus, roasted veggies, and tahini drizzle.', platform: 'Uber Eats', imgPath: 'https://images.unsplash.com/photo-1626804475297-41609ea0adb4?auto=format&fit=crop&w=600&q=80' }
];

// Tab Switching Logic
let calendarObj = null;

function initCalendar() {
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) return;
  
  calendarObj = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    events: orders.map(o => ({
      id: o.fbId,
      title: `${o.platform} - ${o.id}`,
      start: o.deliveryDate,
      extendedProps: { order: o }
    })),
    dayMaxEvents: false,
    height: 'auto',
    eventClick: function(info) {
      openOrderDetails(info.event.extendedProps.order);
    }
  });

  calendarObj.render();
}

document.querySelectorAll('.nav-item').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    button.classList.add('active');
    const tabId = button.getAttribute('data-tab') + '-tab';
    document.getElementById(tabId).classList.add('active');
    
    if (tabId === 'calendar-tab') {
      setTimeout(() => {
        if (!calendarObj) {
          initCalendar();
        } else {
          calendarObj.updateSize();
        }
      }, 50);
    }
  });
});



// Compute Dynamic Status
function computeOrderStatus(order) {
  if (order.status === 'Cancelled' || order.status === 'Archived') return order.status;
  try {
    if (!order.deliveryDate) return order.status || 'New';
    const nowSF = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
    const [yy, mm, dd] = order.deliveryDate.split('-');
    const deliveryMoment = new Date(parseInt(yy), parseInt(mm) - 1, parseInt(dd));
    const finalizeMoment = new Date(parseInt(yy), parseInt(mm) - 1, parseInt(dd) - 1, 17, 0, 0); // 5 PM day before
    
    let tStr = order.pickUpTime || order.deliveryTime || "";
    if (tStr) {
       tStr = tStr.trim().toUpperCase();
       let hr = 12, mn = 0;
       const match = tStr.match(/(\d+):(\d+)\s*(AM|PM)?/);
       if (match) {
         hr = parseInt(match[1]);
         mn = parseInt(match[2]);
         const ampm = match[3];
         if (ampm === 'PM' && hr < 12) hr += 12;
         if (ampm === 'AM' && hr === 12) hr = 0;
       }
       deliveryMoment.setHours(hr, mn, 0);
    } else {
       deliveryMoment.setHours(12, 0, 0);
    }
    
    if (nowSF > deliveryMoment) return 'Completed';
    if (nowSF >= finalizeMoment) return 'Finalize';
    return 'New';
  } catch (e) {
    return order.status || 'New';
  }
}

// Global utility to resolve platform aliases back to official menu titles
function getOfficialDishName(rawName) {
    if (!rawName) return 'Unknown Item';
    const cleanRaw = rawName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Look through menu items
    for (const menu of menuItems) {
        // 1. Check title match
        if (menu.title && menu.title.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanRaw) {
            return menu.title;
        }
        
        // 2. Check platform overrides (aliases)
        if (menu.platformOverrides) {
            for (const plat of Object.keys(menu.platformOverrides)) {
                const alias = menu.platformOverrides[plat]?.alias;
                if (alias && alias.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanRaw) {
                    return menu.title;
                }
            }
        }
    }
    return rawName; // Fallback to raw name if no match found
}

// Render Dashboard
function renderDashboard() {
  const dashTotalOrders = document.getElementById('dash-total-orders');
  const dashTotalAmount = document.getElementById('dash-total-amount');
  const dashNetPayout = document.getElementById('dash-net-payout');
  const dashAvgPayout = document.getElementById('dash-avg-payout');
  const dashPopularDishes = document.getElementById('dash-popular-dishes');
  const dashPlatformBreakdown = document.getElementById('dash-platform-breakdown');
  
  if (!dashTotalOrders) return;

  let totalAmount = 0;
  let totalNetPayout = 0;
  const deliveryDates = new Set();

  const dishCounts = {};
  const platformStats = {};
  
  const startDate = document.getElementById('dash-start-date').value;
  const endDate = document.getElementById('dash-end-date').value;

  const filteredOrders = orders.filter(o => {
    if (o.status === 'Cancelled' || o.status === 'Archived') return false;
    if (!o.deliveryDate) return false;
    if (startDate && o.deliveryDate < startDate) return false;
    if (endDate && o.deliveryDate > endDate) return false;
    return true;
  });

  const totalOrders = filteredOrders.length;
  
  filteredOrders.forEach(o => {
    totalAmount += (parseFloat(o.total) || 0);
    totalNetPayout += (parseFloat(o.netPayout) || 0);
    if (o.deliveryDate) deliveryDates.add(o.deliveryDate);
    
    // Platform stats
    const plat = normalizePlatform(o.platform) || 'Unknown';
    if (!platformStats[plat]) {
      platformStats[plat] = { count: 0, total: 0, netPayout: 0 };
    }
    platformStats[plat].count += 1;
    platformStats[plat].total += (parseFloat(o.total) || 0);
    platformStats[plat].netPayout += (parseFloat(o.netPayout) || 0);

    // Dishes
    if (o.items && Array.isArray(o.items)) {
      o.items.forEach(item => {
        const officialName = getOfficialDishName(item.name);
        const amount = parseInt(item.amount) || 1;
        dishCounts[officialName] = (dishCounts[officialName] || 0) + amount;
      });
    }
  });

  let daysDivisor = deliveryDates.size;
  if (startDate) {
     const [yr, mo] = startDate.split('-');
     daysDivisor = new Date(parseInt(yr), parseInt(mo), 0).getDate();
  }

  const avgPayout = daysDivisor > 0 ? (totalNetPayout / daysDivisor) : 0;

  dashTotalOrders.innerText = totalOrders;
  dashTotalAmount.innerText = '$' + totalAmount.toFixed(2);
  dashNetPayout.innerText = '$' + totalNetPayout.toFixed(2);
  dashAvgPayout.innerText = '$' + avgPayout.toFixed(2);

  const sortedDishes = Object.entries(dishCounts).sort((a,b) => b[1] - a[1]).slice(0, 10);
  dashPopularDishes.innerHTML = sortedDishes.map(([name, count], i) => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; ${i < sortedDishes.length - 1 ? 'border-bottom: 1px solid rgba(255,255,255,0.05);' : ''}">
      <span style="font-weight: 500;">${name}</span>
      <span style="background: rgba(110, 231, 183, 0.2); color: #6ee7b7; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">${count}x</span>
    </div>
  `).join('');

  const sortedPlatforms = Object.entries(platformStats).sort((a,b) => b[1].netPayout - a[1].netPayout);
  dashPlatformBreakdown.innerHTML = sortedPlatforms.map(([plat, stats], i) => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; ${i < sortedPlatforms.length - 1 ? 'border-bottom: 1px solid rgba(255,255,255,0.05);' : ''}">
      <span style="font-weight: 500; font-size: 0.95rem;">${plat} <span style="color:#9ca3af; font-size:0.8rem; margin-left:8px;">(${stats.count} orders)</span></span>
      <div style="text-align: right;">
        <div style="color: #6ee7b7; font-weight: bold;">$${stats.netPayout.toFixed(2)} <span style="font-size:0.75rem; color:#9ca3af; font-weight: normal;">net</span></div>
        <div style="font-size: 0.75rem; color: #9ca3af;">$${stats.total.toFixed(2)} total</div>
      </div>
    </div>
  `).join('');
}

// Add event listeners to date pickers
document.getElementById('dash-start-date')?.addEventListener('change', renderDashboard);
document.getElementById('dash-end-date')?.addEventListener('change', renderDashboard);

// Render Orders Table
function renderOrders() {
  const tbody = document.getElementById('orders-tbody');
  tbody.innerHTML = '';

  const platformFilter = document.getElementById('orders-platform-filter')?.value || 'all';
  const statusFilter = document.getElementById('orders-status-filter')?.value || 'all';
  const startDate = document.getElementById('orders-start-date')?.value || '';
  const endDate = document.getElementById('orders-end-date')?.value || '';

  const filteredOrders = orders.filter(o => {
    let keep = true;
    if (platformFilter !== 'all' && (!o.platform || o.platform.toLowerCase() !== platformFilter.toLowerCase())) keep = false;
    
    const dynamicStatus = computeOrderStatus(o);
    if (statusFilter !== 'all' && dynamicStatus.toLowerCase() !== statusFilter.toLowerCase()) keep = false;

    if (startDate && (!o.deliveryDate || o.deliveryDate < startDate)) keep = false;
    if (endDate && (!o.deliveryDate || o.deliveryDate > endDate)) keep = false;

    return keep;
  });

  filteredOrders.forEach(order => {
    try {
      const dynamicStatus = computeOrderStatus(order);
      let statusClass = 'status-pending';
      if (dynamicStatus === 'Completed') statusClass = 'status-completed';
      if (dynamicStatus === 'Finalize') statusClass = 'status-finalize';
      if (dynamicStatus === 'Cancelled') statusClass = 'status-cancelled';
      
      const row = document.createElement('tr');
      const itemsStr = order.items && order.items.length > 0 
        ? order.items.map(i => `${i.amount}x ${i.name || 'Item'}`).join(', ') 
        : 'No Items recorded';

      let methodTimeStr = '';
      let methodType = order.deliveryMethod || 'Platform';
      if (methodType.toLowerCase() === 'platform' || methodType.toLowerCase() === 'partner') {
          methodTimeStr = `Pick up: <span style="color: #6ee7b7; font-weight: 500;">${order.pickUpTime || order.deliveryTime || 'TBD'}</span>`;
      } else {
          methodTimeStr = `Deliver: <span style="color: #6ee7b7; font-weight: 500;">${order.deliveryTime || 'TBD'}</span>`;
      }

      let displayPayout = "0.00";
      if (typeof order.netPayout === 'number') displayPayout = order.netPayout.toFixed(2);
      else if (order.netPayout) displayPayout = parseFloat(order.netPayout).toFixed(2) || "0.00";

    row.innerHTML = `
      <td><strong>${order.id}</strong></td>
      <td>${normalizePlatform(order.platform)}</td>
      <td>${order.customerName}</td>
      <td style="white-space: nowrap;">${order.deliveryDate}</td>
      <td>
        <div style="font-weight: 500; margin-bottom: 0.25rem;">${methodType}</div>
        <div style="font-size: 0.8rem; color: #9ca3af;">${methodTimeStr}</div>
      </td>
      <td style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.85rem; color: #9ca3af;">${itemsStr}</td>
      <td>$${displayPayout}</td>
      <td><span class="status-badge ${statusClass}">${dynamicStatus}</span></td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          <button class="secondary-btn edit-order-btn" data-id="${order.fbId}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Edit</button>
          <button class="delete-order-btn" data-id="${order.fbId}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid #ef4444; border-radius: 8px; cursor: pointer;">Delete</button>
        </div>
      </td>
    `;
    
    row.style.cursor = 'pointer';
    row.addEventListener('click', async (e) => {
      const isBtn = e.target.closest('button');
      if (isBtn && isBtn.classList.contains('delete-order-btn')) {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this order?')) {
          await updateDoc(doc(db, 'orders', order.fbId), { isDeleted: true });
        }
      } else if (isBtn && isBtn.classList.contains('edit-order-btn')) {
        e.stopPropagation();
        const addOrderForm = document.getElementById('add-order-form');
        addOrderForm.dataset.editingId = order.fbId;
        
        document.getElementById('new-order-platform').value = order.platform || 'Direct';
        document.getElementById('new-order-id').value = order.id || '';
        document.getElementById('new-order-type').value = order.typeOfOrder || 'Catering';
        document.getElementById('new-order-customer').value = order.customerName || '';
        document.getElementById('new-order-date').value = order.deliveryDate || '';
        document.getElementById('new-order-time').value = order.deliveryTime || '';
        document.getElementById('new-order-method').value = order.deliveryMethod || 'Platform';
        document.getElementById('new-order-pickup').value = order.pickUpTime || '';
        document.getElementById('new-order-subtotal').value = order.subtotal || 0;
        document.getElementById('new-order-total').value = order.total || 0;
        document.getElementById('new-order-payout').value = order.netPayout || 0;
        document.getElementById('new-order-notes').value = order.overallNotes || '';
        
        const itemsContainer = document.getElementById('new-order-items-container');
        itemsContainer.innerHTML = '';
        if (order.items && order.items.length > 0) {
           order.items.forEach(item => {
               createItemRow();
               const lastRow = itemsContainer.lastElementChild;
               lastRow.querySelector('.item-name-select').value = item.name || '';
               lastRow.querySelector('.item-amount').value = item.amount || 1;
               lastRow.querySelector('.item-notes-input').value = item.notes || '';
           });
        }
        document.getElementById('add-order-modal').classList.add('active');
      } else {
        openOrderDetails(order);
      }
    });
    
    tbody.appendChild(row);
    } catch (e) { console.error(e) }
  });
}

// Side Panel Logic
function openOrderDetails(order) {
  const panelContent = document.getElementById('panel-content');
  const overlay = document.getElementById('order-modal-overlay');
  const panel = document.getElementById('order-details-panel');

  const itemsHtml = order.items.map(item => `
    <div class="item-row">
      <span><strong>${item.amount}x</strong> ${item.name}</span>
      ${item.notes ? `<div class="item-notes">Note: ${item.notes}</div>` : ''}
    </div>
  `).join('');

    let timeLabel = '';
    let timeValue = '';
    let methodType = order.deliveryMethod || 'Platform';
    if (methodType.toLowerCase() === 'platform' || methodType.toLowerCase() === 'partner') {
        timeLabel = 'Pick Up Time';
        timeValue = order.pickUpTime || order.deliveryTime;
    } else {
        timeLabel = 'Delivery Time';
        timeValue = order.deliveryTime;
    }

    const dynamicStatus = computeOrderStatus(order);
    let statusClass = 'status-pending';
    if (dynamicStatus === 'Completed') statusClass = 'status-completed';
    if (dynamicStatus === 'Finalize') statusClass = 'status-finalize';
    if (dynamicStatus === 'Cancelled') statusClass = 'status-cancelled';

    panelContent.innerHTML = `
    <div class="panel-header">
      <h2>${order.id} - ${order.platform}</h2>
      <span class="status-badge ${statusClass}" style="display: inline-block; margin-top: 0.5rem;">${dynamicStatus}</span>
    </div>
    
    <div class="panel-grid">
      <div class="info-group"><label>Customer Name</label><p>${order.customerName}</p></div>
      <div class="info-group"><label>Order Type</label><p>${order.typeOfOrder}</p></div>
      <div class="info-group"><label>Delivery Date</label><p>${order.deliveryDate}</p></div>
      <div class="info-group"><label>Delivery Method</label><p>${methodType}</p></div>
      <div class="info-group"><label>${timeLabel}</label><p style="color: #6ee7b7;">${timeValue}</p></div>
      <div class="info-group"><label>Subtotal</label><p>$${(parseFloat(order.subtotal) || 0).toFixed(2)}</p></div>
      <div class="info-group"><label>Total</label><p>$${(parseFloat(order.total) || 0).toFixed(2)}</p></div>
      <div class="info-group"><label>Net Payout</label><p>$${(parseFloat(order.netPayout) || 0).toFixed(2)}</p></div>
    </div>
    
    <h3>Items in Order</h3>
    <div class="items-list">
      ${itemsHtml}
    </div>
    
    ${order.overallNotes ? `
      <h3>Overall Notes</h3>
      <div class="overall-notes">${order.overallNotes}</div>
    ` : ''}
  `;

  overlay.classList.add('active');
  panel.classList.add('active');
}

const getSpicyIcon = (level) => {
  const num = parseInt(level) || 0;
  return num === 0 ? '<span style="color: rgba(255,255,255,0.1);">-</span>' : '🌶️'.repeat(num);
};

function openMenuDetails(menu) {
  const panelContent = document.getElementById('panel-content');
  const overlay = document.getElementById('order-modal-overlay');
  const panel = document.getElementById('order-details-panel');

  const diet = menu.dietary ? Object.entries(menu.dietary).filter(([k,v]) => v).map(([k,v]) => k.charAt(0).toUpperCase() + k.slice(1)).join(', ') : 'None';
  const allergens = (menu.allergens && menu.allergens.length > 0) ? menu.allergens.join(', ') : 'None specified';
  
  const platformsHtml = menu.platformOverrides ? Object.entries(menu.platformOverrides)
    .filter(([k, p]) => p.price || p.note)
    .map(([k, p]) => `
      <div style="background: rgba(255,255,255,0.05); padding: 0.75rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong style="color: #6ee7b7;">${k}</strong>
          ${p.note ? `<div style="font-size: 0.85rem; margin-top: 0.25rem; color: #9ca3af;">Note: ${p.note}</div>` : ''}
        </div>
        ${p.price ? `<div style="font-size: 1rem; font-weight: bold; margin-left: 1rem;">$${p.price}</div>` : ''}
      </div>
    `).join('') : '<p style="color: #9ca3af; font-size: 0.85rem;">No platform overrides.</p>';

  panelContent.innerHTML = `
    <div class="panel-header">
      <h2>${menu.title || 'Unnamed Menu'}</h2>
      <span class="status-badge" style="background: rgba(99, 102, 241, 0.2); color: #818cf8;">${menu.category || 'Uncategorized'}</span>
    </div>
    
    <div class="panel-grid" style="grid-template-columns: 1fr; gap: 1rem; margin-bottom: 1.5rem;">
      <div class="info-group">
        <label>Description</label>
        <p style="white-space: pre-wrap;">${menu.desc || 'No description provided.'}</p>
      </div>
    </div>

    <div class="panel-grid">
      <div class="info-group"><label>Standard Price</label><p style="font-weight: bold; color: #6ee7b7; font-size: 1.1rem;">$${menu.standardPrice || '0.00'}</p></div>
      <div class="info-group"><label>Cooked Weight</label><p>${menu.weightG ? menu.weightG + 'g' : 'N/A'}</p></div>
      <div class="info-group"><label>Serving Size</label><p>${menu.serving || 'N/A'}</p></div>
      <div class="info-group"><label>Spicy Level</label><p>${getSpicyIcon(menu.spicyLevel)}</p></div>
      <div class="info-group"><label>Base</label><p>${menu.base || 'N/A'}</p></div>
      <div class="info-group"><label>Proteins</label><p>${menu.proteins || 'N/A'}</p></div>
    </div>
    
    <div style="margin-top: 1.5rem; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px;">
      <h3 style="margin-top: 0; margin-bottom: 1rem;">Composition</h3>
      <div class="info-group" style="margin-bottom: 0.75rem;"><label>Ingredients</label><p>${menu.ingredient || 'None specified'}</p></div>
      <div class="info-group" style="margin-bottom: 0.75rem;"><label>Toppings</label><p>${menu.toppings || 'None specified'}</p></div>
      <div class="info-group" style="margin-bottom: 0.75rem;"><label>Sauces</label><p>${menu.sauce || 'None specified'}</p></div>
      <div class="info-group" style="margin-bottom: 0.75rem;"><label>Allergen List</label><p style="color: #ef4444; font-weight: 500;">${allergens}</p></div>
      <div class="info-group" style="margin-bottom: 0;"><label>Dietary Restrictions</label><p style="color: #10b981; font-weight: 500;">${diet}</p></div>
    </div>
    
    <div style="margin-top: 1.5rem;">
      <h3 style="margin-bottom: 1rem;">Platform Modifications</h3>
      ${platformsHtml}
    </div>
  `;

  overlay.classList.add('active');
  panel.classList.add('active');
}

function closeOrderDetails() {
  document.getElementById('order-modal-overlay').classList.remove('active');
  document.getElementById('order-details-panel').classList.remove('active');
}

document.getElementById('close-panel-btn').addEventListener('click', closeOrderDetails);
document.getElementById('order-modal-overlay').addEventListener('click', closeOrderDetails);

// Render Menu Items
function renderMenus(filter = 'all') {
  const tbody = document.getElementById('menu-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  const filtered = menuItems.filter(item => {
    if (filter === 'all') return true;
    return item.category && item.category.toLowerCase().replace(' ', '') === filter;
  });

  filtered.forEach(item => {
    const tr = document.createElement('tr');
    tr.dataset.id = item.fbId;
    tr.style.cursor = 'pointer';
    tr.classList.add('menu-row');
    
    const plats = item.platformOverrides ? Object.keys(item.platformOverrides).filter(k => item.platformOverrides[k].price || item.platformOverrides[k].note).join(', ') : '';
    const basePro = [item.base, item.proteins].filter(Boolean).join(' + ');

    const isDiet = (key) => item.dietary && item.dietary[key] ? '<span style="color: #10b981; font-weight: bold; font-size: 1.1rem;">&#10003;</span>' : '<span style="color: rgba(255,255,255,0.1);">-</span>';

    tr.innerHTML = `
      <td>${item.category || ''}</td>
      <td style="font-weight: 600;">${item.title || ''}</td>
      <td style="font-weight: bold; color: #6ee7b7;">$${item.standardPrice || '0.00'}</td>
      <td style="font-size: 0.85rem; white-space: normal;">${basePro}</td>
      <td>${item.weightG || ''}</td>
      <td style="font-size: 1.1rem;">${getSpicyIcon(item.spicyLevel)}</td>
      <td style="text-align: center;">${isDiet('vegan')}</td>
      <td style="text-align: center;">${isDiet('vegetarian')}</td>
      <td style="text-align: center;">${isDiet('gf')}</td>
      <td style="text-align: center;">${isDiet('soy')}</td>
      <td style="text-align: center;">${isDiet('nut')}</td>
      <td style="text-align: center;">${isDiet('dairy')}</td>
      <td style="text-align: center;">${isDiet('egg')}</td>
      <td style="text-align: center;">${isDiet('sesame')}</td>
      <td style="text-align: center;">${isDiet('shellfish')}</td>
      <td style="text-align: center;">${isDiet('seafood')}</td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          <button class="secondary-btn edit-menu-btn" data-id="${item.fbId}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Edit</button>
          <button class="delete-menu-btn" data-id="${item.fbId}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid #ef4444; border-radius: 8px; cursor: pointer;">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Menu Grid Actions (Edit / Delete)
document.getElementById('save-new-menu-btn')?.addEventListener('click', async () => {
    // Left empty for existing logic or it was from somewhere... wait I should append to the EOF
    // Let me just append.
});

// Crawler Configurations UI
let crawlerConfigs = {};
const PLATFORMS_TO_TRACK = ['ezCater', 'ClubFeast', 'Cater2.me', 'Email Source'];

onSnapshot(doc(db, 'system', 'crawlers'), (docSnap) => {
  if (docSnap.exists()) {
    crawlerConfigs = docSnap.data();
  } else {
    crawlerConfigs = {};
  }
  renderCrawlerConfigs();
});

function renderCrawlerConfigs() {
  const container = document.getElementById('crawlers-configs-container');
  if (!container) return;
  
  let html = '';
  PLATFORMS_TO_TRACK.forEach(plat => {
     const data = crawlerConfigs[plat] || { status: 'Unknown', cookie: '' };
     const isExpired = data.status === 'Expired';
     
     const statColor = isExpired ? '#f87171' : (data.status === 'Active' ? '#6ee7b7' : '#9ca3af');
     
     html += `
       <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 1.25rem; border-radius: 8px;">
         <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
           <h4 style="font-size: 1.1rem; margin: 0;">${plat}</h4>
           <span style="font-size: 0.8rem; font-weight: bold; color: ${statColor}; background: rgba(255,255,255,0.1); padding: 0.2rem 0.6rem; border-radius: 12px;">${data.status}</span>
         </div>
         <div style="margin-bottom: 0.5rem;">
           <label style="display: block; font-size: 0.75rem; color: #9ca3af; margin-bottom: 0.25rem;">${plat === 'Email Source' ? 'Email Address, App Password (Optional)' : 'Authorization Token / Cookie'}</label>
           <input type="text" id="crawler-cookie-${plat.replace(/\s+/g,'-')}" value="${data.cookie || ''}" placeholder="${plat === 'Email Source' ? 'e.g. supassorn@holyshred.co, password123' : 'Paste raw cookie string here...'}" style="width: 100%; background: #0f172a; border: 1px solid rgba(255,255,255,0.1); color: #f8fafc; padding: 0.5rem; border-radius: 4px;" />
         </div>
         ${data.lastRun ? '<div style="font-size: 0.75rem; color: #9ca3af; margin-bottom: 1rem;">Last checked: ' + data.lastRun + '</div>' : '<div style="font-size: 0.75rem; color: #9ca3af; margin-bottom: 1rem;">Never run</div>'}
         <button class="secondary-btn" onclick="saveCrawlerConfig('${plat}')" style="width: 100%; font-size: 0.8rem;">Update Connection</button>
       </div>
     `;
  });
  
  container.innerHTML = html;
  
  const syncBtn = document.getElementById('force-sync-btn');
  if (syncBtn) {
     if (crawlerConfigs.isSyncing) {
         syncBtn.innerText = 'Syncing Orders...';
         syncBtn.disabled = true;
         syncBtn.style.opacity = '0.7';
     } else {
         syncBtn.innerText = crawlerConfigs.lastGlobalSync ? `Refresh Immediately (Last: ${crawlerConfigs.lastGlobalSync})` : 'Refresh Immediately';
         syncBtn.disabled = false;
         syncBtn.style.opacity = '1';
     }
  }
}

document.getElementById('force-sync-btn')?.addEventListener('click', async () => {
    await setDoc(doc(db, 'system', 'crawlers'), { forceSync: true }, { merge: true });
});

window.saveCrawlerConfig = async (plat) => {
   const val = document.getElementById(`crawler-cookie-${plat.replace(/\s+/g,'-')}`).value;
   const payload = {
      [plat]: {
         ...((crawlerConfigs[plat]) || {}),
         cookie: val,
         status: val ? 'Active' : 'Missing', 
         updatedAt: new Date().toLocaleTimeString()
      }
   };
   await setDoc(doc(db, 'system', 'crawlers'), payload, { merge: true });
   alert(`${plat} configuration updated successfully! The scraper will automatically ingest your new token on its next cycle.`);
};

document.getElementById('menu-table-body').addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete-menu-btn')) {
    const id = e.target.getAttribute('data-id');
    if (confirm('Are you sure you want to delete this menu item?')) {
      await deleteDoc(doc(db, 'menus', id));
    }
  } else if (e.target.classList.contains('edit-menu-btn')) {
    const id = e.target.getAttribute('data-id');
    const item = menuItems.find(m => m.fbId === id);
    if (item) {
      document.getElementById('add-menu-form').reset();
      if (typeof allergenTags !== 'undefined') {
        allergenTags = [];
        renderTags();
      }
      initPlatformRows();

      document.getElementById('add-menu-form').dataset.editingId = id;
      document.getElementById('menu-category').value = item.category || '';
      document.getElementById('menu-name').value = item.title || '';
      document.getElementById('menu-desc').value = item.desc || '';
      document.getElementById('menu-price').value = item.standardPrice || '';
      document.getElementById('menu-ingredient').value = item.ingredient || '';
      document.getElementById('menu-toppings').value = item.toppings || '';
      document.getElementById('menu-sauce').value = item.sauce || '';
      document.getElementById('menu-base').value = item.base || '';
      document.getElementById('menu-proteins').value = item.proteins || '';
      document.getElementById('menu-serving').value = item.serving || '';
      document.getElementById('menu-weight-g').value = item.weightG || '';
      if (item.weightG) document.getElementById('menu-weight-g').dispatchEvent(new Event('input'));
      document.getElementById('menu-spicy').value = item.spicyLevel || '0';
      
      if (item.allergens && Array.isArray(item.allergens)) {
        allergenTags = [...item.allergens];
        renderTags();
      }
      
      if (item.dietary) {
        document.getElementById('diet-vegan').checked = !!item.dietary.vegan;
        document.getElementById('diet-vegetarian').checked = !!item.dietary.vegetarian;
        document.getElementById('diet-gf').checked = !!item.dietary.gf;
        document.getElementById('diet-soy').checked = !!item.dietary.soy;
        document.getElementById('diet-sesame').checked = !!item.dietary.sesame;
        document.getElementById('diet-nut').checked = !!item.dietary.nut;
        document.getElementById('diet-dairy').checked = !!item.dietary.dairy;
        document.getElementById('diet-egg').checked = !!item.dietary.egg;
        document.getElementById('diet-shellfish').checked = !!item.dietary.shellfish;
        document.getElementById('diet-seafood').checked = !!item.dietary.seafood;
      }

      if (item.platformOverrides) {
        document.querySelectorAll('#platform-details-container .platform-alias').forEach(el => {
          const p = el.getAttribute('data-platform');
          if (item.platformOverrides[p]) {
            el.value = item.platformOverrides[p].alias || '';
            if (el.value) el.dataset.dirty = "true";
          }
        });
        document.querySelectorAll('#platform-details-container .platform-note').forEach(el => {
          const p = el.getAttribute('data-platform');
          if (item.platformOverrides[p]) el.value = item.platformOverrides[p].note || '';
        });
        document.querySelectorAll('#platform-details-container .platform-price').forEach(el => {
          const p = el.getAttribute('data-platform');
          if (item.platformOverrides[p]) {
            el.value = item.platformOverrides[p].price || '';
            if (el.value) el.dataset.dirty = "true";
          }
        });
      }
      
      addMenuModal.classList.add('active');
    }
  } else {
    const tr = e.target.closest('tr');
    if (tr) {
      const id = tr.getAttribute('data-id');
      const item = menuItems.find(m => m.fbId === id);
      if (item) openMenuDetails(item);
    }
  }
});

// Filter Dropdown
document.getElementById('category-filter').addEventListener('change', (e) => {
  renderMenus(e.target.value);
});

document.getElementById('orders-platform-filter')?.addEventListener('change', renderOrders);
document.getElementById('orders-status-filter')?.addEventListener('change', renderOrders);
document.getElementById('orders-start-date')?.addEventListener('change', renderOrders);
document.getElementById('orders-end-date')?.addEventListener('change', renderOrders);
// Init
const dashStartEl = document.getElementById('dash-start-date');
const dashEndEl = document.getElementById('dash-end-date');
if (dashStartEl && dashEndEl && !dashStartEl.value && !dashEndEl.value) {
    const nowStringSF = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', year: 'numeric', month: 'numeric', day: 'numeric' }).format(new Date());
    const [mo, dy, yr] = nowStringSF.split('/');
    const year = parseInt(yr);
    const month = parseInt(mo);
    const lastDateObj = new Date(year, month, 0); // 0th day computes last day of current month
    
    const pad = (n) => n.toString().padStart(2, '0');
    dashStartEl.value = `${year}-${pad(month)}-01`;
    dashEndEl.value = `${year}-${pad(month)}-${pad(lastDateObj.getDate())}`;
}

onSnapshot(collection(db, 'orders'), (snapshot) => {
  orders = snapshot.docs.map(doc => ({ fbId: doc.id, ...doc.data() })).filter(o => !o.isDeleted);
  orders.sort((a, b) => {
    let dateA = new Date(a.deliveryDate || 0);
    let dateB = new Date(b.deliveryDate || 0);
    return dateB - dateA;
  });
  
  renderOrders();
  renderDashboard();
  if (typeof renderPrepTab === 'function') renderPrepTab();
  
  if (calendarObj) {
    calendarObj.removeAllEvents();
    calendarObj.addEventSource(orders.map(o => ({
      id: o.fbId,
      title: `${o.platform} - ${o.id}`,
      start: o.deliveryDate,
      extendedProps: { order: o }
    })));
  }
});

onSnapshot(collection(db, 'menus'), (snapshot) => {
  menuItems = snapshot.docs.map(doc => ({ fbId: doc.id, ...doc.data() }));
  const filterEl = document.getElementById('category-filter');
  renderMenus(filterEl ? filterEl.value : 'all');
  if (typeof renderPrepTab === 'function') renderPrepTab();
  
  let dl = document.getElementById('menu-items-global-list');
  if (!dl) {
    dl = document.createElement('datalist');
    dl.id = 'menu-items-global-list';
    document.body.appendChild(dl);
  }
  const uniqueNames = [...new Set(menuItems.map(m => m.title).filter(Boolean))];
  dl.innerHTML = uniqueNames.map(title => `<option value="${title}"></option>`).join('');
});

// Add Order Modal Logic
const addOrderModal = document.getElementById('add-order-modal');
const addOrderBtn = document.getElementById('add-order-btn');
const closeAddOrderBtn = document.getElementById('close-add-order-btn');
const addItemRowBtn = document.getElementById('add-item-row-btn');
const itemsContainer = document.getElementById('new-order-items-container');
const addOrderForm = document.getElementById('add-order-form');

function createItemRow() {
  const row = document.createElement('div');
  row.className = 'dynamic-item-row';
  
  row.innerHTML = `
    <input type="text" class="item-name-select" list="menu-items-global-list" placeholder="Select or type Menu Item..." required />
    <input type="number" class="item-amount" placeholder="Qty" min="1" required />
    <input type="text" class="item-notes-input" placeholder="Notes (optional)" />
    <button type="button" class="remove-item-btn" title="Remove">&times;</button>
  `;
  
  row.querySelector('.remove-item-btn').addEventListener('click', () => {
    row.remove();
  });
  
  itemsContainer.appendChild(row);
}

addOrderBtn.addEventListener('click', () => {
  addOrderForm.reset();
  delete addOrderForm.dataset.editingId;
  itemsContainer.innerHTML = '';
  addOrderModal.classList.add('active');
  if (itemsContainer.children.length === 0) {
    createItemRow();
  }
});

closeAddOrderBtn.addEventListener('click', () => {
  addOrderModal.classList.remove('active');
});

// Close modal on click outside if desired
addOrderModal.addEventListener('click', (e) => {
  if (e.target === addOrderModal) {
    addOrderModal.classList.remove('active');
  }
});

addItemRowBtn.addEventListener('click', createItemRow);

addOrderForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const items = [];
  document.querySelectorAll('.dynamic-item-row').forEach(row => {
    items.push({
      name: row.querySelector('.item-name-select').value,
      amount: parseInt(row.querySelector('.item-amount').value, 10),
      notes: row.querySelector('.item-notes-input').value
    });
  });

  const newOrder = {
    id: document.getElementById('new-order-id').value,
    platform: document.getElementById('new-order-platform').value,
    customerName: document.getElementById('new-order-customer').value,
    typeOfOrder: document.getElementById('new-order-type').value,
    deliveryDate: document.getElementById('new-order-date').value,
    deliveryTime: document.getElementById('new-order-time').value,
    deliveryMethod: document.getElementById('new-order-method').value,
    pickUpTime: document.getElementById('new-order-pickup').value,
    subtotal: parseFloat(document.getElementById('new-order-subtotal').value),
    total: parseFloat(document.getElementById('new-order-total').value),
    netPayout: parseFloat(document.getElementById('new-order-payout').value),
    status: 'New',
    overallNotes: document.getElementById('new-order-notes').value,
    items: items
  };

  if (addOrderForm.dataset.editingId) {
    newOrder.manualOverride = true;
    updateDoc(doc(db, 'orders', addOrderForm.dataset.editingId), newOrder);
    delete addOrderForm.dataset.editingId;
  } else {
    addDoc(collection(db, 'orders'), newOrder);
  }
  
  addOrderForm.reset();
  itemsContainer.innerHTML = ''; // clear rows
  addOrderModal.classList.remove('active');
});

// Add Menu Modal Logic
const addMenuModal = document.getElementById('add-menu-modal');
const addMenuBtn = document.getElementById('add-menu-btn');
const closeAddMenuBtn = document.getElementById('close-add-menu-btn');
const addMenuForm = document.getElementById('add-menu-form');
const platformDetailsContainer = document.getElementById('platform-details-container');
const menuWeightG = document.getElementById('menu-weight-g');
const menuPrice = document.getElementById('menu-price');

const menuPlatforms = ['Cater2.me', 'ClubFeast', 'Direct', 'DoorDash', 'ezCater', 'Fooda', 'Foodja', 'Forkable', 'Hungry', 'Uber Eats', 'Zerocater'];

// Generate platform rows
function initPlatformRows() {
  platformDetailsContainer.innerHTML = '';
  menuPlatforms.forEach(p => {
    const row = document.createElement('div');
    row.style.display = 'grid';
    row.style.gridTemplateColumns = '1fr 2fr 2fr 1fr';
    row.style.gap = '0.5rem';
    row.style.alignItems = 'center';
    row.style.background = 'rgba(255, 255, 255, 0.02)';
    row.style.padding = '0.75rem';
    row.style.borderRadius = '8px';
    row.style.border = '1px solid var(--glass-border)';
    
    row.innerHTML = `
      <strong style="color: var(--text-primary); font-size: 0.85rem;">${p}</strong>
      <input type="text" class="platform-alias" data-platform="${p}" placeholder="Alias Name..." style="width: 100%; background: var(--bg-primary); border: 1px solid var(--glass-border); padding: 0.5rem; border-radius: 8px; color: var(--text-primary); outline: none;" />
      <input type="text" class="platform-note" data-platform="${p}" placeholder="Special Note..." style="width: 100%; background: var(--bg-primary); border: 1px solid var(--glass-border); padding: 0.5rem; border-radius: 8px; color: var(--text-primary); outline: none;" />
      <input type="number" step="0.01" class="platform-price" data-platform="${p}" placeholder="Price ($)" style="width: 100%; background: var(--bg-primary); border: 1px solid var(--glass-border); padding: 0.5rem; border-radius: 8px; color: var(--text-primary); outline: none;" />
    `;
    platformDetailsContainer.appendChild(row);
  });
}

// Convert Weights
menuWeightG.addEventListener('input', (e) => {
  const g = parseFloat(e.target.value);
  if (!isNaN(g)) {
    document.getElementById('menu-weight-oz').value = (g / 28.3495).toFixed(2);
    document.getElementById('menu-weight-lbs').value = (g / 453.592).toFixed(2);
  } else {
    document.getElementById('menu-weight-oz').value = '';
    document.getElementById('menu-weight-lbs').value = '';
  }
});

// Sync default prices and names
menuPrice.addEventListener('input', (e) => {
  const stdPrice = e.target.value;
  document.querySelectorAll('.platform-price').forEach(input => {
    if (!input.dataset.dirty) {
      input.value = stdPrice;
    }
  });
});

document.getElementById('menu-name').addEventListener('input', (e) => {
  const stdName = e.target.value;
  document.querySelectorAll('.platform-alias').forEach(input => {
    if (!input.dataset.dirty) {
      input.value = stdName;
    }
  });
});

// Mark input as dirty if user types in it manually
platformDetailsContainer.addEventListener('input', (e) => {
  if (e.target.classList.contains('platform-price') || e.target.classList.contains('platform-alias')) {
    e.target.dataset.dirty = "true";
  }
});

addMenuBtn.addEventListener('click', () => {
  addMenuForm.reset();
  delete addMenuForm.dataset.editingId;
  if (typeof allergenTags !== 'undefined') {
    allergenTags = [];
    renderTags();
  }
  if (platformDetailsContainer.children.length === 0) {
    initPlatformRows();
  }
  addMenuModal.classList.add('active');
});

closeAddMenuBtn.addEventListener('click', () => {
  addMenuModal.classList.remove('active');
});

addMenuModal.addEventListener('click', (e) => {
  if (e.target === addMenuModal) {
    addMenuModal.classList.remove('active');
  }
});

addMenuForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = addMenuForm.querySelector('button[type="submit"]');
  const orgText = submitBtn.innerText;
  submitBtn.innerText = 'Saving...';
  submitBtn.disabled = true;

  const overrides = {};
  document.querySelectorAll('#platform-details-container .platform-alias').forEach(el => {
    const plat = el.getAttribute('data-platform');
    if (!overrides[plat]) overrides[plat] = {};
    overrides[plat].alias = el.value.trim();
  });
  document.querySelectorAll('#platform-details-container .platform-note').forEach(el => {
    const plat = el.getAttribute('data-platform');
    if (!overrides[plat]) overrides[plat] = {};
    overrides[plat].note = el.value.trim();
  });
  document.querySelectorAll('#platform-details-container .platform-price').forEach(el => {
    const plat = el.getAttribute('data-platform');
    if (!overrides[plat]) overrides[plat] = {};
    overrides[plat].price = el.value;
  });

  const payload = {
    title: document.getElementById('menu-name').value,
    desc: document.getElementById('menu-desc').value,
    category: document.getElementById('menu-category').value,
    standardPrice: document.getElementById('menu-price').value,
    ingredient: document.getElementById('menu-ingredient').value,
    toppings: document.getElementById('menu-toppings').value,
    sauce: document.getElementById('menu-sauce').value,
    base: document.getElementById('menu-base').value,
    proteins: document.getElementById('menu-proteins').value,
    serving: document.getElementById('menu-serving').value,
    weightG: document.getElementById('menu-weight-g').value,
    spicyLevel: document.getElementById('menu-spicy').value,
    allergens: allergenTags,
    dietary: {
      vegan: document.getElementById('diet-vegan').checked,
      vegetarian: document.getElementById('diet-vegetarian').checked,
      gf: document.getElementById('diet-gf').checked,
      soy: document.getElementById('diet-soy').checked,
      sesame: document.getElementById('diet-sesame').checked,
      nut: document.getElementById('diet-nut').checked,
      dairy: document.getElementById('diet-dairy').checked,
      egg: document.getElementById('diet-egg').checked,
      shellfish: document.getElementById('diet-shellfish').checked,
      seafood: document.getElementById('diet-seafood').checked
    },
    platformOverrides: overrides
  };

  const editingId = addMenuForm.dataset.editingId;
  if (editingId) {
    await updateDoc(doc(db, 'menus', editingId), payload);
    delete addMenuForm.dataset.editingId;
  } else {
    payload.id = Date.now();
    payload.platform = 'Custom';
    await addDoc(collection(db, 'menus'), payload);
  }
  
  submitBtn.innerText = orgText;
  submitBtn.disabled = false;
  
  addMenuForm.reset();
  platformDetailsContainer.innerHTML = '';
  if (typeof allergenTags !== 'undefined') {
    allergenTags = [];
    renderTags();
  }
  addMenuModal.classList.remove('active');
});

// Tags Input Logic
const allergensInput = document.getElementById('menu-allergens-input');
const tagsWrapper = document.getElementById('allergen-tags-wrapper');
const allergensHidden = document.getElementById('menu-allergens');
let allergenTags = [];

function renderTags() {
  tagsWrapper.innerHTML = '';
  allergenTags.forEach((tag, index) => {
    const pill = document.createElement('span');
    pill.className = 'tag-pill';
    pill.innerHTML = `${tag} <span class="remove-tag" data-index="${index}">&times;</span>`;
    tagsWrapper.appendChild(pill);
  });
  allergensHidden.value = allergenTags.join(',');
  
  tagsWrapper.querySelectorAll('.remove-tag').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = e.target.getAttribute('data-index');
      allergenTags.splice(idx, 1);
      renderTags();
    });
  });
}

if (allergensInput) {
  allergensInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault(); 
      const val = allergensInput.value.trim().replace(/,/g, '');
      if (val && !allergenTags.includes(val)) {
        allergenTags.push(val);
        allergensInput.value = '';
        renderTags();
      } else if (val) {
        allergensInput.value = ''; 
      }
    }
  });
}

// Seed Mock Data if Firestore is empty
(async function seedDatabase() {
  try {
    const ordersSnap = await getDocs(collection(db, 'orders'));
    if (ordersSnap.empty) {
      console.log('Seeding mock orders...');
      MOCK_ORDERS.forEach(o => addDoc(collection(db, 'orders'), o));
    }
    
    const menusSnap = await getDocs(collection(db, 'menus'));
    if (menusSnap.empty) {
      console.log('Seeding mock menus...');
      MOCK_MENUS.forEach(m => addDoc(collection(db, 'menus'), m));
    }
    } catch (err) {
    console.error('Failed to seed database. Are Firestore Security Rules set to true? Error:', err);
  }
})();

// ==== PREP TAB LOGIC ====

// Initialize Date Picker to today in local Pacific Time securely
const tzDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
document.getElementById('prep-date-filter').value = tzDate;

let currentPrepView = 'order'; // 'dish', 'comp', or 'order'

function updatePrepToggles(view) {
    currentPrepView = view;
    const views = ['dish', 'comp', 'order'];
    views.forEach(v => {
        const btn = document.getElementById(`prep-view-${v}`);
        const container = document.getElementById(`prep-dash-${v === 'dish' ? 'dish' : v === 'comp' ? 'comp' : 'order'}-container`); // Wait, IDs are different
        // Let's re-check the IDs in HTML
    });
}
// I'll stick to a simpler approach since the IDs are a bit inconsistent
document.getElementById('prep-view-dish')?.addEventListener('click', () => {
    currentPrepView = 'dish';
    ['dish', 'comp', 'order'].forEach(v => {
        const btn = document.getElementById(`prep-view-${v}`);
        if (btn) {
            btn.style.background = (v === 'dish') ? 'var(--primary-accent)' : 'transparent';
            btn.style.color = (v === 'dish') ? 'white' : 'var(--text-secondary)';
        }
    });
    document.getElementById('prep-dish-container').style.display = 'block';
    document.getElementById('prep-comp-container').style.display = 'none';
    document.getElementById('prep-order-container').style.display = 'none';
    renderPrepTab();
});

document.getElementById('prep-view-comp')?.addEventListener('click', () => {
    currentPrepView = 'comp';
    ['dish', 'comp', 'order'].forEach(v => {
        const btn = document.getElementById(`prep-view-${v}`);
        if (btn) {
            btn.style.background = (v === 'comp') ? 'var(--primary-accent)' : 'transparent';
            btn.style.color = (v === 'comp') ? 'white' : 'var(--text-secondary)';
        }
    });
    document.getElementById('prep-dish-container').style.display = 'none';
    document.getElementById('prep-comp-container').style.display = 'block';
    document.getElementById('prep-order-container').style.display = 'none';
    renderPrepTab();
});

document.getElementById('prep-view-order')?.addEventListener('click', () => {
    currentPrepView = 'order';
    ['dish', 'comp', 'order'].forEach(v => {
        const btn = document.getElementById(`prep-view-${v}`);
        if (btn) {
            btn.style.background = (v === 'order') ? 'var(--primary-accent)' : 'transparent';
            btn.style.color = (v === 'order') ? 'white' : 'var(--text-secondary)';
        }
    });
    document.getElementById('prep-dish-container').style.display = 'none';
    document.getElementById('prep-comp-container').style.display = 'none';
    document.getElementById('prep-order-container').style.display = 'block';
    renderPrepTab();
});

document.getElementById('prep-date-filter')?.addEventListener('change', renderPrepTab);

function renderPrepTab() {
    if (!orders || !menuItems) return;
    
    const dateInput = document.getElementById('prep-date-filter').value;
    if (!dateInput) return; // Wait for user to select a date

    // Get order matching the date
    const targetOrders = orders.filter(o => {
        if (o.status === 'Cancelled' || o.status === 'Archived') return false;
        if (!o.deliveryDate) return false;
        // Match YYYY-MM-DD prefix purely
        return o.deliveryDate.startsWith(dateInput);
    });

    let dishMap = {}; // { "Shredded Chicken Noodle": { qty: 2, servings: 2, menuRef: {...} } }

    targetOrders.forEach(o => {
        if (o.items && Array.isArray(o.items)) {
            o.items.forEach(itm => {
                let name = getOfficialDishName(itm.name);
                let q = parseInt(itm.amount) || 1;
                
                if (!dishMap[name]) dishMap[name] = { qty: 0, servings: 0, menuRef: null };
                dishMap[name].qty += q;
            });
        }
    });

    // Resolve menu bindings to compute pure servings
    // Resolve menu bindings to compute pure servings
    Object.keys(dishMap).forEach(dishName => {
        let menuMatch = menuItems.find(m => m.title === dishName);

        if (menuMatch) {
            dishMap[dishName].menuRef = menuMatch;
            let servMult = parseInt(menuMatch.serving) || 1;
            dishMap[dishName].servings = dishMap[dishName].qty * servMult;
        } else {
            dishMap[dishName].servings = dishMap[dishName].qty; // Default 1:1 if unknown
        }
    });

    if (currentPrepView === 'dish') {
        const tbody = document.getElementById('prep-dish-tbody');
        let html = '';
        const sortedDishes = Object.keys(dishMap).sort((a,b) => dishMap[b].qty - dishMap[a].qty);
        
        sortedDishes.forEach(d => {
            html += `<tr>
                <td style="padding-left: 1rem; color: #f8fafc;">${d} ${dishMap[d].menuRef ? '' : '<span style="color: #fbbf24; font-size: 0.65rem; margin-left: 0.5rem; border: 1px solid #fbbf24; padding: 2px 4px; border-radius: 4px;">Unlinked</span>'}</td>
                <td style="text-align: right; color: #9ca3af;">${dishMap[d].qty}</td>
                <td style="text-align: right; padding-right: 1rem; color: #6ee7b7; font-weight: bold;">${dishMap[d].servings}</td>
            </tr>`;
        });
        
        if (sortedDishes.length === 0) {
            html = `<tr><td colspan="3" style="text-align: center; color: #64748b; padding: 2rem;">No orders matched the selected date.</td></tr>`;
        }
        tbody.innerHTML = html;
        
    } else if (currentPrepView === 'comp') {
        const container = document.getElementById('prep-comp-grids');
        let compGroups = {
            'Proteins': {},
            'Base': {},
            'Toppings': {},
            'Sauce': {}
        };

        Object.keys(dishMap).forEach(d => {
            let item = dishMap[d];
            if (item.menuRef) {
                let servs = item.servings;
                
                if (item.menuRef.proteins) {
                    if (!compGroups['Proteins'][item.menuRef.proteins]) compGroups['Proteins'][item.menuRef.proteins] = 0;
                    compGroups['Proteins'][item.menuRef.proteins] += servs;
                }
                if (item.menuRef.base) {
                    if (!compGroups['Base'][item.menuRef.base]) compGroups['Base'][item.menuRef.base] = 0;
                    compGroups['Base'][item.menuRef.base] += servs;
                }
                if (item.menuRef.toppings) {
                    if (!compGroups['Toppings'][item.menuRef.toppings]) compGroups['Toppings'][item.menuRef.toppings] = 0;
                    compGroups['Toppings'][item.menuRef.toppings] += servs;
                }
                if (item.menuRef.sauce) {
                    if (!compGroups['Sauce'][item.menuRef.sauce]) compGroups['Sauce'][item.menuRef.sauce] = 0;
                    compGroups['Sauce'][item.menuRef.sauce] += servs;
                }
            }
        });

        let html = '';
        Object.keys(compGroups).forEach(groupName => {
            let innerList = '';
            let comps = Object.keys(compGroups[groupName]).sort((a,b) => compGroups[groupName][b] - compGroups[groupName][a]);
            
            comps.forEach(c => {
                innerList += `
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <span style="color: #f8fafc;">${c}</span>
                        <strong style="color: #6ee7b7;">${compGroups[groupName][c]}</strong>
                    </div>
                `;
            });

            if (comps.length === 0) {
               innerList = `<div style="padding: 1rem; text-align: center; color: #64748b;">No components required.</div>`;
            }

            html += `
              <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; overflow: hidden;">
                  <div style="background: rgba(0,0,0,0.2); padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: 600; color: var(--primary-accent);">${groupName} <span style="float: right; color: #64748b; font-size: 0.7rem; font-weight: normal; margin-top: 3px;">SERVINGS</span></div>
                  <div>${innerList}</div>
              </div>
            `;
        });
        container.innerHTML = html;
    } else if (currentPrepView === 'order') {
        const container = document.getElementById('prep-order-grids');
        let orderGroups = {}; // Key: platform|pickUpTime

        targetOrders.forEach(o => {
            let plat = normalizePlatform(o.platform);
            let time = o.pickUpTime || "";
            let key = `${plat}|${time}`;

            if (!orderGroups[key]) {
                orderGroups[key] = {
                    platform: plat,
                    pickUpTime: time,
                    items: {}
                };
            }

            if (o.items && Array.isArray(o.items)) {
                o.items.forEach(itm => {
                    let name = getOfficialDishName(itm.name);
                    let amt = parseInt(itm.amount) || 1;
                    orderGroups[key].items[name] = (orderGroups[key].items[name] || 0) + amt;
                });
            }
        });

        let html = '';
        const sortedGroups = Object.keys(orderGroups).sort();
        
        sortedGroups.forEach(key => {
            const group = orderGroups[key];
            let itemTags = Object.entries(group.items).map(([name, amt]) => `
                <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.9rem; display: flex; align-items: center; justify-content: space-between; width: 100%;">
                    <span style="color: #f8fafc; font-weight: 500;">${name}</span>
                    <strong style="color: #6ee7b7; background: rgba(110, 231, 183, 0.1); padding: 4px 10px; border-radius: 6px; font-size: 1rem;">${amt}x</strong>
                </div>
            `).join('');

            html += `
                <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 1.25rem; display: flex; align-items: stretch; gap: 1.5rem; transition: transform 0.2s ease;">
                    <div style="min-width: 140px; border-right: 1px solid rgba(255,255,255,0.05); padding-right: 1rem; display: flex; align-items: center;">
                        <h4 style="margin: 0; color: var(--primary-accent); font-size: 1rem; font-weight: 700;">${group.platform}</h4>
                    </div>
                    
                    <div style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem;">
                        ${itemTags}
                    </div>
                    
                    <div style="text-align: right; min-width: 100px; border-left: 1px solid rgba(255,255,255,0.05); padding-left: 1rem;">
                        <div style="font-size: 0.6rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">Pick Up</div>
                        <div style="font-weight: 600; color: ${group.pickUpTime ? '#6ee7b7' : '#64748b'}; font-size: 0.9rem;">${group.pickUpTime || '---'}</div>
                    </div>
                </div>
            `;
        });

        if (sortedGroups.length === 0) {
            html = `<div style="text-align: center; color: #64748b; padding: 4rem; background: rgba(255,255,255,0.01); border-radius: 16px; border: 1px dashed rgba(255,255,255,0.1);">No orders matched the selected date.</div>`;
        }
        container.innerHTML = html;
    }
}

// Sidebar Toggle Logic
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const toggleSvg = document.getElementById('toggle-icon-svg');
    
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
        if (mainContent) mainContent.classList.toggle('expanded');
        
        const isCollapsed = sidebar.classList.contains('collapsed');
        if (toggleSvg) {
            toggleSvg.style.transform = isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    }
}

document.getElementById('sidebar-toggle-btn')?.addEventListener('click', toggleSidebar);

// Export Orders Logic
document.getElementById('export-orders-btn')?.addEventListener('click', () => {
  if (!orders || orders.length === 0) {
    alert("No orders to export.");
    return;
  }

  // Get current filters
  const platformFilter = document.getElementById('orders-platform-filter')?.value || 'all';
  const statusFilter = document.getElementById('orders-status-filter')?.value || 'all';
  const startDate = document.getElementById('orders-start-date')?.value || '';
  const endDate = document.getElementById('orders-end-date')?.value || '';

  const filteredOrders = orders.filter(o => {
    let keep = true;
    if (platformFilter !== 'all') {
      const oPlat = normalizePlatform(o.platform);
      if (!oPlat || oPlat.toLowerCase() !== platformFilter.toLowerCase()) keep = false;
    }
    
    const dynamicStatus = computeOrderStatus(o);
    if (statusFilter !== 'all' && dynamicStatus.toLowerCase() !== statusFilter.toLowerCase()) keep = false;

    if (startDate && (!o.deliveryDate || o.deliveryDate < startDate)) keep = false;
    if (endDate && (!o.deliveryDate || o.deliveryDate > endDate)) keep = false;

    return keep;
  });

  if (filteredOrders.length === 0) {
    alert("No orders match the current filters.");
    return;
  }

  // Generate CSV without item breakdowns
  let csvContent = "Order ID,Platform,Customer Name,Delivery Date,Delivery Method,Time,Subtotal,Total,Net Payout,Status,Notes\n";
  
  filteredOrders.forEach(o => {
    const dynamicStatus = computeOrderStatus(o);
    const plat = normalizePlatform(o.platform);
    let methodTimeStr = '';
    let methodType = o.deliveryMethod || 'Platform';
    if (methodType.toLowerCase() === 'platform' || methodType.toLowerCase() === 'partner') {
        methodTimeStr = o.pickUpTime || o.deliveryTime || 'TBD';
    } else {
        methodTimeStr = o.deliveryTime || 'TBD';
    }

    const escapeCsv = (str) => {
        if (str === null || str === undefined) return '""';
        let cleanMatch = String(str).replace(/"/g, '""');
        return `"${cleanMatch}"`;
    };

    let displaySubtotal = typeof o.subtotal === 'number' ? o.subtotal.toFixed(2) : parseFloat(o.subtotal || 0).toFixed(2);
    let displayTotal = typeof o.total === 'number' ? o.total.toFixed(2) : parseFloat(o.total || 0).toFixed(2);
    let displayNet = typeof o.netPayout === 'number' ? o.netPayout.toFixed(2) : parseFloat(o.netPayout || 0).toFixed(2);

    let row = [
        escapeCsv(o.id),
        escapeCsv(plat),
        escapeCsv(o.customerName),
        escapeCsv(o.deliveryDate),
        escapeCsv(methodType),
        escapeCsv(methodTimeStr),
        escapeCsv(displaySubtotal),
        escapeCsv(displayTotal),
        escapeCsv(displayNet),
        escapeCsv(dynamicStatus),
        escapeCsv(o.overallNotes)
    ];

    csvContent += row.join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `HSCaterHub_Export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
